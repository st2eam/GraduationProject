from flask import json
from enum import Enum, auto
from bson import ObjectId


class JsonResp:

    status: int
    message: str

    def __init__(self, status: int, message: str):
        self.status = status
        self.message = message


class JsonEncoder(json.JSONEncoder):
    def __init__(self, **kwargs):
        kwargs['ensure_ascii'] = False
        super(JsonEncoder, self).__init__(**kwargs)

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return vars(obj)


class ApiResp(JsonResp):

    data: any

    def __init__(self, data: any, status: int, message: str):
        self.data = data
        self.status = status
        self.message = message


class ServiceError(Exception):

    code: int
    status: int
    message: str

    def __init__(self, message, code=-1, status=200):
        self.code = code
        self.status = status
        self.message = message


class EUserStatus(Enum):
    Normal = auto()
    Disabled = auto()


class EPostType(Enum):
    Post = auto()
    Comment = auto()
    Forward = auto()
    Delete = auto()


class EMsgType(Enum):
    Common = auto()
    Image = auto()


class EMsgStatus(Enum):
    Read = auto()
    Unread = auto()
    Deleted = auto()


class ENotifyType(Enum):
    Follow = auto()
    Comment = auto()
    Forward = auto()


class ISession:
    def __init__(self,
                 userId: str,
                 sid: str,
                 ip: str,
                 createdAt: float):
        self.userId = userId
        self.sid = sid
        self.ip = ip
        self.createdAt = createdAt


class IUser:
    def __init__(self,
                 userId: str,
                 username: str,
                 password: str,
                 email: str,
                 avatar: str,
                 banner: str,
                 bio: str,  # 个人背景介绍
                 createdAt: float,
                 status: EUserStatus):
        self.userId = userId
        self.username = username
        self.password = password
        self.email = email
        self.avatar = avatar
        self.banner = banner
        self.bio = bio
        self.createdAt = createdAt
        self.status = status


class ILikes:
    postId: ObjectId
    userId: str
    createdAt: float


class IFollow:
    userId: str
    followId: str
    createdAt: float


class IConversation:
    userId: str
    friendId: str


class IPost:
    def __init__(self,
                 userId: str,
                 relationId: ObjectId,  # 如果是评论则为评论id，如果是转发则为转发id
                 type: EPostType,
                 imgs: list[str],
                 content: str,
                 likes: int,
                 comments: int,
                 forwards: int,
                 createdAt: float):
        self.userId = userId
        self.relationId = relationId
        self.type = type
        self.imgs = imgs
        self.content = content
        self.likes = likes
        self.comments = comments
        self.forwards = forwards
        self.createdAt = createdAt


class IDirectMsg:
    userId: str  # 虚假发送者（单向删除）
    friendId: str  # 虚假接收者（单向删除）
    senderId: str  # 真实发送者
    receiverId: str  # 真实接收者
    msgType: EMsgType
    content: str
    sendTime: int
    status: EMsgStatus


class INotify:
    type: ENotifyType
    senderId: str
    receiverId: str
    relationId: ObjectId  # 如果没有relationId 回复会多一层判断
    content: str  # content内容：回复存senderId 发的新的贴子_id
    sendTime: int
    status: EMsgStatus
