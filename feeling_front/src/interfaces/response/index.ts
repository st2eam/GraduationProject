// error interface
export interface IResp<T = unknown> {
  status: number
  message: string
  code?: number //错误返回
  data?: T //正确返回
}
