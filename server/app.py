import os
import tempfile

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
from google.cloud import firestore
from google.cloud import storage

app = Flask(__name__)

CORS(app)

db = firestore.Client()
col = db.collection(u'postcards')

@app.route('/')
def hello_world():
    target = os.environ.get('TARGET', 'World')
    return 'Hello {}!\n'.format(target)

@app.route('/postcards', methods=['GET', 'POST'])
def postcards():
    if request.method == 'GET':
        docs = col.get()
        data = [d.to_dict() for d in docs]
        return jsonify(data)

    if request.method == 'POST':
        f = request.files['file']  
        # process name
        filename = secure_filename(f.filename)

        # save file
        temp_dir = tempfile.TemporaryDirectory()
        temp_path = os.path.join(temp_dir.name, filename)
        f.save(temp_path)

        # upload file
        client = storage.Client()
        bucket = client.get_bucket('truble-autofocus-installation')
        blob = bucket.blob(filename)
        blob.cache_control = 'public, max-age=31622400'
        blob.upload_from_filename(temp_path)

        return filename


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))