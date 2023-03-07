import CustomList from '@/components/CustomList'
import CustomSwiperTab, { ITab } from '@/components/CustomSwiperTab'
import FollowItem from './FollowItem'
import styles from './style.module.scss'
import { EFollowTab, EPagePath } from '@/enums/page'
import { IUserFollowItemResp } from '@/interfaces/response/user'
import { NavBar } from 'antd-mobile'
import { ReactComponent as BackArrowIcon } from '@/assets/icons/back_arrow.svg'
import { useEffect, useState, MouseEvent, useCallback } from 'react'
import { useFollows } from '@/hooks/useFollows'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useRequest } from 'ahooks'
import CustomDotLoading from '@/components/CustomDotLoading'

interface IState {
  activeKey: EFollowTab
}
interface IClickFollowBtn {
  target: IUserFollowItemResp[]
  setTarget: (follows: IUserFollowItemResp[]) => void
  index: number
}

function Follow() {
  const navigate = useNavigate()
  const {
    user,
    otherUser,
    handleGetUserInfo,
    handleFollowUser,
    handleUnfollowUser
  } = useUserInfo()
  // 当前用户id
  const { userId } = useParams()
  // 判断是否不是自己的页面
  const isOthers = userId !== user.userId
  const location = useLocation()
  // get user info
  useEffect(() => {
    handleGetUserInfo({ userId }, isOthers)
  }, [handleGetUserInfo, isOthers, userId])
  // 正在关注
  const {
    follows,
    setFollows,
    getFollows,
    loadMore: loadMoreFollows,
    hasNext: hasNextFollows
  } = useFollows(EFollowTab.FOLLOW)
  // 关注者
  const {
    follows: subscribes,
    setFollows: setSubscribes,
    getFollows: getSubscribes,
    loadMore: loadMoreSubscribes,
    hasNext: hasNextSubscribes
  } = useFollows(EFollowTab.SUBSCRIBE)
  // tabs
  const tabs: ITab[] = [
    { key: EFollowTab.SUBSCRIBE, title: '关注者' },
    { key: EFollowTab.FOLLOW, title: '正在关注' }
  ]
  // 默认激活的tab
  const { activeKey = EFollowTab.FOLLOW } = (location.state as IState) ?? {}
  const initActiveIndex = tabs.findIndex((tab) => tab.key === activeKey)
  // 记录activeIndex，以此完成判断当前所在tab完成click操作
  const [activeIndex, setActiveIndex] = useState(initActiveIndex)
  const handleFollowRequest = useCallback(async () => {
    try {
      await Promise.all([
        getFollows({ id: userId }),
        getSubscribes({ id: userId })
      ])
    } catch (error) {}
  }, [getFollows, getSubscribes, userId])
  // get follows & subscribes
  const { loading } = useRequest(handleFollowRequest)

  // 下拉刷新
  const handleRefresh = async (type: EFollowTab) => {
    EFollowTab.FOLLOW === type && (await getFollows({ id: userId }))
    EFollowTab.SUBSCRIBE === type && (await getSubscribes({ id: userId }))
  }

  const handleFollowBtnClick = async (
    { target, setTarget, index }: IClickFollowBtn,
    e: MouseEvent
  ) => {
    e.stopPropagation() // 阻止冒泡
    const _hasFollowed = target[index].hasFollowed
    const res = _hasFollowed
      ? await handleUnfollowUser({ id: target[index].user.userId })
      : await handleFollowUser({ id: target[index].user.userId })
    if (res) {
      target[index].hasFollowed = !_hasFollowed
      setTarget([...target])
      if (!isOthers) {
        // 判断是否是自己的follow页面，若是则执行同步操作，若不是则不执行
        if (activeIndex === 0) {
          // 如果在关注我的列表
          if (_hasFollowed) {
            // 如果当前状态是关注中，则再次点击是取关, 去除我的关注列表的关注
            const _follows = follows.filter(
              (item) => item.followId !== subscribes[index].userId
            )
            setFollows(_follows)
          } else {
            // 如果当前状态是回关，则再次点击是关注，判断当前我的关注数组中是否已有该对象，
            // 若没有将userId与followId倒置插入数组第一条，若有则同步状态即可
            const isExist = follows.findIndex(
              (follow) => follow.followId === target[index].userId
            )
            if (isExist === -1) {
              const _follows = [
                {
                  ...target[index],
                  userId: target[index].followId,
                  followId: target[index].userId
                },
                ...follows
              ]
              setFollows(_follows)
            } else {
              follows[isExist].hasFollowed = target[index].hasFollowed
              setFollows([...follows])
            }
          }
        } else if (activeIndex === 1) {
          // 如果在我的关注列表，只需要将hasFollowed改变同步到关注我的列表即可
          for (const subscribe of subscribes) {
            if (subscribe.userId === target[index].followId) {
              subscribe.hasFollowed = target[index].hasFollowed
              break
            }
          }
          setSubscribes([...subscribes])
        }
      }
    }
  }

  return (
    <div className={styles.followWrapper}>
      <NavBar
        className={styles.navBar}
        backArrow={<BackArrowIcon />}
        onBack={() => navigate(-1)}
      >
        <span className={styles.nickname}>
          {isOthers ? otherUser.nickname : user.nickname}
        </span>
      </NavBar>
      <CustomSwiperTab
        tabs={tabs}
        swiperItems={[
          {
            key: EFollowTab.SUBSCRIBE,
            content: loading ? (
              <CustomDotLoading />
            ) : (
              <CustomList
                className={styles.content}
                list={subscribes}
                onRefresh={() => handleRefresh(EFollowTab.SUBSCRIBE)}
                loadMore={() => loadMoreSubscribes({ id: userId })}
                hasMore={hasNextSubscribes}
              >
                {subscribes.map((subscribe, index) => (
                  <FollowItem
                    key={subscribe._id}
                    user={subscribe.user}
                    isSelf={subscribe.user.userId === user.userId}
                    unfollowText={isOthers ? '关注' : '回关'}
                    hasFollowed={subscribe.hasFollowed}
                    onItemClick={() =>
                      navigate(
                        EPagePath.PERSONAL_HOME.replace(
                          ':userId',
                          subscribe.user.userId
                        )
                      )
                    }
                    onFollowBtnClick={(e) =>
                      handleFollowBtnClick(
                        {
                          target: subscribes,
                          setTarget: setSubscribes,
                          index
                        },
                        e
                      )
                    }
                  />
                ))}
              </CustomList>
            )
          },
          {
            key: EFollowTab.FOLLOW,
            content: loading ? (
              <CustomDotLoading />
            ) : (
              <CustomList
                className={styles.content}
                list={follows}
                onRefresh={() => handleRefresh(EFollowTab.FOLLOW)}
                loadMore={() => loadMoreFollows({ id: userId })}
                hasMore={hasNextFollows}
              >
                {follows.map((follow, index) => (
                  <FollowItem
                    key={follow._id}
                    user={follow.user}
                    isSelf={follow.user.userId === user.userId}
                    hasFollowed={follow.hasFollowed}
                    onItemClick={() =>
                      navigate(
                        EPagePath.PERSONAL_HOME.replace(
                          ':userId',
                          follow.user.userId
                        )
                      )
                    }
                    onFollowBtnClick={(e) =>
                      handleFollowBtnClick(
                        {
                          target: follows,
                          setTarget: setFollows,
                          index
                        },
                        e
                      )
                    }
                  />
                ))}
              </CustomList>
            )
          }
        ]}
        initActiveIndex={initActiveIndex}
        className={styles.swiperTab}
        swiperClassName={styles.swiper}
        tabClassName={styles.tabs}
        onChange={(index) => setActiveIndex(index)}
      />
    </div>
  )
}
export default Follow
