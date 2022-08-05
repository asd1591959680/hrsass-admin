import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600 //定义超时
// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
// 创建一个axios的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
})
// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (isCheckTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }

    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}),
  error => {
    return Promise.reject(error)
  }
// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  //Token失效的被动处理
  error => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }

    return Promise.reject(error)
  }
)

function isCheckTimeOut() {
  let currentTime = Date.now()
  let timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
