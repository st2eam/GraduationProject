import { IPagination } from './post'

export type IGetNotify = IPagination

export interface IUpdateNotifyStatus {
  id: string // objectId
}

export interface IDeleteNotify {
  id: string // objectId
}

export interface IGetHasUnread {
  id: string // objectId
}