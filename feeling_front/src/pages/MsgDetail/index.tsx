import { useNavigate, useParams } from 'react-router-dom'
import { useMount, useRequest, useUnmount } from 'ahooks'
import { useInView } from 'react-intersection-observer'
import { useContext, useEffect, useRef, useState } from 'react'
import { directMsgWithFriends } from '@/hooks/store'
import { ReactComponent as ImageIcon } from '../../assets/icons/imgMsg.svg'
import { ReactComponent as BackIcon } from '@/assets/icons/back_arrow.svg'
import { IDirectMsgItem } from '@/interfaces/response/message'
import { IDeleteDirectMsg } from '@/interfaces/request/directMsg'
import { EMsgStatus, EMsgType } from '@/enums/model'
import { CloseCircleFill } from 'antd-mobile-icons'
import { Button, NavBar, Image, Toast, TextArea } from 'antd-mobile'
import useMessage from '@/hooks/useMessage'
import styles from './style.module.scss'
import classNames from 'classnames'
import MsgDetailItem from './MsgDetailItem'
import { useUserInfo } from '@/hooks/useUserInfo'
import { EPagePath } from '@/enums/page'

function MsgDetail() {
  const navigate = useNavigate()
  const params = useParams()
  const { user } = useUserInfo()
  const { FriendId, FriendName } = params
  // 如果用户通过手动输入的FriendId地址和自己通话，进行拦截
  useEffect(() => {
    if (user.userId === FriendId) {
      navigate(EPagePath.MESSAGE)
      Toast.show({
        icon: 'fail',
        content: '不能和自己私信'
      })
    }
  },[FriendId, navigate, user])
  const { setInChatFriendId } = useContext(directMsgWithFriends)
  const [content, setContent] = useState<string>('')
  const {
    directMsgList,
    fileList,
    unReadCountWithOnePeople,
    newMsgId,
    msgDetailLimit,
    imgCopy,
    hasNextMsg,
    handleImgsChange,
    handleImageClick,
    getNewMsgWithOneFriend,
    getEarlierMsg,
    getDirectMsg,
    deleteImg,
    deleteDirectMsg,
    createDirectMsg
  } = useMessage(FriendId)

  const [isFirstEnter, setIsFirstEnter] = useState(true)
  const [newMsgHint, setNewMsgHint] = useState(false)
  const { loading } = useRequest(getDirectMsg)
  const { loading: loadingEarlierMsg, run } = useRequest(getEarlierMsg, {
    manual: true
  })
  const { run: runNewMsg } = useRequest(
    async () => {
      const newMsgCount = await getNewMsgWithOneFriend()
      if (newMsgCount && newMsgCount > 0 && !hideInView) {
        setNewMsgHint(true)
      }
    },
    {
      pollingInterval: 1000,
      manual: true
    }
  )

  useMount(() => {
    FriendId && setInChatFriendId(FriendId)
  })
  useUnmount(() => {
    FriendId && setInChatFriendId('')
  })

  // 页面滚动加载更多
  const chatListRef = useRef<HTMLDivElement>(null)
  const [lastScrollHeight, setLastScrollHeight] = useState(0)
  const { ref } = useInView({
    threshold: 1,
    root: chatListRef.current,
    onChange: (inView) => {
      const node = chatListRef.current
      if (inView && node && !loading && hasNextMsg) {
        setLastScrollHeight(node.scrollHeight)
        run()
      }
    }
  })

  // 检测是否查看了新消息
  const [hideRef, hideInView] = useInView({
    threshold: 0,
    root: chatListRef.current,
    onChange: (InView) => {
      if (InView) {
        setNewMsgHint(false)
      }
    }
  })

  // 新消息提醒以及拉取历史消息保持滚动条不变以及初次进入页面置底
  useEffect(() => {
    const node = chatListRef.current
    if (node !== null) {
      // 第一次进入且加载完毕
      if (!loading && isFirstEnter) {
        if (node.scrollHeight <= node.clientHeight) {
          run()
        }
        runNewMsg()
        node.scrollTop = node.scrollHeight - node.clientHeight
        setLastScrollHeight(node.scrollHeight)
        setIsFirstEnter(false)
      } else {
        if (!loadingEarlierMsg && node.scrollHeight > lastScrollHeight) {
          node.scrollTop = node.scrollHeight - lastScrollHeight
          setLastScrollHeight(node.scrollHeight)
        }
      }
    }
  }, [
    isFirstEnter,
    lastScrollHeight,
    loading,
    loadingEarlierMsg,
    run,
    runNewMsg
  ])

  function findLastReadMsg(item: IDirectMsgItem) {
    return item.status === EMsgStatus.Read
  }
  // 0不需要加
  // >0 在 LastReadMsg-1的item上加
  //-1 在arr.length上加
  const LastReadMsgIndex = directMsgList.findIndex(findLastReadMsg)
  let firstUnreadMsgIndex = -1
  if (LastReadMsgIndex === -1) {
    firstUnreadMsgIndex = directMsgList.length - 1
  } else if (LastReadMsgIndex > 0) {
    firstUnreadMsgIndex = LastReadMsgIndex - 1
  } else {
    firstUnreadMsgIndex = -1
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.msgDetailHead}>
        <NavBar backArrow={<BackIcon />} onBack={() => navigate(-1)}>
          {FriendName || '用户未找到'}
        </NavBar>
      </div>
      <div className={styles.MsgListOuterContainer} ref={chatListRef}>
        {/* 下拉加载更多 */}
        <div ref={ref} className={styles.pullToLoadMore}></div>
        {/* 消息列表 */}
        <div className={styles.MsgList}>
          {directMsgList &&
            directMsgList.map((item, index) => (
              <MsgDetailItem
                key={item._id}
                message={
                  item._id === newMsgId && item.msgType === EMsgType.Image
                    ? { ...item, content: imgCopy?.url! }
                    : item
                }
                unReadPrompt={
                  unReadCountWithOnePeople! > msgDetailLimit
                    ? `上面还有${
                        unReadCountWithOnePeople! - msgDetailLimit
                      }条消息未读`
                    : '未读'
                }
                firstUnread={index === firstUnreadMsgIndex}
                deleteMsg={async (params: IDeleteDirectMsg) => {
                  await deleteDirectMsg(params)
                }}
              />
            ))}
        </div>
        <div ref={hideRef} className={styles.pullToLoadMore}></div>
      </div>
      {/* 发送信息部分 */}
      <div className={styles.sendMsg}>
        {/* 新消息提示 */}
        <div className={newMsgHint ? styles.newMsgHint : styles.newMsgOut}>
          <Button
            shape="rounded"
            className={styles.hintText}
            onClick={() => {
              chatListRef.current!.scrollTop = chatListRef.current!.scrollHeight
            }}
          >
            <BackIcon className={styles.down} />
            <span className={styles.text}>新私信</span>
          </Button>
        </div>
        <label className={styles.footer}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImgsChange(e)
            }}
          />
          <ImageIcon fill="#fff" className={styles.imageIcon} />
        </label>
        <TextArea
          className={classNames(
            styles.input,
            fileList.length > 0 ? styles.displayNone : undefined
          )}
          placeholder="发送一条私信"
          value={content || ''}
          rows={1}
          autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={(value) => setContent(value)}
        />
        {/* 图片 */}
        <div className={styles.imageList}>
          {fileList.map((item, index) => (
            <div className={styles.imageContainer} key={index}>
              <CloseCircleFill className={styles.delete} onClick={deleteImg} />
              <Image
                src={item.url}
                className={styles.imgMsg}
                fit="cover"
                lazy
                alt=""
                onClick={() =>
                  handleImageClick(
                    index,
                    fileList.map((i) => i.url)
                  )
                }
              />
            </div>
          ))}
        </div>
        {/* 发送按钮 */}
        <Button
          shape="rounded"
          color="primary"
          size="mini"
          className={styles.sendButton}
          onClick={async () => {
            if (content !== '' || fileList.length > 0) {
              //第一次进入页面发消息可能还没生效不能发送消息
              const res = await createDirectMsg(FriendId!, content!, fileList)
              setContent('')
              if (res) {
                await getDirectMsg()
                setIsFirstEnter(true)
              } else {
                Toast.show({
                  icon: 'fail',
                  content: '消息发送失败'
                })
              }
            }
          }}
        >
          发送
        </Button>
      </div>
    </div>
  )
}
export default MsgDetail
