export enum EMsgType {
  Common = 1,
  Image
}

export enum ESexType {
  Male = 1,
  Female
}

export enum EMsgStatus {
  Read = 1,
  Unread,
  Deleted
}
export enum EWhoSendMsg {
  Me = 1,
  Frined
}

export enum EPostType {
  Post = 1,
  Comment,
  Forward,
  Delete
}

export enum ENotifyType {
  Follow = 1,
  Comment,
  Forward
}

// user
export enum EUserStatus {
  Normal = 1,
  Disabled = 2
}
