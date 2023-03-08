import { useAuth } from '@/hooks/useAuth'
import { Avatar, Button, Radio, Form, Input } from 'antd-mobile'
import styles from './style.module.scss'
import { checkUserId } from '@/utils/validate/checkUserId'
import { IRegister } from '@/interfaces/request/auth'
import { useState } from 'react'

function Register() {
  const [code, setCode] = useState('')
  const { handleRegister, handleLogin, getSecurityCode } = useAuth()
  const [form] = Form.useForm<IRegister>()

  const confirmRegister = async () => {
    const values = form.getFieldsValue()
    const { username, password, email, sex, banner = '', avatar = '' } = values
    try {
      // validate info
      await form.validateFields()
      const registerRes = await handleRegister({
        username,
        password,
        email,
        sex,
        banner,
        avatar
      })

      if (registerRes) {
        await handleLogin({
          username: username,
          password: password
        })
      }
    } catch (error) {}
  }
  const checkCode = (_: any, value: string) => {
    if (value)
      if (value === code) {
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('验证码不正确'))
      }
    return Promise.reject(new Error('验证码不能为空'))
  }
  const handleSendCode = async () => {
    const values = form.getFieldsValue()
    const { email } = values
    const res = await getSecurityCode({ email: email })
    if (res) {
      setCode(res)
    }
  }

  return (
    <div className={styles.registerWrapper}>
      <Avatar src={''} className={styles.avatar} />
      <div className={styles.nickname}>请选择头像</div>
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
          <Input placeholder="请输入用户名" className={styles.userIdInput} />
        </Form.Item>
        <Form.Item name="sex" label="性别" required initialValue={1}>
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true },
            { type: 'string', min: 6 },
            { type: 'email', warningOnly: true }
          ]}
        >
          <Input placeholder="请输入邮箱" className={styles.emailInput} />
        </Form.Item>
        <Form.Item
          name="security_code"
          label="验证码"
          extra={
            <span className={styles.security_code} onClick={handleSendCode}>
              发送验证码
            </span>
          }
          rules={[{ validator: checkCode }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true }, { type: 'string', min: 6 }]}
        >
          <Input placeholder="请输入密码" className={styles.emailInput} />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          rules={[{ required: true }, { type: 'string', min: 6 }]}
        >
          <Input placeholder="请确认密码" className={styles.emailInput} />
        </Form.Item>
      </Form>
      <Button className={styles.registerBtn} block onClick={confirmRegister}>
        <div className={styles.registerText}>注册</div>
      </Button>
    </div>
  )
}
export default Register
