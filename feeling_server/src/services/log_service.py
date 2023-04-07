import time
from ..models import ELogType
from ..database import get_collection


def addItem(userId: str, postId: str, type: ELogType):
    item = {
        'userId': userId,
        'postId': postId,
        'type': type
    }
    res = get_collection('log').insert_one(item)
    return res


def addRecommendedPosts(userId: str, postList: list[str]):
    items = map(lambda postId: {
        'userId': userId,
        'postId': postId,
        'createdAt': time.time() * 1000
    }, postList)
    res = get_collection('recommend').insert_many(items)
    return res
