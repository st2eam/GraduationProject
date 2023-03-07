import { ISearch } from './../interfaces/request/search'
import { ESearchTab } from '@/enums/page'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IPostItem, IPostItemResp } from '@/interfaces/response/post'
import { useCallback, useMemo, useState } from 'react'
import { searchPost, searchImgPost, searchUser } from '@/api/search'
import { IResp } from '@/interfaces/response'
import { checkWithData } from '@/utils/checkHttpRes'
import { IUserInfoResp, IUserSearchResp } from '@/interfaces/response/user'
import { useLocalStorageState } from 'ahooks'
interface IUseSearch {
  userId: string
  keyword: string
}
export default function useSearch(type: ESearchTab) {
  const [searchList, setSearchList] = useState<IUseSearch[]>([])
  const [searchHistory, setSearchHistory] = useLocalStorageState<
    IUseSearch[] | undefined
  >('searchHistory')
  const [postList, setPostList] = useState<IPostItem[]>([])
  const [userList, setUserList] = useState<IUserInfoResp[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [next, setNext] = useState('')
  const { user } = useUserInfo()

  const services = useMemo(
    () => ({
      [ESearchTab.POST]: (params: ISearch) => searchPost(params),
      [ESearchTab.IMAGE_POST]: (params: ISearch) => searchImgPost(params),
      [ESearchTab.USER]: (params: ISearch) => searchUser(params)
    }),
    []
  )

  const getResults = useCallback(
    async ({ keyword = '' }: ISearch) => {
      try {
        let postRes: IResp<IPostItemResp>
        let userRes: IResp<IUserSearchResp>
        if (type === ESearchTab.USER) {
          userRes = await services[ESearchTab.USER]({ keyword })
          if (checkWithData(userRes)) {
            const { data } = userRes
            setUserList(data!.items)
            if (data!.hasNext) {
              setNext(data!.items[data!.items.length - 1]._id)
              setHasNext(true)
            } else {
              setNext('')
              setHasNext(false)
            }
          }
        } else {
          postRes = await services[type]({ keyword })
          if (checkWithData(postRes)) {
            const { data } = postRes
            setPostList(data!.items)
            if (data!.hasNext) {
              setNext(data!.items[data!.items.length - 1]._id)
              setHasNext(true)
            } else {
              setNext('')
              setHasNext(false)
            }
          }
        }
      } catch (error) {}
    },
    [services, type]
  )

  // 获取更多
  const loadMore = useCallback(
    async ({ keyword = '' }: ISearch) => {
      try {
        let postRes: IResp<IPostItemResp>
        let userRes: IResp<IUserSearchResp>
        if (type === ESearchTab.USER) {
          userRes = await services[ESearchTab.USER]({ keyword, next })
          if (checkWithData(userRes)) {
            const { data } = userRes
            const newItems = [...userList, ...data!.items].filter(
              (item, index, self) =>
                index === self.findIndex((t) => t._id === item._id)
            )
            setUserList(newItems)
            if (data!.items.length > 0) {
              setNext(data!.items[data!.items.length - 1]._id)
              setHasNext(true)
            } else {
              setNext('')
              setHasNext(false)
            }
          }
        } else {
          postRes = await services[type]({ keyword, next })
          if (checkWithData(postRes)) {
            const { data } = postRes
            const newItems = [...postList, ...data!.items].filter(
              (item, index, self) =>
                index === self.findIndex((t) => t._id === item._id)
            )
            setPostList(newItems)
            if (data!.items.length > 0) {
              setNext(data!.items[data!.items.length - 1]._id)
              setHasNext(true)
            } else {
              setNext('')
              setHasNext(false)
            }
          }
        }
      } catch (error) {
        console.trace(error)
      }
    },
    [next, postList, services, type, userList]
  )

  //历史记录保存本地
  const saveToLocal = useCallback(
    (records: IUseSearch[]) => {
      if (searchHistory === undefined) {
        setSearchHistory([...records])
      } else {
        const newRecords = [...records, ...searchHistory].filter(
          (item, index, self) => {
            return (
              self.findIndex(
                (t) => t.userId === item.userId && t.keyword === item.keyword
              ) === index
            )
          }
        )
        setSearchHistory(newRecords)
      }
    },
    [searchHistory, setSearchHistory]
  )

  //获取历史记录
  const getSearchHistory = useCallback(() => {
    if (searchHistory) {
      const Records: IUseSearch[] = searchHistory.filter(
        (item: IUseSearch) => item.userId === user._id
      )
      setSearchList(Records)
    }
  }, [searchHistory, user._id])

  //添加历史记录
  const addSearchHistory = useCallback(
    (keyword: string) => {
      const record: IUseSearch = { userId: user._id, keyword: keyword.trim() }
      const newRecordList = [record, ...searchList].filter(
        (item, index, self) => {
          return (
            self.findIndex(
              (t) => t.userId === item.userId && t.keyword === item.keyword
            ) === index
          )
        }
      )
      setSearchList(newRecordList)
      saveToLocal(newRecordList)
    },
    [saveToLocal, searchList, user._id]
  )

  // 清除历史记录
  const clearSearchHistory = useCallback(() => {
    if (searchHistory) {
      const newRecords = searchHistory.filter(
        (item: IUseSearch) => item.userId !== user._id
      )
      setSearchHistory(newRecords)
      setSearchList([])
    }
  }, [searchHistory, setSearchHistory, user._id])
  return {
    next,
    searchList,
    postList,
    userList,
    hasNext,
    loadMore,
    getResults,
    setPostList,
    setUserList,
    getSearchHistory,
    addSearchHistory,
    clearSearchHistory
  }
}
