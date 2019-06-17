#! /bin/sh

gcloud builds submit server --tag gcr.io/autofocus/postcard-server
gcloud beta run deploy postcard-server  --image gcr.io/autofocus/postcard-server --allow-unauthenticated
