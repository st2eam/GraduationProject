import { login, logout, register, security_code, validate } from '@/api/auth'
import { EPagePath } from '@/enums/page'
import { IEmail, ILogin, IRegister } from '@/interfaces/request/auth'
import { check, checkWithData } from '@/utils/check'
import { userIdRule } from '@/utils/validate/checkUserId'
import { Toast } from 'antd-mobile'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleLogin = useCallback(
    async (params: ILogin) => {
      try {
        const res = await login(params)
        if (checkWithData(res)) {
          const token = res.data
          if (token) {
            navigate('/home', { replace: true })
          } else {
            navigate('/login', { replace: true })
          }
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [navigate]
  )

  const handleLogout = useCallback(async () => {
    try {
      const res = await logout()
      if (check(res)) {
        Toast.show({
          content: '已退出',
          icon: 'success'
        })
        navigate(EPagePath.LOGIN, { replace: true })
        return true
      } else return false
    } catch (error) {
      return false
    }
  }, [navigate])

  const handleRegister = useCallback(async (params: IRegister) => {
    try {
      const res = await register(params)
      if (checkWithData(res)) {
        return res.data!
      }
    } catch (error: any) {
      setError(error)
    }
  }, [])

  const getSecurityCode = useCallback(async (params: IEmail) => {
    try {
      const res = await security_code(params)
      if (checkWithData(res)) {
        return res.data!
      }
    } catch (error: any) {
      setError(error)
    }
  }, [])

  const validate_info = useCallback(async (type: string, info: string) => {
    let flag = false
    if (type === 'userId') {
      flag = userIdRule(info, false)
    } else {
      flag =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          info
        )
    }
    if (flag) {
      try {
        const res = await validate({ type, info })
        if (checkWithData(res)) {
          return !res.data!
        }
      } catch (error: any) {
        setError(error)
      }
    } else {
      return false
    }
  }, [])

  return {
    error,
    handleLogin,
    handleLogout,
    handleRegister,
    validate_info,
    getSecurityCode
  }
}
