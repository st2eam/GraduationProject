from flask import json
import bson.json_util


def bsonify(data):
    return bson.json_util.loads(json.dumps(data))
