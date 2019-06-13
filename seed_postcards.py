from google.cloud import spanner

instance_id = 'autofocus-instance'
database_id = 'autofocus-database'

def get_db():
    c = spanner.Client(project='autofocus')
    i = c.instance(instance_id)
    d = i.database(database_id)
    return d


def insert_data():
    d = get_db()
    def insert_postcards(t):
        t.insert(
            'Postcard',
            columns=['postcardId', 'img', 'comment', 'x', 'y'],
            values=[
                ['p1', 'foo.jpg', 'the first', 0.2, 0.8]
            ]
        )

    d.run_in_transaction(insert_postcards)

if __name__ == '__main__':
    insert_data()
