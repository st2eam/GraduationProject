import { useAuth } from '@/hooks/useAuth'
import {
  Avatar,
  Radio,
  Form,
  Input,
  SpinLoading,
  Modal,
  Selector,
  Steps,
  Swiper,
  Divider
} from 'antd-mobile'
import {
  CheckOutline,
  CloseOutline,
  EyeInvisibleOutline,
  EyeOutline
} from 'antd-mobile-icons'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import { checkUserId } from '@/utils/validate/checkUserId'
import { useRef, useState } from 'react'
import styles from './style.module.scss'
import { useRequest, useCountDown } from 'ahooks'
import { options } from './options'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'

function Register() {
  const [src, setSrc] = useState('')
  const [code, setCode] = useState('666666')
  const [flag, setFlag] = useState(false)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [labels, setLabels] = useState<Array<string>>(['财经'])
  const [targetDate, setTargetDate] = useState<number>()
  const navigator = useNavigate()
  const { handleRegister, handleLogin, getSecurityCode, validate_info } =
    useAuth()
  const [form] = Form.useForm()
  const { Step } = Steps
  const ref = useRef<SwiperRef>(null)
  const [countdown] = useCountDown({
    targetDate
  })
  const confirmRegister = async () => {
    const values = form.getFieldsValue()
    const { userId, password, confirm, email, sex, security_code } = values
    if (!data || sex === undefined) {
      ref.current?.swipeTo(0)
      return
    } else if (
      !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
        email
      ) ||
      security_code !== code
    ) {
      ref.current?.swipeTo(1)
      return
    } else if (
      password === undefined ||
      password === '' ||
      confirm !== password
    ) {
      ref.current?.swipeTo(2)
      return
    }
    try {
      // validate info
      await form.validateFields()
      const registerRes = await handleRegister({
        userId,
        password,
        email,
        sex,
        banner: '',
        avatar: src,
        labels: labels
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
    setTargetDate(Date.now() + 60000)
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
    <Form form={form} mode="card" layout="horizontal" requiredMarkStyle="none">
      <div className={styles.register}>
        <div className={styles.form}>
          <Steps current={current}>
            <Step title="ACCOUNT SETUP" />
            <Step title="EMAIL VALIDATE" />
            <Step title="CONFIRM PASSWORD" />
            <Step title="PERSONAL DETAILS" />
          </Steps>
          <Swiper onIndexChange={setCurrent} indicator={() => null} ref={ref}>
            <Swiper.Item className={styles.swiper_item}>
              <Form.Item
                name="userId"
                label="用户名"
                className={styles.inputContainer}
                rules={[{ validator: checkUserId }]}
                extra={
                  loading ? (
                    <SpinLoading color="primary" style={{ '--size': '16px' }} />
                  ) : data ? (
                    <CheckOutline
                      color="var(--adm-color-success)"
                      fontSize={16}
                    />
                  ) : (
                    <CloseOutline
                      color="var(--adm-color-danger)"
                      fontSize={16}
                    />
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
            </Swiper.Item>

            <Swiper.Item className={styles.swiper_item}>
              <div className={styles.inputContainer}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true },
                    { type: 'email', warningOnly: true }
                  ]}
                  extra={
                    loading_email ? (
                      <SpinLoading
                        color="primary"
                        style={{ '--size': '16px' }}
                      />
                    ) : data_email ? (
                      <CheckOutline
                        color="var(--adm-color-success)"
                        fontSize={16}
                      />
                    ) : (
                      <CloseOutline
                        color="var(--adm-color-danger)"
                        fontSize={16}
                      />
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
                    data_email ? (
                      countdown === 0 ? (
                        <span
                          className={styles.security_code}
                          onClick={handleSendCode}
                        >
                          发送验证码
                        </span>
                      ) : (
                        <span>重新发送({Math.floor(countdown / 1000)}s)</span>
                      )
                    ) : null
                  }
                  rules={[{ validator: checkCode }]}
                >
                  <Input
                    placeholder={
                      data_email ? '请输入验证码' : '请先输入正确的邮箱'
                    }
                    className={styles.input}
                  />
                </Form.Item>
              </div>
            </Swiper.Item>

            <Swiper.Item className={styles.swiper_item}>
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
                      <CheckOutline
                        color="var(--adm-color-success)"
                        fontSize={16}
                      />
                    ) : (
                      <CloseOutline
                        color="var(--adm-color-danger)"
                        fontSize={16}
                      />
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
            </Swiper.Item>

            <Swiper.Item className={styles.swiper_item}>
              <div
                className={styles.choose_avatar}
                onClick={() => {
                  Modal.show({
                    closeOnAction: true,
                    content: (
                      <Selector
                        defaultValue={[src]}
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
                <span className={styles.choose_text}>请选择头像</span>
              </div>
              <Divider />
              <span className={styles.choose_text}>
                请选择感兴趣的项目（最少一项）
              </span>
              <Selector
                columns={5}
                options={[
                  '财经',
                  '房产',
                  '股票',
                  '教育',
                  '科技',
                  '社会',
                  '时政',
                  '体育',
                  '游戏',
                  '娱乐'
                ].map((item) => {
                  return {
                    label: item,
                    value: item
                  }
                })}
                defaultValue={labels}
                value={labels}
                multiple={true}
                onChange={(v) => {
                  if (v.length) {
                    setLabels(v)
                  }
                }}
              />
            </Swiper.Item>
          </Swiper>
          <footer>
            <div className={styles.btnContainer}>
              {current >= 1 && current <= 2 && (
                <button
                  className={`${styles.bubbly_button} ${
                    animate ? styles.animate : ''
                  }`}
                  onClick={() => {
                    ref.current?.swipePrev()
                    setCurrent((i) => i - 1)
                    setAnimate(true)
                  }}
                >
                  上一步
                </button>
              )}
              {current < 3 && (
                <button
                  className={`${styles.bubbly_button} ${
                    animate ? styles.animate : ''
                  }`}
                  onClick={() => {
                    ref.current?.swipeNext()
                    setCurrent((i) => i + 1)
                    setAnimate(true)
                  }}
                >
                  下一步
                </button>
              )}
              {current === 3 && (
                <button
                  className={`${styles.bubbly_button} ${
                    animate ? styles.animate : ''
                  }`}
                  onClick={() => {
                    setAnimate(true)
                    confirmRegister()
                  }}
                >
                  注册
                </button>
              )}
            </div>
            <span
              className={styles.login}
              onClick={() => {
                navigator(EPagePath.LOGIN)
              }}
            >
              已有帐号,直接登录
            </span>
          </footer>
        </div>
      </div>
    </Form>
  )
}
export default Register
