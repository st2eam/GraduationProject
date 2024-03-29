import re
import time
import jieba
from bson import ObjectId
from keybert import KeyBERT
from ..models import ENoticeType, EPostType,  IPagination,  ELogType
from ..utils.check import *
from ..database import get_collection
from ..services import session_service, notice_service, log_service, user_service
from ..bert import NER_MAIN, TextClassifier_MAIN
from ..word2vec import Word2VecModel

kw_model = KeyBERT(model='paraphrase-multilingual-MiniLM-L12-v2')

ner_class_list = ['address', 'book', 'company', 'game', 'goverment',
                  'movie', 'name', 'organization', 'position', 'scene', 'customize']

classify_class_list = ['财经', '房产', '股票',
                       '教育', '科技', '社会', '时政', '体育', '游戏', '娱乐']


filterDeleted = [{'$match': {'type': {'$ne': EPostType.Delete.value}}}]

relatInfo = [
    {'$lookup': {
        'from': 'posts',
        'localField': 'relationId',
        'foreignField': '_id',
        'as': 'relate.post'
    }
    },
    {'$lookup': {
        'from': 'users',
        'localField': 'relate.post.userId',
        'foreignField': 'userId',
        'as': 'relate.user'
    }
    },
    {'$project': {
        'relate.user._id': 0,
        'relate.user.createdAt': 0,
        'relate.user.banner': 0,
        'relate.user.bio': 0,
        'relate.user.status': 0
    }
    }
]

userInfo = [
    {
        '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': 'userId',
            'as': 'user'
        }
    },
    {
        '$unwind': '$user'
    },
    {
        '$project': {
            'user._id': 0,
            'user.createdAt': 0,
            'user.banner': 0,
            'user.bio': 0,
            'user.password': 0,
            'user.status': 0
        }
    }
]


def get_recommend(token: str):
    userId = session_service.getSessionBySid(token)['userId']
    user = get_collection('users').find_one({'userId': userId})
    labels = user['labels']
    recommend_option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'follows',
                'localField': 'userId',
                'foreignField': 'followId',
                'as': 'follow'
            }
        },
        {
            '$lookup': {
                'from': 'recommend',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'recommended'
            }
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$addFields': {
                'haveRecommended': {'$in': [userId, '$recommended.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0,
                'recommended': 0
            }
        },
        {
            '$match': {
                '$and': [
                    {'userId': {'$not': {'$eq': userId}}},
                    {'follow.userId': {'$not': {'$eq': userId}}},
                    {'haveRecommended': False}
                ]
            }
        },
        {'$match': {'type': {'$ne': EPostType.Comment.value}}},
        {
            '$sort': {
                '_id': -1
            }
        },
        {
            '$project': {
                'follow': 0,
                'haveRecommended': 0,
                'user.labels': 0
            }
        }
    ]
    recommend_data_cursor = get_collection(
        'posts').aggregate([*recommend_option])
    temp = [x for x in recommend_data_cursor]
    model = Word2VecModel.get_instance()
    recommend_arr = sorted(temp, key=lambda x: model.wv.n_similarity(
        x['keywords'], labels), reverse=True)
    items = recommend_arr[:10]
    if (len(items) != 0):
        log_service.addRecommendedPosts(
            userId=userId, postList=map(lambda post: post['_id'], items))
    return {
        'items': items
    }


def get_historical_recommend(token: str, options: IPagination):
    userId = session_service.getSessionBySid(token)['userId']
    option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'follows',
                'localField': 'userId',
                'foreignField': 'followId',
                'as': 'follow'
            }
        },
        {
            '$lookup': {
                'from': 'recommend',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'recommended'
            }
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$addFields': {
                'haveRecommended': {'$in': [userId, '$recommended.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0,
                'recommended': 0
            }
        },
        {
            '$match': {
                '$and': [
                    {'userId': {'$not': {'$eq': userId}}},
                    {'follow.userId': {'$not': {'$eq': userId}}},
                    {'haveRecommended': True}
                ]
            }
        },
        {'$match': {'type': {'$ne': EPostType.Comment.value}}},
        {
            '$sort': {
                '_id': -1
            }
        },
        {
            '$project': {
                'follow': 0,
                'haveRecommended': 0,
                'user.labels': 0
            }
        }
    ]
    if bool(options.next):
        next = get_collection('posts').find_one(
            {'_id': ObjectId(options.next)})
        data_cursor = get_collection('posts').aggregate([
            *option,
            {
                '$match': {
                    'createdAt': {
                        '$lt': next['createdAt']
                    }
                }
            },
            {
                '$limit': options.limit
            }
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option, {
                '$limit': options.limit
            }
        ])
    items = [x for x in data_cursor]
    hasNext = len(items) == options.limit
    return {
        'items': items,
        'hasNext': hasNext
    }


def get_following(token: str, options: IPagination):
    userId = session_service.getSessionBySid(token)['userId']
    hasNext = False
    option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'follows',
                'localField': 'userId',
                'foreignField': 'followId',
                'as': 'follow'
            }
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        },
        {
            '$match': {
                '$or': [{'userId': userId}, {'follow.userId': userId}]
            }
        },
        {'$match': {'type': {'$ne': EPostType.Comment.value}}},
        {
            '$sort': {
                '_id': -1
            }
        },
        {
            '$project': {
                'follow': 0
            }
        }
    ]
    if bool(options.next):
        data_cursor = get_collection('posts').aggregate([
            *option,
            {
                '$match': {
                    '_id': {
                        '$lt': ObjectId(options.next)
                    }
                }
            },
            {
                '$limit': options.limit
            }
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option, {
                '$limit': options.limit
            }
        ])
    arr = [x for x in data_cursor]
    hasNext = len(arr) == options.limit
    return {
        'items': arr,
        'hasNext': hasNext
    }


def create_post(token: str, content: str, imgs: list[str], labels: list[str]):
    result_Classify = TextClassifier_MAIN.predict([content])[0]
    result_NER = NER_MAIN.pos_predict([content])[0]["label"]
    doc = " ".join(jieba.cut(content))
    extract_keywords = kw_model.extract_keywords(doc)
    keywords = []
    for item in extract_keywords:
        keywords.append(item[0])

    for key in result_NER:
        keywords.extend(result_NER[key])

    if labels:
        result_NER.update({'customize': labels})
    keywords = list(set(keywords))
    increment_count = int(len(keywords)/53*47)
    for i in range(increment_count):
        keywords.append(result_Classify)
    userId = session_service.getSessionBySid(token)['userId']
    post = {
        'userId': userId,
        'relationId': None,
        'type': EPostType.Post.value,
        'imgs': imgs,
        'content': content,
        'classify': result_Classify,
        'label': result_NER,
        'keywords': keywords,
        'likes': 0,
        'comments': 0,
        'forwards': 0,
        'createdAt': time.time() * 1000
    }
    res = get_collection('posts').insert_one(post)
    user_service.addLabels(userId=userId, newLabels=keywords)
    log_service.addItem(userId=userId, postId=res.inserted_id,
                        type=ELogType.Post.value)
    return str(res.inserted_id)


def create_comment(token: str, relationId: str, content: str, imgs: list[str]):
    userId = session_service.getSessionBySid(token)['userId']
    post = get_collection('posts').find_one_and_update(
        {'_id': ObjectId(relationId)}, {'$inc': {'comments': 1}})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED.value)
    doc = " ".join(jieba.cut(content))
    extract_keywords = kw_model.extract_keywords(doc)
    keywords = post['keywords']
    for item in extract_keywords:
        keywords.append(item[0])
    keywords = list(set(keywords))
    comment = {
        'userId': userId,
        'relationId': ObjectId(relationId),
        'type': EPostType.Comment.value,
        'imgs': imgs,
        'content': content,
        'classify': post['classify'],
        'label': post['label'],
        'keywords': keywords,
        'likes': 0,
        'comments': 0,
        'forwards': 0,
        'createdAt': time.time() * 1000
    }
    res = get_collection('posts').insert_one(comment)
    if userId != post['userId']:
        notice_service.create_notice(
            type=ENoticeType.Comment.value,
            senderId=userId,
            receiverId=post['userId'],
            relationId=ObjectId(relationId),
            content=''
        )
    user_service.addLabels(userId=userId, newLabels=keywords)
    log_service.addItem(userId=userId, postId=ObjectId(
        relationId), type=ELogType.Comment.value)
    return str(res.inserted_id)


def create_forward(token: str, relationId: str, content: str, imgs: list[str]):
    userId = session_service.getSessionBySid(token)['userId']
    post = get_collection('posts').find_one_and_update(
        {'_id': ObjectId(relationId)}, {'$inc': {'forwards': 1}})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED.value)
    doc = " ".join(jieba.cut(content))
    extract_keywords = kw_model.extract_keywords(doc)
    keywords = post['keywords']
    for item in extract_keywords:
        keywords.append(item[0])
    keywords = list(set(keywords))
    forward = {
        'userId': userId,
        'relationId': ObjectId(relationId),
        'type': EPostType.Forward.value,
        'imgs': imgs,
        'content': content,
        'classify': post['classify'],
        'label': post['label'],
        'keywords': keywords,
        'likes': 0,
        'comments': 0,
        'forwards': 0,
        'createdAt': time.time() * 1000
    }

    res = get_collection('posts').insert_one(forward)
    if userId != post['userId']:
        notice_service.create_notice(
            type=ENoticeType.Forward.value,
            senderId=userId,
            receiverId=post['userId'],
            relationId=ObjectId(relationId),
            content=''
        )
    user_service.addLabels(userId=userId, newLabels=keywords)
    log_service.addItem(userId=userId, postId=ObjectId(
        relationId), type=ELogType.Forward.value)
    return str(res.inserted_id)


def get_detail(id: str, token: str):
    pattern = r'^[A-Fa-f0-9]{1,24}$'
    check(re.match(pattern, id) and len(id) == 24,
          PostErrorStat.ERR_POST_NOT_FOUND.value)
    userId = session_service.getSessionBySid(token)['userId']
    likeInfo = [
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        }
    ]
    data_cursor = get_collection('posts').aggregate([
        {'$match': {'_id': ObjectId(id)}},
        *relatInfo,
        *userInfo,
        *likeInfo
    ])
    post = [x for x in data_cursor][0]

    check(bool(post), PostErrorStat.ERR_POST_NOT_FOUND.value)
    if (post['type'] == EPostType.Delete.value):
        post['content'] = '帖子已删除'
        post['imgs'] = []
    return post


def get_comments(id: str, token: str, options: IPagination):
    hasNext = False
    userId = session_service.getSessionBySid(token)['userId']
    likeInfo = [
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        }
    ]
    option = [
        *filterDeleted,
        *relatInfo,
        *userInfo,
        *likeInfo,
        {'$sort': {'_id': -1}}
    ]
    if options.next:
        data_cursor = get_collection('posts').aggregate([
            *option,
            {
                "$match": {
                    "relationId": ObjectId(id),
                    "_id": {"$lt": ObjectId(options.next)},
                    "type": EPostType.Comment.value
                }
            },
            {"$match": {"userId": userId}},
            {"$limit": options.limit}
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option,
            {
                "$match": {
                    "relationId": ObjectId(id),
                    "type": EPostType.Comment.value
                }
            },
            {"$limit": options.limit}
        ])
    items = [x for x in data_cursor]
    hasNext = len(items) == options.limit
    return {
        'items': items,
        'hasNext': hasNext
    }


def like(id: str, token: str):
    userId = session_service.getSessionBySid(token)['userId']
    exist = get_collection('likes').find_one(
        {'postId': ObjectId(id), 'userId': userId})
    check(not exist, PostErrorStat.ERR_POST_HAS_BEEN_LIKED.value)
    post = get_collection('posts').find_one_and_update(
        {'_id': ObjectId(id)}, {'$inc': {'likes': 1}})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED.value)
    res = get_collection('likes').insert_one(
        {
            'postId': ObjectId(id),
            'userId': userId,
            'createdAt': time.time() * 1000
        })
    user_service.addLabels(userId=userId, newLabels=post['keywords'])
    log_service.addItem(userId=userId, postId=ObjectId(id),
                        type=ELogType.Like.value)
    return str(res.inserted_id)


def unlike(id: str, token: str):
    userId = session_service.getSessionBySid(token)['userId']
    post = get_collection('posts').find_one_and_update(
        {'_id': ObjectId(id)}, {'$inc': {'likes': -1}})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED.value)
    like = get_collection('likes').find_one(
        {'userId': userId, 'postId': ObjectId(id)})
    check(like, PostErrorStat.ERR_LIKE_NOT_FOUND.value)
    res = get_collection('likes').delete_one(
        {'userId': userId, 'postId': ObjectId(id)})
    user_service.delLabels(token=token, newLabels=post['keywords'])
    log_service.addItem(userId=userId, postId=ObjectId(id),
                        type=ELogType.Unlike.value)
    return res.acknowledged


def delete(id: str, token: str):
    # 获取用户ID和帖子
    userId = session_service.getSessionBySid(token)['userId']
    post = get_collection('posts').find_one({'_id': ObjectId(id)})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)

    # 将帖子类型设置为删除
    get_collection('posts').update_one({'_id': ObjectId(id)}, {
        '$set': {'type': EPostType.Delete.value}})
    # 更新用户数据,仅添加属于自己的内容
    if post['userId'] == userId:
        type = ELogType.DeletePost.value if post['type'] == EPostType.Post.value else ELogType.DeleteForward.value if post[
            'type'] == EPostType.Forward.value else ELogType.DeleteComment.value
        user_service.delLabels(token=token, newLabels=post['keywords'])
        log_service.addItem(userId=userId, postId=ObjectId(
            id), type=type)

    # 删除相关评论
    comments = get_collection('posts').find({
        'relationId': id,
        'type': EPostType.Comment.value
    })
    for comment in comments:
        delete(comment['_id'], token=token)


def get_user_post(token: str, relationId: str, options: IPagination):
    userId = user_service.get_user_info(token, relationId)['userId']
    option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        },
        {'$sort': {'_id': -1}}
    ]
    if (options.next):
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'userId': userId,
                        'type': {'$ne': EPostType.Comment.value},
                        '_id': {'$lt': ObjectId(options.next)}}},
            {'$limit': options.limit}
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'userId': userId, 'type': {'$ne': EPostType.Comment.value}}},
            {'$limit': options.limit}
        ])
    items = [x for x in data_cursor]
    hasNext = len(items) == options.limit
    return {'items': items, 'hasNext': hasNext}


def get_user_img_post(token: str, relationId: str, options: IPagination):
    userId = user_service.get_user_info(token, relationId)['userId']
    option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        },
        {'$sort': {'_id': -1}}
    ]
    if (options.next):
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'userId': userId,
                        'type': {'$ne': EPostType.Comment.value},
                        'imgs': {'$ne': []},
                        '_id': {'$lt': ObjectId(options.next)}}},
            {'$limit': options.limit}
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'userId': userId,
                        'type': {'$ne': EPostType.Comment.value},
                        'imgs': {'$ne': []}}},
            {'$limit': options.limit}
        ])
    items = [x for x in data_cursor]
    hasNext = len(items) == options.limit
    return {'items': items, 'hasNext': hasNext}


def get_user_like_post(token: str, relationId: str, options: IPagination):
    userId = user_service.get_user_info(token, relationId)['userId']
    option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'likePosts'
            }
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0
            }
        },
        {'$unwind': '$likePosts'},
        {'$match': {'likePosts.userId': userId}},
        {'$sort': {'_id': -1}}
    ]
    if (options.next):
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'type': {'$ne': EPostType.Comment.value},
                        '_id': {'$lt': ObjectId(options.next)}}},
            {'$limit': options.limit}
        ])
    else:
        data_cursor = get_collection('posts').aggregate([
            *option,
            {'$match': {'type': {'$ne': EPostType.Comment.value}}},
            {'$limit': options.limit}
        ])
    items = [x for x in data_cursor]
    hasNext = len(items) == options.limit
    return {'items': items, 'hasNext': hasNext}


def similar(id: str, token: str):
    post = get_collection('posts').find_one({'_id': ObjectId(id)})
    userId = session_service.getSessionBySid(token)['userId']
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    recommend_option = [
        *filterDeleted,
        *userInfo,
        *relatInfo,
        {
            '$lookup': {
                'from': 'follows',
                'localField': 'userId',
                'foreignField': 'followId',
                'as': 'follow'
            }
        },
        {
            '$lookup': {
                'from': 'recommend',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'recommended'
            }
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'postId',
                'as': 'hasLikes'
            }
        },
        {
            '$addFields': {
                'isLike': {'$in': [userId, '$hasLikes.userId']},
            }
        },
        {
            '$addFields': {
                'haveRecommended': {'$in': [userId, '$recommended.userId']},
            }
        },
        {
            '$project': {
                'hasLikes': 0,
                'recommended': 0
            }
        },
        {
            '$match': {
                '$and': [
                    {'_id': {'$not': {'$eq': ObjectId(id)}}},
                    {'userId': {'$not': {'$eq': userId}}},
                    {'follow.userId': {'$not': {'$eq': userId}}},
                    {'haveRecommended': {'$eq': False}}
                ]
            }
        },
        {'$match': {'type': {'$ne': EPostType.Comment.value}}},
        {
            '$sort': {
                '_id': -1
            }
        },
        {
            '$project': {
                'follow': 0,
                'haveRecommended': 0,
                'user.labels': 0
            }
        }
    ]
    recommend_data_cursor = get_collection(
        'posts').aggregate([*recommend_option])
    temp = [x for x in recommend_data_cursor]
    if len(temp) == 0:
        return None
    else:
        model = Word2VecModel.get_instance()
        recommend_arr = sorted(temp, key=lambda x: model.wv.n_similarity(
            x['keywords'], post['keywords']), reverse=True)
        most_recommended = recommend_arr[0]
        log_service.addRecommendedPosts(userId=userId, postList=[
                                        most_recommended['_id']])
    return most_recommended


def create_daily_posts(data: list[str]):
    user_array = ["老王",  "Caphriel",
                  "Rahmiel", "Naaririel", "小李", "Ophanim", "Yahoel", "Wish"]
    for i, content in enumerate(data):
        userId = user_array[i % len(user_array)]
        result_Classify = TextClassifier_MAIN.predict([content])[0]
        result_NER = NER_MAIN.pos_predict([content])[0]["label"]
        doc = " ".join(jieba.cut(content))
        extract_keywords = kw_model.extract_keywords(doc)
        keywords = []
        keywords.append(result_Classify)
        for key in result_NER:
            keywords.extend(result_NER[key])
        for item in extract_keywords:
            keywords.append(item[0])
        keywords = list(set(keywords))
        post = {
            'userId': userId,
            'relationId': None,
            'type': EPostType.Post.value,
            'imgs': [],
            'content': content,
            'classify': result_Classify,
            'label': result_NER,
            'keywords': keywords,
            'likes': 0,
            'comments': 0,
            'forwards': 0,
            'createdAt': time.time() * 1000
        }
        res = get_collection('posts').insert_one(post)
        user_service.addLabels(userId=userId, newLabels=keywords)
        log_service.addItem(userId=userId, postId=res.inserted_id,
                            type=ELogType.Post.value)
        print(userId+'成功发布一篇文章')
