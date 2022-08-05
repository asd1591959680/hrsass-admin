import request from '@/utils/request'

//获取组织架构数据

export function getDepartments() {
  return request({
    url: '/company/department',
  })
}
// 根据id根据部门 删除功能

export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
  })
}
// 根据id根据部门 新增功能
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data,
  })
}
// 根据id根据部门 获取详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
  })
}
// 根据id根据部门 获取详情
export function upadteDeparts(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data,
  })
}
