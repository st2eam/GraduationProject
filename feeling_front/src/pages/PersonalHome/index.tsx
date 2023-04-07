import { useUserInfo } from '@/hooks/useUserInfo'
import { useRequest } from 'ahooks'
import { usePosts } from '@/hooks/usePosts'
import { useNavigate, useParams } from 'react-router-dom'
import { newPostContext } from '@/hooks/store'
import { ReactComponent as BackArrowIcon } from '@/assets/icons/back_arrow.svg'
import { NavBar, Image } from 'antd-mobile'
import { EPageName, EPagePath, EPersonalHomeTab } from '@/enums/page'
import styles from './style.module.scss'
import defaultBannerImage from '@/assets/images/default.png'
import classnames from 'classnames'
import UserInfoBoardSkeleton from './UserInfoBoardSkeleton'
import UserInfoBoard from './UserInfoBoard'
import PostItem from '@/components/PostItem'
import CustomSwiperTab, { ITab } from '@/components/CustomSwiperTab'
import CustomList from '@/components/CustomList'
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { IPostItem } from '@/interfaces/response/post'
import { useInView } from 'react-intersection-observer'
import PostItemSkeleton from '@/components/PostItem/PostItemSkeleton'

function PersonalHome() {
  const tabs: ITab[] = [
    { key: EPersonalHomeTab.POST, title: '帖子' },
    { key: EPersonalHomeTab.IMAGE_POST, title: '图片' },
    { key: EPersonalHomeTab.LIKE_POST, title: '喜欢' }
  ]
  const navigate = useNavigate()
  const { newPost } = useContext(newPostContext)
  const { user, otherUser, haveFollowed, sethaveFollowed, handleGetUserInfo } =
    useUserInfo()
  const { userId } = useParams()
  const isOthers = userId !== user.userId
  const { posts, getPosts, setPosts, loadMore, hasNext } = usePosts(
    EPageName.PERSONAL_HOME,
    EPersonalHomeTab.POST
  )
  const {
    posts: imgPosts,
    getPosts: getImgPosts,
    setPosts: setImgPosts,
    loadMore: loadMoreImgPosts,
    hasNext: hasNextImgPosts
  } = usePosts(EPageName.PERSONAL_HOME, EPersonalHomeTab.IMAGE_POST)
  const {
    posts: likePosts,
    getPosts: getLikePosts,
    setPosts: setLikePosts,
    loadMore: loadMoreLikePosts,
    hasNext: hasNextLikePosts
  } = usePosts(EPageName.PERSONAL_HOME, EPersonalHomeTab.LIKE_POST)
  // 该页面请求
  const handleUserRequest = async () => {
    await handleGetUserInfo({ userId }, isOthers)
  }

  const handlePostRequest = useCallback(async () => {
    try {
      await Promise.all([
        getPosts({ id: userId }),
        getImgPosts({ id: userId }),
        getLikePosts({ id: userId })
      ])
    } catch (error) {}
  }, [getImgPosts, getLikePosts, getPosts, userId])

  const linkToPostDetail = useCallback(
    (postId: string) => {
      navigate(EPagePath.DETAIL.replace(':id', postId))
    },
    [navigate]
  )

  // 监听是否有新帖子
  useEffect(() => {
    if (!!newPost) {
      handlePostRequest()
    }
  }, [handlePostRequest, newPost])

  // 监听是否有刷新
  useEffect(() => {
    if (!!newPost) {
      handlePostRequest()
    }
  }, [handlePostRequest, newPost])

  const onDelete = {
    [EPersonalHomeTab.POST]: (post: IPostItem) => {
      setPosts(posts.filter((item) => item._id !== post._id))
    },
    [EPersonalHomeTab.IMAGE_POST]: (post: IPostItem) => {
      setImgPosts(imgPosts.filter((item) => item._id !== post._id))
    },
    [EPersonalHomeTab.LIKE_POST]: (post: IPostItem) => {
      setLikePosts(likePosts.filter((item) => item._id !== post._id))
    }
  }

  // 下拉刷新
  const handleRefresh = async (type: EPersonalHomeTab) => {
    EPersonalHomeTab.POST === type && (await getPosts({ id: userId }))
    EPersonalHomeTab.IMAGE_POST === type && (await getImgPosts({ id: userId }))
    EPersonalHomeTab.LIKE_POST === type && (await getLikePosts({ id: userId }))
  }

  // 请求数据
  const { loading } = useRequest(handleUserRequest)
  const { loading: postLoading } = useRequest(handlePostRequest)
  // 监听整体页面滚动控制tabBar样式
  const [isViewPost, setIsViewPost] = useState(false)
  const pHomeRef = useRef<HTMLDivElement>(null)
  const { ref } = useInView({
    initialInView: true,
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
        setIsViewPost(false)
      }
      if (!inView) {
        setIsViewPost(true)
      }
    }
  })

  return (
    <div className={styles.personalHomeWrapper} ref={pHomeRef}>
      {/* 头部 */}
      <NavBar
        className={classnames(styles.navBar, {
          [styles.viewPost]: isViewPost
        })}
        backArrow={
          <div className={styles.iconBox}>
            <BackArrowIcon />
          </div>
        }
        onBack={() => navigate(-1)}
      >
        <span className={styles.title}>
          {isOthers ? otherUser.userId : user.userId}
        </span>
      </NavBar>
      {/* banner */}
      <Image
        className={styles.banner}
        src={
          ((isOthers ? otherUser.banner : user.banner) || defaultBannerImage) +
          '?x-oss-process=image/quality,q_20'
        }
        fit="cover"
        onClick={() => {
          !isOthers && navigate(EPagePath.PERSONAL_DATA)
        }}
      />
      {/* 用户信息 */}
      {loading ? (
        <UserInfoBoardSkeleton />
      ) : (
        <div ref={ref}>
          <UserInfoBoard
            className={classnames(styles.userInfoWrapper, {
              [styles.viewPost]: isViewPost
            })}
            user={isOthers ? otherUser : user}
            isOthers={isOthers}
            haveFollowed={haveFollowed}
            sethaveFollowed={sethaveFollowed}
          />
        </div>
      )}
      {/* 帖子 */}
      <CustomSwiperTab
        tabs={tabs}
        swiperItems={[
          {
            key: EPersonalHomeTab.POST,
            content: postLoading ? (
              <PostItemSkeleton count={2} />
            ) : (
              <CustomList
                list={posts}
                className={classnames(styles.list, {
                  [styles.viewPost]: isViewPost
                })}
                onRefresh={() => handleRefresh(EPersonalHomeTab.POST)}
                loadMore={() => loadMore({ id: userId })}
                hasMore={hasNext}
              >
                {posts.map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    onComment={() => linkToPostDetail(post._id)}
                    onForward={() => linkToPostDetail(post._id)}
                    onDelete={() => onDelete[EPersonalHomeTab.POST](post)}
                  />
                ))}
              </CustomList>
            )
          },
          {
            key: EPersonalHomeTab.IMAGE_POST,
            content: postLoading ? (
              <PostItemSkeleton count={2} />
            ) : (
              <CustomList
                list={imgPosts}
                className={classnames(styles.list, {
                  [styles.viewPost]: isViewPost
                })}
                onRefresh={() => handleRefresh(EPersonalHomeTab.IMAGE_POST)}
                loadMore={() => loadMoreImgPosts({ id: userId })}
                hasMore={hasNextImgPosts}
              >
                {imgPosts.map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    onComment={() => linkToPostDetail(post._id)}
                    onForward={() => linkToPostDetail(post._id)}
                    onDelete={() => onDelete[EPersonalHomeTab.IMAGE_POST](post)}
                  />
                ))}
              </CustomList>
            )
          },
          {
            key: EPersonalHomeTab.LIKE_POST,
            content: postLoading ? (
              <PostItemSkeleton count={2} />
            ) : (
              <CustomList
                list={likePosts}
                className={classnames(styles.list, {
                  [styles.viewPost]: isViewPost
                })}
                onRefresh={() => handleRefresh(EPersonalHomeTab.LIKE_POST)}
                loadMore={() => loadMoreLikePosts({ id: userId })}
                hasMore={hasNextLikePosts}
              >
                {likePosts.map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    onComment={() => linkToPostDetail(post._id)}
                    onForward={() => linkToPostDetail(post._id)}
                    onDelete={() => onDelete[EPersonalHomeTab.LIKE_POST](post)}
                  />
                ))}
              </CustomList>
            )
          }
        ]}
        className={styles.swiperTab}
        swiperClassName={styles.swiper}
        tabClassName={styles.tabs}
      />
    </div>
  )
}
export default PersonalHome
