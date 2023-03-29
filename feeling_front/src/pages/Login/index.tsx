import { useAuth } from '@/hooks/useAuth'
import { ILogin } from '@/interfaces/request/auth'
import { Button, Form, Input } from 'antd-mobile'
import styles from './style.module.scss'
import { checkUserId } from '@/utils/validate/checkUserId'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'
function Login() {
  const [form] = Form.useForm<ILogin>()
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
    <div className={styles.contentFull}>
      <Form
        form={form}
        mode="card"
        className={styles.form}
        layout="horizontal"
        requiredMarkStyle="none"
        footer={
          <div className={styles.btnContainer}>
            <Button
              block
              onClick={() => {
                navigator(EPagePath.REGISTER)
              }}
            >
              <div className={styles.registerText}>没有帐号</div>
            </Button>
            <Button
              className={styles.loginBtn}
              color="primary"
              block
              onClick={confirmLogin}
            >
              <div className={styles.loginText}>登录</div>
            </Button>
          </div>
        }
      >
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
      </Form>
    </div>
  )
}
export default Login
