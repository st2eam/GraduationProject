import styles from './login-layout.module.scss'
import { ReactComponent as LogoIcon } from '@/assets/icons/logo.svg'
import { Outlet } from 'react-router-dom'
import logoTextUrl from '@/assets/images/logoText.png'
import { Image } from 'antd-mobile'

function LoginLayout() {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.content}>
        <div className={styles.appView}>
          <Image src={logoTextUrl} alt="logo Text" />
          <LogoIcon className={styles.loginIcon} />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
export default LoginLayout
