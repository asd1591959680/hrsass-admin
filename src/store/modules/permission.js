import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes,
  //asyncRoutess是所有静态路由
}

const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  },
}
const actions = {
  //asyncRoutess是所有动态路由
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
      // routes就是当前用户所拥有的 动态路由的权限
    })
    context.commit('setRoutes', routes)
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
