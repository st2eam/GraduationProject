import { Button, ErrorBlock } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'
function Error() {
  const navigate = useNavigate()
  return (
    <ErrorBlock
      status="default"
      title={'未找到此页面'}
      description={
        <Button
          onClick={() => navigate('/')}
          className={styles.button}
          size={'small'}
        >
          返回首页
        </Button>
      }
      fullPage
    />
  )
}
export default Error
