import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime) // 相对时间
dayjs.locale('zh-cn')
// 需要安装cnpm i dayjs --save
/*
 * @param time 时间字符串
 * @param friendly 显示xxx时间前 (显示为几分钟前 几小时前 几天前 几个月前 )
 */
export function getLastTimeStr(time: number) {
  let friendly = dayjs().diff(time, 'week') < 2 ? true : false
  if (friendly) {
    return dayjs(time).fromNow().replace(' ', '')
  }
  return dayjs(new Date(time)).format('YYYY-MM-DD HH:mm')
}

export function formateTime(time: number) {
  return dayjs(new Date(time)).format('YYYY/MM/DD HH:mm')
}
