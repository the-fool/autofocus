#! /bin/sh

. ./env.sh

gcloud builds sumbmit server --tag $GCLOUD_POSTCARD_IMAGE_TAG
