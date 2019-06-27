#! /bin/bash

export GCLOUD_PROJECT=$(gcloud config get-value project)
export GCLOUD_REGION="us-central1"
export GCLOUD_POSTCARD_SERVER_IMAGE="gcr.io/$GCLOUD_PROJECT/postcard-server"


config_run () {
    gcloud config set run/platform managed
    gcloud config set run/region $GCLOUD_REGION
}

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
    config_run
    gcloud beta run deploy postcard-server --image $GCLOUD_POSTCARD_SERVER_IMAGE:latest
    export GCLOUD_POSTCARD_SERVER_HOST=$(gcloud beta run services describe postcard-server --format="value(domain)")
}

case $1 in
init)
    init    
    ;;
build) 
    build
    ;;
config_run)
    config_run
    ;;
deploy)
    deploy
    ;;
*)
    echo "unknown argument"
    exit 1
esac

