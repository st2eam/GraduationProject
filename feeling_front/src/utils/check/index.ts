import { IResp } from '@/interfaces/response'

export function check(res: IResp) {
  if (res.message === 'ok' && res.status === 200) {
    return true
  } else return false
}

export function checkWithData(res: IResp) {
  if (res.message === 'ok' && res.status === 200 && res.data) {
    return true
  } else return false
}
