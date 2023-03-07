import { ReactNode } from 'react'
import { ReactComponent as EmptyIcon } from '@/assets/icons/empty.svg'
import styles from './style.module.scss'
import classnames from 'classnames'

interface ICustomEmpty {
  isEmpty?: boolean
  children?: ReactNode
  emptyIconSize?: number
  emptyIcon?: ReactNode
  color?: string
  className?: string
}

function CustomEmpty(props: ICustomEmpty) {
  const {
    isEmpty = false,
    children = null,
    emptyIconSize = 50,
    emptyIcon = null,
    color = 'inherit',
    className = ''
  } = props
  const getEmptyIconStyle = () => ({
    opacity: 0.5,
    width: `${emptyIconSize}px`,
    height: `${emptyIconSize}px`,
    color
  })
  return (
    <>
      {isEmpty ? (
        <div className={classnames(styles.emptyWrapper, className)}>
          {emptyIcon || <EmptyIcon style={getEmptyIconStyle()} />}
        </div>
      ) : (
        children
      )}
    </>
  )
}
export default CustomEmpty
