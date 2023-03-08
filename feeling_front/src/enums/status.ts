// http status
export enum EHttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// service response fail code of user
export enum EUserErrorCode {
  ERR_USER_NOT_FOUND = 20001,
  ERR_PWD_NOT_CORRECT,
  ERR_EMAIL_ALREADY_EXISTS,
  ERR_USER_ALREADY_EXISTS,
  ERR_USER_NOT_LOGIN,
  ERR_USER_HAS_BEEN_BANNED
}

// service response fail code of wechat
export enum EWxErrorCode {
  ERR_WX_LOGIN_ERROR = 20100
}

// service response fail code of body params
export enum EBodyErrorCode {
  ERR_BAD_BODY_PARAMS = 10001
}

// service response fail code of post
export enum EPostErrorCode {
  ERR_POST_NOT_FOUND = 30001,
  ERR_POST_HAS_BEEN_DELETED,
  ERR_POST_HAS_BEEN_LIKED,
  ERR_LIKE_NOT_FOUND
}

// service response fail code of notify
export enum ENotifyErrorCode {
  ERR_NOTIFY_NOT_FOUND = 40001
}

export enum EMessageErrorCode {
  ERR_FRIEND_NOT_FOUND = 50001
}

// service response fail code of follow
export enum EFollowErrorCode {
  ERR_FRIEND_NOT_FOUND = 60001
}
