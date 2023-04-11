import { ReactComponent as NotifyIcon } from '@/assets/icons/notify_outline.svg'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useCallback, useContext, useEffect, useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { useNavigate } from 'react-router-dom'
import { useMount, useRequest } from 'ahooks'
import { newPostContext } from '@/hooks/store'
import { IPostItem } from '@/interfaces/response/post'
import { EPostType } from '@/enums/model'
import { EHomeTab, EPageName, EPagePath } from '@/enums/page'
import { Avatar } from 'antd-mobile'
import styles from './style.module.scss'
import PostItem from '@/components/PostItem'
import NewPostPopup from '@/components/NewPostPopup'
import HomeSideMenu from './HomeSideMenu'
import CustomList from '@/components/CustomList'
import PostItemSkeleton from '@/components/PostItem/PostItemSkeleton'
import CustomSwiperTab, { ITab } from '@/components/CustomSwiperTab'

function Home() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [type, setType] = useState<EPostType>(EPostType.Post)
  const [post, setPost] = useState<IPostItem>({} as IPostItem)
  const { newPost, setNewPost } = useContext(newPostContext)
  const { user } = useUserInfo()
  const navigate = useNavigate()
  const {
    posts,
    hasNext,
    getPosts,
    setPosts,
    loadMore,
    get_similar_post,
    get_recommend_post
  } = usePosts(EPageName.HOME)
  const {
    posts: followPosts,
    hasNext: hasNextFollow,
    getPosts: getFollowPosts,
    setPosts: setFollowPosts,
    loadMore: loadMoreFollow
  } = usePosts(EPageName.FOLLOW)

  const tabs: ITab[] = [
    { key: EHomeTab.RECOMMEND, title: '推荐' },
    { key: EHomeTab.FOLLOW, title: '关注' }
  ]
  useMount(() => {
    append_recommend_posts()
    onRefresh()
  })
  // 请求数据
  const { loading, run } = useRequest(() => getPosts({}))
  const { loading: loading_follow, run: run_follow } = useRequest(() =>
    getFollowPosts({})
  )
  useEffect(() => {
    if (!!newPost) {
      run()
      run_follow()
    }
  }, [newPost, run, run_follow])

  const append_similar_posts = useCallback(() => {
    followPosts.forEach(async (item, index) => {
      if (item.isLike) {
        const res = await get_similar_post(item._id)
        res && followPosts.splice(index + 1, 0, res)
      }
    })
  }, [get_similar_post, followPosts])

  const append_recommend_posts = useCallback(async () => {
    const res = await get_recommend_post()
    res &&
      res.items.length !== 0 &&
      setPosts((items) => res.items.concat(items))
  }, [get_recommend_post, setPosts])

  useEffect(() => {
    if (!loading_follow) {
      append_similar_posts()
    }
  }, [append_similar_posts, loading_follow])

  const onRefresh = () => {
    run_follow()
    run()
    setType(EPostType.Post)
    setPost(posts[0])
    setNewPost('')
  }

  const onCommentClick = (post: IPostItem) => {
    setPost(post)
    setType(EPostType.Comment)
    setPopupVisible(true)
  }

  const onForwardClick = (post: IPostItem) => {
    setPost(post)
    setType(EPostType.Forward)
    setPopupVisible(true)
  }
  const onDeleteClick = {
    [EHomeTab.RECOMMEND]: (post: IPostItem) => {
      setPosts(posts.filter((item) => item._id !== post._id))
    },
    [EHomeTab.FOLLOW]: (post: IPostItem) => {
      setFollowPosts(followPosts.filter((item) => item._id !== post._id))
    }
  }
  return (
    <div className={styles.homeWrapper}>
      <div className={styles.navBar}>
        <div onClick={() => setSideMenuVisible(true)}>
          <Avatar src={user.avatar || ''} className={styles.avatar} />
        </div>
        <Logo className={styles.logo} />
        <NotifyIcon
          className={styles.notify}
          onClick={() => navigate(EPagePath.NOTIFY)}
        />
      </div>
      <CustomSwiperTab
        tabs={tabs}
        className={styles.swiperTabs}
        swiperClassName={styles.swiper}
        swiperItems={[
          {
            key: EHomeTab.RECOMMEND,
            content: loading ? (
              <PostItemSkeleton />
            ) : (
              <CustomList
                list={posts}
                className={styles.list}
                hasMore={hasNext}
                loadMore={() => loadMore({})}
                onRefresh={async () => {
                  append_recommend_posts()
                  setNewPost('')
                }}
              >
                {posts &&
                  posts.map((post) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      onDelete={() => onDeleteClick[EHomeTab.RECOMMEND](post)}
                      onForward={() => onForwardClick(post)}
                      onComment={() => onCommentClick(post)}
                    />
                  ))}
              </CustomList>
            )
          },
          {
            key: EHomeTab.FOLLOW,
            content: loading_follow ? (
              <PostItemSkeleton />
            ) : (
              <CustomList
                list={followPosts}
                className={styles.list}
                hasMore={hasNextFollow}
                loadMore={() => loadMoreFollow({})}
                onRefresh={async () => {
                  getFollowPosts({})
                  setNewPost('')
                }}
              >
                {followPosts &&
                  followPosts.map((post) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      onDelete={() => onDeleteClick[EHomeTab.FOLLOW](post)}
                      onForward={() => onForwardClick(post)}
                      onComment={() => onCommentClick(post)}
                    />
                  ))}
              </CustomList>
            )
          }
        ]}
      />
      <NewPostPopup
        type={type}
        post={post}
        visible={popupVisible}
        onClose={() => onRefresh()}
        setVisible={setPopupVisible}
      />
      <HomeSideMenu visible={sideMenuVisible} setVisible={setSideMenuVisible} />
    </div>
  )
}
export default Home
