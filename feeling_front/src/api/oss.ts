import { EUploadApi } from '@/enums/api'
import { IUploadImage } from '@/interfaces/request/upload'
import { IResp } from '@/interfaces/response'
import { IUploadResp } from '@/interfaces/response/upload'
import * as request from '@/utils/http/axios'
import { checkWithData } from '@/utils/checkHttpRes'

export const getImageUploadedURL = async ({ image }: IUploadImage) => {
  try {
    const res = await request.httpGet<IResp<IUploadResp>>(
      EUploadApi.Upload + '/' + image.name
    )
    if (checkWithData(res)) {
      const url = res.data!.url
      const data = new Blob([image], { type: image.type })
      const result = await request.httpPut(url, data, {
        'Content-Type': 'blob',
        'x-oss-storage-class': 'Standard'
      })
      console.log(result)
      const resUrl = url.split('?')[0]
      return resUrl
    }
  } catch (error) {}
}
