import { pages, subPackages } from '@/pages.json'
import { useNetworkStore } from '@/store/network'

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = async () => {
  // 动态导入 pages.json，确保 tabBar 配置存在时才使用
  const config: any = await import('@/pages.json')
  const tabBar = config?.tabBar
  if (!tabBar || !tabBar.list || tabBar.list.length < 2) {
    return false
  }
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  const lastPage = getCurrentPages().at(-1)
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路劲和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const pages = getCurrentPages()
  const lastPage = pages[pages.length - 1]
  const { route } = lastPage
  console.log('route', route)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(route)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')

  const query: Record<string, string> = {}
  // 判断 queryStr 是否存在，避免报错
  if (queryStr) {
    queryStr.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      query[key] = ensureDecodeURIComponent(value)
    })
  }

  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = '') => {
  console.log('pages', pages)
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  console.log('mainPages', mainPages)
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getAllPagePaths = (): string[] => getAllPages().map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 判断是否有网
 */
export const checkNetwork = (): boolean => {
  const networkStore = useNetworkStore()
  return networkStore.isOnline
}

// 深拷贝
export function deepCopy<T>(obj: T, hash = new WeakMap()): T {
  // 如果是基本类型或者函数，则直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 如果已经拷贝过该对象，则直接返回拷贝后的对象
  if (hash.has(obj)) {
    return hash.get(obj)
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const arrCopy = obj.slice() as any[]
    hash.set(obj, arrCopy)
    arrCopy.forEach((item, index) => {
      arrCopy[index] = deepCopy(item, hash)
    })
    return arrCopy as any as T
  }

  // 处理对象
  const clonedObj: any = {}
  hash.set(obj, clonedObj)
  Object.keys(obj).forEach((key) => {
    clonedObj[key] = deepCopy(obj[key], hash)
  })

  // 处理原型链上的属性
  const prototype = Object.getPrototypeOf(obj)
  if (prototype !== null) {
    Object.setPrototypeOf(clonedObj, deepCopy(prototype, hash))
  }

  return clonedObj as T
}
