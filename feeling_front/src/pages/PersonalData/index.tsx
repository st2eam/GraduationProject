import styles from './style.module.scss'
import { NavBar, TextArea, Form, Input, Dialog, Toast } from 'antd-mobile'
import { ReactComponent as BackArrowIcon } from '@/assets/icons/back_arrow.svg'
import { useNavigate } from 'react-router-dom'
import defaultBannerImage from '@/assets/images/default.png'
import { useState } from 'react'
import { useUserInfo } from '@/hooks/useUserInfo'
import SingleImageUploader from './SingleImageUploader'
import { ISetUserInfo } from '@/interfaces/request/user'
import { userIdRule } from '@/utils/validate/checkUserId'
import { getImageUploadedURL } from '@/api/oss'
import { getStrLen } from '@/utils/tools/getStrLen'

function PersonalData() {
  const navigate = useNavigate()
  const { user, setUser, handleSetUserInfo } = useUserInfo()
  const [newBanner, setNewBanner] = useState('')
  const [newAvatar, setNewAvatar] = useState('')
  const [userForm] = Form.useForm<Pick<ISetUserInfo, 'bio' | 'nickname'>>()
  const bio = Form.useWatch('bio', userForm)
  const nickname = Form.useWatch('nickname', userForm)
  const handleSave = async () => {
    try {
      const value = userForm.getFieldsValue()
      await userForm.validateFields()
      const checkNicknameRes = userIdRule(value.nickname || '')
      if (checkNicknameRes) {
        const result = await Dialog.confirm({
          content: '您确定要保存吗'
        })
        if (result) {
          const res = await handleSetUserInfo({
            ...value,
            avatar: newAvatar || user.avatar,
            banner: newBanner || user.banner
          })
          if (res) {
            setUser(res)
          }
        }
      }
    } catch (error) {}
  }
  const handleBannerChange = async (image: File) => {
    try {
      const url = (await getImageUploadedURL({ image })) || user.banner
      setNewBanner(url)
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '上传似乎出了些问题~?'
      })
    }
  }
  const handleAvatarChange = async (image: File) => {
    try {
      const url = (await getImageUploadedURL({ image })) || user.avatar
      setNewAvatar(url)
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '上传似乎出了些问题~?'
      })
    }
  }

  const checkTextArea = (_: any, value: string) => {
    const strMaxLen = 150
    if (getStrLen(value) <= strMaxLen) {
      return Promise.resolve()
    } else {
      Toast.show({
        content: '个人简介太长啦',
        position: 'top'
      })
      return Promise.reject(new Error(`长度不能超过${strMaxLen}个字符喔`))
    }
  }

  return (
    <div className={styles.personalDataWrapper}>
      <NavBar
        className={styles.navBar}
        backArrow={<BackArrowIcon />}
        right={
          <span className={styles.save} onClick={handleSave}>
            保存
          </span>
        }
        onBack={() => navigate(-1)}
      >
        <span className={styles.title}>编辑个人资料</span>
      </NavBar>
      {/* banner */}
      <SingleImageUploader
        imageURL={
          (user.banner || defaultBannerImage) +
          '?x-oss-process=image/quality,q_20'
        }
        aspect={2 / 1}
        className={styles.banner}
        onChange={(newImageFile) => handleBannerChange(newImageFile)}
        fit="cover"
      />
      {/* avatar */}
      <SingleImageUploader
        imageURL={user.avatar + '?x-oss-process=image/quality,q_20'}
        aspect={1 / 1}
        className={styles.avatar}
        onChange={(newImageFile) => handleAvatarChange(newImageFile)}
        fit="cover"
      />
      {/* 表单 */}
      <Form
        className={styles.userForm}
        form={userForm}
        initialValues={{
          nickname: user.username,
          bio: user.bio
        }}
        layout="horizontal"
        requiredMarkStyle="none"
      >
        <Form.Item
          name="nickname"
          label="姓名"
          rules={[{ required: true }]}
          description={
            <div className={styles.limit}>{getStrLen(nickname || '')}/16</div>
          }
        >
          <Input className={styles.nickname} placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="bio"
          label="简介"
          rules={[{ validator: checkTextArea }]}
          description={
            <div className={styles.limit}>{getStrLen(bio || '')}/150</div>
          }
        >
          <TextArea
            className={styles.bio}
            value={bio}
            placeholder="个人简介"
            rows={6}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
export default PersonalData
