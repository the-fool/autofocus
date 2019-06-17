import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import firestore

app = Flask(__name__)

CORS(app)

db = firestore.Client()
col = db.collection(u'postcards')

@app.route('/')
def hello_world():
    target = os.environ.get('TARGET', 'World')
    return 'Hello {}!\n'.format(target)

@app.route('/postcards')
def postcards():
    docs = col.get()
    data = [d.to_dict() for d in docs]
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))