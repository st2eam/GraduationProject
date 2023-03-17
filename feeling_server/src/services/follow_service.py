import time
from bson import ObjectId
from ..utils.check import *
from ..models import ENoticeType, IPagination
from ..database import get_collection
from ..services import session_service, notice_service, user_service


# =====================================
# @description 关注
# =====================================
def follow(token: str, followId: str):
    userId = session_service.getSessionBySid(token)['userId']
    FollowAlreadyExists = get_collection(
        'follows').find_one({'userId': userId, 'followId': followId})
    check(not FollowAlreadyExists, FollowErrorStat.ERR_ALREADY_FOLLOW.value)
    user = {
        'userId': userId,
        'followId': followId,
        'createdAt': time.time() * 1000
    }
    res = get_collection('follows').insert_one(user)
    notice_service.create_notice(
        type=ENoticeType.Follow.value,
        senderId=userId,
        receiverId=followId,
        relationId=None,
        content=''
    )
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


def follower_list(token: str, relationId: str, options: IPagination):
    user = user_service.get_user_info(token, relationId)
    current_user = user_service.get_user_info(token)
    if options.next:
        data_cursor = get_collection('follows').aggregate([
            {
                '$match': {'userId': user['userId'], '_id': {'$lt': ObjectId(next)}}
            },
            {
                '$sort': {'_id': -1}
            },
            {
                '$limit': options.limit
            },
            {
                '$lookup': {
                    'from': 'follows',
                    'let': {'userId': '$userId', 'followId': '$followId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$followId',
                                                 '$$followId']},
                                        {'$eq': ['$userId',
                                                 current_user['userId']]}
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户，通常情况都是当前登录用户
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'followId',
                    'foreignField': 'userId',
                    'as': 'user'  # 同时返回关注userId的用户的信息
                }
            },
            {
                '$unwind': '$user'
            }
        ])
    else:
        data_cursor = get_collection('follows').aggregate([
            {
                '$match': {'userId': user['userId']}
            },
            {
                '$sort': {'_id': -1}
            },
            {
                '$limit': options.limit
            },
            {
                '$lookup': {
                    'from': 'follows',
                    'let': {'userId': '$userId', 'followId': '$followId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$followId', '$$followId']},
                                        {'$eq': ['$userId',
                                                 current_user['userId']]}
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户，通常情况都是当前登录用户
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'followId',
                    'foreignField': 'userId',
                    'as': 'user'  # 同时返回关注userId的用户的信息
                }
            },
            {
                '$unwind': '$user'
            }
        ])
        arr = [x for x in data_cursor]
        hasNext = len(arr) == options.limit
        res = [
            {**val, 'haveFollowed': len(val['haveFollowed']) != 0} for val in arr]
    return {'items': res, 'hasNext': hasNext}


def subscriber_list(token: str, relationId: str, options: IPagination):
    user = user_service.get_user_info(token, relationId)
    current_user = user_service.get_user_info(token)
    if options.next:
        data_cursor = get_collection('follows').aggregate([
            {
                '$match': {'followId': user['userId'], '_id': {'$lt': ObjectId(next)}}
            },
            {
                '$sort': {'_id': -1}
            },
            {
                '$limit': options.limit
            },
            {
                '$lookup': {
                    'from': 'follows',
                    'let': {'userId': '$userId', 'followId': '$followId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$followId',
                                                 '$$userId']},
                                        {'$eq': ['$userId',
                                                 current_user['userId']]}
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户，通常情况都是当前登录用户
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': 'userId',
                    'as': 'user'  # 同时返回关注userId的用户的信息
                }
            },
            {
                '$unwind': '$user'
            }
        ])
    else:
        data_cursor = get_collection('follows').aggregate([
            {
                '$match': {'followId': user['userId']}
            },
            {
                '$sort': {'_id': -1}
            },
            {
                '$limit': options.limit
            },
            {
                '$lookup': {
                    'from': 'follows',
                    'let': {'userId': '$userId', 'followId': '$followId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$followId', '$$userId']},
                                        {'$eq': ['$userId',
                                                 current_user['userId']]}
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户，通常情况都是当前登录用户
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': 'userId',
                    'as': 'user'  # 同时返回关注userId的用户的信息
                }
            },
            {
                '$unwind': '$user'
            }
        ])
        arr = [x for x in data_cursor]
        hasNext = len(arr) == options.limit
        res = [
            {**val, 'haveFollowed': len(val['haveFollowed']) != 0} for val in arr]
    return {'items': res, 'hasNext': hasNext}
