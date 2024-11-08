import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: any) => uni.setStorageSync(key, value),
    },
  }),
)

export default store

// 模块统一导出
export * from './user'
export * from './dict'
export * from './network'
export * from './common'
