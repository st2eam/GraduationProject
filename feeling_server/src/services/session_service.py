from ..database import get_collection


def getSessionBySid(sid: str):
    res = get_collection('session').find_one({'sid': sid})
    return res


def getSessionByUserId(userId: str):
    res = get_collection('session').find_one({'userId': userId})
    return res
