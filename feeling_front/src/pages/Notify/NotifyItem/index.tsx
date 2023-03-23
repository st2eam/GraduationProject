import { EMsgStatus, ENotifyType } from '@/enums/model'
import { EPagePath } from '@/enums/page'
import { INotifyItem } from '@/interfaces/response/notify'
import { getFormatDateByMillionSeconds } from '@/utils/dayjs'
import { Avatar, Badge, Dialog, SwipeAction } from 'antd-mobile'
import { Action } from 'antd-mobile/es/components/swipe-action'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'
interface Props {
  notify: INotifyItem
  deleteOneNotify: () => void
  changeToRead: () => void
}
export default function NotifyItem({
  notify,
  deleteOneNotify,
  changeToRead
}: Props) {
  const rightActions: Action[] = [
    {
      key: 'mute',
      text: notify.status === EMsgStatus.Unread ? '设为已读' : '设为未读',
      color: 'warning',
      onClick: () => {
        changeToRead()
      }
    },
    {
      key: 'delete',
      text: '删除',
      color: 'danger',
      onClick: async () => {
        Dialog.confirm({
          content: '是否删除？',
          confirmText: <span className={styles.confirmText}>删除</span>,
          onConfirm: () => {
            deleteOneNotify()
          }
        })
      }
    }
  ]
  const navigate = useNavigate()
  function notifyType(params: ENotifyType) {
    if (params === ENotifyType.Comment) {
      return '回复了你的贴子'
    } else if (params === ENotifyType.Follow) {
      return '关注了你'
    } else {
      return '转发了你的贴子'
    }
  }
  function isRead(params: EMsgStatus) {
    if (params === EMsgStatus.Unread) {
      return <Badge content={Badge.dot} />
    }
  }
  function enterPersonalHome() {
    navigate(EPagePath.PERSONAL_HOME.replace(':userId', notify.senderId))
  }
  function enterWithDiffEvents() {
    if (notify.status === EMsgStatus.Unread) {
      changeToRead()
    }
    if (notify.type === ENotifyType.Follow) {
      navigate(EPagePath.PERSONAL_HOME.replace(':userId', notify.senderId))
    } else {
      navigate(EPagePath.DETAIL.replace(':id', notify.relationId))
    }
  }
  return (
    <SwipeAction key={notify._id} rightActions={rightActions}>
      <div className={styles.outContainer}>
        <Avatar
          src={notify.avatar}
          style={{ '--size': '40px', '--border-radius': '20px' }}
          onClick={() => {
            enterPersonalHome()
          }}
        />
        <div
          className={styles.notifyINfo}
          onClick={() => {
            enterWithDiffEvents()
          }}
        >
          <div className={styles.notifyType}>
            <div className={styles.userId}> {notify.userId}</div>
            <div>{notifyType(notify.type)}</div>
          </div>
          <div>
            {getFormatDateByMillionSeconds(notify.sendTime, 'YYYY/MM/DD HH:mm')}
          </div>
        </div>
        {isRead(notify.status)}
      </div>
    </SwipeAction>
  )
}
