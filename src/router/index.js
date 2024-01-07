import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/anime/view',
      children: [
        {
          path: '/anime/view',
          component: () => import('@/views/anime/AnimeView.vue')
        },
        {
          path: '/episode/view',
          component: () => import('@/views/episode/EpisodeView.vue')
        },
      ]
    }
    ]
})
//全局导航守卫
router.beforeEach((to) => {
  const useStore = useUserStore()
  // 没有拿到token, 就会回到login页面
  if (!useStore.token && to.path !== '/login') return '/login'
  return true
})
export default router
