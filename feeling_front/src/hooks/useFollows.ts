import { getUserFollows, getUserSubscribes } from '@/api/user'
import { EFollowTab } from '@/enums/page'
import { IGetFollows, IGetSubscribes } from '@/interfaces/request/user'
import { IUserFollowItemResp } from '@/interfaces/response/user'
import { useCallback, useMemo, useState } from 'react'
import { checkWithData } from '../utils/check'

export function useFollows(type: EFollowTab) {
  const [follows, setFollows] = useState<IUserFollowItemResp[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [next, setNext] = useState('')
  // 依据状态选择service
  const services = useMemo(
    () => ({
      [EFollowTab.FOLLOW]: (params: IGetFollows) => getUserFollows(params),
      [EFollowTab.SUBSCRIBE]: (params: IGetSubscribes) =>
        getUserSubscribes(params)
    }),
    []
  )

  const getFollows = useCallback(
    async ({ id = '' }: IGetFollows | IGetSubscribes) => {
      try {
        const res = await services[type]({ id })
        if (checkWithData(res)) {
          const { data } = res
          setFollows(data!.items)
          if (data!.hasNext) {
            setNext(data!.items[data!.items.length - 1]._id)
            setHasNext(true)
          } else {
            setNext('')
            setHasNext(false)
          }
        }
      } catch (error) {}
    },
    [services, type]
  )

  // 获取更多
  const loadMore = useCallback(
    async ({ id = '' }: IGetFollows | IGetSubscribes) => {
      try {
        const res = await services[type]({ id, next })
        if (checkWithData(res)) {
          const { data } = res
          setFollows([...follows, ...data!.items])
          if (data!.hasNext) {
            setNext(data!.items[data!.items.length - 1]._id)
            setHasNext(true)
          } else {
            setNext('')
            setHasNext(false)
          }
        }
      } catch (error) {}
    },
    [follows, next, services, type]
  )

  return {
    follows,
    hasNext,
    setFollows,
    getFollows,
    loadMore
  }
}
