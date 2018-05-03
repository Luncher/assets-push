import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import misc from './modules/misc'
import project from './modules/project'
import application from './modules/application'
import patch from './modules/patch'
import statistics from './modules/statistics'

Vue.use(Vuex)

export function createStore () {
  const store = new Vuex.Store({
    modules: {
      user,
      misc,
      patch,
      project,
      application,
      statistics
    },
    strict: true
  })

  return store
}
