import { getHomePosts } from '@/api/post'
import { EPageName, EPersonalHomeTab } from '@/enums/page'
import { IPagination } from '@/interfaces/request/post'
import { IGetImgPost, IGetLikePost, IGetPost } from '@/interfaces/request/user'
import { IResp } from '@/interfaces/response'
import { IPostItem, IPostItemResp } from '@/interfaces/response/post'
import { useCallback, useMemo, useState } from 'react'
import { checkWithData } from '../utils/checkHttpRes'
import {
  getUserHomeImgPosts,
  getUserHomeLikePosts,
  getUserHomePosts
} from '@/api/user'

export function usePosts(page: EPageName, type?: EPersonalHomeTab) {
  const [posts, setPosts] = useState<IPostItem[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [next, setNext] = useState('')
  const services = useMemo(
    () => ({
      [EPageName.HOME]: (params: IPagination) => getHomePosts(params),
      [EPersonalHomeTab.POST]: (params: IGetPost) => getUserHomePosts(params),
      [EPersonalHomeTab.IMAGE_POST]: (params: IGetImgPost) =>
        getUserHomeImgPosts(params),
      [EPersonalHomeTab.LIKE_POST]: (params: IGetLikePost) =>
        getUserHomeLikePosts(params)
    }),
    []
  )
  const getPosts = useCallback(
    async ({ id = '' }: IGetPost) => {
      try {
        let res: IResp<IPostItemResp>
        if (page === EPageName.HOME) {
          res = await services[page]({})
        } else {
          res = await services[type || EPersonalHomeTab.POST]({ id })
        }
        if (checkWithData(res)) {
          const { data } = res
          setPosts(data!.items)
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
    [page, services, type]
  )

  // 获取更多
  const loadMore = useCallback(
    async ({ id = '' }: IGetPost) => {
      try {
        let res: IResp<IPostItemResp>
        if (page === EPageName.HOME) {
          res = await services[page]({ next })
        } else {
          res = await services[type || EPersonalHomeTab.POST]({ id, next })
        }
        if (checkWithData(res)) {
          const { data } = res
          const newItems = [...posts, ...data!.items].filter(
            (item, index, self) =>
              index === self.findIndex((t) => t._id === item._id)
          )
          setPosts(newItems)
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
    [next, page, posts, services, type]
  )

  return {
    posts,
    setPosts,
    hasNext,
    getPosts,
    loadMore
  }
}
