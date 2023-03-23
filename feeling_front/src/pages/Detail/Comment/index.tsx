import { IPostItem } from '@/interfaces/response/post'
import styles from './style.module.scss'
import { Avatar, Divider } from 'antd-mobile'
import { getLastTimeStr } from '@/utils/tools/formatTime'
import Content from '@/components/PostItem/Content'
import { EPostType } from '@/enums/model'
import ForwardItem from '@/components/PostItem/ForwardItem'
import { HeartOutline, SendOutline, MessageOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'
import { useDetail } from '@/hooks/useDetail'
import { useMount } from 'ahooks'

const CommentItem = (props: IPostItem) => {
  // 链接至用户主页
  const navigate = useNavigate()
  const { post: relatePost, load } = useDetail(props.relate!.post[0].relationId)
  const linkToUserById = (
    e: React.MouseEvent<HTMLImageElement, Event>,
    userId: string
  ) => {
    if (userId === '') return
    navigate(`/personal_home/${userId}`)
    e.stopPropagation()
  }

  useMount(() => {
    if (props.relate!.post[0].type === EPostType.Forward) {
      load()
    }
  })

  return (
    <>
      <div
        className={styles.postItem}
        onClick={() =>
          navigate(EPagePath.DETAIL.replace(':id', props.relationId))
        }
      >
        <header className={styles.left}>
          <Avatar
            className={styles.avatar}
            src={props.relate?.user[0].avatar || ''}
            onClick={(e) =>
              linkToUserById(e, props.relate?.user[0].userId ?? '')
            }
          />
          <Divider direction="vertical" className={styles.divider} />
          <Avatar
            className={styles.avatar}
            src={props.user.avatar || ''}
            onClick={(e) => linkToUserById(e, props.user.userId)}
          />
        </header>
        <main className={styles.right}>
          <div className={styles.postItemHeader}>
            <span className={styles.userId}>
              {props.relate?.user[0].userId}
            </span>
            <span>{getLastTimeStr(props.relate?.post[0].createdAt ?? 0)}</span>
          </div>
          <Content
            onClick={() =>
              navigate(EPagePath.DETAIL.replace(':id', props.relationId))
            }
            content={props.relate?.post[0].content || ''}
            imgs={props.relate?.post[0].imgs || []}
          >
            {props.relate!.post[0].type === EPostType.Forward &&
              relatePost._id && <ForwardItem {...relatePost} />}
          </Content>
          <div className={styles.postItemFooter}>
            <span>
              <MessageOutline className={styles.FooterIcon} />
              {props.relate?.post[0].comments}
            </span>
            <span>
              <SendOutline className={styles.FooterIcon} />
              {props.relate?.post[0].forwards}
            </span>
            <span>
              <HeartOutline className={styles.FooterIcon} />
              {props.relate?.post[0].likes}
            </span>
          </div>
          <span className={styles.userId}>{props.user.userId}</span>
        </main>
      </div>
      <footer className={styles.footer}>
        {props.type === EPostType.Comment && (
          <div className={styles.comment}>
            <span>回复：</span>
            <span className={styles.replyTo}>
              {props.relate!.user[0].userId}{' '}
            </span>
          </div>
        )}
        <Content content={props.content} imgs={props.imgs}>
          {props.type === EPostType.Forward && (
            <ForwardItem
              {...props.relate!.post[0]}
              user={props.relate!.user[0]}
            />
          )}
        </Content>
        <span className={styles.date}>{getLastTimeStr(props.createdAt)}</span>
      </footer>
    </>
  )
}

export default CommentItem
