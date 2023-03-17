import { getStrLen } from '@/utils/tools/getStrLen'
import { Toast } from 'antd-mobile'

export function userIdRule(userId: string, showToast = true): boolean {
  const userIdRegex = /[a-zA-Z0-9_ \u4e00-\u9fa5]*/g
  const userIdLen = getStrLen(userId)
  // 检查长度
  if (userIdLen === 0) {
    showToast &&
      Toast.show({
        content: '请输入名称',
        position: 'top'
      })
    return false
  }
  if (userIdLen < 2 || userIdLen > 16) {
    showToast &&
      Toast.show({
        content: '名称长度不符规范，请输入2到16个字符',
        position: 'top'
      })
    return false
  }
  // 非法字符
  if (userIdRegex.test(userId) && userIdRegex.lastIndex === userId.length - 1) {
    showToast &&
      Toast.show({
        content: '名称含有非法字符',
        position: 'top'
      })
    return false
  }

  return true
}

export function checkUserId(_: any, value: string) {
  if (value) {
    const userIdRegex = /[a-zA-Z0-9_ \u4e00-\u9fa5]*/g
    const userIdLen = getStrLen(value)
    // 检查长度
    if (userIdLen === 0) {
      return Promise.reject(new Error('请输入名称'))
    }
    // if (userIdLen < 2 || userIdLen > 17) {
    //   return Promise.reject(new Error('名称长度不符规范，请输入2到16个字符'))
    // }
    // 非法字符
    if (userIdRegex.test(value) && userIdRegex.lastIndex === value.length - 1) {
      return Promise.reject(new Error('名称含有非法字符!'))
    }
    return Promise.resolve()
  }
  return Promise.reject(new Error('用户名不能为空'))
}
