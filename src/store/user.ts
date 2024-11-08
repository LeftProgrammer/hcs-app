import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userLogout } from '@/service/home'
import { useToast } from '@/utils/modals'

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
    const userInfo: any = ref({ ...initState })

    const clearToken = () => {
      userInfo.value.token = ''
    }
    const setUserInfo = (val) => {
      userInfo.value = val
    }
    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    const setPassword = (val) => {
      userInfo.value.password = val
    }
    const clearPassword = () => {
      userInfo.value.password = ''
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }

    const logout = async () => {
      const { code } = await userLogout()
      if (code === 200) {
        clearToken()
        useToast('退出成功')
        uni.navigateTo({ url: '/pages/login/index' })
      } else {
        useToast('退出失败')
      }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      clearToken,
      setUserInfo,
      clearUserInfo,
      setPassword,
      clearPassword,
      reset,
      logout,
      isLogined,
    }
  },
  {
    persist: true,
  },
)
