import { useState } from 'react'
import { useCurrentPage } from '@/hooks/useCurrentPage'
import { FloatingBubble } from 'antd-mobile'
import { EPagePath } from '@/enums/page'
import { EPostType } from '@/enums/model'
import { AddOutline } from 'antd-mobile-icons'
import styles from './style.module.scss'
import NewPostPopup from '@/components/NewPostPopup'

const FloatBubble = () => {
  const [visible, setVisible] = useState(false)
  const { currPagePath } = useCurrentPage()
  const noRenderTarget = [
    EPagePath.LOGIN.toString(),
    EPagePath.REGISTER.toString(),
    EPagePath.MESSAGE.toString(),
    EPagePath.MESSAGE_DETAIL.toString().split('/')[1],
    EPagePath.PERSONAL_DATA.toString().split('/')[1]
  ]
  return noRenderTarget.includes(currPagePath.split('/')[1]) ? null : (
    <>
      <FloatingBubble
        className={styles.floatBubble}
        axis="xy"
        magnetic="x"
        onClick={() => setVisible(true)}
      >
        <AddOutline className={styles.icon} fontSize={20} />
      </FloatingBubble>
      <NewPostPopup
        type={EPostType.Post}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  )
}
export default FloatBubble
