/* eslint prefer-promise-reject-errors: 0 */

import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

let serverCookies
export { serverCookies }

export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, store, router } = createApp()
    const { url, cookies } = context
    serverCookies = cookies

    router.push(url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        console.log(url, ' not found ')
        return reject({ code: 404 })
      }
      return Promise.all(matchedComponents.map(({ asyncData }) => {
        if (asyncData) {
          return asyncData({store, route: router.currentRoute})
        }
      })).then(() => {
        isDev && console.log(`data preFetch: ${Date.now() - s}ms`)
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
