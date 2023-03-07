import styles from './style.module.scss'
import { Image } from 'antd-mobile'
import { ReactComponent as UploadImgIcon } from '@/assets/icons/upload_img.svg'
import classnames from 'classnames'
import { ChangeEvent, useState } from 'react'
import CropImage, { INewImg } from '@/components/CropImage'

interface ISingleImageUploader {
  imageURL: string
  aspect?: number
  className?: string
  onChange?: (newImageFile: File, newImgURL: string) => void
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

function SingleImageUploader({
  imageURL,
  className,
  aspect,
  onChange = () => {},
  fit = 'fill'
}: ISingleImageUploader) {
  const [imageURLCopy, setImageURLCopy] = useState(imageURL)
  const [cropImgURL, setCropImgURL] = useState('')
  // 图像裁剪

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImageFile = e.target.files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(newImageFile)
      fileReader.onload = (e) => {
        if (e.target?.result) {
          const newImageURL = e.target?.result as string
          setCropImgURL(newImageURL)
        }
      }
    }
  }

  const onConfirm = (croppedImg: INewImg) => {
    setImageURLCopy(croppedImg.newImgURL)
    onChange(croppedImg.newImgFile, croppedImg.newImgURL)
    setCropImgURL('')
  }
  const onCancel = () => {
    setCropImgURL('')
  }
  return cropImgURL ? (
    <CropImage
      cropImgURL={cropImgURL}
      aspect={aspect}
      onConfirm={(croppedImg) => onConfirm(croppedImg)}
      onCancel={onCancel}
    />
  ) : (
    <div className={classnames(styles.uploaderWrapper, className)}>
      <Image src={imageURLCopy} height="100%" fit={fit} />
      <div className={styles.uploadBtn}>
        <div className={styles.mask} />
        <UploadImgIcon />
        <input
          className={styles.uploadInput}
          accept="image/*"
          type="file"
          onChange={(e) => handleOnChange(e)}
        />
      </div>
    </div>
  )
}
export default SingleImageUploader
