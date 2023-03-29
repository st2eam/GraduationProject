import { useAuth } from '@/hooks/useAuth'
import {
  Avatar,
  Button,
  Radio,
  Form,
  Input,
  SpinLoading,
  Modal,
  Selector,
  Steps
} from 'antd-mobile'
import {
  CheckOutline,
  CloseOutline,
  EyeInvisibleOutline,
  EyeOutline
} from 'antd-mobile-icons'
import { checkUserId } from '@/utils/validate/checkUserId'
import { IRegister } from '@/interfaces/request/auth'
import { useState } from 'react'
import styles from './style.module.scss'
import { useRequest } from 'ahooks'
import { options } from './options'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'

function Register() {
  const [src, setSrc] = useState('')
  const [code, setCode] = useState('')
  const [flag, setFlag] = useState(false)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const navigator = useNavigate()
  const { handleRegister, handleLogin, getSecurityCode, validate_info } =
    useAuth()
  const [form] = Form.useForm<IRegister>()
  const { Step } = Steps
  const confirmRegister = async () => {
    const values = form.getFieldsValue()
    const { userId, password, email, sex, banner = '' } = values
    try {
      // validate info
      await form.validateFields()
      const registerRes = await handleRegister({
        userId,
        password,
        email,
        sex,
        banner,
        avatar: src
      })

      if (registerRes) {
        await handleLogin({
          username: userId,
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

  // 当关键字改变时，设置0.4s的防抖搜索
  const { data, loading, run } = useRequest(validate_info, {
    debounceWait: 400,
    manual: true
  })

  const {
    data: data_email,
    loading: loading_email,
    run: run_email
  } = useRequest(validate_info, {
    debounceWait: 400,
    manual: true
  })

  const handleEmailInput = (value: string) => {
    run_email('email', value)
    setEmail(value)
  }

  const handleUserIdInput = (value: string) => {
    run('userId', value)
    setUserId(value)
  }

  const handleConfirmInput = (value: string) => {
    setConfirm(value)
    if (value === password) {
      setFlag(true)
    } else setFlag(false)
  }

  return (
    <Form
      form={form}
      mode="card"
      layout="horizontal"
      requiredMarkStyle="none"
      footer={
        <div className={styles.btnContainer}>
          <Button block color="primary" onClick={confirmRegister}>
            <div className={styles.registerText}>注册</div>
          </Button>
          <div
            className={styles.registerText}
            onClick={() => {
              navigator(EPagePath.LOGIN)
            }}
          >
            已有帐号,直接登录
          </div>
        </div>
      }
    >
      <Steps current={current}>
        <Step title="ACCOUNT SETUP" />
        <Step title="EMAIL VALIDATE" />
        <Step title="PERSONAL DETAILS" />
      </Steps>
      <div
        className={styles.choose_avatar}
        onClick={() => {
          Modal.show({
            closeOnAction: true,
            content: (
              <Selector
                defaultValue={[
                  'https://fee1ing.oss-cn-hangzhou.aliyuncs.com/avatar/avatar1.svg'
                ]}
                style={{ '--padding': '0' }}
                options={options}
                onChange={(arr) => setSrc(arr[0])}
              />
            ),
            actions: [
              {
                key: 'confirm',
                text: '我选好了',
                primary: true
              }
            ]
          })
        }}
      >
        <Avatar
          src={src}
          className={styles.avatar}
          style={{ '--size': '64px' }}
        />
        {src === '' ? <span>请选择头像</span> : null}
      </div>
      <Form.Item
        name="userId"
        label="用户名"
        className={styles.inputContainer}
        rules={[{ validator: checkUserId }]}
        extra={
          loading ? (
            <SpinLoading color="primary" style={{ '--size': '16px' }} />
          ) : data ? (
            <CheckOutline color="var(--adm-color-success)" fontSize={16} />
          ) : (
            <CloseOutline color="var(--adm-color-danger)" fontSize={16} />
          )
        }
      >
        <Input
          placeholder="请输入用户名"
          className={styles.input}
          value={userId}
          onChange={(value) => handleUserIdInput(value)}
        />
      </Form.Item>

      <Form.Item
        name="sex"
        className={styles.inputContainer}
        label="性别"
        required
        initialValue={1}
      >
        <Radio.Group>
          <Radio value={1}>男</Radio>
          <Radio value={2}>女</Radio>
        </Radio.Group>
      </Form.Item>

      <div className={styles.inputContainer}>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true }, { type: 'email', warningOnly: true }]}
          extra={
            loading_email ? (
              <SpinLoading color="primary" style={{ '--size': '16px' }} />
            ) : data_email ? (
              <CheckOutline color="var(--adm-color-success)" fontSize={16} />
            ) : (
              <CloseOutline color="var(--adm-color-danger)" fontSize={16} />
            )
          }
        >
          <Input
            placeholder="请输入邮箱"
            className={styles.input}
            value={email}
            onChange={handleEmailInput}
          />
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
          <Input placeholder="请输入" className={styles.input} />
        </Form.Item>
      </div>

      <div className={styles.inputContainer}>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true }, { type: 'string', min: 6 }]}
          extra={
            <div className={styles.eye}>
              {!visible ? (
                <EyeInvisibleOutline onClick={() => setVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setVisible(false)} />
              )}
            </div>
          }
        >
          <Input
            className={styles.input}
            placeholder="请输入密码"
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          rules={[{ required: true }, { type: 'string', min: 6 }]}
          extra={
            flag ? (
              <CheckOutline color="var(--adm-color-success)" fontSize={16} />
            ) : (
              <CloseOutline color="var(--adm-color-danger)" fontSize={16} />
            )
          }
        >
          <Input
            placeholder="请确认密码"
            className={styles.input}
            type={'password'}
            value={confirm}
            onChange={handleConfirmInput}
          />
        </Form.Item>
      </div>
    </Form>
  )
}
export default Register
