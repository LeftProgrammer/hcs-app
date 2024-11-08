import { defineStore } from 'pinia'
import { ref } from 'vue'

// 初始状态
const initState = {
  serviceAddress: '',
  planObj: {
    name: '',
    id: '',
  },
}

export const useCommonStore = defineStore(
  'common',
  () => {
    const commonInfo = ref({ ...initState })

    // 设置服务地址
    const setServiceAddress = (address: string) => {
      commonInfo.value.serviceAddress = address
    }

    // 清除服务地址
    const clearServiceAddress = () => {
      commonInfo.value.serviceAddress = ''
    }

    // 设置方案对象
    const setPlanObj = (obj: { name: string; id: string }) => {
      commonInfo.value.planObj = obj
    }

    // 清除方案对象
    const clearPlanObj = () => {
      commonInfo.value.planObj = { name: '', id: '' }
    }

    // 重置所有状态
    const reset = () => {
      commonInfo.value = { ...initState }
    }

    return {
      commonInfo,
      setServiceAddress,
      clearServiceAddress,
      setPlanObj,
      clearPlanObj,
      reset,
    }
  },
  {
    persist: true, // 开启数据持久化
  },
)
