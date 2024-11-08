/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useUserStore, useCommonStore } from '@/store'
import { platform } from '@/utils/platform'
import { checkAndRedirect } from '@/interceptors/route'

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址

const getDynamicRequestURL = () => {
  const serviceAddress = useCommonStore().commonInfo.serviceAddress // 从本地存储获取 serviceAddress
  console.error('getDynamicRequestURL', serviceAddress)
  return (
    `${serviceAddress}${import.meta.env.VITE_BASE_URL}` ||
    `${import.meta.env.VITE_SERVER_BASEURL}${import.meta.env.VITE_BASE_URL}`
  )
}

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    const baseUrl = getDynamicRequestURL()
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__) || JSON.parse(__VITE_APP_MOCK__)) {
        // 啥都不需要做
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 20000 // 10s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      // platform, // TOTD: 涉及CORS（跨域资源共享），暂时先注释掉。  可选，与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }
    // 3. 添加 token 请求头标识
    const userInfo = useUserStore().userInfo || {}
    const token = userInfo.token
    if (token) {
      // options.header['X-Access-Token'] = token
      options.header.Authorization = token
    }
    console.log('完整参数-invoke', options)
  },
  success(args) {
    console.log('interceptor-success', args)
    if (args.statusCode === 500) {
      if (args.data.message.indexOf('Token失效') >= 0) {
        const userStore = useUserStore()
        userStore.clearToken()
        checkAndRedirect()
      }
    }
  },
  fail(err) {
    console.log('interceptor-fail', err)
  },
  complete(res) {
    // console.log('interceptor-complete', res)
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
