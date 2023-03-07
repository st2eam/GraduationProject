import { loginByWx, logout, register } from '@/api/auth'
import { EPagePath } from '@/enums/page'
import { IRegister, IWxLogin } from '@/interfaces/request/auth'
import { check, checkWithData } from '@/utils/checkHttpRes'
import { Toast } from 'antd-mobile'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleLogin = useCallback(
    async (params: IWxLogin) => {
      try {
        const res = await loginByWx(params)
        if (checkWithData(res)) {
          const { isRegistered, nickname = '', avatar = '', openId = '' } = res.data!
          if (isRegistered) {
            navigate(EPagePath.HOME, { replace: true })
          } else {
            navigate(EPagePath.REGISTER, {
              replace: true,
              state: {
                nickname,
                avatar,
                openId
              }
            })
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
  return {
    error,
    handleLogin,
    handleLogout,
    handleRegister
  }
}
