import os
from werkzeug.utils import secure_filename
import tempfile
from google.cloud import storage

def images(request):
    # get file
    file = request.files['file']

    # process name
    filename = secure_filename(file.filename)

    # save file
    temp_dir = tempfile.TemporaryDirectory()
    temp_path = os.path.join(temp_dir.name, filename)
    file.save(temp_path)

    # upload file
    client = storage.Client()
    bucket = client.get_bucket(os.environ['GCLOUD_BUCKET_MEDIA'])
    blob = bucket.blob(filename)
    blob.cache_control = 'public, max-age=31622400'
    blob.upload_from_filename(temp_path)

    return filename

