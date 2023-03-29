import { IResp } from '@/interfaces/response'

export function check(res: IResp) {
  if (res.message === 'ok' && res.status === 200) {
    return true
  } else return false
}

export function checkWithData(res: IResp) {
  if (res.message === 'ok' && res.status === 200) {
    if (typeof res.data === 'boolean') {
      return true
    } else if (res.data) {
      return true
    }
  }
  return false
}
