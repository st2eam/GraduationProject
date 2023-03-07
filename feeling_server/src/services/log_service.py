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
