export GCLOUD_BUCKET=$DEVSHELL_PROJECT_ID-media
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
export GCLOUD_REGION=us-central1
export GCLOUD_ESP_NAME=autofocus-api
export GCLOUD_PROJECT_NUMBER=$(gcloud projects list --filter="$GCLOUD_PROJECT" --format="value(PROJECT_NUMBER)")


echo "Creating App Engine app"
gcloud app create --region $GCLOUD_REGION

echo "Making bucket $GCLOUD_BUCKET"
gsutil mb gs://$GCLOUD_BUCKET

echo "Creating Spanner"
gcloud services enable spanner.googleapis.com

echo "Creating Cloud Spanner Instance, Database, and Table"
gcloud spanner instances create autofocus-instance --config=regional-us-central1 --description="Autofocus instance" --nodes=1
gcloud spanner databases create autofocus-database --instance autofocus-instance --ddl "CREATE TABLE Postcard ( postcardId STRING(100) NOT NULL, comment STRING(MAX), img STRING(MAX), x FLOAT64, y FLOAT64 ) PRIMARY KEY (postcardId);"

gcloud spanner databases add-iam-policy-binding autofocus-database \
--instance=autofocus-instance \
--member "serviceAccount:service-$GCLOUD_PROJECT_NUMBER@gcf-admin-robot.iam.gserviceaccount.com" \
--role="roles/spanner.databaseAdmin"

echo "Installing Go deps"
go get -u cloud.google.com/go/firestore

echo "Seeding Pin data"
go run seed_pins.go

echo "Creating ESP for Endpoints"
gcloud config set run/region $GCLOUD_REGION
gcloud beta run deploy $GCLOUD_ESP_NAME \
    --image="gcr.io/endpoints-release/endpoints-runtime-serverless" \
    --allow-unauthenticated \
    --project=$GCLOUD_PROJECT 


# TODO: use env variables
# GCLOUD_ESP_HOSTNAME=$(gcloud beta run services describe autofocus-api | grep hostname | awk '{print $2}' | sed -e "s/^https:\/\///")
# envsubst < openapi-functions.yaml

gcloud endpoints services deploy openapi-functions.yaml \
    --project $GCLOUD_PROJECT

echo "Configuring ESP"
gcloud beta run services update $GCLOUD_ESP_NAME \
    --set-env-vars ENDPOINTS_SERVICE_NAME=autofocus-api-vteoiajvqq-uc.a.run.app

echo "Deploying Cloud Functions"
gcloud services enable cloudfunctions.googleapis.com

echo "getPins"
gcloud functions deploy getPins \
    --source functions/getPins \
    --runtime python37 \
    --trigger-http

gcloud alpha functions add-iam-policy-binding getPins \
    --member "serviceAccount:$GCLOUD_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role "roles/cloudfunctions.invoker" \
    --project autofocus
