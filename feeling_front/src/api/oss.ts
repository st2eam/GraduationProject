import { IUploadImage } from '@/interfaces/request/upload'
import { IResp } from '@/interfaces/response'
import { IUploadResp } from '@/interfaces/response/upload'
import * as request from '@/utils/axios'
import { checkWithData } from '@/utils/check'

export const getImageUploadedURL = async ({ image }: IUploadImage) => {
  try {
    const res = await request.httpGet<IResp<IUploadResp>>(
      '/upload/' + image.name
    )
    if (checkWithData(res)) {
      const url = res.data!.url
      const data = new Blob([image], { type: image.type })
      request.httpPut(url, data, {
        'Content-Type': 'blob'
      })
      const resUrl = url.split('?')[0]
      return resUrl
    }
  } catch (error) {}
}
