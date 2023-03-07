import { DotLoading } from 'antd-mobile'
import styles from './style.module.scss'

function CustomDotLoading() {
  return (
    <div className={styles.loadingWrapper}>
      <DotLoading className={styles.dotLoading} color="#3291ff" />
    </div>
  )
}
export default CustomDotLoading
