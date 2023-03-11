import time
from ..utils.check import *
from ..utils.bsonify import *
from ..models import IFollow
from ..database import get_collection
from ..services import session_service


# =====================================
# @description 关注
# =====================================
def follow(token: str, followId: str):
    userId = session_service.getSessionBySid(token)['userId']
    FollowAlreadyExists = get_collection(
        'follows').find_one({'userId': userId, 'followId': followId})
    check(not FollowAlreadyExists, FollowErrorStat.ERR_ALREADY_FOLLOW.value)
    user = bsonify(IFollow(
        userId=userId,
        followId=followId,
        createdAt=time.time()*1000
    ))
    res = get_collection('follows').insert_one(user)
    return str(res.inserted_id)


# =====================================
# @description 取关
# =====================================
def unfollow(token: str, followId: str):
    userId = session_service.getSessionBySid(token)['userId']
    FollowAlreadyExists = get_collection(
        'follows').find_one({'userId': userId, 'followId': followId})
    check(FollowAlreadyExists, FollowErrorStat.ERR_FOLLOW_NOT_FOUND.value)
    res = get_collection('follows').delete_one(
        {'userId': userId, 'followId': followId})
    return str(res.acknowledged)


# =====================================
# @description How many people do I follow
# =====================================
def how_many_people_I_follow(userId: str):
    counts = get_collection('follows').count_documents({'userId': userId})
    return counts


# =====================================
# @description How many people follow me
# =====================================
def how_many_people_follow_me(userId: str):
    counts = get_collection('follows').count_documents({'followId': userId})
    return counts


# =====================================
# @description Whether to follow each other
# =====================================
def follow_each_other(userId: str, followId: str):
    res1 = get_collection('follows').count_documents(
        {'userId': userId, 'followId': followId})
    res2 = get_collection('follows').count_documents(
        {'userId': followId, 'followId': userId})
    return bool(res1 and res2)


# =====================================
# @description Whether to follow users
# =====================================
def haveFollowed(userId: str, followId: str):
    res = get_collection(
        'follows').find_one({'userId': userId, 'followId': followId})
    return bool(res)
