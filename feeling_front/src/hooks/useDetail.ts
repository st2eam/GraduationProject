import { Toast } from 'antd-mobile'
import { EPostType } from '@/enums/model'
import { IPostItem } from '@/interfaces/response/post'
import { useCallback, useState } from 'react'
import {
  getPostDetail,
  deletePost,
  likePost,
  unLikePost,
  getComments
} from '@/api/post'

export function useDetail(_id: string) {
  const [type, setType] = useState<EPostType>(EPostType.Comment)
  const [post, setPost] = useState<IPostItem>({} as IPostItem)
  const [next, setNext] = useState<string>('')
  const [comments, setComments] = useState<IPostItem[]>([])
  const [hasNext, setHasNext] = useState<boolean>(false)

  const load = useCallback(async () => {
    try {
      const res = await getPostDetail({ _id })
      setPost(res.data! as IPostItem)
      const comment = await getComments({ _id })
      if (comment.message === 'ok') {
        setComments(comment.data?.items as IPostItem[])
        if (comment.data?.hasNext === true) {
          setHasNext(true)
          setNext(
            comment.data?.items[comment.data?.items.length - 1]._id as string
          )
        } else {
          setHasNext(false)
        }
      }
    } catch (e) {
      console.trace(e)
    }
  }, [_id])

  const loadmore = useCallback(async () => {
    try {
      const comment = await getComments({ _id, next })
      if (comment.message === 'ok') {
        setComments([...comments, ...(comment.data?.items as IPostItem[])])
        if (comment.data?.hasNext === true) {
          setHasNext(true)
          setNext(
            comment.data?.items[comment.data?.items.length - 1]._id as string
          )
        } else {
          setHasNext(false)
        }
      }
    } catch (e) {
      console.trace(e)
    }
  }, [comments, _id, next])

  const handleDelete = async () => {
    const res = await deletePost({ _id })
    if (res.message === 'ok') {
      Toast.show({
        icon: 'success',
        content: '删除成功'
      })
      return true
    } else {
      Toast.show({
        icon: 'error',
        content: '删除失败'
      })
      return false
    }
  }

  const ThumbsUp = async () => {
    const res = await likePost({ _id })
    if (res.message === 'ok') {
      Toast.show('点赞成功')
      return true
    } else {
      return false
    }
  }

  const CancelThumbsUp = async () => {
    const res = await unLikePost({ _id })
    if (res.message === 'ok') {
      Toast.show('取消点赞成功')
      return true
    } else {
      return false
    }
  }
  return {
    type,
    post,
    comments,
    hasNext,
    load,
    loadmore,
    setType,
    setPost,
    ThumbsUp,
    CancelThumbsUp,
    handleDelete
  }
}
