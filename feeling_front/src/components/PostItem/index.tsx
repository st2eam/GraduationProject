import { useNavigate } from 'react-router-dom'
import { useDebounceFn } from 'ahooks'
import { getLastTimeStr } from '@/utils/tools/formatTime'
import { IPostItem } from '@/interfaces/response/post'
import { useUserInfo } from '@/hooks/useUserInfo'
import { EPostType } from '@/enums/model'
import { Avatar, Dialog } from 'antd-mobile'
import { useDetail } from '@/hooks/useDetail'
import { MoreOutline, DeleteOutline } from 'antd-mobile-icons'
import { Popover } from 'antd-mobile'
import { Action } from 'antd-mobile/es/components/popover'
import { useState } from 'react'
import {
  HeartOutline,
  SendOutline,
  MessageOutline,
  HeartFill
} from 'antd-mobile-icons'
import styles from './style.module.scss'
import ForwardItem from './ForwardItem'
import Content from './Content'

interface IProps {
  post: IPostItem
  onDelete?: () => void
  onForward?: () => void
  onComment?: () => void
}

const PostItem = (props: IProps) => {
  const navigate = useNavigate()
  const { user } = useUserInfo()
  const { post } = props
  const { ThumbsUp, CancelThumbsUp, handleDelete } = useDetail(post._id)
  const [isLike, setIsLike] = useState(post.isLike)

  // 跟据传入的类型链接
  const linkToPost = () => {
    navigate(`/detail/${post._id}`)
  }

  // 链接至用户主页
  const linkToUser = (e: React.MouseEvent<HTMLImageElement, Event>) => {
    navigate(`/personal_home/${post.userId}`)
    e.stopPropagation()
  }

  // 删除帖子
  const deletePost = () => {
    Dialog.confirm({
      content: '删除后不可恢复，确定删除吗？',
      confirmText: <span className={styles.confirmText}>删除</span>,
      onConfirm: async () => {
        props.onDelete && props.onDelete()
        handleDelete()
      }
    })
  }

  // 转发帖子
  const forwardPost = (e: React.MouseEvent) => {
    props.onForward && props.onForward()
    e.stopPropagation()
  }

  // 评论帖子
  const commentPost = (e: React.MouseEvent) => {
    props.onComment && props.onComment()
    e.stopPropagation()
  }

  // 点赞帖子
  const likePost = async () => {
    setIsLike(true)
    post.likes += 1
    if (!(await ThumbsUp())) {
      setIsLike(false)
      post.likes -= 1
    }
  }

  // 点赞帖子防抖最后一次生效
  const { run: runThumbsUp } = useDebounceFn(
    () => {
      likePost()
    },
    { wait: 500 }
  )

  // 疯狂点赞时
  const onHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    runThumbsUp()
  }

  // 取消点赞帖子
  const cancelLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLike(false)
    post.likes -= 1
    if (!(await CancelThumbsUp())) {
      setIsLike(true)
      post.likes += 1
    }
  }

  const actions: Action[] = [
    {
      key: 'scan',
      icon: <DeleteOutline />,
      text: '删除',
      onClick: () => deletePost()
    }
  ]
  // render
  return (
    <div className={styles.postItem} onClick={() => linkToPost()}>
      <Avatar
        className={styles.left}
        src={post.user.avatar}
        onClick={(e) => linkToUser(e)}
      />
      <div className={styles.right}>
        <div className={styles.postItemHeader} onClick={() => linkToPost()}>
          <span className={styles.nickname}>{post.user.userId}</span>
          <span>
            {post.userId} · {getLastTimeStr(post.createdAt)}
          </span>
        </div>
        {post.type === EPostType.Comment && (
          <div className={styles.comment}>
            <span>回复：</span>
            <span className={styles.replyTo}>
              {post.relate!.user[0].userId}{' '}
            </span>
          </div>
        )}
        <Content
          id={post._id}
          content={post.content}
          imgs={post.imgs}
          onClick={() => linkToPost()}
        >
          {post.type === EPostType.Forward && (
            <ForwardItem
              {...post.relate!.post[0]}
              user={post.relate!.user[0]}
            />
          )}
        </Content>
        <div className={styles.postItemFooter}>
          <span className={styles.footerItem} onClick={(e) => commentPost(e)}>
            <MessageOutline className={styles.FooterIcon} />
            <span>{Number(post.comments)}</span>
          </span>
          <span className={styles.footerItem} onClick={(e) => forwardPost(e)}>
            <SendOutline className={styles.FooterIcon} />
            <span>{Number(post.forwards)}</span>
          </span>
          <span className={styles.footerItem}>
            {isLike ? (
              <HeartFill
                className={styles.FooterIcon + ` ${styles.like}`}
                onClick={(e) => cancelLikePost(e)}
              />
            ) : (
              <HeartOutline
                className={styles.FooterIcon + ` ${styles.heartAnimation}`}
                onClick={(e) => onHeartClick(e)}
              />
            )}
            <span className={styles.dot} />
            <span>{Number(post.likes)}</span>
          </span>
        </div>
      </div>
      {user.userId === post.userId && (
        <Popover.Menu
          actions={actions}
          placement="bottom-start"
          trigger="click"
        >
          <MoreOutline
            className={styles.more}
            onClick={(event) => event.stopPropagation()}
          />
        </Popover.Menu>
      )}
    </div>
  )
}
export default PostItem
