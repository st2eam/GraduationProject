import {
  IDeleteNotify,
  IGetNotify,
  IUpdateNotifyStatus
} from '@/interfaces/request/notify'
import { IResp } from '@/interfaces/response'
import { IResINotifyItem } from '@/interfaces/response/notify'
import * as request from '@/utils/axios'
import { getStringifyObj } from '@/utils/qs'
/**
 * @description 获取通知列表
 * @param param0
 * @returns
 */
export async function getNotifyItem({ next = '', limit = 10 }: IGetNotify) {
  const res = await request.httpGet<IResp<IResINotifyItem>>(
    '/notice/get?' + getStringifyObj({ next, limit: String(limit) })
  )
  return res
}
/**
 * @description 切换一条通知的状态
 * @param param0
 * @returns
 */
export async function updataNotifyStatus({ id = '' }: IUpdateNotifyStatus) {
  const res = await request.httpPost<IResp>('/notice/update_status', { id })
  return res
}
/**
 * @description 删除一条通知
 * @param param0
 * @returns
 */
export async function deleteNotify({ id = '' }: IDeleteNotify) {
  const res = await request.httpPost<IResp>('/notice/delete', {
    id
  })
  return res
}
/**
 * @description 获取未读通知条数
 * @returns
 */
export async function getHasUnread() {
  const res = await request.httpGet<IResp<number>>('/notice/unread')
  return res
}
/**
 * @description 将所有通知设为已读
 * @returns
 */
export async function setAllNotifyToRead() {
  return request.httpPost<IResp>('/notice/read_all')
}

/**
 * @description 将所有通知删除
 * @returns
 */
export async function setAllNotifyToDelete() {
  return request.httpPost<IResp>('/notice/delete_all')
}
