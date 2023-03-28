import { login, logout, register, security_code } from '@/api/auth'
import { EPagePath } from '@/enums/page'
import { IEmail, ILogin, IRegister } from '@/interfaces/request/auth'
import { check, checkWithData } from '@/utils/check'
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

  return {
    error,
    handleLogin,
    handleLogout,
    handleRegister,
    getSecurityCode
  }
}
