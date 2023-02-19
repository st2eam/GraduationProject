from enum import Enum
from ..models import ServiceError


def check(isValidate: bool, err: ServiceError):
    # validate --> what need to be correct
    if not isValidate:
        raise err


class BodyErrorStat(Enum):
    ERR_BAD_BODY_PARAMS = ServiceError(
        status=400, code=10001, message='参数缺失或错误')


class UserErrorStat(Enum):
    ERR_USER_NOT_FOUND = ServiceError(
        status=404, code=20001, message='用户未找到')
    ERR_PWD_NOT_CORRECT = ServiceError(
        status=400, code=20002, message='密码不正确')
    ERR_EMAIL_ALREADY_EXISTS = ServiceError(
        status=400, code=20003, message='邮箱已存在')
    ERR_USER_ALREADY_EXISTS = ServiceError(
        status=400, code=20004, message='用户已存在')
    ERR_USER_NOT_LOGIN = ServiceError(
        status=401, code=20005, message='用户未登录')
    ERR_USER_HAS_BEEN_BANNED = ServiceError(
        status=403, code=20006, message='用户已被禁止')


class PostErrorStat(Enum):
    ERR_POST_NOT_FOUND = ServiceError(
        status=404, code=30001, message='帖子未找到')
    ERR_POST_HAS_BEEN_DELETED = ServiceError(
        status=404, code=30002, message='帖子已删除')
    ERR_POST_HAS_BEEN_LIKED = ServiceError(
        status=400, code=30003, message='该帖子已点赞')


class NotifyErrorStat(Enum):
    ERR_NOTIFY_NOT_FOUND = ServiceError(
        status=404, code=40001, message='通知未找到')


class MessageErrorStat(Enum):
    ERR_FRIEND_NOT_FOUND = ServiceError(
        status=404, code=50001, message='该对象不存在')


class FollowErrorStat(Enum):
    ERR_ALREADY_FOLLOW = ServiceError(
        status=400, code=60001, message='已在关注列表')
