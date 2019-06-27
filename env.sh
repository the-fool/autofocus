#! /bin/bash

export GCLOUD_PROJECT=$(gcloud config get-value project)
export GCLOUD_POSTCARD_IMAGE_TAG="gcr.io/$GCLOUD_PROJECT/postcard-server"
