import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data,
  })
}
//  获取用户的基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}
//显示头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
  })
}
