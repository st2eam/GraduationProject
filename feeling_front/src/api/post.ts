import * as request from '@/utils/http/axios'
import { IResp } from '@/interfaces/response'
import { EPostApi } from '@/enums/api'
import {
  ICommentResp,
  IPostItem,
  IPostItemResp
} from '@/interfaces/response/post'
import { ICreate, IGetComment, IPagination } from '@/interfaces/request/post'
import { getStringifyObj } from '@/utils/qs'

/**
 * @description 获取首页列表
 * @param { next = '', limit = 10 }: IPagination
 * @returns IResp<IPostItemResp[]>
 */
export async function getHomePosts({ next = '', limit = 10 }: IPagination) {
  const res = await request.httpGet<IResp<IPostItemResp>>(
    EPostApi.Prefix +
      EPostApi.GetRecommend +
      '?' +
      getStringifyObj({ next, limit: String(limit) })
  )
  return res
}

/**
 * @description 获取文章详情
 * @param _id
 * @returns IResp<IPostDetailResp>
 */
export async function getPostDetail({ _id }: { _id: string }) {
  const res = await request.httpGet<IResp<IPostItem>>(
    EPostApi.Prefix + EPostApi.GetDetail + '?' + getStringifyObj({ _id })
  )
  return res
}

/**
 * @description 获取文章评论
 * @param _id
 * @returns IResp<IPostDetailResp>
 */
export async function getComments({
  _id = '',
  next = '',
  limit = 10
}: IGetComment) {
  const res = await request.httpGet<IResp<ICommentResp>>(
    EPostApi.Prefix +
      EPostApi.GetComments +
      '?' +
      getStringifyObj({ _id, next, limit: String(limit) })
  )
  return res
}

/**
 * @description 创建文章
 * @param content
 * @param imgs
 * @returns IResp
 */
export async function createPost({ content, imgs }: ICreate) {
  const res = await request.httpPost<IResp>(
    EPostApi.Prefix + EPostApi.CreatePost,
    { content, imgs }
  )
  return res
}

/**
 * @description 创建评论
 * @param relationId
 * @param content
 * @param imgs
 * @returns IResp
 */
export async function createComment({ relationId, content, imgs }: ICreate) {
  const res = await request.httpPost<IResp>(
    EPostApi.Prefix + EPostApi.CreateComment,
    { relationId, content, imgs }
  )
  return res
}

/**
 * @description 创建转发
 * @param relationId
 * @param content
 * @param imgs
 * @returns IResp
 */
export async function createForward({ relationId, content, imgs }: ICreate) {
  const res = await request.httpPost<IResp>(
    EPostApi.Prefix + EPostApi.CreateForward,
    { relationId, content, imgs }
  )
  return res
}

/**
 * @description 删除帖子
 * @param _id
 * @returns IResp
 */
export async function deletePost({ _id }: { _id: string }) {
  const res = await request.httpPost<IResp>(EPostApi.Prefix + EPostApi.Delete, {
    id: _id
  })
  return res
}

/**
 * @description 点赞
 * @param _id
 * @returns IResp
 */
export async function likePost({ _id }: { _id: string }) {
  const res = await request.httpPost<IResp>(EPostApi.Prefix + EPostApi.Like, {
    id: _id
  })
  return res
}

/**
 * @description 取消点赞
 * @param _id
 * @returns IResp
 */
export async function unLikePost({ _id }: { _id: string }) {
  const res = await request.httpPost<IResp>(EPostApi.Prefix + EPostApi.Unlike, {
    id: _id
  })
  return res
}
