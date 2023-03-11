import { EUserStatus } from '@/enums/model'
import { IUserInfoResp } from '@/interfaces/response/user'
import { createContext } from 'react'

export interface StoreContext {
  user: IUserInfoResp
  setUser: (
    user: IUserInfoResp | ((user: IUserInfoResp) => IUserInfoResp)
  ) => void
}

const context = createContext<StoreContext>({
  user: {
    _id: '',
    userId: '',
    email: '',
    avatar: '',
    banner: '',
    bio: '',
    createdAt: -1,
    status: EUserStatus.Normal,
    haveFollowed: false,
    followCounts: 0,
    subscribeCounts: 0
  },
  setUser: () => {}
})
const StoreProvider = context.Provider

export { context, StoreProvider }

export interface NewPostContext {
  newPost: string
  setNewPost: (newPost: string | ((newPost: string) => string)) => void
}

const newPostContext = createContext<NewPostContext>({
  newPost: '',
  setNewPost: () => {}
})

const NewPostProvider = newPostContext.Provider

export { newPostContext, NewPostProvider }

export interface DirectMsgWithFriends {
  inChatFriendId: string
  setInChatFriendId: (
    inChatFriendId: string | ((inChatFriendId: string) => string)
  ) => void
}
const directMsgWithFriends = createContext<DirectMsgWithFriends>({
  inChatFriendId: '',
  setInChatFriendId: () => {}
})
const DirectMsgProvider = directMsgWithFriends.Provider
export { directMsgWithFriends, DirectMsgProvider }
