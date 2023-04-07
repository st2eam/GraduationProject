import { useUserInfo } from '@/hooks/useUserInfo'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ReactComponent as UpIcon } from '@/assets/icons/up.svg'
import { ReactComponent as BackIcon } from '@/assets/icons/back_arrow.svg'
import { List, NavBar, SearchBar } from 'antd-mobile'
import { IPostItem } from '@/interfaces/response/post'
import { EPostType } from '@/enums/model'
import { EPagePath, ESearchTab } from '@/enums/page'
import { CloseOutline } from 'antd-mobile-icons'
import useSearch from '@/hooks/useSearch'
import styles from './style.module.scss'
import PostItem from '@/components/PostItem'
import NewPostPopup from '@/components/NewPostPopup'
import FollowItem from '../Follow/FollowItem'
import CustomSwiperTab, { ITab } from '@/components/CustomSwiperTab'
import CustomList from '@/components/CustomList'
import CustomEmpty from '@/components/CustomEmpty'
import PostItemSkeleton from '@/components/PostItem/PostItemSkeleton'

function Search() {
  const [searchContent, setSearchContent] = useState<string>('')
  const [type, setType] = useState<EPostType>(EPostType.Post)
  const [post, setPost] = useState<IPostItem>({} as IPostItem)
  const [resultVisiable, setResultVisiable] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [backVisiable, setBackVisiable] = useState(false)
  const { user: self, handleFollowUser, handleUnfollowUser } = useUserInfo()
  const tabs: ITab[] = [
    { key: ESearchTab.POST, title: '贴子' },
    { key: ESearchTab.USER, title: '用户' },
    { key: ESearchTab.IMAGE_POST, title: '图片' }
  ]
  const {
    searchList,
    postList: posts,
    setPostList,
    loadMore: loadMorePosts,
    hasNext: hasNextPost,
    getResults: getPosts,
    getSearchHistory,
    addSearchHistory,
    clearSearchHistory
  } = useSearch(ESearchTab.POST)

  const {
    postList: imgPosts,
    loadMore: loadMoreImgPosts,
    setPostList: setImgPosts,
    hasNext: hasNextImgPost,
    getResults: getImgPosts
  } = useSearch(ESearchTab.IMAGE_POST)

  const {
    userList,
    setUserList,
    loadMore: loadMoreUsers,
    hasNext: hasNextUser,
    getResults: getUsers
  } = useSearch(ESearchTab.USER)

  useEffect(() => {
    getSearchHistory()
  }, [getSearchHistory])

  // 获取搜索结果
  const handleSearch = async (keyword: string) => {
    if (keyword.trim().length !== 0) {
      setSearchContent(keyword)
      addSearchHistory(keyword)
      setBackVisiable(true)
      setResultVisiable(true)
      await getPosts({ keyword })
      await getUsers({ keyword })
      await getImgPosts({ keyword })
    }
  }

  // 下拉刷新
  const handleRefresh = async (type: ESearchTab) => {
    ESearchTab.IMAGE_POST === type &&
      (await getImgPosts({ keyword: searchContent }))
    ESearchTab.POST === type && (await getPosts({ keyword: searchContent }))
    ESearchTab.USER === type && (await getUsers({ keyword: searchContent }))
  }

  // 当关键字改变时，设置0.4s的防抖搜索
  const { loading, run: search } = useRequest(handleSearch, {
    debounceWait: 400,
    manual: true
  })

  const handleChange = (keyword: string) => {
    setSearchContent(keyword)
    search(keyword)
  }

  // 点击返回按钮
  const onBack = () => {
    setBackVisiable(false)
    setResultVisiable(false)
    setSearchContent('')
  }

  // 点击删除时
  const onDelete = {
    [ESearchTab.POST]: (post: IPostItem) => {
      setPostList(posts.filter((item) => item._id !== post._id))
    },
    [ESearchTab.IMAGE_POST]: (post: IPostItem) => {
      setImgPosts(imgPosts.filter((item) => item._id !== post._id))
    }
  }

  // 点击评论按钮
  const onCommentClick = (post: IPostItem) => {
    setPost(post)
    setType(EPostType.Comment)
    setPopupVisible(true)
  }

  // 点击转发按钮
  const onForwardClick = (post: IPostItem) => {
    setPost(post)
    setType(EPostType.Forward)
    setPopupVisible(true)
  }

  // 点击用户Item
  const navigate = useNavigate()
  const onUserItemClick = (id: string) => {
    navigate(EPagePath.PERSONAL_HOME.replace(':userId', id))
  }

  // 点击关注按钮
  const onFollow = async (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const res = userList[index].haveFollowed
      ? await handleUnfollowUser({ id: userList[index].userId })
      : await handleFollowUser({ id: userList[index].userId })
    if (res) {
      userList[index].haveFollowed = !userList[index].haveFollowed
      setUserList(userList)
    }
  }

  return (
    <div className={styles.searchWrapper}>
      <NavBar
        className={styles.nav}
        backArrow={backVisiable && <BackIcon onClick={onBack}></BackIcon>}
      >
        <SearchBar
          placeholder="搜索"
          value={searchContent}
          onChange={(value) => handleChange(value)}
          onSearch={(value) => search(value)}
        />
      </NavBar>
      {resultVisiable ? (
        <CustomSwiperTab
          tabs={tabs}
          className={styles.swiperTabs}
          swiperClassName={styles.swiper}
          swiperItems={[
            {
              key: ESearchTab.POST,
              content: loading ? (
                <PostItemSkeleton />
              ) : (
                <CustomList
                  list={posts}
                  className={styles.list}
                  onRefresh={() => handleRefresh(ESearchTab.POST)}
                  loadMore={() => loadMorePosts({ keyword: searchContent })}
                  hasMore={hasNextPost}
                >
                  {posts.map((post) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      onForward={() => onForwardClick(post)}
                      onComment={() => onCommentClick(post)}
                      onDelete={() => onDelete[ESearchTab.POST](post)}
                    />
                  ))}
                </CustomList>
              )
            },
            {
              key: ESearchTab.USER,
              content: loading ? (
                <PostItemSkeleton />
              ) : (
                <CustomList
                  list={userList}
                  className={styles.list}
                  onRefresh={() => handleRefresh(ESearchTab.USER)}
                  loadMore={() => loadMoreUsers({ keyword: searchContent })}
                  hasMore={hasNextUser}
                >
                  {userList.map((user, index) => (
                    <FollowItem
                      key={user._id}
                      user={user}
                      isSelf={user._id === self._id}
                      onItemClick={() => onUserItemClick(user.userId)}
                      onFollowBtnClick={(e) => onFollow(e, index)}
                      haveFollowed={user.haveFollowed}
                    />
                  ))}
                </CustomList>
              )
            },
            {
              key: ESearchTab.IMAGE_POST,
              content: loading ? (
                <PostItemSkeleton />
              ) : (
                <CustomList
                  list={imgPosts}
                  className={styles.list}
                  onRefresh={() => handleRefresh(ESearchTab.IMAGE_POST)}
                  loadMore={() => loadMoreImgPosts({ keyword: searchContent })}
                  hasMore={hasNextImgPost}
                >
                  {imgPosts.map((post) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      onDelete={() => onDelete[ESearchTab.IMAGE_POST](post)}
                      onForward={() => onForwardClick(post)}
                      onComment={() => onCommentClick(post)}
                    />
                  ))}
                </CustomList>
              )
            }
          ]}
        />
      ) : (
        <>
          {searchList.length !== 0 ? (
            <NavBar
              left={<span>最近搜索</span>}
              right={
                <CloseOutline
                  fontSize={24}
                  onClick={() => clearSearchHistory()}
                />
              }
              back={null}
            ></NavBar>
          ) : null}
          <CustomEmpty isEmpty={searchList.length === 0}>
            <List className={styles.list}>
              {searchList.map((item) => (
                <List.Item
                  key={item.keyword}
                  arrow={<UpIcon />}
                  onClick={() => {
                    search(item.keyword)
                  }}
                >
                  {item.keyword}
                </List.Item>
              ))}
            </List>
          </CustomEmpty>
        </>
      )}
      <NewPostPopup
        type={type}
        post={post}
        visible={popupVisible}
        onClose={() => search(searchContent)}
        setVisible={setPopupVisible}
      />
    </div>
  )
}
export default Search
