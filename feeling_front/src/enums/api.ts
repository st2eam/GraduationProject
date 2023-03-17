export enum EAuthApi {
  Prefix = '/auth',
  WxLogin = '/wx_login',
  WxAuth = '/wx_auth',
  Logout = '/logout',
  Register = '/register'
}

export enum EUserApi {
  Prefix = '/user',
  GetInfo = '/get_info',
  SetInfo = '/set_info',
  Follow = '/follow',
  Unfollow = '/unfollow',
  GetFollowers = '/follower_list',
  GetSubscribers = '/subscriber_list'
}

export enum EPostApi {
  Prefix = '/post',
  CreateComment = '/create_comment',
  CreateForward = '/create_forward',
  CreatePost = '/create_post',
  Delete = '/delete',
  GetRecommend = '/recommend',
  GetDetail = '/get_detail',
  GetComments = '/get_comments',
  GetPost = '/get_user_post',
  GetImgPost = '/get_user_img_post',
  GetLikePost = '/get_user_like_post',
  Unlike = '/unlike',
  Like = '/like'
}

export enum ENotifyApi {
  Prefix = '/notice',
  Get = '/get',
  UpdateStatus = '/update_status',
  GetHasUnread = '/get_unread',
  Delete = '/delete',
  setAllNotifyToRead = '/read_all',
  setAllNotifyToDelete = '/delete_all'
}

export enum EUploadApi {
  Upload = '/upload'
}

export enum EDirectMsgApi {
  Prefix = '/direct_msg',
  GetChatItem = '/get_chat_item',
  GetDirectMsg = '/get_direct_msg',
  GetUnreadCount = '/get_unread_count',
  DeleteChatItem = '/delete_chat_item',
  DeleteDirectMsg = '/delete_direct_msg',
  CreateDirectMsg = '/create_direct_msg',
  SetMsgToRead = '/set_msg_read',
  SetAllMsgToRead = '/set_all_msg_read',
  getNewUnReadMsgWithOneFriend = '/get_unread_msg_with_friend'
}

export enum ESearchApi {
  Prefix = '/search',
  Post = '/post',
  User = '/user',
  Img = '/img'
}
