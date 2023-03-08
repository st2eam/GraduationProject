import { useAuth } from '@/hooks/useAuth'
import { ILogin } from '@/interfaces/request/auth'
import { Avatar, Button, Form, Input } from 'antd-mobile'
import styles from './style.module.scss'
import { checkUserId } from '@/utils/validate/checkUserId'
function Login() {
  const [form] = Form.useForm<ILogin>()
  const { handleLogin } = useAuth()
  const confirmRegister = async () => {
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
    <div className={styles.loginWrapper}>
      <Form
        form={form}
        mode="card"
        layout="horizontal"
        requiredMarkStyle="none"
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
      <Button className={styles.registerBtn} block onClick={confirmRegister}>
        <div className={styles.registerText}>登录</div>
      </Button>
    </div>
  )
}
export default Login
