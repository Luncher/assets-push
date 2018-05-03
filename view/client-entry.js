import Vue from 'vue'
import iView from 'iview'
import { createApp } from './app'
const { app, store, router } = createApp()

Vue.mixin({
  beforeRouteUpdate: (to, from, next) => {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const actived = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = actived.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }
    iView.LoadingBar.start()
    Promise.all(asyncDataHooks.map(hook => {
      return hook({ store, route: to })
    })).then(() => {
      iView.LoadingBar.finish()
      next()
    }).catch(next)
  })
  app.$mount('#app')
})
