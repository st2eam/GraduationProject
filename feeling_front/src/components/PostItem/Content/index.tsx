import { newPostContext } from '@/hooks/store'
import { Ellipsis, Image, ImageViewer } from 'antd-mobile'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { PictureOutline } from 'antd-mobile-icons'
import { ReactNode, useContext } from 'react'
import styles from '../style.module.scss'
interface IProps {
  id?: string
  children: ReactNode
  content: string
  imgs: string[]
  onClick?: () => void
}
const Content = (props: IProps) => {
  const localImgs: ImageUploadItem[] = JSON.parse(
    String(sessionStorage.getItem('newImgList'))
  )
  const { newPost } = useContext(newPostContext)
  // 显示图片
  const handleImageClick = (
    e: React.MouseEvent<HTMLImageElement, Event>,
    index: number
  ) => {
    // 每张图片添加'?x-oss-process=image/quality,q_60'后缀，防止图片太大，导致图片加载失败
    ImageViewer.Multi.show({
      images: props.imgs.map(
        (item) => `${item}?x-oss-process=image/quality,q_60`
      ),
      renderFooter: (_, __) => {
        return (
          <div
            className={styles.imageViewerFooter}
            onClick={() => {
              ImageViewer.Multi.show({
                images: props.imgs,
                defaultIndex: index
              })
            }}
          >
            <div className={styles.footerCenter}>
              <PictureOutline />
              <span>查看原图</span>
            </div>
          </div>
        )
      },
      defaultIndex: index
    })
    e.stopPropagation()
  }
  return (
    <div className={styles.postItemContent}>
      <div
        className={styles.postItemText}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Ellipsis
          direction="end"
          content={props.content}
          rows={3}
          expandText="展开"
          collapseText="收起"
          onContentClick={props.onClick}
        />
      </div>
      {props.imgs.length !== 0 && (
        <div className={styles.imageContainer}>
          {props.id === newPost && localImgs.length !== 0
            ? localImgs.map((item, index) => (
                <Image
                  key={index}
                  src={item.url}
                  fit="cover"
                  lazy
                  alt=""
                  className={styles.image}
                  onClick={(e) => handleImageClick(e, index)}
                />
              ))
            : props.imgs.map((url, index) => (
                <Image
                  key={url + index}
                  src={url + '?x-oss-process=image/quality,q_20'}
                  fit="cover"
                  lazy
                  alt=""
                  className={styles.image}
                  onClick={(e) => handleImageClick(e, index)}
                />
              ))}
        </div>
      )}
      {props.children}
    </div>
  )
}
export default Content
