import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register.vue')
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/home',
    meta: { requiresAuth: true },     // 整个后台都需要登录
    children: [
      { path: 'home', component: () => import('@/views/home/index.vue'), meta: { title: '首页' } },
      { path: 'cat', component: () => import('@/views/cat/index.vue'), meta: { title: '猫咪档案' } },
      { path: 'feeding', component: () => import('@/views/feeding/index.vue'), meta: { title: '喂养记录' } },
      { path: 'adoption', component: () => import('@/views/adoption/index.vue'), meta: { title: '领养信息' } },
      { path: 'medical_record', component: () => import('@/views/medical_record/index.vue'), meta: { title: '健康管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (to.meta.requiresAuth && !token) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router 