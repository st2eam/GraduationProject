import { EAuthApi } from '@/enums/api'
import { IRegister, IWxLogin } from '@/interfaces/request/auth'
import { IResp } from '@/interfaces/response'
import { ILoginResp, IRegisterResp } from '@/interfaces/response/user'
import { IWxAuthResp } from '@/interfaces/response/wx'
import * as request from '@/utils/http/axios'

export async function wxAuth() {
  return request.httpGet<IResp<IWxAuthResp>>(EAuthApi.Prefix + EAuthApi.WxAuth)
}

export async function register(body: IRegister) {
  return request.httpPost<IResp<IRegisterResp>>(
    EAuthApi.Prefix + EAuthApi.Register,
    body
  )
}

export async function loginByWx(body: IWxLogin) {
  return request.httpPost<IResp<ILoginResp>>(
    EAuthApi.Prefix + EAuthApi.WxLogin,
    body
  )
}

export async function logout() {
  return request.httpPost<IResp<ILoginResp>>(EAuthApi.Prefix + EAuthApi.Logout)
}
