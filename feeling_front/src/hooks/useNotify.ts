import { INotifyItem } from '@/interfaces/response/notify'
import { useCallback, useMemo, useState } from 'react'
import * as notifyServices from '@/api/notify'
import { check, checkWithData } from '@/utils/check'
import { IDeleteNotify, IUpdateNotifyStatus } from '@/interfaces/request/notify'
export default function useNotify() {
  const [error, setError] = useState('')
  const [hasNext, setHasNext] = useState(false)
  const [limit] = useState(15)
  const [hasUnread, setHasUnread] = useState<boolean>(false)
  const [notifyList, setNotifyList] = useState<INotifyItem[]>([])

  // 获取通知列表
  const getNotifyLIst = useCallback(async () => {
    try {
      setError('')
      const res = await notifyServices.getNotifyItem({ limit })
      if (checkWithData(res)) {
        setNotifyList(res.data!.NotifyList.map((v) => v))
        setHasNext(res.data?.hasNext!)
      }
    } catch (error: any) {
      setError(error)
    }
  }, [limit])

  // 判断是否还有更多通知
  const hasMore = useMemo(() => {
    return hasNext
  }, [hasNext])

  // 加载跟多通知
  const loadMore = useCallback(
    async (next: string) => {
      try {
        setError('')
        const res = await notifyServices.getNotifyItem({ limit, next })
        if (checkWithData(res)) {
          setNotifyList(notifyList?.concat(res.data?.NotifyList!))
          setHasNext(res.data?.hasNext!)
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [limit, notifyList]
  )

  //删除一条通知
  const deleteNotify = useCallback(
    async (params: IDeleteNotify) => {
      try {
        setError('')
        const res = await notifyServices.deleteNotify(params)
        if (check(res)) {
          // getNotifyLIst()
          setNotifyList(notifyList.filter((item) => item._id !== params.id))
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [notifyList]
  )
  //将所有通知设为已读
  const setNotifyToRead = useCallback(
    async (params: IUpdateNotifyStatus) => {
      try {
        setError('')
        // setNotifyList([])
        const res = await notifyServices.updataNotifyStatus(params)
        if (check(res)) {
          getNotifyLIst()
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [getNotifyLIst]
  )

  // 判断是否有未读的通知
  const isUnread = useCallback(async () => {
    try {
      setError('')
      const res = await notifyServices.getHasUnread()
      if (checkWithData(res)) {
        if (res.data?.unReadCount! > 0) {
          setHasUnread(true)
        } else {
          setHasUnread(false)
        }
      }
    } catch (error: any) {
      setError(error)
    }
  }, [])

  // 将所有通知设为已读
  const setAllNotifyToRead = useCallback(async () => {
    try {
      setError('')
      const res = await notifyServices.setAllNotifyToRead()
      if (check(res)) {
        getNotifyLIst()
      }
    } catch (error: any) {
      setError(error)
    }
  }, [getNotifyLIst])

  const setAllNotifyToDelete = useCallback(async () => {
    try {
      setError('')
      const res = await notifyServices.setAllNotifyToDelete()
      if (check(res)) {
        getNotifyLIst()
      }
    } catch (error: any) {
      setError(error)
    }
  }, [getNotifyLIst])
  return {
    error,
    notifyList,
    hasMore,
    hasUnread,
    getNotifyLIst,
    deleteNotify,
    setNotifyToRead,
    loadMore,
    isUnread,
    setAllNotifyToRead,
    setAllNotifyToDelete
  }
}
