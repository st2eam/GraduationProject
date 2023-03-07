import styles from './style.module.scss'
import { ReactComponent as WechatIcon } from '@/assets/icons/wechat.svg'
import { Button } from 'antd-mobile'
import { wxAuth } from '@/api/auth'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'react-router-dom'

function Login() {
  const { handleLogin } = useAuth()
  const [searchParams] = useSearchParams()
  // 检测当前地址是否是微信回调地址
  useEffect(() => {
    if (searchParams.get('code')) {
      const code = searchParams.get('code')
      handleLogin({ code: code ?? '' })
    }
  }, [handleLogin, searchParams])
  const goToWxAuth = async () => {
    window.location.href = (await wxAuth()).data?.url || window.location.href
  }
  return (
    <Button className={styles.loginBtn} block onClick={goToWxAuth}>
      <div className={styles.loginBtnContent}>
        <WechatIcon className={styles.wechatIcon} />
        <span>微信授权登录</span>
      </div>
    </Button>
  )
}
export default Login
