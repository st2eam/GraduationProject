import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime) // 相对时间
dayjs.locale('zh-cn')

export function getFormatDateByMillionSeconds(
  millionSeconds: number,
  format = 'YYYY-MM-DD'
) {
  return dayjs(millionSeconds).format(format)
}

export function getLastTimeStr(time: number) {
  let friendly = dayjs().diff(time, 'week') < 2 ? true : false
  if (friendly) {
    return dayjs(time).fromNow().replace(' ', '')
  }
  return dayjs(new Date(time)).format('YYYY-MM-DD HH:mm')
}
/**
 * //根据是否是今年 今天 返回不同格式的时间
 * @param time
 * @returns
 */
export function getMsgFormateDate(time: number) {
  let date = new Date() // 以下获取今年第一天0点时间戳
  date.setMonth(0) //0代表1月
  date.setDate(1) //1 代表本月第一天
  date.setHours(0)
  date.setSeconds(0)
  date.setMinutes(0)
  const startTime = new Date(new Date().toLocaleDateString()).getTime() //获取今天0点时间戳
  //距离今年第一天0点毫秒数 大于0表示今年
  let isThisYear = dayjs(dayjs(time).format('YYYYMMDD')).diff(
    dayjs(dayjs(date).format('YYYYMMDD'))
  )
  //距离今天0点毫秒数 大于0表示今天的消息
  let isToday = dayjs(dayjs(time).format('YYYYMMDD')).diff(
    dayjs(dayjs(startTime).format('YYYYMMDD'))
  )
  if (isThisYear < 0) {
    return dayjs(new Date(time)).format('YYYY-MM-DD HH:mm')
  } else {
    if (isToday < 0) {
      return dayjs(new Date(time)).format('MM-DD HH:mm')
    } else {
      return dayjs(new Date(time)).format('HH:mm')
    }
  }
}
