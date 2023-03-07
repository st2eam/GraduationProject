import { IPostItemResp } from "./post"
import { IUserInfoResp } from "./user"

export interface ISearchPostResp {
  items: IPostItemResp[]
  hasNext: boolean
}

export type ISearchImgPostResp  = ISearchPostResp

export interface ISearchUserResp {
  items: IUserInfoResp[]
  hasNext: boolean
}