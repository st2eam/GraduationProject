import time
import uuid

from ..utils.md5 import *
from ..utils.check import *
from ..models import EUserStatus, ESexType
from ..database import get_collection
from ..services import session_service, follow_service


# =====================================
# @description 注册
# =====================================
def register(userId: str, password: str, sex: ESexType, avatar: str, banner: str, email: str):
    EmailAlreadyExists = get_collection('users').find_one({'email': email})
    UserAlreadyExists = get_collection(
        'users').find_one({'userId': userId})
    check(not EmailAlreadyExists, UserErrorStat.ERR_EMAIL_ALREADY_EXISTS.value)
    check(not UserAlreadyExists, UserErrorStat.ERR_USER_ALREADY_EXISTS.value)
    user = {
        'userId': userId,
        'password': md5(password),
        'email': email,
        'sex': sex,
        'avatar': avatar,
        'banner': banner,
        'bio': '',
        'labels': [],
        'createdAt': time.time() * 1000,
        'status': EUserStatus.Normal.value
    }
    res = get_collection('users').insert_one(user)
    return str(res.inserted_id)


# =====================================
# @description 登录
# =====================================
def login(username: str, password: str, ip: str):
    data_cursor = get_collection('users').find(
        {"$or": [{'email': username}, {'userId': username}]})
    arr = []
    for x in data_cursor:
        arr.append(x)
    check(len(arr) == 1, UserErrorStat.ERR_USER_NOT_FOUND.value)
    user = arr[0]
    check(user['status'] == EUserStatus.Normal.value,
          UserErrorStat.ERR_USER_HAS_BEEN_BANNED.value)
    check(md5(password) == user['password'],
          UserErrorStat.ERR_PWD_NOT_CORRECT.value)
    session = session_service.getSessionByUserId(user['userId'])
    if not session:
        UUID = str(uuid.uuid1())
        session = {
            "userId": user['userId'],
            "sid": UUID,
            "ip": ip,
            "createdAt": time.time()*1000
        }
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


# =====================================
# @description 检查登录状态
# =====================================
def validate_token(token: str):
    res = get_collection('session').find_one({'sid': token})
    check(res, UserErrorStat.ERR_USER_NOT_LOGIN.value)


# =====================================
# @description 获取用户信息
# =====================================
def get_user_info(token: str, otherUserId=''):
    currLoginUserId = session_service.getSessionBySid(token)['userId']
    userId = otherUserId if bool(otherUserId) else currLoginUserId
    user = get_collection('users').find_one({'userId': userId})
    check(bool(user), UserErrorStat.ERR_USER_NOT_FOUND.value)
    check(user['status'] == EUserStatus.Normal.value,
          UserErrorStat.ERR_USER_HAS_BEEN_BANNED.value)
    follows = follow_service.how_many_people_I_follow(userId)
    subscribes = follow_service.how_many_people_follow_me(userId)
    haveFollowed = follow_service.haveFollowed(
        currLoginUserId, otherUserId) if bool(otherUserId) else False
    return {**user, 'haveFollowed': haveFollowed, 'followCounts': follows, 'subscribeCounts': subscribes}


# =====================================
# @description 更新用户信息
# =====================================
def set_user_info(token: str, newUserId: str, avatar: str, banner: str, bio: str):
    userId = session_service.getSessionBySid(token)['userId']
    user = get_collection('users').find_one({'userId': userId})
    check(bool(user), UserErrorStat.ERR_USER_NOT_FOUND.value)
    userId = newUserId if newUserId else user['userId']
    avatar = avatar if avatar else user['avatar']
    banner = banner if banner else user['banner']
    res = get_collection('users').update_one({'userId': userId}, {
        '$set': {'userId': userId, 'avatar': avatar, 'bio': bio, 'banner': banner}})
    return res.acknowledged


# =====================================
# @description 给用户增加标签
# =====================================
def addLabels(token: str, newLabels: list[str]):
    userId = session_service.getSessionBySid(token)['userId']
    user = get_collection('users').find_one({'userId': userId})
    check(bool(user), UserErrorStat.ERR_USER_NOT_FOUND.value)
    res = get_collection('users').update_one(
        {"_id": user["_id"]},
        {"$push": {"labels": {"$each": newLabels}}}
    )
    return res.acknowledged


# =====================================
# @description 给用户删除标签
# =====================================
def delLabels(token: str, newLabels: list[str]):
    userId = session_service.getSessionBySid(token)['userId']
    user = get_collection('users').find_one({'userId': userId})
    check(bool(user), UserErrorStat.ERR_USER_NOT_FOUND.value)
    labels = user['labels']
    for x in newLabels:
        if x in labels:
            labels.remove(x)
    res = get_collection('users').update_one(
        {"_id": user["_id"]}, {'$set': {'labels': labels}})
    return res.acknowledged
