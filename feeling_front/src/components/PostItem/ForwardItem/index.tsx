import { Avatar, Ellipsis, Image } from 'antd-mobile'
import styles from './style.module.scss'
import { IPostItem } from '@/interfaces/response/post'
import { getLastTimeStr } from '@/utils/tools/formatTime'
import { EPostType } from '@/enums/model'
import { useNavigate } from 'react-router-dom'
import { useDetail } from '@/hooks/useDetail'
import { useMount } from 'ahooks'

const ForwardItem = (props: IPostItem) => {
  const navigate = useNavigate()
  const { post: relatePost, load } = useDetail(props.relationId)

  useMount(() => {
    if (props.type === EPostType.Comment) {
      load()
    }
  })

  // 链接至帖子详情
  const linkToPost = (e: React.MouseEvent) => {
    navigate(`/detail/${props._id}`)
    e.stopPropagation()
  }

  // render
  return props.type === EPostType.Delete ? (
    <div className={styles.deleteItem}>帖子已删除</div>
  ) : (
    <div className={styles.ForwardItem}>
      <div className={styles.ForwardItemHeader} onClick={(e) => linkToPost(e)}>
        <Avatar className={styles.avatar} src={props.user.avatar || ''} />
        <span className={styles.nickname}>{props.user.nickname}</span>
        <span>
          {props.userId} · {getLastTimeStr(props.createdAt)}
        </span>
      </div>
      <div className={styles.ForwardItemContent}>
        <div className={styles.ForwardItemText}>
          {props.type === EPostType.Comment && (
            <div className={styles.comment}>
              <span>回复：</span>
              <span className={styles.replyTo}>
                {relatePost && relatePost.userId}
              </span>
            </div>
          )}
          <Ellipsis
            direction="end"
            content={props.content}
            rows={3}
            onContentClick={(e) => linkToPost(e)}
          />
        </div>
        {props.imgs.length !== 0 && (
          <div className={styles.imageContainer}>
            {props.imgs.map((url, index) => (
              <Image
                key={index}
                className={styles.image}
                src={url + '?x-oss-process=image/quality,q_20'}
                fit="cover"
                alt=""
                lazy
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default ForwardItem
