import time

from bson import ObjectId

from ..models import ENoticeType, EPostType, ILikes, IPost, ELogType
from ..utils.check import *
from ..utils.bsonify import *
from ..database import get_collection
from ..services import session_service, notice_service, log_service
from ..bert import NER_MAIN, TextClassifier_MAIN


ner_class_list = ['address', 'book', 'company', 'game', 'goverment',
                  'movie', 'name', 'organization', 'position', 'scene', 'customize']

classify_class_list = ['财经', '房产', '股票', '教育', '科技',
                       '社会', '时政', '体育', '游戏', '娱乐']

filterDeleted = [{'$match': {'type': {'$ne': EPostType.Delete.value}}}]

relatInfo = [
    {'$lookup': {
        'from': 'post',
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
        'relate.user.openId': 0,
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
            'user.openId': 0,
            'user.banner': 0,
            'user.bio': 0,
            'user.status': 0
        }
    }
]


def create_post(token: str, content: str, imgs: list[str], label: list[str]):
    result_Classify = TextClassifier_MAIN.predict([content])[0]
    result_NER = NER_MAIN.pos_predict([content])[0]["label"]
    if label:
        result_NER.update({'customize': label})
    userId = session_service.getSessionBySid(token)['userId']
    post = bsonify(IPost(
        userId=userId,
        relationId=None,
        type=EPostType.Post.value,
        imgs=imgs,
        content=content,
        classify=result_Classify,
        label=result_NER,
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time()*1000
    ))
    res = get_collection('posts').insert_one(post)
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
    comment = bsonify(IPost(
        userId=userId,
        relationId=ObjectId(relationId),
        type=EPostType.Comment.value,
        imgs=imgs,
        content=content,
        classify=post['classify'],
        label=post['label'],
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time()*1000
    ))
    res = get_collection('posts').insert_one(comment)
    if userId != post['userId']:
        notice_service.create_notice(
            type=ENoticeType.Comment.value,
            senderId=userId,
            receiverId=post['userId'],
            relationId=ObjectId(relationId),
            content=''
        )
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
    forward = bsonify(IPost(
        userId=userId,
        relationId=ObjectId(relationId),
        type=EPostType.Forward.value,
        imgs=imgs,
        content=content,
        classify=post['classify'],
        label=post['label'],
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time()*1000
    ))
    res = get_collection('posts').insert_one(forward)
    if userId != post['userId']:
        notice_service.create_notice(
            type=ENoticeType.Forward.value,
            senderId=userId,
            receiverId=post['userId'],
            relationId=ObjectId(relationId),
            content=''
        )
    log_service.addItem(userId=userId, postId=ObjectId(
        relationId), type=ELogType.Forward.value)
    return str(res.inserted_id)


def like(id: str, token: str):
    userId = session_service.getSessionBySid(token)['userId']
    exist = get_collection('likes').find_one({'postId': id, 'userId': userId})
    check(not exist, PostErrorStat.ERR_POST_HAS_BEEN_LIKED.value)
    post = get_collection('posts').find_one_and_update(
        {'_id': ObjectId(id)}, {'$inc': {'likes': 1}})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED.value)
    like = bsonify(
        ILikes(userId=userId, postId=ObjectId(id), createdAt=time.time()*1000))
    res = get_collection('likes').insert_one(like)
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
        {'userId': userId, 'postId': id})
    check(like, PostErrorStat.ERR_LIKE_NOT_FOUND.value)
    res = get_collection('likes').delete_one(
        {'userId': userId, 'postId': id})
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
        log_service.addItem(userId=userId, postId=ObjectId(
            id), type=type)

    # 删除相关评论
    comments = get_collection('posts').find({
        'relationId': id,
        'type': EPostType.Comment.value
    })
    for comment in comments:
        delete(comment['_id'], token=token)
