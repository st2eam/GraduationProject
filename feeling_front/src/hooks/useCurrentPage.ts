import { useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { EPagePath, EPageName } from '@/enums/page'

export function useCurrentPage() {
  const [currPagePath, setCurrPagePath] = useState('')
  const location = useLocation()

  useEffect(() => {
    setCurrPagePath(location.pathname)
  }, [location])

  const currPageName = useMemo(() => {
    switch (true) {
      case currPagePath.startsWith(EPagePath.HOME):
        return EPageName.HOME
      case currPagePath.startsWith(EPagePath.SEARCH):
        return EPageName.SEARCH
      case currPagePath.startsWith(EPagePath.NOTIFY):
        return EPageName.NOTIFY
      case currPagePath.startsWith(EPagePath.Follow.replace('/:userId', '')):
        return EPageName.FOLLOW
      case currPagePath.startsWith(
        EPagePath.PERSONAL_DATA.replace('/:userId', '')
      ):
        return EPageName.PERSONAL_DATA
      case currPagePath.startsWith(
        EPagePath.PERSONAL_HOME.replace('/:userId', '')
      ):
        return EPageName.PERSONAL_HOME
      default:
        return EPageName.HOME
    }
  }, [currPagePath])

  return {
    currPagePath,
    setCurrPagePath,
    currPageName
  }
}
