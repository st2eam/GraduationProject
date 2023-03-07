import { IPagination } from './post'

export interface IGetUserInfo {
  userId?: string
}

export interface ISetUserInfo {
  nickname?: string
  avatar?: string
  banner?: string
  bio?: string
}

export interface IFollowUser {
  id: string // userId
}

export interface IUnfollowUser {
  id: string // userId
}

export interface IGetFollows extends IPagination {
  id?: string // userId 若没有则是查看自己，若有则是查看别人
}

export interface IGetSubscribes extends IPagination {
  id?: string // userId 若没有则是查看自己，若有则是查看别人
}

export interface IGetPost extends IPagination {
  id?: string // userId 若没有则是查看自己，若有则是查看别人
}

export type IGetImgPost = IGetPost
export type IGetLikePost = IGetPost
