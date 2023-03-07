import styles from './style.module.scss'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'
import { NavBar, Toast, Slider } from 'antd-mobile'
import { useCallback, useRef, useState, MouseEvent } from 'react'
import { ReactComponent as CancelIcon } from '@/assets/icons/cancel.svg'
import { ReactComponent as ConfirmIcon } from '@/assets/icons/confirm.svg'
import { SliderValue } from 'antd-mobile/es/components/slider'

interface ICropImage {
  cropImgURL: string
  aspect?: number
  quality?: number
  onConfirm?: (croppedImg: INewImg, e: MouseEvent) => void
  onCancel?: (e: MouseEvent) => void
}
export interface INewImg {
  newImgURL: string
  newImgFile: File
}

function CropImage({
  cropImgURL,
  aspect = 1 / 1,
  quality = 0.8,
  onConfirm = () => {},
  onCancel = () => {}
}: ICropImage) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const [zoom, setZoom] = useState(1)
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  // 创建图片
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      imgRef.current!.onload = () => resolve(imgRef.current as HTMLImageElement)
      imgRef.current!.onerror = (error: any) => reject(error)
      imgRef.current!.src = url
    })

  // 得到裁剪过后的图片
  const getCroppedImg = async (pixelCrop: Area) => {
    // 等待url加载完毕
    const image = await createImage(cropImgURL)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    // 把原来的图像画上去
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    // 得到裁剪过后的图像大小坐标
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    )
    // 把裁剪框缩放过后的图像画布大小画上去
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    // 从左上角开始将图像具体像素信息放上去
    ctx.putImageData(data, 0, 0)
    // result
    const newImgURL = canvas.toDataURL('image/png', quality)
    return new Promise<INewImg>((resolve, reject) => {
      canvas.toBlob(
        (file) => {
          if (file) {
            const newImgFile = new File([file], 'new_img.png', {
              type: 'image/png'
            })
            resolve({ newImgURL, newImgFile })
          } else {
            reject('转换出错')
          }
        },
        'image/png',
        quality
      )
    })
  }

  // 确认裁剪完成
  const handleOnConfirm = async (croppedAreaPixels: Area, e: MouseEvent) => {
    try {
      const res = await getCroppedImg(croppedAreaPixels)
      if (res) {
        onConfirm(res, e)
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '裁剪失败，请重试'
      })
    }
  }

  // 处理滑块change
  const handleSliderChange = (value: SliderValue) => {
    const _value = (value as number) / 10
    setZoom(_value)
  }
  return (
    <div className={styles.cropperWrapper}>
      <NavBar
        className={styles.navBar}
        backArrow={
          <CancelIcon
            className={styles.cancelIcon}
            onClick={(e) => onCancel(e)}
          />
        }
        right={
          <ConfirmIcon
            className={styles.confirmIcon}
            onClick={(e) => handleOnConfirm(croppedAreaPixels, e)}
          />
        }
      >
        <span className={styles.title}>裁剪</span>
      </NavBar>
      <Cropper
        classes={{ containerClassName: styles.cropperContainer }}
        image={cropImgURL}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <div className={styles.sliderWrapper}>
        <span>{(zoom * 100).toFixed(0)}%</span>
        <Slider
          className={styles.slider}
          defaultValue={zoom * 10}
          step={1}
          value={zoom * 10}
          onChange={(value) => handleSliderChange(value)}
          min={10}
        />
      </div>
      <img ref={imgRef} src="" alt="" />
    </div>
  )
}
export default CropImage
