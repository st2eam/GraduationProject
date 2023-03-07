import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { Avatar, Button, Form, Input, Toast } from 'antd-mobile'
import styles from './style.module.scss'
import { checkUserId } from '@/utils/validate/checkUserId'
import { ILoginResp } from '@/interfaces/response/user'

function Register() {
  const location = useLocation()
  const { avatar = '', nickname = '匿名用户', openId = '' } = location.state as ILoginResp ?? {}
  const { handleRegister, handleLogin } = useAuth()
  const [userIdForm] = Form.useForm<{ userId: string }>()

  // 刷新form初始值
  useEffect(() => {
    userIdForm.setFieldValue('userId', nickname)
  }, [nickname, userIdForm])

  const confirmRegister = async () => {
    try {
      if (!openId) {
        Toast.show({
          content: '请微信授权后注册',
          position: 'top'
        })
        return
      }
      // validate info
      const value = userIdForm.getFieldsValue()
      const res = checkUserId(value.userId)
      if (res) {
        const registerRes = await handleRegister({
          userId: '@' + value.userId,
          nickname: nickname!,
          avatar: avatar!,
          openId: openId!
        })
        if (registerRes) {
          await handleLogin({ openId: openId! })
        }
      }
    } catch (error) {}
  }

  return (
    <div className={styles.registerWrapper}>
      <Avatar src={avatar!} className={styles.avatar} />
      <div className={styles.nickname}>{nickname}</div>
      <Form
        className={styles.form}
        form={userIdForm}
        requiredMarkStyle="none"
        mode="card"
        initialValues={{ userId: nickname }}
        layout="horizontal"
      >
        <Form.Item
          name="userId"
          label={<div className={styles.userIdPrefix}>@</div>}
        >
          <Input
            placeholder="请输入用户名"
            className={styles.userIdInput}
            clearable
          />
        </Form.Item>
      </Form>
      <Button className={styles.registerBtn} block onClick={confirmRegister}>
        <div className={styles.registerText}>注册</div>
      </Button>
    </div>
  )
}
export default Register
