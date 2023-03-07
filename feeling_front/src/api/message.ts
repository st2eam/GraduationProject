import { EDirectMsgApi } from '@/enums/api'
import {
  ICreateDirectMsg,
  IDeleteChatItem,
  IDeleteDirectMsg,
  IGetChatItem,
  IGetDirectMsg,
  IGetUnreadCount,
  IGetUnreadDirectMsg,
  ISetMsgToRead
} from '@/interfaces/request/directMsg'
import { IResp } from '@/interfaces/response'
import {
  IResChatItem,
  IResDirectMsg,
  IResNewDirectMsg,
  IResUnreadCount
} from '@/interfaces/response/message'
import * as request from '@/utils/http/axios'
/**
 * @description 获取与其他人的私信列表
 * @param params 
 * @returns 
 */
export async function getChatList(params: IGetChatItem) {
  return request.httpGet<IResp<IResChatItem>>(
    EDirectMsgApi.Prefix +
      EDirectMsgApi.GetChatItem +
      '?' +
      (params.limit ? `limit=${params.limit}` : '') +
      (params.next ? `&next=${params.next}` : '') +
      (params.prev ? `&prev=${params.prev}` : '')
  )
}
/**
 * @description 获取和某个人的私信详情
 * @param params 
 * @returns 
 */
export async function getDirectMsg(params: IGetDirectMsg) {
  return request.httpGet<IResp<IResDirectMsg>>(
    EDirectMsgApi.Prefix +
      EDirectMsgApi.GetDirectMsg +
      '?' +
      `id=${params.id}` +
      (params.limit ? `&limit=${params.limit}` : '') +
      (params.next ? `&next=${params.next}` : '') +
      (params.prev ? `&prev=${params.prev}` : '')
  )
}
/**
 * @description 获取和某个用户的新私信，在和某个用户的私信页面，轮询调用这个接口获取最新消息
 * @param params 
 * @returns 
 */
export async function getNewMsgWithOneFriend(params: IGetUnreadDirectMsg) {
  return request.httpGet<IResp<IResNewDirectMsg>>(
    EDirectMsgApi.Prefix +
      EDirectMsgApi.getNewUnReadMsgWithOneFriend +
      '?' +
      `id=${params.id}`
  )
}
/**
 * @description 创建一条新私信
 * @param params 
 * @returns 
 */
export async function createDirectMsg(params: ICreateDirectMsg) {
  return request.httpPost<IResp<string>>(
    EDirectMsgApi.Prefix + EDirectMsgApi.CreateDirectMsg,
    params
  )
}
/**
 * 单向删除一条私信
 * @param params 
 * @returns 
 */
export async function deleteDirectMsg(params: IDeleteDirectMsg) {
  return request.httpPost<IResp>(
    EDirectMsgApi.Prefix + EDirectMsgApi.DeleteDirectMsg,
    params
  )
}
/**
 * @description 在私信列表删除和某个用户的会话
 * @param params 
 * @returns 
 */

export async function deleteChatItem(params: IDeleteChatItem) {
  return request.httpPost<IResp>(
    EDirectMsgApi.Prefix + EDirectMsgApi.DeleteChatItem,
    params
  )
}
/**
 * @description 在私信列表将和某人的私信全部设为已读
 * @param params 
 * @returns 
 */

export async function setMsgToRead(params: ISetMsgToRead) {
  return request.httpPost<IResp>(
    EDirectMsgApi.Prefix + EDirectMsgApi.SetMsgToRead,
    params
  )
}
/**
 * @description 获取该用户的所有未读私信条数
 * @param params 
 * @returns 
 */
export async function getUnreadCount(params: IGetUnreadCount) {
  return request.httpGet<IResp<IResUnreadCount>>(
    EDirectMsgApi.Prefix +
      EDirectMsgApi.GetUnreadCount +
      '?' +
      `id=${params.id}`
  )
}
/**
 * 将当前用户的所有私信设为已读
 * @returns 
 */
export async function setAllItemToRead() {
  return request.httpPost<IResp>(
    EDirectMsgApi.Prefix + EDirectMsgApi.SetAllMsgToRead
  )
}
