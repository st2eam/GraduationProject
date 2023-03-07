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
    if (currPagePath.includes(EPagePath.HOME)) {
      return EPageName.HOME
    }
    if (currPagePath.includes(EPagePath.SEARCH)) {
      return EPageName.SEARCH
    }
    if (currPagePath.includes(EPagePath.NOTIFY)) {
      return EPageName.NOTIFY
    }
    if (currPagePath.includes(EPagePath.MESSAGE)) {
      return EPageName.MESSAGE
    }
    if (currPagePath.includes(EPagePath.Follow.replace('/:userId', ''))) {
      return EPageName.FOLLOW
    }
    if (
      currPagePath.includes(EPagePath.PERSONAL_DATA.replace('/:userId', ''))
    ) {
      return EPageName.PERSONAL_DATA
    }
    if (
      currPagePath.includes(EPagePath.PERSONAL_HOME.replace('/:userId', ''))
    ) {
      return EPageName.PERSONAL_HOME
    }
    if (
      currPagePath.includes(EPagePath.MESSAGE_DETAIL.replace('/:FriendId/:FriendName', ''))
    ) {
      return EPageName.MESSAGE
    }

    return EPageName.HOME
  }, [currPagePath])
  return {
    currPagePath,
    setCurrPagePath,
    currPageName
  }
}
