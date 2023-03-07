import { EHttpStatusCode, EServiceRespCode } from '@/enums/status'
import { IResp } from '@/interfaces/response'

export function check (res: IResp) {
  if (res.code === EServiceRespCode.OK && res.status === EHttpStatusCode.OK) {
    return true
  } else return false
}

export function checkWithData (res: IResp) {
  if (res.code === EServiceRespCode.OK && res.status === EHttpStatusCode.OK && res.data) {
    return true
  } else return false
}
