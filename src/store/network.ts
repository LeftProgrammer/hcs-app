import { defineStore } from 'pinia'
import { useToast } from '@/utils/modals'

export const useNetworkStore = defineStore('network', () => {
  const isOnline = ref(true)

  const updateNetworkStatus = (networkType: string) => {
    isOnline.value = networkType !== 'none'
    console.error('isOnline.value======>', isOnline.value)
    useToast(`当前网络类型：${networkType}`)
  }

  const getNetworkStatus = () => {
    uni.getNetworkType({
      success: (res) => {
        updateNetworkStatus(res.networkType)
      },
    })
  }

  uni.onNetworkStatusChange((res) => {
    updateNetworkStatus(res.networkType)
  })

  getNetworkStatus()

  return { isOnline }
})
