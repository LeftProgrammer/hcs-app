// TODO: 别忘加更改环境变量的 VITE_UPLOAD_BASEURL 地址。
const VITE_UPLOAD_BASEURL = import.meta.env.VITE_UPLOAD_BASEURL

interface UploadOptions {
  onProgress?: (progress: number) => void // 上传进度回调函数
}

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '菲鸽'}。
 * @param options 可选参数，包含上传进度回调函数等。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useUpload<T = string>(
  formData: FormData = new FormData(), // 默认创建一个空的 FormData 对象
  options: UploadOptions = {},
) {
  const loading = ref(false)
  const error = ref(false)
  const data = ref<T>()
  let tempFilePath: string | undefined // 存储选择的图片路径

  // 选择图片
  const chooseImage = () => {
    return new Promise<string>((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: (res) => {
          resolve(res.tempFiles[0].tempFilePath)
        },
        fail: (err) => {
          console.error('选择图片失败：', err)
          reject(err)
        },
      })
      // #endif
      // #ifndef MP-WEIXIN
      uni.chooseImage({
        count: 1,
        success: (res) => {
          resolve(res.tempFilePaths[0]) // 注意：此处返回值是 tempFilePaths
        },
        fail: (err) => {
          console.error('选择图片失败：', err)
          reject(err)
        },
      })
      // #endif
    })
  }

  const run = () => {
    return new Promise<T>((resolve, reject) => {
      loading.value = true
      // 如果已经选择了图片，则直接上传
      if (tempFilePath) {
        uploadFile<T>({
          tempFilePath,
          formData,
          data,
          error,
          loading,
          resolve,
          reject,
          onProgress: options.onProgress,
        })
        return
      }

      // 否则，先选择图片
      chooseImage()
        .then((filePath) => {
          tempFilePath = filePath
          uploadFile<T>({
            tempFilePath,
            formData,
            data,
            error,
            loading,
            resolve,
            reject,
            onProgress: options.onProgress,
          })
        })
        .catch((err) => {
          loading.value = false
          error.value = true
          reject(err)
        })
    })
  }

  return { loading, error, data, run }
}
function uploadFile<T>({
  tempFilePath,
  formData,
  data,
  error,
  loading,
  resolve,
  reject,
  onProgress,
}: {
  tempFilePath: string
  formData: FormData
  data: Ref<T | undefined>
  error: Ref<boolean>
  loading: Ref<boolean>
  resolve: (value: T) => void
  reject: (reason?: any) => void
  onProgress?: (progress: number) => void
}) {
  uni.uploadFile({
    url: VITE_UPLOAD_BASEURL,
    filePath: tempFilePath,
    name: 'file',
    formData,
    success: (uploadFileRes) => {
      data.value = uploadFileRes.data as T
      resolve(uploadFileRes.data as T)
    },
    fail: (err) => {
      console.error('上传文件失败：', err)
      error.value = true
      reject(err)
    },
    complete: () => {
      loading.value = false
    },
    // 添加上传进度回调函数
    progress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onProgress(progress)
      }
    },
  })
}
