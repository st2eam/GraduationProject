import Comment from './Comment'
import CustomList from '@/components/CustomList'
import DetailSkeleton from './DetailSkeleton'
import NewPostPopup from '@/components/NewPostPopup'
import Post from './Post'
import PostItem from '@/components/PostItem'
import PostItemSkeleton from '@/components/PostItem/PostItemSkeleton'
import styles from './style.module.scss'
import { Avatar, Dialog, NavBar, Popover } from 'antd-mobile'
import { EPagePath } from '@/enums/page'
import { EPostType } from '@/enums/model'
import { IPostItem } from '@/interfaces/response/post'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Back } from '@/assets/icons/back_arrow.svg'
import { useDebounceFn, useRequest } from 'ahooks'
import { useDetail } from '@/hooks/useDetail'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useUserInfo } from '@/hooks/useUserInfo'
import {
  HeartOutline,
  SendOutline,
  MessageOutline,
  HeartFill,
  MoreOutline,
  DeleteOutline
} from 'antd-mobile-icons'
import { Action } from 'antd-mobile/es/components/popover'
const Detail = () => {
  const params = useParams()
  const { user } = useUserInfo()
  const id = params.id as string
  const {
    type,
    post,
    comments,
    hasNext,
    loadmore,
    setPost,
    setType,
    load,
    ThumbsUp,
    CancelThumbsUp,
    handleDelete
  } = useDetail(id)
  const [visible, setVisible] = useState(false)
  const [isLike, setIsLike] = useState(post.isLike)
  const [inView, setInView] = useState(true)
  const navigator = useNavigate()
  const renderType = {
    [EPostType.Comment]: <Comment {...post} />,
    [EPostType.Post]: <Post {...post} />,
    [EPostType.Forward]: <Post {...post} />,
    [EPostType.Delete]: <div className={styles.delete}>该贴已删除</div>
  }

  // 请求数据
  const { loading, run } = useRequest(load)

  useEffect(() => {
    run()
    setIsLike(post.isLike)
  }, [id, load, post.isLike, run])

  // 评论按钮点击
  const handleCommentClick = (post: IPostItem) => {
    post && setPost(post)
    setType(EPostType.Comment)
    setVisible(true)
  }
  // 转发按钮点击
  const handleForwardClick = (post: IPostItem) => {
    post && setPost(post)
    setType(EPostType.Forward)
    setVisible(true)
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
    { wait: 800 }
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

  // 下滑判断顶部tab
  const { ref } = useInView({
    threshold: 0,
    initialInView: true,
    onChange: (inView) => {
      setInView(inView)
    }
  })

  // 删除帖子
  const deletePost = () => {
    Dialog.confirm({
      content: '删除后不可恢复，确定删除吗？',
      confirmText: <span className={styles.confirmText}>删除</span>,
      onConfirm: async () => {
        handleDelete()
        navigator(EPagePath.HOME)
      }
    })
  }

  const actions: Action[] = [
    {
      key: 'scan',
      icon: <DeleteOutline />,
      text: '删除',
      onClick: () => deletePost()
    }
  ]

  // 链接至用户主页
  const linkToUser = (e: React.MouseEvent<HTMLImageElement, Event>) => {
    navigator(EPagePath.PERSONAL_HOME.replace(':userId', post.userId))
    e.stopPropagation()
  }
  return (
    <div className={styles.detailWrapper}>
      <NavBar
        className={styles.navbar}
        backArrow={<Back />}
        onBack={() => navigator(-1)}
        left={
          loading ? null : (
            <div className={inView ? styles.hiddenHeader : styles.showHeader}>
              <Avatar
                className={styles.avatar}
                src={post.user.avatar || ''}
                onClick={(e) => linkToUser(e)}
              />
              <h4 className={styles.userId}>{post.user.userId}</h4>
            </div>
          )
        }
        right={
          user.userId === post.userId && (
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
          )
        }
      >
        <h4 className={inView ? styles.showTitle : styles.hiddenTitle}>
          主题帖
        </h4>
      </NavBar>
      {post.type === EPostType.Delete ? (
        <Navigate to={EPagePath.NOT_FOUND} />
      ) : (
        <>
          {loading ? (
            <DetailSkeleton />
          ) : (
            <div ref={ref}>{renderType[post.type]}</div>
          )}
          <div className={styles.numbers}>
            <span className={styles.number}>{post.forwards}</span>
            <span>转发</span>
            <span className={styles.number}>{post.likes}</span>
            <span>喜欢</span>
          </div>
          <div className={styles.icons}>
            <MessageOutline
              className={styles.footerIcon}
              onClick={() => handleCommentClick(post)}
            />
            <SendOutline
              className={styles.footerIcon}
              onClick={() => handleForwardClick(post)}
            />
            <div className={styles.heartBlast}>
              {isLike ? (
                <HeartFill
                  className={styles.footerIcon + ` ${styles.like}`}
                  onClick={(e) => cancelLikePost(e)}
                />
              ) : (
                <HeartOutline
                  className={styles.footerIcon + ` ${styles.heartAnimation}`}
                  onClick={(e) => onHeartClick(e)}
                />
              )}
              <span className={styles.dot} />
            </div>
          </div>
        </>
      )}
      {loading ? (
        <PostItemSkeleton count={2} />
      ) : (
        <CustomList
          className={styles.list}
          list={comments}
          hasMore={hasNext}
          loadMore={loadmore}
          onRefresh={load}
        >
          {comments.map(
            (comment) =>
              comment.user && (
                <PostItem
                  key={comment._id}
                  post={comment}
                  onForward={() => handleForwardClick(comment)}
                  onComment={() => handleCommentClick(comment)}
                />
              )
          )}
        </CustomList>
      )}
      <NewPostPopup
        type={type}
        post={post}
        onClose={() => load()}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  )
}

export default Detail
