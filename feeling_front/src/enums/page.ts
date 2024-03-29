export enum EPagePath {
  LOGIN = '/login',
  REGISTER = '/register',
  HOME = '/home',
  SEARCH = '/search',
  NOTIFY = '/notify',
  PERSONAL_HOME = '/personal_home/:userId', // 可能是自己的，也可能是别人的
  PERSONAL_DATA = '/personal_data',
  Follow = '/follow/:userId', // 可能是自己的，也可能是别人的
  DETAIL = '/detail/:id',
  NOT_FOUND = '/404'
}

export enum EPageName {
  LOGIN = '登录',
  REGISTER = '注册',
  HOME = '主页',
  SEARCH = '搜索',
  NOTIFY = '通知',
  PERSONAL_HOME = '个人主页',
  PERSONAL_DATA = '个人资料',
  FOLLOW = '关注',
  NOT_FOUND = '未找到'
}

// Home页面内tabs
export enum EHomeTab {
  FOLLOW = 'follow',
  RECOMMEND = 'recommend'
}

// follow页面内tabs
export enum EFollowTab {
  FOLLOW = 'follow',
  SUBSCRIBE = 'subscribe'
}

// 个人中心页面tabs
export enum EPersonalHomeTab {
  POST = 'post',
  IMAGE_POST = 'image_post',
  LIKE_POST = 'like_post'
}

// 搜索页面中的tabs
export enum ESearchTab {
  POST = 'post',
  USER = 'users',
  IMAGE_POST = 'image_post'
}
