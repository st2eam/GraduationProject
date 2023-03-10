from flask import json
from enum import Enum, auto
from bson import ObjectId


class JsonResp:

    status: int
    message: str

    def __init__(self, status=200, message='ok'):
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

    def __init__(self, data: any, status=200, message='ok'):
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


class ELogType(Enum):
    Post = auto()
    Comment = auto()
    Forward = auto()
    DeletePost = auto()
    DeleteComment = auto()
    DeleteForward = auto()
    Like = auto()
    Unlike = auto()
    Follow = auto()
    Unfollow = auto()
    Search = auto()


class ESexType(Enum):
    Male = auto()
    Female = auto()


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


class ENoticeType(Enum):
    Follow = auto()
    Comment = auto()
    Forward = auto()


class IPagination:
    def __init__(self,
                 limit: int,
                 prev=None,
                 next=None):
        self.prev = prev
        self.next = next
        self.limit = limit


class ISearch(IPagination):
    def __init__(self,
                 keyword: str,
                 limit: int,
                 prev=None,
                 next=None):
        super().__init__(prev=prev, next=next, limit=limit)
        self.keyword = keyword


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
                 password: str,
                 email: str,
                 sex: ESexType,
                 avatar: str,
                 banner: str,
                 bio: str,  # ??????????????????
                 createdAt: float,
                 status: EUserStatus):
        self.userId = userId
        self.password = password
        self.sex = sex
        self.email = email
        self.avatar = avatar
        self.banner = banner
        self.bio = bio
        self.createdAt = createdAt
        self.status = status


class ILikes:
    def __init__(self,
                 postId: ObjectId,
                 userId: str,
                 createdAt: float):
        self.postId = postId
        self.userId = userId
        self.createdAt = createdAt


class IFollow:
    def __init__(self,
                 userId: str,
                 followId: str,
                 createdAt: float):
        self.userId = userId
        self.followId = followId
        self.createdAt = createdAt


class IConversation:
    userId: str
    friendId: str


class IPost:
    def __init__(self,
                 userId: str,
                 relationId: ObjectId,  # ???????????????????????????id??????????????????????????????id
                 type: EPostType,
                 imgs: list[str],
                 content: str,
                 classify: str,
                 label: dict,
                 likes: int,
                 comments: int,
                 forwards: int,
                 createdAt: float):
        self.userId = userId
        self.relationId = relationId
        self.type = type
        self.imgs = imgs
        self.content = content
        self.classify = classify
        self.label = label
        self.likes = likes
        self.comments = comments
        self.forwards = forwards
        self.createdAt = createdAt


class IDirectMsg:
    userId: str  # ?????????????????????????????????
    friendId: str  # ?????????????????????????????????
    senderId: str  # ???????????????
    receiverId: str  # ???????????????
    msgType: EMsgType
    content: str
    sendTime: int
    status: EMsgStatus


class INotice:
    def __init__(self,
                 type: ENoticeType,
                 senderId: str,
                 receiverId: str,
                 relationId: ObjectId,  # ????????????relationId ????????????????????????
                 content: str,  # content??????????????????senderId ??????????????????_id
                 createdAt: float,
                 status: EMsgStatus):
        self.type = type
        self.senderId = senderId
        self.receiverId = receiverId
        self.relationId = relationId
        self.content = content
        self.createdAt = createdAt
        self.status = status
