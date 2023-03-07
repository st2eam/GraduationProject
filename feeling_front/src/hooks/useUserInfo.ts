import {
  getUserInfo,
  setUserInfo,
  userFollow,
  userUnfollow
} from '@/api/user'
import {
  IFollowUser,
  IGetUserInfo,
  ISetUserInfo,
  IUnfollowUser
} from '@/interfaces/request/user'
import { check, checkWithData } from '@/utils/checkHttpRes'
import { useCallback, useContext, useState } from 'react'
import { context } from './store'
import { Toast } from 'antd-mobile'
import { IUserInfoResp } from '@/interfaces/response/user'
import { EUserStatus } from '@/enums/model'

export function useUserInfo() {
  const { user, setUser } = useContext(context)
  const [otherUser, setOtherUser] = useState<IUserInfoResp>({
    _id: '',
    openId: '',
    userId: '',
    nickname: '',
    avatar: '',
    banner: '',
    bio: '',
    createdAt: -1,
    status: EUserStatus.Normal,
    hasFollowed: false,
    followCounts: 0,
    subscribeCounts: 0
  })
  const [hasFollowed, setHasFollowed] = useState(false)

  const handleGetUserInfo = useCallback(
    async (params: IGetUserInfo, isOthers = false) => {
      try {
        const res = await getUserInfo(params)
        if (checkWithData(res)) {
          if (isOthers) {
            setOtherUser(res.data!)
          } else {
            setUser(res.data!)
          }
          setHasFollowed(res.data!.hasFollowed)
        }
      } catch (error) {}
    },
    [setUser]
  )

  const handleSetUserInfo = useCallback(async (params: ISetUserInfo) => {
    try {
      const res = await setUserInfo(params)
      if (checkWithData(res)) {
        Toast.show({
          icon: 'success',
          content: '保存成功'
        })
        return res.data
      }
    } catch (error) {}
  }, [])

  const handleFollowUser = useCallback(
    async (params: IFollowUser) => {
      try {
        const res = await userFollow(params)
        if (check(res)) {
          setUser((user) => ({
            ...user,
            followCounts: user.followCounts + 1
          }))
          Toast.show({
            content: '关注成功~'
          })
          return true
        }
      } catch (error) {}
    },
    [setUser]
  )

  const handleUnfollowUser = useCallback(
    async (params: IUnfollowUser) => {
      try {
        const res = await userUnfollow(params)
        if (check(res)) {
          setUser((user) => ({
            ...user,
            followCounts: user.followCounts - 1
          }))
          Toast.show({
            content: '已取消关注'
          })
          return true
        }
      } catch (error) {}
    },
    [setUser]
  )
  return {
    user,
    setUser,
    otherUser,
    setOtherUser,
    hasFollowed,
    setHasFollowed,
    handleGetUserInfo,
    handleSetUserInfo,
    handleFollowUser,
    handleUnfollowUser
  }
}
