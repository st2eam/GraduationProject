import { useContext, useState } from 'react'
import { newPostContext } from '@/hooks/store'
import { getImageUploadedURL } from '@/api/oss'
import { createComment, createForward, createPost } from '@/api/post'
import { ImageViewer, Toast, Form } from 'antd-mobile'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { ICreate } from './../interfaces/request/post'
import { EPostType } from './../enums/model'

const useNewPost = () => {
  const [labels, setLabels] = useState<Array<string>>([])
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  const { setNewPost } = useContext(newPostContext)
  const [form] = Form.useForm()

  const services = {
    [EPostType.Post]: (params: ICreate) => createPost(params),
    [EPostType.Comment]: (params: ICreate) => createComment(params),
    [EPostType.Forward]: (params: ICreate) => createForward(params),
    [EPostType.Delete]: (params: ICreate) => createPost(params) //不会用到
  }

  // 发布新帖
  const publishNewPost = async (type: EPostType, relationId?: string) => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      const { content } = values
      const urlList: string[] = []
      for (const item of fileList) {
        const url = await getImageUploadedURL({ image: item.extra.file })
        urlList.push(String(url))
      }
      services[type]({ content, imgs: urlList, relationId, labels }).then(
        (res) => {
          if ((res.message = 'ok')) {
            Toast.show({
              icon: 'success',
              content: '发布成功'
            })
            sessionStorage.setItem('newImgList', JSON.stringify(fileList))
            setFileList([])
            setLabels([])
            form.resetFields()
            setNewPost(String(res.data))
          }
        }
      )
      return true
    } catch (err) {}
  }

  // 上传图片
  const mockUpload = (file: File) => {
    return {
      extra: {
        file: file,
        name: file.name
      },
      url: URL.createObjectURL(file)
    }
  }

  // 显示图片
  const handleImageClick = (index: number, images: string[]) => {
    ImageViewer.Multi.show({ images, defaultIndex: index })
  }

  // 图片改变时
  const handleImgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxCount = 4
    const files = e.target.files
    if (files) {
      const append = Array.from(files).map(mockUpload).slice(0, maxCount)
      if (fileList.length + append.length > maxCount) {
        Toast.show({
          icon: 'fail',
          content: `最多上传${maxCount}张图片`
        })
        setFileList(
          fileList.concat(append.slice(0, maxCount - fileList.length))
        )
      } else {
        setFileList(fileList.concat(append))
      }
    }
    e.target.files = null
    e.target.value = ''
  }
  // 删除图片
  const deleteImg = (index: number) => {
    setFileList(fileList.filter((_, i) => i !== index))
  }
  return {
    form,
    fileList,
    labels,
    setLabels,
    publishNewPost,
    handleImageClick,
    handleImgsChange,
    deleteImg
  }
}
export default useNewPost
