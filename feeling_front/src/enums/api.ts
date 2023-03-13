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
  GetFollows = '/get_follows',
  GetSubscribes = '/get_subscribes',
  GetPost = '/get_post',
  GetImgPost = '/get_img_post',
  GetLikePost = '/get_post_like'
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
  Unlike = '/unlike',
  Like = '/like'
}

export enum ENotifyApi {
  Prefix = '/notify',
  Get = '/get',
  UpdateStatus = '/update_status',
  GetHasUnread = '/get_has_unread',
  Delete = '/delete',
  setAllNotifyToRead = '/set_all_notify_read',
  setAllNotifyToDelete = '/set_all_notify_delete'
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
