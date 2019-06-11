export GCLOUD_BUCKET=$DEVSHELL_PROJECT_ID-media
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID

echo "Creating App Engine app"
gcloud app create --region "us-central"

echo "Making bucket $GCLOUD_BUCKET"
gsutil mb gs://$GCLOUD_BUCKET

echo "Installing Go deps"
go get -u cloud.google.com/go/firestore

echo "Seeding Pin data"
go run seed_pins.go


