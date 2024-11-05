import { http } from '@/utils/http'

export const getDict = (data) => {
  return http({
    url: `/sys/dict/getDictItems/${data}`,
    method: 'GET',
  })
}
