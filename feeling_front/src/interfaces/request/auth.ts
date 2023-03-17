import { ESexType } from '@/enums/model'

export interface ILogin {
  username: string
  password: string
}

export interface IEmail {
  email: string
}

export interface IRegister {
  userId: string
  password: string
  email: string
  sex: ESexType
  banner: string
  avatar: string
}
