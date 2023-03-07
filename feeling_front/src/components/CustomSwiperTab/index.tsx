import { Swiper, Tabs } from 'antd-mobile'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import { ReactNode, useRef, useState } from 'react'
import classnames from 'classnames'
import styles from './style.module.scss'

export interface ITab {
  key: string
  title: ReactNode
}

export interface ISwiperItem {
  key: string
  content: ReactNode
}

interface ICustomSwiperTab {
  tabs: ITab[]
  swiperItems: ISwiperItem[]
  initActiveIndex?: number
  onChange?: (index: number) => void
  tabClassName?: string
  swiperClassName?: string
  className?: string
}

function CustomSwiperTab({
  tabs,
  swiperItems,
  initActiveIndex = 0,
  onChange = () => {},
  tabClassName,
  swiperClassName,
  className
}: ICustomSwiperTab) {
  const swiperRef = useRef<SwiperRef>(null)
  const [activeIndex, setActiveIndex] = useState(initActiveIndex)
  const handleTabChange = (key: string) => {
    const index = tabs.findIndex((tab) => tab.key === key)
    setActiveIndex(index)
    swiperRef.current?.swipeTo(index)
    onChange(index)
  }
  const handleSwiperChange = (index: number) => {
    setActiveIndex(index)
    onChange(index)
  }

  return (
    <div className={classnames(styles.swiperTabWrapper, className)}>
      <Tabs
        className={tabClassName}
        activeKey={tabs[activeIndex].key}
        onChange={(key) => handleTabChange(key)}
      >
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.key} title={tab.title} />
        ))}
      </Tabs>
      <Swiper
        className={swiperClassName}
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => handleSwiperChange(index)}
      >
        {swiperItems.map((item) => (
          <Swiper.Item key={item.key}>{item.content}</Swiper.Item>
        ))}
      </Swiper>
    </div>
  )
}
export default CustomSwiperTab
