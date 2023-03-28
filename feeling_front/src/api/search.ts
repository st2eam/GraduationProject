import { ISearchUserResp } from './../interfaces/response/search'
import { ISearch } from '@/interfaces/request/search'
import { IResp } from '@/interfaces/response'
import { IPostItemResp } from '@/interfaces/response/post'
import * as request from '@/utils/axios'
import { getStringifyObj } from '@/utils/qs'

export async function searchPost({ keyword, next = '', limit = 10 }: ISearch) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    '/search/post?' + getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}

export async function searchImgPost({
  keyword,
  next = '',
  limit = 10
}: ISearch) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    '/search/img?' + getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}

export async function searchUser({ keyword, next = '', limit = 10 }: ISearch) {
  const res = await request.httpGet<IResp<ISearchUserResp>>(
    '/search/user?' + getStringifyObj({ keyword, next, limit: String(limit) })
  )
  return res
}
