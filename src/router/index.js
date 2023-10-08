import useAuth from '@/plugins/authServices'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const {isAuthenticated}= useAuth()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !isAuthenticated()) {
    // if the route requires authentication and the user is not authenticated, redirect to the login page
    next('/login')
  } else if (to.name =='login' && isAuthenticated()) {
    // if the route does not require authentication and the user is authenticated, redirect to the dashboard page
    next('/')
  } else {
    // otherwise, allow access to the requested route
    next()
  }
})
export default router
