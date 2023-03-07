export interface IPagination {
  prev?: string
  next?: string
  limit?: number
}

export interface IGetUserPosts extends IPagination {
  token: string
}

export type IGetFollowPosts = IGetUserPosts

export interface ICreate {
  content: string
  imgs: string[]
  relationId?: string // post_id ObjectId
}

export interface ICreatePost extends ICreate {
  token: string
}

export interface IGetDetail {
  _id: string // post_id ObjectId
}

export interface IGetComment extends IGetDetail, IPagination {}

export type IDelPost = IGetDetail

export interface IThumbsUp extends IGetDetail {
  token: string
}
