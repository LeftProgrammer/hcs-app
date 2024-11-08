import { http } from '@/utils/http'
// 登录
export const userLogin = (data) => {
  return http({
    url: `/login`,
    method: 'POST',
    data,
  })
}
// 退出登录
export const userLogout = () => {
  return http({
    url: `/logout`,
    method: 'GET',
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

// 修改密码
export const updatePwd = (data) => {
  return http({
    url: `/updatePwd`,
    method: 'POST',
    data,
  })
}
