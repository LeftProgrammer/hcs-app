// src/stores/dictionary.ts
import { defineStore } from 'pinia'
import { getDict } from '@/service/dict/index'

export const useDictionaryStore = defineStore(
  'dictionary',
  () => {
    const dictionary = ref<any>({})

    const get = async (key, timeout: number = 30) => {
      const cachedItem = dictionary.value[key]
      if (
        cachedItem &&
        new Date().getTime() - cachedItem.timestamp < cachedItem.timeout * 24 * 60 * 60 * 1000
      ) {
        return cachedItem.data
      } else {
        const value = await fetchFromAPI(key)
        if (value.length > 0) set(key, value, timeout)
        return value
      }
    }
    const set = (key: string, data: any, timeout: number) => {
      dictionary.value[key] = { data, timestamp: new Date().getTime(), timeout }
    }
    const fetchFromAPI = async (key: string) => {
      const response = await getDict(key)
      return response.result || []
    }
    return {
      get,
      set,
      dictionary,
    }
  },
  {
    persist: true,
  },
)
