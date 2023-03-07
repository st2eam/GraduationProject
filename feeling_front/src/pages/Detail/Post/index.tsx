import { IPostItem } from '@/interfaces/response/post'
import styles from './style.module.scss'
import { Avatar } from 'antd-mobile'
import { getLastTimeStr } from '@/utils/tools/formatTime'
import Content from '@/components/PostItem/Content'
import ForwardItem from '@/components/PostItem/ForwardItem'
import { EPostType } from '@/enums/model'
import { useNavigate } from 'react-router-dom'
import { EPagePath } from '@/enums/page'

const Post = (props: IPostItem) => {
  const navigate = useNavigate()
  // 链接至用户主页
  const linkToUser = (e: React.MouseEvent<HTMLImageElement, Event>) => {
    navigate(EPagePath.PERSONAL_HOME.replace(':userId', props.userId))
    e.stopPropagation()
  }

  return (
    <div className={styles.postItem}>
      <header className={styles.header}>
        <Avatar
          className={styles.avatar}
          src={props.user.avatar || ''}
          onClick={(e) => linkToUser(e)}
        />
        <div className={styles.userInfo}>
          <span className={styles.nickname}>{props.user.nickname}</span>
          <span className={styles.userId}>{props.user.userId}</span>
        </div>
      </header>
      <main className={styles.main}>
        <Content content={props.content} imgs={props.imgs}>
          {props.type === EPostType.Forward && (
            <ForwardItem
              {...props.relate!.post[0]}
              user={props.relate!.user[0]}
            />
          )}
          <span className={styles.date}>{getLastTimeStr(props.createdAt)}</span>
        </Content>
      </main>
    </div>
  )
}

export default Post
