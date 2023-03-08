import { IRegister, ILogin, IEmail } from '@/interfaces/request/auth'
import { IResp } from '@/interfaces/response'
import { ILoginResp, IRegisterResp } from '@/interfaces/response/user'
import * as request from '@/utils/http/axios'

// 登录
export async function login(body: ILogin) {
  return request.httpPost<IResp<ILoginResp>>('/auth/login', body)
}

// 注册
export async function register(body: IRegister) {
  return request.httpPost<IResp<IRegisterResp>>('/auth/register', body)
}

// 退出登录
export async function logout() {
  return request.httpGet<IResp<ILoginResp>>('/auth/logout')
}

export async function security_code(body: IEmail) {
  return request.httpPost<IResp<string>>('/auth/email', body)
}
