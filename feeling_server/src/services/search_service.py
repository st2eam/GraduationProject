from bson import ObjectId

from ..models import EPostType, EUserStatus, ISearch
from ..database import get_collection
from ..services import post_service, session_service


def search_post(token: str, props: ISearch):
    hasNext = False
    if (props.next):
        data_cursor = get_collection('posts').aggregate(
            [*post_service.filterDeleted,
             *post_service.relatInfo,
             *post_service.userInfo,
             {'$match': {
                 'content': {'$regex': props.keyword, '$options': 'i'},
                 '_id': {'$lt': ObjectId(next)},
                 'type': {'$ne': EPostType.Delete.value}
             }},
             {'$sort': {'_id': -1}}, {'$limit': props.limit}])
    else:
        data_cursor = get_collection('posts').aggregate(
            [*post_service.filterDeleted,
             *post_service.relatInfo,
             *post_service.userInfo,
             {'$match': {
                 'content': {'$regex': props.keyword, '$options': 'i'},
                 'type': {'$ne': EPostType.Delete.value}
             }},
                {'$sort': {'_id': -1}}, {'$limit': props.limit}])

    arr = []
    for x in data_cursor:
        arr.append(x)
    hasNext = len(arr) == props.limit
    return {
        'items': arr,
        'hasNext': hasNext
    }


def search_img(token: str, props: ISearch):
    hasNext = False
    if (props.next):
        data_cursor = get_collection('posts').aggregate(
            [*post_service.filterDeleted,
             *post_service.relatInfo,
             *post_service.userInfo,
             {'$match': {
                 'content': {'$regex': props.keyword, '$options': 'i'},
                 '_id': {'$lt': ObjectId(next)},
                 'imgs': {'$ne': []},
                 'type': {'$ne': EPostType.Delete.value}
             }},
             {'$sort': {'_id': -1}}, {'$limit': props.limit}])
    else:
        data_cursor = get_collection('posts').aggregate(
            [*post_service.filterDeleted,
             *post_service.relatInfo,
             *post_service.userInfo,
             {'$match': {
                 'content': {'$regex': props.keyword, '$options': 'i'},
                 'imgs': {'$ne': []},
                 'type': {'$ne': EPostType.Delete.value}
             }},
                {'$sort': {'_id': -1}}, {'$limit': props.limit}])
    arr = []
    for x in data_cursor:
        arr.append(x)
    hasNext = len(arr) == props.limit
    return {
        'items': arr,
        'hasNext': hasNext
    }


def search_user(token: str, props: ISearch):
    userId = session_service.getSessionBySid(token)['userId']
    hasNext = False
    if (props.next):
        data_cursor = get_collection('users').aggregate([
            {
                '$match': {
                    '$or': [{
                        'userId': {
                            '$regex': props.keyword,
                            '$options': 'i'
                        }
                    },
                        {
                        'nickname': {
                            '$regex': props.keyword,
                            '$options': 'i'
                        }
                    }
                    ],
                    '_id': {
                        '$lt': ObjectId(next)
                    },
                    'status': EUserStatus.Normal.value
                }
            }, {
                '$sort': {
                    '_id': -1
                }
            }, {
                '$limit': props.limit
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$and': [{
                                    '$eq': ['$userId', userId]
                                },
                                    {
                                    '$eq': ['$followId', '$$userId']
                                }
                                ]
                            }
                        }
                    }],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户， 通常情况都是当前登录用户
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$eq': ['$$userId', '$userId']
                            }
                        }
                    },
                        {
                        '$group': {
                            '_id': '$userId',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                    ],
                    'as': 'followCounts'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$eq': ['$$userId', '$followId']
                            }
                        }
                    },
                        {
                        '$group': {
                            '_id': '$followId',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                    ],
                    'as': 'subscribeCounts'
                }
            }
        ])
    else:
        data_cursor = get_collection('users').aggregate([
            {
                '$match': {
                    '$or': [{
                        'userId': {
                            '$regex': props.keyword,
                            '$options': 'i'
                        }
                    },
                        {
                        'nickname': {
                            '$regex': props.keyword,
                            '$options': 'i'
                        }
                    }
                    ],
                    'status': EUserStatus.Normal.value
                }
            }, {
                '$sort': {
                    '_id': -1
                }
            }, {
                '$limit': props.limit
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$and': [{
                                    '$eq': ['$userId', userId]
                                },
                                    {
                                    '$eq': ['$followId', '$$userId']
                                }
                                ]
                            }
                        }
                    }],
                    'as': 'haveFollowed'  # relationId用户是否关注了查找出来的userId用户关注的用户， 通常情况都是当前登录用户
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$eq': ['$$userId', '$userId']
                            }
                        }
                    },
                        {
                        '$group': {
                            '_id': '$userId',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                    ],
                    'as': 'followCounts'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'let': {
                        'userId': '$userId'
                    },
                    'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$eq': ['$$userId', '$followId']
                            }
                        }
                    },
                        {
                        '$group': {
                            '_id': '$followId',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                    ],
                    'as': 'subscribeCounts'
                }
            }
        ])
    arr = []
    for x in data_cursor:
        arr.append(x)
    hasNext = len(arr) == props.limit
    res = [
        {
            **item,
            'haveFollowed': len(item['haveFollowed']) != 0,
            'followCounts': item['followCounts'][0]['count'] if len(item['followCounts']) else 0,
            'subscribeCounts': item['subscribeCounts'][0]['count'] if len(item['subscribeCounts']) else 0
        }
        for item in arr
    ]
    return {
        'items': res,
        'hasNext': hasNext
    }
