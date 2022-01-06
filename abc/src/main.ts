import { createApp } from 'vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, beforeEach, afterEach } from "./router"

import store from "./store"
import API from './api'
import App from './App.vue'

import './assets/stylus/Init'

const { __POWERED_BY_QIANKUN__ } = qiankunWindow
let router = null
let instance: any = null
let history: any = null

function render(props: any = {}) {
  const { container, name } = props
  const historyAddress = __POWERED_BY_QIANKUN__
    ? name
    : '/'
  history = createWebHistory(historyAddress);
  router = createRouter({
    history,
    routes
  })
  router.beforeEach((to, from, next) => {
    beforeEach(to, from, next)
  })
  router.afterEach(() => {
    afterEach()
  })

  instance = createApp(App);
  instance.use(API)
  instance.use(router)
  instance.use(store)
  instance.mount(container
    ? container.querySelector('#abc')
    :document.getElementById('abc'))
}

renderWithQiankun({
  mount(props) {
    render(props)
  },
  bootstrap() {
    console.log('bootstrap')
  },
  unmount(props) {
    instance.unmount()
    instance._container.innerHTML = ''
    history.destroy()
    router = null
    instance = null
  },
})

if (!__POWERED_BY_QIANKUN__) {
  render()
}
