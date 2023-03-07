import { useUserInfo } from '@/hooks/useUserInfo'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './style.module.scss'
import HomeTabBar from './HomeTabBar'
import FloatBubble from '@/layout/HomeLayout/FloatBubble'

function HomeLayout() {
  const { handleGetUserInfo, setUser } = useUserInfo()
  // 检测是否登录
  useEffect(() => {
    handleGetUserInfo({})
  }, [handleGetUserInfo, setUser])

  return (
    <div className={styles.homeWrapper}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <FloatBubble />
        <HomeTabBar />
      </footer>
    </div>
  )
}
export default HomeLayout
