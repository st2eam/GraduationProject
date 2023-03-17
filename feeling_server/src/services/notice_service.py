import time
from bson import ObjectId
from ..utils.check import *
from ..models import EMsgStatus, ENoticeType,  IPagination
from ..services import session_service
from ..database import get_collection


def create_notice(type: ENoticeType, senderId: str, receiverId: str, relationId: str, content: str):
    notice = {
        'type': type,
        'content': content,
        'senderId': senderId,
        'receiverId': receiverId,
        'relationId': ObjectId(relationId),
        'createdAt': time.time() * 1000,
        'status': EMsgStatus.Unread.value
    }
    res = get_collection('notices').insert_one(notice)
    return res


def get_notice_list(token: str, props: IPagination):
    userId = session_service.getSessionBySid(token)['userId']
    items = []
    hasNext = False
    hasPrev = False
    if props.next:
        data_cursor = get_collection('notices').aggregate([
            {'$sort': {'_id': -1}},
            {
                '$match': {
                    'receiverId': userId,
                    'status': {'$in': [EMsgStatus.Read.value, EMsgStatus.Unread.value]},
                    '_id': {'$lt': ObjectId(props.next)}
                }
            },

            {'$limit': props.limit},
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'senderId',
                    'foreignField': 'userId',
                    'as': 'fromItems'
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [{'$arrayElemAt': ['$fromItems', 0]}, '$$ROOT']
                    }
                }
            },
            {
                '$project': {
                    'fromItems': 0,
                    'openId': 0,
                    'userId': 0,
                    'banner': 0,
                    'bio': 0,
                    'createdAt': 0,
                    'receiverId': 0
                }
            }
        ])
    elif (props.prev):
        data_cursor = get_collection('notices').aggregate([
            {'$sort': {'_id': 1}},
            {'$match': {
                'receiverId': userId,
                'status': {'$in': [EMsgStatus.Read.value, EMsgStatus.Unread.value]},
                '_id': {'$gt': ObjectId(props.prev)}
            }
            },

            {'$limit': props.limit},
            {'$lookup': {
                'from': 'users',
                'localField': 'senderId',
                'foreignField': 'userId',
                'as': 'fromItems'
            }
            },
            {'$replaceRoot': {
                'newRoot': {'$mergeObjects': [{'$arrayElemAt': ['$fromItems', 0]}, '$$ROOT']
                            }
            }
            },
            {'$project': {
                'fromItems': 0,
                'openId': 0,
                'userId': 0,
                'banner': 0,
                'bio': 0,
                'createdAt': 0,
                'receiverId': 0
            }
            }
        ])
    else:
        data_cursor = get_collection('notices').aggregate([
            {'$sort': {'_id': -1}},
            {'$match': {
                'receiverId': userId,
                'status': {'$in': [EMsgStatus.Read.value, EMsgStatus.Unread.value]}
            }
            },

            {'$limit': props.limit},
            {'$lookup': {
                'from': 'users',
                'localField': 'senderId',
                'foreignField': 'userId',
                'as': 'fromItems'
            }
            },
            {'$replaceRoot': {
                'newRoot': {'$mergeObjects': [{'$arrayElemAt': ['$fromItems', 0]}, '$$ROOT']
                            }
            }
            },
            {'$project': {
                'fromItems': 0,
                'openId': 0,
                'userId': 0,
                'banner': 0,
                'bio': 0,
                'createdAt': 0,
                'receiverId': 0
            }
            }
        ])
        items = [x for x in data_cursor]
        if props.prev:
            items.reverse()
        if (len(items) > 0):
            next_cursor = get_collection('notices').aggregate([
                {'$sort': {'_id': -1}},
                {'$match': {
                    'receiverId': userId,
                    'status': {'$in': [EMsgStatus.Read.value, EMsgStatus.Unread.value]},
                    '_id': {'$lt': items[len(items) - 1]['_id']}
                }
                },
                {'$limit': 1}
            ])
            if (next_cursor.next):
                hasNext = True
            prev_cursor = get_collection('notices').aggregate([
                {'$sort': {'_id': -1}},
                {'$match': {
                    'receiverId': userId,
                    'status': {'$in': [EMsgStatus.Read.value, EMsgStatus.Unread.value]},
                    '_id': {'$gt': items[0]['_id']}
                }
                },
                {'$limit': 1}
            ])
            if (prev_cursor.next):
                hasPrev = True
    return {'NotifyList': items, 'hasNext': hasNext, 'hasPrev': hasPrev}


def update_status(token: str, id: str):
    userId = session_service.getSessionBySid(token)['userId']
    result = get_collection('notices').find_one({
        '_id': ObjectId(id),
        'receiverId': userId
    })
    check(result, NotifyErrorStat.ERR_NOTIFY_NOT_FOUND.value)
    if result['status'] == EMsgStatus.Read.value:
        new_status = EMsgStatus.Unread.value
    elif result['status'] == EMsgStatus.Unread.value:
        new_status = EMsgStatus.Read.value
    else:
        new_status = result['status']
    res = get_collection('notices').update_one(
        {'_id': ObjectId(id)},
        {'$set': {'status': new_status}}
    )
    return res.acknowledged


def delete(token: str, id: str):
    userId = session_service.getSessionBySid(token)['userId']
    result = get_collection('notices').update_one(
        {'_id': ObjectId(id), 'receiverId': userId},
        {'$set': {'status': EMsgStatus.Deleted.value}}
    )
    return result.acknowledged


def get_unread(token: str):
    userId = session_service.getSessionBySid(token)['userId']
    count = get_collection('notices').count_documents({
        'receiverId': userId,
        'status': EMsgStatus.Unread.value
    })
    return count


def read_all(token: str):
    userId = session_service.getSessionBySid(token)['userId']
    res = get_collection('notices').update_many(
        {'receiverId': userId, 'status': EMsgStatus.Unread.value},
        {'$set': {'status': EMsgStatus.Read.value}}
    )
    return res.acknowledged


def delete_all(token: str):
    userId = session_service.getSessionBySid(token)['userId']
    res = get_collection('notices').update_many(
        {'receiverId': userId},
        {'$set': {'status': EMsgStatus.Deleted.value}}
    )
    return res.acknowledged
