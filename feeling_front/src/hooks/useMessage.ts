import * as messageServices from '@/api/message'
import { EMsgType } from '@/enums/model'
import {
  IDeleteChatItem,
  IDeleteDirectMsg,
  ISetMsgToRead
} from '@/interfaces/request/directMsg'
import { IChatItem, IDirectMsgItem } from '@/interfaces/response/message'
import { check, checkWithData } from '@/utils/checkHttpRes'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { ImageViewer, Toast } from 'antd-mobile'
import { useCallback, useContext, useMemo, useState } from 'react'
import { getImageUploadedURL } from '@/api/oss'
import { directMsgWithFriends } from '@/hooks/store'
import { uniqBy } from 'lodash-es'
export default function useMessage(friendId?: string) {
  const [error, setError] = useState('')
  const [imgCopy, setImgCopy] = useState<ImageUploadItem | undefined>(undefined)
  const [newMsgId, setNewMsgId] = useState('')
  const [hasNext, setHasNext] = useState(false) //是否有更多的私信列表
  const [hasNextMsg, setHasNextMsg] = useState(false) //和某个用户是否有更多的私信
  const [limit] = useState(10)
  const [msgDetailLimit] = useState(12)
  const [unReadCount, setUnreadCount] = useState<number | undefined>(undefined)
  const [unReadCountWithOnePeople, setUnReadCountWithOnePeople] = useState<number | undefined>(undefined)
  const [chatList, setChatList] = useState<IChatItem[]>([])
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  const [directMsgList, setDirectMsgList] = useState<IDirectMsgItem[]>([])
  const { inChatFriendId } = useContext(directMsgWithFriends)
  //获取私信列表
  const getChatList = useCallback(async () => {
    try {
      setError('')
      const res = await messageServices.getChatList({ limit })
      // 使用data前要check
      if (checkWithData(res)) {
        setChatList(res.data!.chatItem)
      }
    } catch (error: any) {
      setError(error)
    }
  }, [limit])
  //轮询最新的消息列表信息
  const pollGetMsgList = useCallback(async () => {
    try {
      setError('')
      const prev = chatList[0].lastMsgId||''
      const res = await messageServices.getChatList({ limit, prev })
      if (res.data?.chatItem.length! > 0) {
        const newChatList = uniqBy(
          res.data?.chatItem.concat(chatList),
          'userId'
        )
        setChatList(newChatList)
      }
    } catch (error: any) {
      setError(error)
    }
  }, [chatList, limit])

  // 判断私信列表是否还有更多数据供以加载更多
  const hasMore = useMemo(() => {
    return hasNext
  }, [hasNext])

  //上滑加载更多私信列表
  const loadMore = useCallback(
    async (next: string) => {
      try {
        setError('')
        const res = await messageServices.getChatList({ limit, next })
        if (checkWithData(res)) {
          setChatList(chatList?.concat(res.data?.chatItem!))
          setHasNext(res.data?.hasNext!)
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [chatList, limit]
  )

  //获取和某人的私信详情
  const getDirectMsg = useCallback(async () => {
    try {
      setError('')
      const res = await messageServices.getDirectMsg({
        id: friendId!,
        limit: msgDetailLimit
      })
      if (checkWithData(res)) {
        setDirectMsgList(res.data!.msgList.map((v) => v))
        setHasNextMsg(res.data?.hasNext!)
        setUnReadCountWithOnePeople(res.data?.unReadCount)
      }
    } catch (error: any) {
      setError(error)
    }
  }, [friendId, msgDetailLimit])

  //私信详情的下滑加载更多
  const getEarlierMsg = useCallback(async () => {
    try {
      setError('')
      const next = directMsgList[directMsgList.length - 1]._id

      const res = await messageServices.getDirectMsg({
        id: friendId!,
        next,
        limit: msgDetailLimit
      })
      if (checkWithData(res)) {
        setDirectMsgList(directMsgList.concat(res.data!.msgList))
        setHasNextMsg(res.data?.hasNext!)
      }
    } catch (error: any) {
      setError(error)
    }
  }, [directMsgList, friendId, msgDetailLimit])

  // 在私信详情页面轮询获取和当前用户的最新消息
  const getNewMsgWithOneFriend = useCallback(async () => {
    try {
      setError('')
      const res = await messageServices.getNewMsgWithOneFriend({
        id: friendId!
      })
      if (checkWithData(res)) {
        if (res.data?.unReadMsg && res.data?.unReadMsg.length > 0) {
          setDirectMsgList(res.data.unReadMsg.concat(directMsgList))
          return res.data?.unReadMsg.length
        }
      }
    } catch (error: any) {
      setError(error)
    }
  }, [directMsgList, friendId])

  //创建一条新私信
  const createDirectMsg = useCallback(
    async (friendId: string, content: string, fileList: ImageUploadItem[]) => {
      try {
        setError('')
        let msgType = EMsgType.Common
        if (fileList.length > 0) {
          content = String(
            await getImageUploadedURL({ image: fileList[0].extra.file })
          )
          msgType = EMsgType.Image
        }
        const res = await messageServices.createDirectMsg({
          friendId,
          msgType,
          content
        })
        if (checkWithData(res)) {
          setNewMsgId(res.data!)
          setImgCopy(fileList[0])
          setFileList([])
          return res
        }
      } catch (error: any) {
        setError(error)
      }
    },
    []
  )

  //单向删除一条私信
  const deleteDirectMsg = useCallback(
    async (params: IDeleteDirectMsg) => {
      try {
        setError('')
        const res = await messageServices.deleteDirectMsg(params)
        if (check(res)) {
          setDirectMsgList(
            directMsgList.filter((item) => item._id !== params.MsgId)
          )
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [directMsgList]
  )

  //删除一项和某人的私信列表项
  const deleteChatItem = useCallback(
    async (params: IDeleteChatItem) => {
      try {
        setError('')
        const res = await messageServices.deleteChatItem(params)
        if (check(res)) {
          // getChatList()
          setChatList(chatList.filter((item) => item.userId !== params.id))
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [chatList]
  )

  // 将和某个用户的私信全部设为已读
  const setMsgToRead = useCallback(
    async (params: ISetMsgToRead) => {
      try {
        setError('')
        const res = await messageServices.setMsgToRead(params)
        if (check(res)) {
          getChatList()
        }
      } catch (error: any) {
        setError(error)
      }
    },
    [getChatList]
  )

  // 获取当前用户的所有未读私信
  const getUnreadCount = useCallback(async () => {
    try {
      setError('')
      const res = await messageServices.getUnreadCount({
        id: inChatFriendId
      })
      if (checkWithData(res)) {
        if (res.data?.unReadCount! > 0) {
          setUnreadCount(res.data?.unReadCount)
        } else {
          setUnreadCount(undefined)
        }
      }
    } catch (error: any) {
      setError(error)
    }
  }, [inChatFriendId])

  // 将当前用户所有私信设为已读
  const setAllMsgToRead = useCallback(async () => {
    try {
      setError('')
      const res = await messageServices.setAllItemToRead()
      if (check(res)) {
        getChatList()
      }
    } catch (error: any) {
      setError(error)
    }
  }, [getChatList])

  const handleImageClick = (index: number, images: string[]) => {
    ImageViewer.Multi.show({ images, defaultIndex: index })
  }
  // 上传图片
  const mockUpload = (file: File) => {
    return {
      extra: {
        file: file,
        name: file.name
      },
      url: URL.createObjectURL(file)
    }
  }
  // 图片改变时
  const handleImgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxCount = 1
    const files = e.target.files
    if (files) {
      const append = Array.from(files).map(mockUpload).slice(0, maxCount)
      if (fileList.length + append.length > maxCount) {
        Toast.show({
          icon: 'fail',
          content: `一次只能发送${maxCount}张图片`
        })
        setFileList(
          fileList.concat(append.slice(0, maxCount - fileList.length))
        )
      } else {
        setFileList(fileList.concat(append))
      }
    }
    e.target.files = null
    e.target.value = ''
  }
  // 删除图片
  const deleteImg = () => {
    setFileList([])
    // setFileList(fileList.filter((_, i) => i !== index))
  }
  return {
    error,
    chatList,
    directMsgList,
    newMsgId,
    imgCopy,
    hasMore,
    fileList,
    unReadCount,
    limit,
    msgDetailLimit,
    hasNextMsg,
    unReadCountWithOnePeople,
    getChatList,
    getDirectMsg,
    createDirectMsg,
    deleteDirectMsg,
    deleteChatItem,
    setMsgToRead,
    getEarlierMsg,
    loadMore,
    handleImageClick,
    handleImgsChange,
    deleteImg,
    getUnreadCount,
    setAllMsgToRead,
    getNewMsgWithOneFriend,
    pollGetMsgList
  }
}
