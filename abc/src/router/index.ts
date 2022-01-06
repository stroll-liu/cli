import { createRouter, createWebHistory } from 'vue-router'
import route from './routes'
import before from './beforeEach'
import after from './afterEach'

export const routes = route
export const beforeEach = before
export const afterEach = after

export const router = createRouter({
  history: createWebHistory('/'),
  routes
})
router.beforeEach((to, from, next) => {
  beforeEach(to, from, next)
})
router.afterEach(() => {
  afterEach()
})

export default router
