import { Skeleton } from 'antd-mobile'
import styles from '../Post/style.module.scss'
const DetailSkeleton = () => {
  return (
    <div className={styles.postItem}>
      <header className={styles.header}>
        <Skeleton className={styles.avatar} animated />
        <Skeleton.Paragraph
          className={styles.userInfo}
          lineCount={2}
          animated
        />
      </header>
      <main className={styles.main}>
        <Skeleton.Paragraph
          className={styles.userInfo}
          lineCount={4}
          animated
        />
      </main>
    </div>
  )
}

export default DetailSkeleton
