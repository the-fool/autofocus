import flask
import requests
from google.cloud import spanner
from google.cloud.spanner import KeySet

k = KeySet(all_=True)

instance_id = 'autofocus-instance'
database_id = 'autofocus-database'

def get_db():
    c = spanner.Client(project='autofocus')
    i = c.instance(instance_id)
    d = i.database(database_id)
    return d

def fetchPinsFromSpanner():
    d = get_db()
    columns = ['comment', 'img', 'x', 'y']

    with d.snapshot() as snapshot:
        results = snapshot.read(
            table='Postcard',
            columns=columns,
            keyset=k)

    results = map(lambda row: dict(zip(columns, row)), results)
    results = list(results)
    return results

def getPins(request):
    results = fetchPinsFromSpanner()
    return flask.jsonify(results)

# for local testing
if __name__ == '__main__':
    print(fetchPinsFromSpanner())
