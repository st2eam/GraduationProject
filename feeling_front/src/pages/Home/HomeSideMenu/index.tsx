import { EFollowTab, EPageName, EPagePath } from '@/enums/page'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getFriendlyNum } from '@/utils/tools/getFriendlyNum'
import { Avatar, Button, Popup } from 'antd-mobile'
import { ReactNode, useState, MouseEvent } from 'react'
import styles from './style.module.scss'
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg'
import { ReactComponent as PersonalDataIcon } from '@/assets/icons/personal_data.svg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface IHomeSideMenu {
  visible: boolean
  setVisible: (visible: boolean) => void
}

interface IMenu {
  title: string
  path?: string
  icon: ReactNode
  onClick?: (e: MouseEvent) => void
}

function HomeSideMenu({ visible, setVisible }: IHomeSideMenu) {
  const { user } = useUserInfo()
  const navigate = useNavigate()
  const { handleLogout } = useAuth()
  // 路由菜单
  const [menu] = useState<IMenu[]>([
    {
      title: EPageName.PERSONAL_HOME,
      path: EPagePath.PERSONAL_HOME,
      icon: <HomeIcon className={styles.menuIcon} />,
      onClick: () =>
        navigate(EPagePath.PERSONAL_HOME.replace(':userId', user.userId))
    },
    {
      title: EPageName.PERSONAL_DATA,
      path: EPagePath.PERSONAL_DATA,
      icon: <PersonalDataIcon />,
      onClick: () => navigate(EPagePath.PERSONAL_DATA)
    }
  ])
  return (
    <Popup
      visible={visible}
      position="left"
      onMaskClick={() => {
        setVisible(false)
      }}
      bodyClassName={styles.popup}
    >
      {/* 用户基本信息 */}
      <div className={styles.userBaseInfo}>
        <Avatar
          src={user.avatar}
          className={styles.avatar}
          onClick={() =>
            navigate(EPagePath.PERSONAL_HOME.replace(':userId', user.userId))
          }
        />
        <div className={styles.nickname}>{user.nickname}</div>
        <div className={styles.userId}>{user.userId}</div>
      </div>
      {/* 关注信息 */}
      <div className={styles.userFollowInfo}>
        <div
          className={styles.follow}
          onClick={() =>
            navigate(EPagePath.Follow.replace(':userId', user.userId), {
              state: { activeKey: EFollowTab.FOLLOW }
            })
          }
        >
          <span className={styles.num}>
            {getFriendlyNum(user.followCounts)}
          </span>
          正在关注
        </div>
        <div
          className={styles.subscribe}
          onClick={() =>
            navigate(EPagePath.Follow.replace(':userId', user.userId), {
              state: { activeKey: EFollowTab.SUBSCRIBE }
            })
          }
        >
          <span className={styles.num}>
            {getFriendlyNum(user.subscribeCounts)}
          </span>
          关注者
        </div>
      </div>
      {/* 侧边栏菜单 */}
      <ul className={styles.menuWrapper}>
        {menu.map((item) => (
          <li
            className={styles.menuItem}
            key={item.title}
            onClick={item.onClick}
          >
            <span className={styles.iconBox}>{item.icon}</span>
            <span className={styles.title}>{item.title}</span>
          </li>
        ))}
      </ul>
      {/* 退出登录 */}
      <Button
        className={styles.logoutBtn}
        color="danger"
        onClick={handleLogout}
      >
        退出登录
      </Button>
    </Popup>
  )
}
export default HomeSideMenu
