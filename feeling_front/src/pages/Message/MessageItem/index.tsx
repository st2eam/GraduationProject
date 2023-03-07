import { EMsgType } from '@/enums/model'
import { EPagePath } from '@/enums/page'
import { IChatItem } from '@/interfaces/response/message'
import { getLastTimeStr } from '@/utils/dayjs'
import { Avatar, Badge, Dialog, SwipeAction } from 'antd-mobile'
import { Action } from 'antd-mobile/es/components/swipe-action'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'
interface Props {
  message: IChatItem
  deleteMsgItem: () => void
  setRead: () => void
}
export default function MessageItem({
  message,
  deleteMsgItem,
  setRead
}: Props) {
  const navigate = useNavigate()
  const rightActions: Action[] = [
    {
      key: 'mute',
      text: '设为已读',
      color: 'warning',
      onClick: async () => {
        setRead()
      }
    },
    {
      key: 'delete',
      text: '删除',
      color: 'danger',
      onClick: async () => {
        Dialog.confirm({
          content: '删除后，将清空该聊天的消息记录',
          confirmText: <span className={styles.confirmText}>删除</span>,
          onConfirm: () => {
            deleteMsgItem()
          }
        })
      }
    }
  ]

  function isRead(params: number) {
    if (params === 0) {
      return <Badge />
    } else {
      return <Badge content={params} />
    }
  }
  function lastMsgINfo(params: EMsgType) {
    if (params === EMsgType.Common) {
      return message.lastMsg
    } else {
      return '[图片]'
    }
  }
  function openMsgDetail() {
    navigate(
      EPagePath.MESSAGE_DETAIL.replace(
        ':FriendId',
        message.userId || ''
      ).replace(':FriendName', message.nickname || '')
    )
  }
  return (
    <SwipeAction key={message.userId} rightActions={rightActions}>
      <div className={styles.outContainer} onClick={() => openMsgDetail()}>
        <div className={styles.avator}>
          <Avatar
            src={message.avatar}
            style={{ '--size': '50px', '--border-radius': '25px' }}
          />
        </div>

        <div className={styles.messageRight}>
          <div className={styles.messageTop}>
            <div className={styles.nickname}> {message.nickname}</div>
            <div>{getLastTimeStr(message.lastSendTime)}</div>
          </div>
          <div className={styles.messageInfo}>
            <div className={styles.nowrap}>
              {lastMsgINfo(message.lastMsgType)}
            </div>
            <div className={styles.unreadCount}>
              {isRead(message.unReadCount)}
            </div>
          </div>
        </div>
      </div>
    </SwipeAction>
  )
}
