import os
from werkzeug.utils import secure_filename
import tempfile
import uuid
from google.cloud import storage

def images(request):
    # get file
    file = request.files['file']

    # process name
    filename = secure_filename(file.filename)
    name, ext = os.path.splitext(filename)
    guid = uuid.uuid4().hex
    filename = f'{name}-{guid}.{ext}'

    # save file
    temp_dir = tempfile.TemporaryDirectory()
    temp_path = os.path.join(temp_dir.name, filename)
    file.save(temp_path)

    # upload file
    client = storage.Client()
    bucket = client.get_bucket('autofocus-media')
    blob = bucket.blob(filename)
    blob.upload_from_filename(temp_path)

    return filename

