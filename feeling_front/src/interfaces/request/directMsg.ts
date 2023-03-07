import { EMsgType } from '@/enums/model'
import { IPagination } from './post'

export type IGetChatItem = IPagination

export interface ICreateDirectMsg {
  friendId: string
  msgType: EMsgType
  content: string
}

export interface IDeleteChatItem {
  id: string // friend_id
}

export interface IGetDirectMsg extends IPagination {
  id: string // friend_id
}

export interface IDeleteDirectMsg {
  MsgId: string // msg objectId
}

export interface ISetMsgToRead{
  id: string // friend_id
}
export interface IGetUnreadDirectMsg {
  id: string // friend_id
}
export interface IGetUnreadCount{
  id:string // 如果正在和朋友聊天 则排除他
}

