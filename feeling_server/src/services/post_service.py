import time

from bson import ObjectId
from ..models import EPostType, IPost
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
    check(post, PostErrorStat.ERR_POST_NOT_FOUND)
    check(post['type'] != EPostType.Delete.value,
          PostErrorStat.ERR_POST_HAS_BEEN_DELETED)
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
