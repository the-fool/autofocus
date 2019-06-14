import os
from werkzeug.utils import secure_filename
import tempfile

def images(request):
    file = request.files['file']
    filename = secure_filename(file.filename)
    temp_dir = tempfile.TemporaryDirectory()
    file.save(os.path.join(temp_dir, filename))

    return filename

