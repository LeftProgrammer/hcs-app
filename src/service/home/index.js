import { http } from '@/utils/http'
// 登录
export const login = (data) => {
  return http({
    url: `/sys/login`,
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

// 获取人员
export const queryByUsername = (data) => {
  return http({
    url: `/person/personInfo/queryByUsername`,
    method: 'GET',
    data,
  })
}

// 设置应用
export const addMenus = (data) => {
  return http({
    url: `/quickentry/quickEntryRecord/add`,
    method: 'POST',
    data,
  })
}
// 获取应用
export const getMenus = (data) => {
  return http({
    url: `/quickentry/quickEntryRecord/queryByLoginUser`,
    method: 'GET',
    data,
  })
}

// 获取用户应用权限
export const getPermissionMenus = () => {
  return http({
    url: `/sys/permission/getUserPermissionByToken`,
    method: 'GET',
  })
}
