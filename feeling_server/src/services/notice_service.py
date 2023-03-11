import time
from bson import ObjectId
from ..utils.bsonify import *
from ..models import EMsgStatus, ENoticeType, INotice, IPagination
from ..services import session_service
from ..database import get_collection


def create_notice(type: ENoticeType, senderId: str, receiverId: str, relationId: str, content: str):
    notice = bsonify(INotice(
        type=type,
        content=content,
        senderId=senderId,
        receiverId=receiverId,
        relationId=ObjectId(relationId),
        createdAt=time.time()*1000,
        status=EMsgStatus.Unread.value
    ))
    res = get_collection('notices').insert_one(notice)
    return res


def get_notice_list(token: str, props: IPagination):
    userId = session_service.getSessionBySid(token)['userId']
    NoticeList = []
    hasNext = False
    hasPrev = False
    if not props.next:
        pass
    return props
