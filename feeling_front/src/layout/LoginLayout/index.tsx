import styles from './style.module.scss'
import { Outlet } from 'react-router-dom'

function LoginLayout() {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  )
}
export default LoginLayout
