import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const getComponent = page => () => import(`pages/${page}View`)

export function createRouter () {
  const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: getComponent('ProjectList') },
      { path: '/signin', component: getComponent('Signin') },
      { path: '/projects', component: getComponent('ProjectList') },
      { path: '/projects/:id', component: getComponent('Project') }
    ]
  })

  router.beforeEach((to, from, next) => {
    next()
  })

  return router
}
