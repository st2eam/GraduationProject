import { Skeleton } from 'antd-mobile'
import styles from './style.module.scss'
const PostItemSkeleton = (props: { count?: number }) => {
  const { count = 3 } = props
  return (
    <>
      {new Array(count).fill('').map((_, index) => (
        <div key={index} className={styles.postItem}>
          <Skeleton animated className={styles.avatar} />
          <Skeleton.Paragraph animated lineCount={4} />
        </div>
      ))}
    </>
  )
}

export default PostItemSkeleton
