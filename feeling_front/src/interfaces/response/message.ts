import { EMsgStatus, EMsgType, EWhoSendMsg } from '@/enums/model'

export interface IChatItem {
  userId: string //朋友id
  nickname: string
  avatar: string
  lastSendTime: number
  lastMsg: string
  lastMsgType: EMsgType
  unReadCount: number
  status: EMsgStatus
  lastMsgId:string
}

export interface IResChatItem {
  chatItem: IChatItem[]
  hasNext: boolean
  hasPrev: boolean
}

export interface IDirectMsgItem {
  _id: string
  msgType: EMsgType
  content: string
  sendTime: number
  status: EMsgStatus
  whoSendMsg: EWhoSendMsg
}

export interface IResDirectMsg {
  msgList: IDirectMsgItem[]
  hasNext: boolean
  hasPrev: boolean
  unReadCount:number
}

export interface IResUnreadCount{
  unReadCount:number
}
export interface IResNewDirectMsg{
  unReadMsg:IDirectMsgItem[]
}
