// 转换成base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result?.toString()
      if (base64String) {
        resolve(base64String)
      } else {
        reject(new Error('Failed to convert image to Base64'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read image file'))
    }
  })
}
