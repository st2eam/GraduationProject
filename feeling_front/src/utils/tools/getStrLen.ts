// 得到中英文混合字符串长度

const zh_Cn = {
  test: /[\u4e00-\u9fa5]/g,
  repeat: 2
}
const regexArr = [zh_Cn]

export function getStrLen(str: string): number {
  let _str = str
  regexArr.forEach((regex) => {
    _str = str.replaceAll(regex.test, 'a'.repeat(regex.repeat))
  })
  return _str.length
}
