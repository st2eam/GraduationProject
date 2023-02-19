from flask import json


def bsonify(data):
    return json.loads(json.dumps(data))
