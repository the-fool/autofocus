import flask
import requests
from google.cloud import spanner
from google.cloud.spanner import KeySet

k = KeySet(all_=True)

instance_id = 'autofocus-instance'
database_id = 'autofocus-database'

database = None

columns = ['postcardId', 'comment', 'img', 'x', 'y']

def get_db():
    c = spanner.Client(project='autofocus')
    i = c.instance(instance_id)
    d = i.database(database_id)
    return d

def serialize(postcard_tuple):
    return dict(zip(columns, postcard_tuple))

def upsertPostcard(pin):
    global database
    if not database:
        database = get_db()

    def perform_update(transaction):
        values = [pin[k] for k in columns]
        transaction.insert_or_update(
            'Postcard',
            columns=columns,
            values=[values]
        )
    res = database.run_in_transaction(perform_update)
    return list(map(serialize, res))[0]


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
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': 'https://mydomain.com',
            'Access-Control-Allow-Methods': 'GET',
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
