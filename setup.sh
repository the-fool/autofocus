export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
export GCLOUD_REGION=us-central1
export GCLOUD_ESP_NAME=autofocus-api
export GCLOUD_PROJECT_NUMBER=$(gcloud projects list --filter="$GCLOUD_PROJECT" --format="value(PROJECT_NUMBER)")
export GCLOUD_BUCKET_MEDIA=autofocus_media_$GCLOUD_PROJECT_NUMBER
export GCLOUD_ESP_HOSTNAME=$(gcloud beta run services describe $GCLOUD_ESP_NAME | grep hostname | awk '{print $2}' | sed -e "s/^https:\/\///")

# this value is retrieved in the cloud console > apis & services > credentials
export GCLOUD_OAUTH_CLIENT_ID="775685815708-i4i8nfq327btbf6mh6rno48n0d25s6ap.apps.googleusercontent.com"
# openapi config
export tmp_file=$(mktemp).yml
cat openapi-functions.yaml | envsubst '$GCLOUD_PROJECT,$GCLOUD_ESP_HOSTNAME,$GCLOUD_OAUTH_CLIENT_ID' > $tmp_file

echo "Enabling Services"
gcloud services enable spanner.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable run.googleapis.com


echo "Creating App Engine app"
gcloud app create --region $GCLOUD_REGION

echo "Making bucket $GCLOUD_BUCKET_MEDIA"
gsutil mb gs://$GCLOUD_BUCKET_MEDIA

echo "Setting global read permissions on bucket"
gsutil acl ch -u AllUsers:R gs://$GCLOUD_BUCKET_MEDIA

echo "Creating backend bucket for CDN"
# todo

echo "Creating Spanner"
echo "Creating Cloud Spanner Instance, Database, and Table"
gcloud spanner instances create autofocus-instance --config=regional-us-central1 --description="Autofocus instance" --nodes=1
gcloud spanner databases create autofocus-database --instance autofocus-instance --ddl "CREATE TABLE Postcard ( postcardId STRING(100) NOT NULL, comment STRING(MAX), img STRING(MAX), x FLOAT64, y FLOAT64 ) PRIMARY KEY (postcardId);"

gcloud spanner databases add-iam-policy-binding autofocus-database \
    --instance=autofocus-instance \
    --member "serviceAccount:service-$GCLOUD_PROJECT_NUMBER@gcf-admin-robot.iam.gserviceaccount.com" \
    --role="roles/spanner.databaseAdmin"

gcloud projects add-iam-policy-binding $GCLOUD_PROJECT \
    --member "serviceAccount:service-$GCLOUD_PROJECT_NUMBER@gcf-admin-robot.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

echo "Installing Go deps"
go get -u cloud.google.com/go/firestore

echo "Seeding Pin data"
go run seed_pins.go

echo "Deploying Cloud Functions"
echo "postcards"
gcloud functions deploy postcards \
    --source functions/postcards \
    --runtime python37 \
    --set-env-vars GCLOUD_BUCKET_MEDIA=$GCLOUD_BUCKET_MEDIA,GCLOUD_PROJECT_NAME=$GCLOUD_PROJECT \
    --trigger-http

gcloud alpha functions add-iam-policy-binding postcards \
    --member "serviceAccount:$GCLOUD_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role "roles/cloudfunctions.invoker" \
    --project $GCLOUD_PROJECT

echo "images"
gcloud functions deploy images \
    --source functions/images \
    --runtime python37 \
    --set-env-vars GCLOUD_BUCKET_MEDIA=$GCLOUD_BUCKET_MEDIA,GCLOUD_PROJECT_NAME=$GCLOUD_PROJECT \
    --trigger-http

gcloud alpha functions add-iam-policy-binding images \
    --member "serviceAccount:$GCLOUD_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role "roles/cloudfunctions.invoker" \
    --project $GCLOUD_PROJECT

echo "Creating ESP for Endpoints"
gcloud config set run/region $GCLOUD_REGION
gcloud beta run deploy $GCLOUD_ESP_NAME \
    --image="gcr.io/endpoints-release/endpoints-runtime-serverless:1" \
    --allow-unauthenticated \
    --project=$GCLOUD_PROJECT 

gcloud endpoints services deploy $tmp_file \
    --project $GCLOUD_PROJECT
rm $tmp_file

echo "Configuring ESP"
gcloud beta run services update $GCLOUD_ESP_NAME \
    --set-env-vars ENDPOINTS_SERVICE_NAME=$GCLOUD_ESP_HOSTNAME
