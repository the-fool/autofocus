import os
import tempfile
import uuid
from flask import Flask, jsonify, request, abort
from werkzeug.utils import secure_filename
from flask_cors import CORS
from google.cloud import firestore
from google.cloud import storage

app = Flask(__name__)

CORS(app)

db = firestore.Client()
col = db.collection(u'postcards')

def clamp(value):
    return max(min(value, 0.99), 0.01)

@app.route('/health')
def health():
    return 'healthy'

@app.route('/postcards/<postcard_id>', methods=['DELETE'])
def postcard(postcard_id):
    doc = col.document(postcard_id)
    doc.delete()
    return '', 204

@app.route('/postcards', methods=['GET', 'POST'])
def postcards():
    if request.method == 'GET':
        docs = col.get()
        data = [d.to_dict() for d in docs]
        return jsonify(data)

    if request.method == 'POST':
        try:
            _id = request.form['id']
        except:
            abort(400)
        doc = col.document(_id)

        title = request.form.get('title', '')
        comment = request.form.get('comment', '')
        x = request.form.get('x', 0.5)
        y = request.form.get('y', 0.5)
        x = clamp(float(x))
        y = clamp(float(y))

        f = request.files.get('file', None)

        # process name
        if f:
            u = uuid.uuid4().hex
            filename = u + '_' + secure_filename(f.filename)

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
            
            filename = blob.public_url

        else:
            filename = request.form.get('img', '')

        postcard = {
            'id': _id,
            'title': title,
            'comment': comment,
            'img': filename,
            'x': x,
            'y': y
        }
        doc.set(postcard)

        return jsonify(postcard)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
