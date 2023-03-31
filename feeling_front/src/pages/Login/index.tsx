import { useAuth } from '@/hooks/useAuth'
import { ILogin } from '@/interfaces/request/auth'
import { Form, Input, Image } from 'antd-mobile'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { checkUserId } from '@/utils/validate/checkUserId'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'
import styles from './style.module.scss'
import logoTextUrl from '@/assets/images/logoText.png'
import { useState } from 'react'
function Login() {
  const [form] = Form.useForm<ILogin>()
  const [animate, setAnimate] = useState(false)
  const { handleLogin } = useAuth()
  const navigator = useNavigate()
  const confirmLogin = async () => {
    const values = form.getFieldsValue()
    const { username, password } = values
    try {
      // validate info
      await form.validateFields()
      await handleLogin({
        username,
        password
      })
    } catch (error) {}
  }

  return (
    <Form form={form} mode="card" layout="horizontal" requiredMarkStyle="none">
      <div className={styles.login}>
        <div className={styles.form}>
          <div className={styles.logoContainer}>
            <Logo className={styles.logo} />
            <Image src={logoTextUrl} height={120} alt="logo Text" />
          </div>
          <div>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ validator: checkUserId }]}
            >
              <Input
                placeholder="请输入用户名或邮箱"
                className={styles.userIdInput}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true }, { type: 'string', min: 6 }]}
            >
              <Input placeholder="请输入密码" className={styles.emailInput} />
            </Form.Item>
          </div>
          <div className={styles.btnContainer}>
            <button
              className={`${styles.bubbly_button} ${
                animate ? styles.animate : ''
              }`}
              onClick={() => {
                setAnimate(true)
                confirmLogin()
              }}
            >
              登录
            </button>
            <span
              className={styles.register}
              onClick={() => {
                navigator(EPagePath.REGISTER)
              }}
            >
              没有帐号,先去注册
            </span>
          </div>
        </div>
      </div>
    </Form>
  )
}
export default Login
