import flask
import requests
import os
from google.cloud import spanner

k = spanner.KeySet(all_=True)

instance_id = 'autofocus-instance'
database_id = 'autofocus-database'

database = None

columns = ['postcardId', 'comment', 'img', 'x', 'y']
defaults = ['', '', '', 0, 0]

def get_db():
    c = spanner.Client(project=os.environ['GCLOUD_PROJECT_NAME'])
    i = c.instance(instance_id)
    d = i.database(database_id)
    return d

def serialize(postcard_tuple):
    return dict(zip(columns, postcard_tuple))

def upsertPostcard(postcard):
    global database
    if not database:
        database = get_db()

    def perform_update(transaction):
        values = [postcard.get(k, default) for k, default in zip(columns, defaults)]
        transaction.insert_or_update(
            'Postcard',
            columns=columns,
            values=[values]
        )
    database.run_in_transaction(perform_update)
    return postcard 


def fetchPostcards():
    global database
    if not database:
        database = get_db()
    columns = ['postcardId', 'comment', 'img', 'x', 'y']

    with database.snapshot() as snapshot:
        results = snapshot.read(
            table='Postcard',
            columns=columns,
            keyset=k)

    return list(map(serialize, results))

def postcards(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT',
            'Access-Control-Allow-Headers': 'Authorization',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)
    

    if request.method == 'GET':
        res = fetchPostcards()
        return flask.jsonify(res)
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }

    if request.method == 'PUT':
        new_postcard = request.get_json(silent=True)
        res = upsertPostcard(new_postcard)
        return flask.jsonify(res), 200, headers

    if request.method == 'POST':
        new_postcard = request.get_json(silent=True)
        res = upsertPostcard(new_postcard)
        return flask.jsonify(res), 200, headers



# for local testing
if __name__ == '__main__':
    print(fetchPostcards())
