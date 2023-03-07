import { Skeleton } from 'antd-mobile'
import styles from './style.module.scss'

function UserInfoBoardSkeleton() {
  return (
    <div className={styles.userInfoWrapper}>
      {/* 关注按钮 */}
      {/* 头像 */}
      <Skeleton.Title
        animated
        className={styles.avatar}
      />
      {/* 其他信息 */}
      <Skeleton.Paragraph
        animated
        lineCount={4}
        className={styles.paragraph}
      />
    </div>
  )
}
export default UserInfoBoardSkeleton
