import RouterView from './router'
import { BrowserRouter } from 'react-router-dom'
import {
  StoreProvider,
  NewPostProvider,
  DirectMsgProvider
} from '@/hooks/store'
import { useState } from 'react'
import { IUserInfoResp } from './interfaces/response/user'
import { EUserStatus } from './enums/model'

function App() {
  const [newPost, setNewPost] = useState('')
  const [inChatFriendId, setInChatFriendId] = useState('')
  const [user, setUser] = useState<IUserInfoResp>({
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
  })
  return (
    <StoreProvider value={{ user, setUser }}>
      <NewPostProvider value={{ newPost, setNewPost }}>
        <DirectMsgProvider value={{ inChatFriendId, setInChatFriendId }}>
          <BrowserRouter>
            <RouterView />
          </BrowserRouter>
        </DirectMsgProvider>
      </NewPostProvider>
    </StoreProvider>
  )
}

export default App
