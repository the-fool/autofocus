#! /bin/bash

export GCLOUD_PROJECT=$(gcloud config get-value project)
export GCLOUD_REGION="us-central1"
export GCLOUD_POSTCARD_SERVER_IMAGE="gcr.io/$GCLOUD_PROJECT/postcard-server"

init () {
    echo "Enabling service APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable firestore.googleapis.com
    gcloud services enable run.googleapis.com
}

build () {
    gcloud builds sumbmit server --tag $GCLOUD_POSTCARD_SERVER_IMAGE
}

deploy () {
    echo "Deploying postcard server to Cloud Run..."
    gcloud beta run deploy postcard-server --platform managed --region $GCLOUD_REGION --image $GCLOUD_POSTCARD_SERVER_IMAGE:latest
}

case $1 in
init)
    init    
    ;;
build) 
    build
    ;;
deploy)
    deploy
    ;;
*)
    echo "unknown argument"
    exit 1
esac

