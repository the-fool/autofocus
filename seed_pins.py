from google.cloud import firestore

db = firestore.Client()

batch = db.batch()

col = db.collection('postcards')

data = [
    {
        'id': 'p1',
        'title': 'postcard 1',
        'img': 'https://storage.googleapis.com/autofocus-media/library.jpg',
        'comment': 'p1 comment',
        'x': 0.5,
        'y': 0.5
    },
    {
        'id': 'p2',
        'title': 'postcard 2',
        'img': 'https://storage.googleapis.com/autofocus-media/library.jpg',
        'comment': 'p2 comment',
        'x': 0.7,
        'y': 0.1
    },
    {
        'id': 'p3',
        'title': 'postcard 3',
        'img': 'https://storage.googleapis.com/autofocus-media/library.jpg',
        'comment': 'p3 comment',
        'x': 0.1,
        'y': 0.7
    }
]

for datum in data:
    doc = col.document(datum['id'])
    batch.set(doc, datum)

batch.commit()