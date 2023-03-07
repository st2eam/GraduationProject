import { ReactComponent as NotifyIcon } from '@/assets/icons/notify_outline.svg'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useContext, useEffect, useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { useNavigate } from 'react-router-dom'
import { useMount, useRequest } from 'ahooks'
import { newPostContext } from '@/hooks/store'
import { IPostItem } from '@/interfaces/response/post'
import { EPostType } from '@/enums/model'
import { EPageName, EPagePath } from '@/enums/page'
import { Avatar } from 'antd-mobile'
import styles from './style.module.scss'
import PostItem from '@/components/PostItem'
import NewPostPopup from '@/components/NewPostPopup'
import HomeSideMenu from './HomeSideMenu'
import CustomList from '@/components/CustomList'
import PostItemSkeleton from '@/components/PostItem/PostItemSkeleton'

function Home() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [type, setType] = useState<EPostType>(EPostType.Post)
  const [post, setPost] = useState<IPostItem>({} as IPostItem)
  const { posts, hasNext, getPosts, setPosts, loadMore } = usePosts(
    EPageName.HOME
  )
  const { newPost, setNewPost } = useContext(newPostContext)
  const { user } = useUserInfo()
  const navigate = useNavigate()

  useMount(() => {
    onRefresh()
  })
  // 请求数据
  const { loading, run } = useRequest(() => getPosts({}))

  useEffect(() => {
    if (!!newPost) {
      run()
    }
  }, [newPost, run])

  const onRefresh = () => {
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

  const onDeleteClick = (post: IPostItem) => {
    setPosts(posts.filter((item) => item._id !== post._id))
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
      {loading ? (
        <PostItemSkeleton />
      ) : (
        <CustomList
          list={posts}
          className={styles.list}
          hasMore={hasNext}
          loadMore={() => loadMore({})}
          onRefresh={async () => {
            getPosts({})
            setNewPost('')
          }}
        >
          {posts &&
            posts.map((post) => (
              <PostItem
                key={post._id}
                post={post}
                onDelete={() => onDeleteClick(post)}
                onForward={() => onForwardClick(post)}
                onComment={() => onCommentClick(post)}
              />
            ))}
        </CustomList>
      )}
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
