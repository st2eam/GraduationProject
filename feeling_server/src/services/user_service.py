import time
import uuid

from ..utils.md5 import *
from ..utils.check import *
from ..utils.bsonify import *
from ..models import EUserStatus, IUser, ISession
from ..database import get_collection
from ..services import session_service


# =====================================
# @description 注册
# =====================================
def register(username: str, password: str, avatar: str, banner: str, email: str):
    EmailAlreadyExists = get_collection('users').find_one({'email': email})
    UserAlreadyExists = get_collection(
        'users').find_one({'username': username})
    check(not EmailAlreadyExists, UserErrorStat.ERR_EMAIL_ALREADY_EXISTS.value)
    check(not UserAlreadyExists, UserErrorStat.ERR_USER_ALREADY_EXISTS.value)
    user = bsonify(IUser(
        userId=str(uuid.uuid1()),
        username=username,
        password=md5(password),
        email=email,
        avatar=avatar,
        banner=banner,
        bio='',
        createdAt=time.time(),
        status=EUserStatus.Normal.value
    ))
    res = get_collection('users').insert_one(user)
    return str(res.inserted_id)


# =====================================
# @description 登录
# =====================================
def login(username: str, password: str, ip: str):
    user = get_collection('users').find(
        {"$or": [{'email': username}, {'username': username}]})[0]
    check(user, UserErrorStat.ERR_USER_NOT_FOUND.value)
    check(user['status'] == EUserStatus.Normal.value,
          UserErrorStat.ERR_USER_HAS_BEEN_BANNED.value)
    check(md5(password) == user['password'],
          UserErrorStat.ERR_PWD_NOT_CORRECT.value)
    session = session_service.getSessionByUserId(user['userId'])
    if not session:
        UUID = str(uuid.uuid1())
        session = bsonify(ISession(
            userId=user['userId'],
            sid=UUID,
            ip=ip,
            createdAt=time.time(),
        ))
        get_collection('session').insert_one(session)
        return UUID
    else:
        return session['sid']


# =====================================
# @description 登出
# =====================================
def logout(token: str):
    res = get_collection('session').delete_one({'sid': token})
    return res.acknowledged
