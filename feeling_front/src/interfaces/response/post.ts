import { IPost } from '@/interfaces/model'

export interface IPostItem extends IPost {
  _id: string
  user: {
    avatar: string
    userId: string
    nickname: string
  }
  relate?: {
    post: IPostItem[]
    user: [
      {
        userId: string
        avatar: string
        nickname: string
      }
    ]
  }
}

export interface IPostItemResp {
  items: IPostItem[]
  hasNext: boolean
}

export type ICommentResp = IPostItemResp
