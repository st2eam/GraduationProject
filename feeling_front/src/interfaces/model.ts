import {
  EMsgStatus,
  EMsgType,
  ENotifyType,
  EPostType,
  EUserStatus
} from '../enums/model'

export interface ISession {
  userId: string // unique account @xxx
  sid: string // uuid
  ip: string
  createdAt: Date
}

export interface IUser {
  userId: string // unique account @xxx
  username: string
  email: string
  avatar: string
  banner: string
  bio: string // 个人背景介绍
  createdAt: number
  status: EUserStatus
}

export interface ILikes {
  postId: string
  userId: string
  createdAt: number
}

export interface IFollow {
  userId: string
  followId: string
  createdAt: number
}

export interface IConversation {
  userId: string
  friendId: string
}

export interface IDirectMsg {
  userId: string // 虚假发送者（单向删除）
  friendId: string // 虚假接收者（单向删除）
  senderId: string // 真实发送者
  receiverId: string // 真实接收者
  msgType: EMsgType
  content: string
  sendTime: number
  status: EMsgStatus
}

export interface IPost {
  _id: string
  userId: string
  relationId: string // 如果是评论则为评论id，如果是转发则为转发id
  type: EPostType
  imgs: string[]
  content: string
  likes: number
  comments: number
  forwards: number
  createdAt: number
  isLike: boolean
}

export interface INotify {
  type: ENotifyType
  senderId: string
  receiverId: string
  relationId: string //  如果没有relationId 回复会多一层判断
  //  content内容：回复存senderId 发的新的贴子_id
  content: string
  sendTime: number
  status: EMsgStatus
}
