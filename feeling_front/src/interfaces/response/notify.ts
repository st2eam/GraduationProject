import { EMsgStatus, ENotifyType } from "@/enums/model"

export interface INotifyItem{
    _id:string
    nickname:string
    avatar:string
    type:ENotifyType
    status:EMsgStatus
    sendTime: number
    relationId: string
    receiverId?:string
    content?:string
    senderId:string
}

export interface IResINotifyItem{
    NotifyList:INotifyItem[]
    hasNext:boolean
    hasPrev:boolean
}

export interface IUnReadNotify{
    unReadCount:number
}
