import { ReactComponent as ImageIcon } from '../../assets/icons/imgMsg.svg'
import { CloseOutline } from 'antd-mobile-icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import useNewPost from '@/hooks/useNewPost'
import styles from './style.module.scss'
import { EPostType } from '@/enums/model'
import { IPostItem } from '@/interfaces/response/post'
import ForwardItem from '../PostItem/ForwardItem'
import Content from '../PostItem/Content'
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  Form,
  Image,
  Input,
  Popup,
  TextArea
} from 'antd-mobile'
import { useState } from 'react'
import { getStrLen } from '@/utils/tools/getStrLen'

interface IProps {
  type: EPostType
  post?: IPostItem
  visible: boolean
  onClose?: () => void
  setVisible: (visible: boolean) => void
}

const NewPostPopup = (props: IProps) => {
  const [content, setContent] = useState('')
  const [dialog_visible, setDialogVisible] = useState(false)
  const [label, setLabel] = useState('')
  const { type, post, visible, setVisible } = props
  const { user } = useUserInfo()
  const {
    form,
    fileList,
    labels,
    setLabels,
    publishNewPost,
    handleImageClick,
    handleImgsChange,
    deleteImg
  } = useNewPost()

  const handleSubmit = async () => {
    const res = await publishNewPost(type, post?._id)
    if (res) {
      setVisible(false)
      props.onClose && props.onClose()
    }
  }

  const checkTextArea = (_: any, value: string) => {
    if (getStrLen(value) <= 280) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('长度不能超过280个字符喔'))
  }

  const onTextAreaChange = (value: string) => {
    setContent(value)
  }

  const deleteLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index))
  }

  return (
    <Popup visible={visible} bodyStyle={{ height: '100vh' }}>
      <div className={styles.popup}>
        <header className={styles.header}>
          <span onClick={() => setVisible(false)}>取消</span>
          <Button
            color="primary"
            className={styles.submit}
            onClick={handleSubmit}
          >
            发布
          </Button>
        </header>
        {type === EPostType.Comment && post && (
          <div className={styles.commentType}>
            <div className={styles.left}>
              <Avatar className={styles.avatar} src={post.user?.avatar || ''} />
              <Divider direction="vertical" className={styles.divider} />
            </div>
            <div className={styles.right}>
              {post && (
                <Content content={post.content} imgs={post.imgs}>
                  {post.type === EPostType.Forward && (
                    <ForwardItem
                      {...post.relate!.post[0]}
                      user={post.relate!.user[0]}
                    />
                  )}
                </Content>
              )}
            </div>
          </div>
        )}
        <main className={styles.content}>
          <aside className={styles.aside}>
            <Avatar src={user.avatar || ''} className={styles.avatar} />
          </aside>
          <section className={styles.section}>
            {type === EPostType.Comment && post && (
              <div className={styles.comment}>
                <span>回复：</span>
                <span className={styles.replyTo}>{post.userId}</span>
              </div>
            )}
            <Form
              layout="vertical"
              form={form}
              requiredMarkStyle="text-required"
            >
              <Form.Item
                name="content"
                className={styles.formItem}
                rules={[
                  { required: true, message: '请输入内容' },
                  { validator: checkTextArea }
                ]}
                description={
                  <div className={styles.limit}>{getStrLen(content)}/280</div>
                }
              >
                <TextArea
                  placeholder="说点什么..."
                  value={content}
                  onChange={(val) => onTextAreaChange(val)}
                  maxLength={280}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </Form>
            {type === EPostType.Post && (
              <>
                {labels.map((item, index) => {
                  return (
                    <span key={item} className={styles.keyword}>
                      <CloseOutline
                        className={styles.delete}
                        onClick={() => deleteLabel(index)}
                      />
                      # {item}
                    </span>
                  )
                })}
                <Button
                  className={styles.add}
                  size="mini"
                  onClick={() => setDialogVisible(true)}
                >
                  # 添加标签
                </Button>
                <Dialog
                  visible={dialog_visible}
                  header={'请输入要添加的标签(一次仅限添加一个)'}
                  content={
                    <div>
                      <span>#</span>
                      <Input autoFocus value={label} onChange={setLabel} />
                    </div>
                  }
                  closeOnAction
                  onClose={() => {
                    setDialogVisible(false)
                  }}
                  actions={[
                    {
                      key: 'confirm',
                      text: '确认',
                      onClick: () => {
                        setLabels([...labels, label])
                        setLabel('')
                      }
                    },
                    {
                      key: 'cencel',
                      text: '取消',
                      onClick: () => {
                        setLabel('')
                      }
                    }
                  ]}
                />
              </>
            )}
            <div className={styles.imageList}>
              {fileList.map((item, index) => (
                <div className={styles.imageContainer} key={index}>
                  <CloseOutline
                    className={styles.delete}
                    onClick={() => deleteImg(index)}
                  />
                  <Image
                    src={item.url}
                    className={styles.image}
                    fit="cover"
                    lazy
                    alt=""
                    onClick={() =>
                      handleImageClick(
                        index,
                        fileList.map((i) => i.url)
                      )
                    }
                  />
                </div>
              ))}
            </div>
            {type === EPostType.Forward && post && <ForwardItem {...post} />}
          </section>
        </main>
        <footer className={styles.footer}>
          <label>
            <input
              type="file"
              multiple
              accept="image/*"
              maxLength={4}
              onChange={(e) => {
                handleImgsChange(e)
              }}
            />
            <ImageIcon className={styles.imageIcon} />
          </label>
        </footer>
      </div>
    </Popup>
  )
}

export default NewPostPopup
