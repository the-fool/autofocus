export GCLOUD_BUCKET=$DEVSHELL_PROJECT_ID-media
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
export GCLOUD_REGION=us-central
export GCLOUD_ESP_NAME=autofocus-api
export GCLOUD_PROJECT_NUMBER=$(gcloud projects list --filter="$GCLOUD_PROJECT" --format="value(PROJECT_NUMBER)")


echo "Creating App Engine app"
gcloud app create --region "us-central"

echo "Making bucket $GCLOUD_BUCKET"
gsutil mb gs://$GCLOUD_BUCKET

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

gcloud endpoints services deploy openapi-functions.yaml --project $GCLOUD_PROJECT

echo "Configuring ESP"
gcloud beta run services update $GCLOUD_ESP_NAME \
    --set-env-vars ENDPOINTS_SERVICE_NAME=autofocus-api-vteoiajvqq-uc.a.run.app


