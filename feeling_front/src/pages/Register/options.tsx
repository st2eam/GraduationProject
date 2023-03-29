import { Avatar } from 'antd-mobile'
const avatar_array = [
  '',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar2.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar3.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar4.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar5.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar6.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar7.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar8.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar9.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar10.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar11.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar12.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar13.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar14.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar15.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar16.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar17.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar18.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar19.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar20.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar21.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar22.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar23.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar24.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar25.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar26.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar27.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar28.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar29.svg',
  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar30.svg'
]

export const options = avatar_array.map((item) => {
  return {
    label: <Avatar src={item} style={{ '--size': '68px' }} />,
    value: item
  }
})
