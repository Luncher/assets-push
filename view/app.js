'use strict'

import Vue from 'vue'
import iview from 'iview'
import App from './App.vue'
import * as filters from './filters'
import { sync } from 'vuex-router-sync'
import { createStore } from './store'
import { createRouter } from './router'
import './styles/index.css'

Vue.use(iview)

Object.keys(filters).forEach(it => {
  Vue.filter(it, filters[it])
})

export function createApp () {
  const store = createStore()
  const router = createRouter()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
