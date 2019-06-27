provider "google" {
    project = "truble-autofocus-installation"
    region = "us-central1"
    zone = "us-central1-c"
}

/*
resource "google_endpoints_service" "openapi_service" {
    service_name = "autofocus-api.endpoints.autofocus2.cloud.goog"
    openapi_config = "${file("openapi.yaml")}"
}
*/

resource "google_storage_bucket" "autofocus-store" {
    name = "truble-autofocus-installation"
}

resource "google_storage_bucket_acl" "autofocus-store-acl" {
  bucket = "${google_storage_bucket.autofocus-store.name}"

  role_entity = [
    "OWNER:user-truble@google.com",
    "READER:allUsers",
  ]
}