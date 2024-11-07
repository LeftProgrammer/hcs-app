import { http } from '@/utils/http'
// 登录
export const login = (data) => {
  return http({
    url: `/login`,
    method: 'POST',
    data,
  })
}
// 获取验证码
export const getCaptcha = () => {
  const currdatetime = new Date().getTime()
  return http({
    url: `/sys/randomImage/${currdatetime}`,
    method: 'GET',
  })
}

// 获取方案
export const getDesignPlan = () => {
  return http({
    url: `/designPlan/list`,
    method: 'GET',
  })
}
