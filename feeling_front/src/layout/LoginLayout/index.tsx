import styles from './login-layout.module.scss'
import { Outlet } from 'react-router-dom'

function LoginLayout() {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.content}>
        <div className={styles.appView}></div>
        <Outlet />
      </div>
    </div>
  )
}
export default LoginLayout
