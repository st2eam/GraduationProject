import pymongo

client = pymongo.MongoClient()


def init_db():
    try:
        global client
        client = pymongo.MongoClient(
            "mongodb://localhost:27017/feeling_server")
        print('connect db successfully')
    except:
        print("An exception occurred")


def get_collection(collection_name: str):
    db = client.get_default_database()
    if collection_name == "session":
        db[collection_name].create_index([('createdAt', pymongo.ASCENDING)],
                                         expireAfterSeconds=3600 * 24 * 14)
    return db[collection_name]
