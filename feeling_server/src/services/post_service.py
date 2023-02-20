import time

from bson import ObjectId
from ..models import EPostType, ILikes, IPost
from ..utils.check import *
from ..utils.bsonify import *
from ..database import get_collection
from ..services import session_service


def create_post(token: str, content: str, imgs: list[str]):
    userId = session_service.getSessionBySid(token)['userId']
    post = bsonify(IPost(
        userId=userId,
        relationId=None,
        type=EPostType.Post.value,
        imgs=imgs,
        content=content,
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time(),
    ))
    res = get_collection('posts').insert_one(post)
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
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time(),
    ))
    res = get_collection('posts').insert_one(comment)
    # =====================================
    # 此处需要添加通知
    # =====================================
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
        likes=0,
        comments=0,
        forwards=0,
        createdAt=time.time(),
    ))
    res = get_collection('posts').insert_one(forward)
    # =====================================
    # 此处需要添加通知
    # =====================================
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
        ILikes(userId=userId, postId=ObjectId(id), createdAt=time.time()))
    res = get_collection('likes').insert_one(like)
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
    return res.acknowledged


def delete(id: str):
    post = get_collection('posts').find_one({'_id': ObjectId(id)})
    check(post, PostErrorStat.ERR_POST_NOT_FOUND.value)
    get_collection('posts').update_one({'_id': ObjectId(id)}, {
        '$set': {'type': EPostType.Delete.value}})
    comments = get_collection('posts').find({
        'relationId': id,
        'type': EPostType.Comment.value
    })
    for item in comments:
        delete(item['id'])
