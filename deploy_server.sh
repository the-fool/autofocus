#! /bin/sh

gcloud builds submit server --tag gcr.io/autofocus/helloworld
gcloud beta run deploy helloworld --image gcr.io/autofocus/helloworld
