import styles from './style.module.scss'
import NotifyHead from '@/pages/Notify/NotifyHead'
import MessageItem from '@/pages/Message/MessageItem'
import useMessage from '@/hooks/useMessage'
import { useState } from 'react'
import { EPageName } from '@/enums/page'
import HomeSideMenu from '../Home/HomeSideMenu'
import { useUserInfo } from '@/hooks/useUserInfo'
import CustomList from '@/components/CustomList'
import { useRequest } from 'ahooks'
import CustomDotLoading from '@/components/CustomDotLoading'
function Message() {
  const {
    chatList,
    hasMore,
    loadMore,
    getChatList,
    deleteChatItem,
    setMsgToRead,
    setAllMsgToRead,
    pollGetMsgList
  } = useMessage()
  const { loading } = useRequest(getChatList)
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const { user } = useUserInfo()
  useRequest(
    async () => {
      pollGetMsgList()
    },
    {
      pollingInterval: 2000
    }
  )
  return (
    <div className={styles.outContainer}>
      <NotifyHead
        avatar={user.avatar || ''}
        title={EPageName.MESSAGE}
        showHomeSideMenu={() => setSideMenuVisible(true)}
        setAllRead={() => {
          setAllMsgToRead()
        }}
      />
      <div className={styles.notifyItems}>
        {loading ? (
          <CustomDotLoading />
        ) : (
          <CustomList
            list={chatList}
            onRefresh={() => getChatList()}
            loadMore={() => loadMore(chatList![chatList!.length - 1].lastMsgId)}
            hasMore={hasMore}
          >
            {chatList.map((item, index) => (
              <MessageItem
                key={item.userId || Date.now() + index}
                message={item}
                deleteMsgItem={() => {
                  deleteChatItem({ id: item.userId })
                }}
                setRead={() => {
                  setMsgToRead({ id: item.userId })
                }}
              />
            ))}
          </CustomList>
        )}
      </div>
      <HomeSideMenu visible={sideMenuVisible} setVisible={setSideMenuVisible} />
    </div>
  )
}
export default Message
