import { Avatar, Button } from 'antd-mobile'
import styles from './style.module.scss'
import { ReactComponent as CalendarIcon } from '@/assets/icons/calendar.svg'
import { IUserInfoResp } from '@/interfaces/response/user'
import { getFormatDateByMillionSeconds } from '@/utils/dayjs'
import { useNavigate } from 'react-router-dom'
import { EFollowTab, EPagePath } from '@/enums/page'
import { getFriendlyNum } from '@/utils/tools/getFriendlyNum'
import classnames from 'classnames'
import { useUserInfo } from '@/hooks/useUserInfo'

interface IUserInfoBoard {
  user: IUserInfoResp
  isOthers: boolean
  haveFollowed?: boolean | null // null 是为了解决样式改变的闪现问题
  sethaveFollowed?: (haveFollowed: boolean) => void
  className?: string
}

function UserInfoBoard({
  user,
  className,
  isOthers,
  haveFollowed,
  sethaveFollowed = () => {}
}: IUserInfoBoard) {
  const navigate = useNavigate()
  const { handleFollowUser, handleUnfollowUser } = useUserInfo()
  const handleFollowBtnClick = async () => {
    const res = haveFollowed
      ? await handleUnfollowUser({ id: user.userId })
      : await handleFollowUser({ id: user.userId })
    if (res) {
      sethaveFollowed(!haveFollowed)
    }
  }
  return (
    <div className={classnames(styles.userInfoWrapper, className)}>
      {/* 关注按钮 */}
      {user.userId && isOthers ? (
        <Button
          shape="rounded"
          className={classnames({
            [styles.haveFollowedBtn]: haveFollowed,
            [styles.unFollowedBtn]: !haveFollowed
          })}
          loading="auto"
          onClick={handleFollowBtnClick}
        >
          <span className={styles.text}>
            {haveFollowed ? '正在关注' : '关注'}
          </span>
        </Button>
      ) : null}
      {/* 头像 */}
      <Avatar
        className={styles.avatar}
        src={user.avatar}
        onClick={() => {
          !isOthers && navigate(EPagePath.PERSONAL_DATA)
        }}
      />
      {/* 昵称 */}
      <div className={styles.userId}>{user.userId || '匿名用户'}</div>
      {/* 其他信息 */}
      <div className={styles.otherInfo}>
        <div className={styles.email}>{user.email || '@Unknown'}</div>
        <div className={styles.createTime}>
          <CalendarIcon />
          {getFormatDateByMillionSeconds(user.createdAt)}
          加入
        </div>
      </div>
      {/* bio */}
      <div className={styles.bio}>{user.bio || '这个人很神秘~'}</div>
      {/* 关注信息 */}
      <div className={styles.userFollowInfo}>
        <div
          className={styles.follow}
          onClick={() =>
            navigate(EPagePath.Follow.replace(':userId', user.userId), {
              state: { activeKey: EFollowTab.FOLLOW }
            })
          }
        >
          <span className={styles.num}>
            {getFriendlyNum(user.followCounts)}
          </span>
          正在关注
        </div>
        <div
          className={styles.subscribe}
          onClick={() =>
            navigate(EPagePath.Follow.replace(':userId', user.userId), {
              state: { activeKey: EFollowTab.SUBSCRIBE }
            })
          }
        >
          <span className={styles.num}>
            {getFriendlyNum(user.subscribeCounts)}
          </span>
          关注者
        </div>
      </div>
    </div>
  )
}
export default UserInfoBoard
