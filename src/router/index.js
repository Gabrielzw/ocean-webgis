import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '~/views/Index.vue'
import About from '~/views/AboutView.vue'
import NotFound from '~/views/404.vue'
import Login from '~/views/Login.vue'

import FIndex from '../layouts/FIndex.vue'
import AboutView from '../views/AboutView.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

const routes = [
  { 
    path: '/', 
    component: Index, 
  },
  { 
    path: '/about', 
    component: About, 
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
  // {
  //   path: '/login',
  //   component: Login,
  //   meta: { title: '登录' }
  // }, 
]

const router = createRouter({
  // 路由数据
  routes,
  // 路由匹配模式（哈希）
  history: createWebHashHistory(),
})

// 动态路由
// const asyncRoutes = [
//   {
//     path: '/',
//     name: '/',
//     component: FIndex,
//   },
//   {
//     path: '/goods/list',
//     name: '/goods/list',
//     component: GoodsList,
//     meta: { title: '商品管理' }
//   }
// ]

export default router