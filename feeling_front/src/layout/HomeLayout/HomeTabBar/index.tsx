import { Badge, TabBar } from 'antd-mobile'
import { ReactComponent as WechatIcon } from '@/assets/icons/home.svg'
import { ReactComponent as SearchIcon } from '@/assets/icons/search.svg'
import { ReactComponent as NotifyIcon } from '@/assets/icons/notify.svg'
import { ReactComponent as MessageIcon } from '@/assets/icons/message.svg'
import { useContext, useEffect, useState } from 'react'
import { newPostContext } from '@/hooks/store'
import { EPageName, EPagePath } from '@/enums/page'
import { useCurrentPage } from '@/hooks/useCurrentPage'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'
import classnames from 'classnames'
import useMessage from '@/hooks/useMessage'
import useNotify from '@/hooks/useNotify'
import { useRequest } from 'ahooks'

function HomeTabBar() {
  const { currPagePath, currPageName } = useCurrentPage()
  const { newPost } = useContext(newPostContext)
  const { hasUnread, isUnread } = useNotify()
  const { getUnreadCount, unReadCount } = useMessage()

  useRequest(
    async () => {
      await getUnreadCount()
      await isUnread()
    },
    {
      pollingInterval: 1500,
      pollingErrorRetryCount: 3
    }
  )

  const tabs = [
    {
      key: EPagePath.HOME,
      title: (active: boolean) => (
        <span
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        >
          {EPageName.HOME}
        </span>
      ),
      icon: (active: boolean) => (
        <WechatIcon
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        />
      ),
      badge: !!newPost ? Badge.dot : null
    },
    {
      key: EPagePath.SEARCH,
      title: (active: boolean) => (
        <span
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        >
          {EPageName.SEARCH}
        </span>
      ),
      icon: (active: boolean) => (
        <SearchIcon
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        />
      )
    },
    {
      key: EPagePath.NOTIFY,
      title: (active: boolean) => (
        <span
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        >
          {EPageName.NOTIFY}
        </span>
      ),
      icon: (active: boolean) => (
        <NotifyIcon
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        />
      ),
      badge: hasUnread ? Badge.dot : undefined
    },
    {
      key: EPagePath.MESSAGE,
      title: (active: boolean) => (
        <span
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        >
          {EPageName.MESSAGE}
        </span>
      ),
      icon: (active: boolean) => (
        <MessageIcon
          className={classnames({
            [styles.tabBarItemActive]: active
          })}
        />
      ),
      badge: unReadCount
    }
  ]

  const [activeKey, setActiveKey] = useState(currPagePath)
  const navigate = useNavigate()
  useEffect(() => {
    if (
      currPageName === EPageName.FOLLOW ||
      currPageName === EPageName.PERSONAL_DATA ||
      currPageName === EPageName.PERSONAL_HOME
    ) {
      setActiveKey(EPagePath.HOME)
    } else if (currPageName === EPageName.MESSAGE_DETAIL) {
      setActiveKey(EPagePath.MESSAGE)
    } else {
      setActiveKey(currPagePath)
    }
  }, [currPageName, currPagePath])

  const handleTabBarChange = (key: string) => {
    setActiveKey(key)
    navigate(key)
  }

  return (
    <TabBar
      className={styles.tabBar}
      activeKey={activeKey}
      onChange={(key) => handleTabBarChange(key)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} badge={item.badge} />
      ))}
    </TabBar>
  )
}
export default HomeTabBar
