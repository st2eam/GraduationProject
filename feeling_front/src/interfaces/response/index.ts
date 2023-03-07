// error interface
export interface IError {
  status: number
  code: number
  msg: string
}

// response of json
export interface IJsonResp<T = unknown> extends Omit<IError, 'msg'> {
  data?: T
}

export interface IResp<T = unknown> {
  status: number
  code: number
  msg?: string
  data?: T
}
