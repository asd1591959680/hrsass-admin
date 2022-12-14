import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'

// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {}, //会在getters中引用userinfo的变量，如果设置为null，则会引起异常和报错
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // vuex变化 => 缓存数据
    setToken(token) //vuex和 缓存数据的同步
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() //再清除缓存 vuex和 缓存数据的同步
  },
  removeUserInfo(state) {
    state.userInfo = {}
  },
}
// 执行异步
const actions = {
  async Logins(context, data) {
    const res = await login(data)
    // axios默认给数据加了一层data

    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', res)
    //token超时
    setTimeStamp()
  },
  async _getUserInfo({ commit }) {
    const info = await getUserInfo()
    const img = await getUserDetailById(info.userId)
    const res = { ...info, ...img }
    commit('setUserInfo', res)
    return res
  },
  logout({ commit }) {
    commit('removeToken')
    commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
