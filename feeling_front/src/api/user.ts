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
import { EUserApi } from '@/enums/api'
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
    EUserApi.Prefix +
      EUserApi.GetFollows +
      '/' +
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
    EUserApi.Prefix +
      EUserApi.GetSubscribes +
      '/' +
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
    EUserApi.Prefix +
      EUserApi.GetPost +
      '/' +
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
    EUserApi.Prefix +
      EUserApi.GetImgPost +
      '/' +
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
    EUserApi.Prefix +
      EUserApi.GetLikePost +
      '/' +
      id +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}
