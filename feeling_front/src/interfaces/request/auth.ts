import { ESexType } from '@/enums/model'

export interface ILogin {
  username: string
  password: string
}

export interface IEmail {
  email: string
}

export interface IRegister {
  username: string
  password: string
  email: string
  sex: ESexType
  banner: string
  avatar: string
}
