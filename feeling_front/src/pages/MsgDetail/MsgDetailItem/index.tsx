import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useClickAway, useLongPress } from 'ahooks'
import { getMsgFormateDate } from '@/utils/dayjs'
import { PopoverRef } from 'antd-mobile/es/components/popover'
import { IDirectMsgItem } from '@/interfaces/response/message'
import { IDeleteDirectMsg } from '@/interfaces/request/directMsg'
import { EMsgType, EWhoSendMsg } from '@/enums/model'
import { ActionSheet, Popover, Image, ImageViewer } from 'antd-mobile'
import { Action } from 'antd-mobile/es/components/action-sheet'
import styles from './style.module.scss'
import classNames from 'classnames'

interface Props {
  message: IDirectMsgItem
  firstUnread: boolean
  unReadPrompt: string
  deleteMsg: (params: IDeleteDirectMsg) => void
  // openImg: (imgUrl: string) => void
}
export default function MsgDetailItem({
  message,
  firstUnread,
  deleteMsg,
  unReadPrompt
}: Props) {
  const popover = useRef<PopoverRef>(null)
  const MessageBox = useRef<HTMLDivElement>(null)
  const actions: Action[] = [
    {
      text: '删除',
      key: 'delete',
      danger: true,
      onClick: async () => {
        deleteMsg({ MsgId: message._id })
      }
    }
  ]

  useLongPress(() => popover.current?.show(), MessageBox)

  useClickAway(
    () => {
      setTimeout(() => {
        popover.current?.hide()
      }, 200)
    },
    MessageBox,
    'touchend'
  )

  const isDeleteMsg = () => {
    // setActionVisible(true);
    popover.current!.hide()
    ActionSheet.show({
      extra: '删除后将不会出现在你的消息列表中',
      cancelText: '取消',
      actions: actions,
      closeOnAction: true
    })
  }
  function msgContent() {
    if (message.msgType === EMsgType.Common) {
      return <p className={styles.content}>{message.content}</p>
    } else
      return (
        <Image
          src={message.content}
          onClick={(e) => {
            e.stopPropagation()
            popover.current!.hide()
            ImageViewer.show({ image: message.content })
          }}
          className={styles.image}
          fit="cover"
          lazy={true}
          alt=""
        />
      )
  }
  function unReadFlag() {
    if (firstUnread) {
      return <div className={styles.textCenter}>{unReadPrompt}</div>
    }
  }
  const { ref } = useInView({
    threshold: 1,
    rootMargin: '-50px 0px -100px 0px',
    onChange: (view) => {
      if (!view && popover.current) {
        popover.current.hide()
      }
    }
  })

  return (
    <div>
      {unReadFlag()}
      <div
        className={
          message.whoSendMsg === EWhoSendMsg.Me
            ? styles.ISend
            : styles.FriendSend
        }
      >
        <Popover
          placement="topRight"
          ref={popover}
          content={
            <div
              className={styles.delete}
              ref={ref}
              onClick={() => {
                isDeleteMsg()
              }}
            >
              删除
            </div>
          }
          trigger="click"
          mode="dark"
        >
          <div
            ref={MessageBox}
            className={classNames(
              styles.MessageBox,
              message.whoSendMsg === EWhoSendMsg.Me
                ? styles.IMsgBox
                : styles.FriendMsgBox,
              {
                [styles.imgMessageBox]: message.msgType === EMsgType.Image
              }
            )}
          >
            {msgContent()}
            <span
              className={classNames(
                styles.sendTime,
                message.whoSendMsg === EWhoSendMsg.Me
                  ? styles.meSendTime
                  : styles.friendSendTime
              )}
            >
              {getMsgFormateDate(message.sendTime)}
            </span>
          </div>
        </Popover>
      </div>
    </div>
  )
}
