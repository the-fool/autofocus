#! /bin/bash

. env.sh

gcloud beta run deploy postcard-server --image $GCLOUD_POSTCARD_IMAGE_TAG