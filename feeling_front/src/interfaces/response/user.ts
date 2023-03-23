import { IFollow, IUser } from '../model'

export interface ILoginResp {
  session?: string
  userId?: string
  avatar?: string
}

export interface IRegisterResp {
  id: string
}

export interface IUserInfoResp extends IUser {
  _id: string
  haveFollowed: boolean
  followCounts: number
  subscribeCounts: number
}

export interface IUserSearchResp {
  items: IUserInfoResp[]
  hasNext: boolean
}

export interface IUserFollowItemResp extends IFollow {
  _id: string
  user: IUserInfoResp
  haveFollowed: boolean
}
export interface IUserFollowResp {
  items: IUserFollowItemResp[]
  hasNext: boolean
}

export type IUserSubscribeResp = IUserFollowResp
