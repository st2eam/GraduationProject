import { DotLoading, InfiniteScroll, PullToRefresh } from 'antd-mobile'
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh'
import { ReactNode } from 'react'
import CustomEmpty from '../CustomEmpty'
import styles from './style.module.scss'
import classnames from 'classnames'

interface ICustomList {
  list: unknown[]
  children: ReactNode
  onRefresh?: (() => Promise<any>) | undefined
  loadMore: (isRetry: boolean) => Promise<void>
  hasMore: boolean
  threshold?: number
  className?: string
}

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <div className={styles.hasMore}>
          <span>
            Loading
            <DotLoading color="#3291ff" />
          </span>
        </div>
      ) : (
        <span className={styles.hasMore}> 我是有底线的 ~ </span>
      )}
    </>
  )
}

function CustomList(props: ICustomList) {
  const { list, onRefresh, loadMore, hasMore, children, threshold, className } =
    props

  const statusRecord: Record<PullStatus, ReactNode> = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: (
      <div>
        <span>
          玩命加载中 <DotLoading color="#3291ff" />
        </span>
      </div>
    ),
    complete: '好啦'
  }

  return (
    <div className={classnames(styles.listWrapper, className)}>
      <PullToRefresh
        onRefresh={onRefresh}
        renderText={(status) => {
          return <div className={styles.renderText}>{statusRecord[status]}</div>
        }}
      >
        <CustomEmpty isEmpty={list.length === 0}>
          {children}
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
            threshold={threshold}
          >
            <InfiniteScrollContent hasMore={hasMore} />
          </InfiniteScroll>
        </CustomEmpty>
      </PullToRefresh>
    </div>
  )
}
export default CustomList
