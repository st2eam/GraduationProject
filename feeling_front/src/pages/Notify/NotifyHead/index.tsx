import { Avatar, Dialog, Popover } from 'antd-mobile'
import styles from './style.module.scss'
import { ReactComponent as SetAllReadIcon } from '@/assets/icons/setAllRead.svg'
import { DeleteOutline, MoreOutline } from 'antd-mobile-icons'
import { Action } from 'antd-mobile/es/components/popover'
import { EPageName } from '@/enums/page'
interface Props {
  avatar: string
  title: string
  setAllRead: () => void
  serAllDelete?: () => void
  showHomeSideMenu: () => void
}
export default function NotifyHead({
  avatar,
  title,
  showHomeSideMenu,
  setAllRead,
  serAllDelete
}: Props) {
  const actions: Action[] = [
    {
      key: 'scan',
      icon: <SetAllReadIcon />,
      text: '全部已读',
      onClick: async () => {
        Dialog.confirm({
          content: '是否全部设为已读?',
          onConfirm: () => {
            setAllRead()
          }
        })
      }
    },
    {
      key: 'delete',
      icon: <DeleteOutline />,
      text: '全部删除',
      onClick: async () => {
        Dialog.confirm({
          content: '是否清空所有通知',
          onConfirm: () => {
            serAllDelete && serAllDelete()
          }
        })
      }
    }
  ]
  return (
    <div className={styles.notifyHead}>
      <Avatar
        src={avatar}
        className={styles.avatar}
        onClick={() => showHomeSideMenu()}
      />
      <h4>{title}</h4>
      <Popover.Menu
        actions={
          title === EPageName.NOTIFY
            ? actions
            : actions.filter((item) => item.key !== 'delete')
        }
        placement="bottom-start"
        trigger="click"
      >
        <MoreOutline
          className={styles.more}
          onClick={(event) => event.stopPropagation()}
        />
      </Popover.Menu>
    </div>
  )
}
