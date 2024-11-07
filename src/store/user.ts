import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 初始状态
const initState = {
  id: '',
  nickname: '',
  role: '',
  token: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...initState })
    const token = ref('')
    const encryptedPassword = ref('')

    const setToken = (val) => {
      token.value = val
    }
    const clearToken = () => {
      token.value = ''
    }
    const setUserInfo = (val) => {
      userInfo.value = val
    }
    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    const setEncryptedPassword = (val) => {
      encryptedPassword.value = val
    }
    const clearEncryptedPassword = () => {
      encryptedPassword.value = ''
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
      token.value = ''
      encryptedPassword.value = ''
    }
    const isLogined = computed(() => !!token.value)

    return {
      token,
      setToken,
      clearToken,
      userInfo,
      setUserInfo,
      clearUserInfo,
      encryptedPassword,
      setEncryptedPassword,
      clearEncryptedPassword,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
