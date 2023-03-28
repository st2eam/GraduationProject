import * as request from '@/utils/http/axios'
import {
  IFollowUser,
  IGetFollows,
  IGetUserInfo,
  ISetUserInfo,
  IUnfollowUser
} from '@/interfaces/request/user'
import { IResp } from '@/interfaces/response'
import {
  IUserFollowResp,
  IUserSubscribeResp,
  IUserInfoResp
} from '@/interfaces/response/user'
import { IPostItemResp } from '@/interfaces/response/post'
import { getStringifyObj } from '@/utils/qs'

export async function getUserInfo({ userId = '' }: IGetUserInfo) {
  const res = await request.httpGet<IResp<IUserInfoResp>>(
    '/user/info?id=' + userId
  )
  return res
}

export async function setUserInfo(body: ISetUserInfo) {
  const res = await request.httpPost<IResp<IUserInfoResp>>(
    '/user/set_info',
    body
  )
  return res
}

export async function userFollow(body: IFollowUser) {
  const res = await request.httpPost<IResp>('/user/follow', body)
  return res
}

export async function userUnfollow(body: IUnfollowUser) {
  const res = await request.httpPost<IResp>('/user/unfollow', body)
  return res
}

export async function getUserFollows({
  id = '',
  next = '',
  limit = 5
}: IGetFollows) {
  const res = await request.httpGet<IResp<IUserFollowResp>>(
    '/user/follower_list/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}

export async function getUserSubscribes({
  id = '',
  next = '',
  limit = 5
}: IGetFollows) {
  const res = await request.httpGet<IResp<IUserSubscribeResp>>(
    '/user/subscriber_list/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}

export async function getUserHomePosts({
  id = '',
  next = '',
  limit = 5
}: IGetFollows) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    '/post/get_user_post/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}

export async function getUserHomeImgPosts({
  id = '',
  next = '',
  limit = 5
}: IGetFollows) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    '/post/get_user_img_post/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}

export async function getUserHomeLikePosts({
  id = '',
  next = '',
  limit = 5
}: IGetFollows) {
  const res = await request.httpGet<IResp<any>>(
    '/post/get_user_like_post/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}
