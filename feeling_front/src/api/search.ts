import { ISearchUserResp } from './../interfaces/response/search'
import { ESearchApi } from '@/enums/api'
import { ISearch } from '@/interfaces/request/search'
import { IResp } from '@/interfaces/response'
import { IPostItemResp } from '@/interfaces/response/post'
import * as request from '@/utils/http/axios'
import { getStringifyObj } from '@/utils/qs'

export async function searchPost({ keyword, next = '', limit = 10 }: ISearch) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    ESearchApi.Prefix +
      ESearchApi.Post +
      '?' +
      getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}

export async function searchImgPost({
  keyword,
  next = '',
  limit = 10
}: ISearch) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    ESearchApi.Prefix +
      ESearchApi.Img +
      '?' +
      getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}

export async function searchUser({ keyword, next = '', limit = 10 }: ISearch) {
  const res = await request.httpGet<IResp<ISearchUserResp>>(
    ESearchApi.Prefix +
      ESearchApi.User +
      '?' +
      getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}
