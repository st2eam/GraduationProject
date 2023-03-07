import CustomDotLoading from '@/components/CustomDotLoading'
import CustomList from '@/components/CustomList'
import HomeSideMenu from '../Home/HomeSideMenu'
import NotifyHead from './NotifyHead'
import NotifyItem from './NotifyItem'
import styles from './style.module.scss'
import useNotify from '@/hooks/useNotify'
import { EPageName } from '@/enums/page'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { useUserInfo } from '@/hooks/useUserInfo'

function Notify() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const { user } = useUserInfo()
  const {
    notifyList,
    getNotifyLIst,
    deleteNotify,
    setNotifyToRead,
    loadMore,
    hasMore,
    setAllNotifyToRead,
    setAllNotifyToDelete
  } = useNotify()

  const { loading } = useRequest(getNotifyLIst)

  return (
    <div className={styles.outContainer}>
      <NotifyHead
        avatar={user.avatar || ''}
        title={EPageName.NOTIFY}
        showHomeSideMenu={() => setSideMenuVisible(true)}
        setAllRead={() => {
          setAllNotifyToRead()
        }}
        serAllDelete={() => {
          setAllNotifyToDelete()
        }}
      />
      <div className={styles.notifyItems}>
        {loading ? (
          <CustomDotLoading />
        ) : (
          <CustomList
            list={notifyList}
            onRefresh={() => getNotifyLIst()}
            loadMore={() => loadMore(notifyList![notifyList!.length - 1]._id)}
            hasMore={hasMore}
          >
            {notifyList.map((item) => (
              <NotifyItem
                key={item._id}
                notify={item}
                deleteOneNotify={() => {
                  deleteNotify({ id: item._id })
                }}
                changeToRead={() => {
                  setNotifyToRead({ id: item._id })
                }}
              ></NotifyItem>
            ))}
          </CustomList>
        )}
      </div>
      <HomeSideMenu visible={sideMenuVisible} setVisible={setSideMenuVisible} />
    </div>
  )
}
export default Notify
