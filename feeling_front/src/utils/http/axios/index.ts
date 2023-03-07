import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios'
import { Toast } from 'antd-mobile'
import { EPagePath } from '@/enums/page'
import {
  EPostErrorCode,
  EServiceRespCode,
  EUserErrorCode
} from '@/enums/status'
import { throttle } from 'lodash-es'

const showNetWorkErrorToast = throttle(
  () => Toast.show('服务器开小差了~'),
  6000,
  { leading: true }
)

const config: AxiosRequestConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: (status: number) => {
    return status >= 200 && status < 500
  }
}

const defHttp = axios.create(config)

defHttp.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (err: any) => {
    Toast.show({
      content: '网络不稳定',
      icon: 'fail'
    })
    Toast.clear()
    return Promise.reject(err)
  }
)

// 设置回应拦截
defHttp.interceptors.response.use(
  (response: { data: { code: number; msg: any } }) => {
    if (response.data.code !== EServiceRespCode.OK) {
      // 未拿到且code为20004（未登录）则定向到login
      if (
        response.data.code === EUserErrorCode.ERR_USER_NOT_LOGIN &&
        !window.location.href.includes(EPagePath.LOGIN)
      ) {
        window.location.replace(EPagePath.LOGIN)
      }
      if (response.data.code === EPostErrorCode.ERR_POST_NOT_FOUND) {
        window.location.replace(EPagePath.NOT_FOUND)
      }
      if (response.data.msg) {
        Toast.show({
          content: response.data.msg,
          icon: 'fail',
          duration: 800
        })
      }
    }
    return response
  },
  (err: AxiosError) => {
    showNetWorkErrorToast()
    return Promise.reject(err)
  }
)

async function http<T>(
  url: string,
  method: string,
  data?: unknown,
  headers?: AxiosRequestHeaders
) {
  const res = await defHttp({ url, method, data, headers })
  const responseData: T = res.data
  return responseData
}

export function httpPost<T>(url: string, data?: unknown) {
  return http<T>(url, 'POST', data)
}

export function httpGet<T>(url: string) {
  return http<T>(url, 'GET')
}

export function httpPut<T>(
  url: string,
  data?: unknown,
  headers?: AxiosRequestHeaders
) {
  return http<T>(url, 'PUT', data, headers)
}
