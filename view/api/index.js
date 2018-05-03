import axios from 'axios'
import iView from 'iview'
import { serverCookies } from '../server-entry'

const timeout = 30000
const isClient = process.env.VUE_ENV === 'client'
const baseURL = isClient ? '/api' : sails.config.fe.apiPrefix

const request = axios.create({
  baseURL,
  timeout
})

const createAPI = (method, url, config = {}) => {
  return request({
    url,
    method,
    ...config
  })
}

const loading = {
  start: function () {
    if (!isClient) return
    iView.LoadingBar.start()
  },

  finish: function () {
    if (!isClient) return
    iView.LoadingBar.finish()
  }
}

request.interceptors.request.use(config => {
  if (!isClient) {
    config.headers.Cookie = serverCookies
  }
  loading.start()
  return config
}, error => Promise.reject(error))

request.interceptors.request.use(config => {
  if (config && config.data && config.url.indexOf(':') > 0) {
    const matchs = config.url.match(/:(.+)/)
    if (matchs != null) {
      const value = config.data[matchs[1]]
      config.url = config.url.replace(/:(.+)/, value)
    }
  }
  return config
}, error => Promise.reject(error))

request.interceptors.response.use(res => {
  const body = res.data
  const messageDefault = res.config.messageDefault
  if (body.code !== 0) {
    if (isClient) {
      iView.Message.error(messageDefault || body.message || '操作失败')
    }
    return Promise.reject(res)
  }
  loading.finish()
  return res
}, error => {
  loading.finish()
  const res = error.response
  if (res) {
    const messageDefault = res.config.messageDefault
    const msg = res.data.message
    if (isClient) {
      iView.Message.error(messageDefault || msg)
    }
  }

  return Promise.reject(error)
})

const misc = {
  getResourceMD5: config => createAPI('get', '/qiniu/md5', config),
  getQiniuToken: config => createAPI('get', '/qiniu/token', config)
}

const user = {
  signin: config => createAPI('post', '/sessions', config),
  signout: config => createAPI('delete', '/sessions', config),
  getUserInfo: config => createAPI('get', '/sessions', config)
}

const project = {
  loadList: config => createAPI('get', '/projects', config),
  loadChannels: config => createAPI('get', '/projects/channels', config),
  create: config => createAPI('post', '/projects', config),
  update: config => createAPI('patch', '/projects/:id', config),
  delete: config => createAPI('delete', '/projects/:id', config),
  findOne: config => createAPI('get', '/projects/:id', config)
}

const application = {
  loadList: config => createAPI('get', '/applications', config),
  create: config => createAPI('post', '/applications', config),
  update: config => createAPI('patch', '/applications/:id', config),
  delete: config => createAPI('delete', '/applications/:id', config)
}

const patch = {
  loadList: config => createAPI('get', '/patchs', config),
  create: config => createAPI('post', '/patchs', config),
  update: config => createAPI('patch', '/patchs/:id', config),
  delete: config => createAPI('delete', '/patchs/:id', config)
}

const statistics = {
  loadPatchList: config => createAPI('get', '/statistics/patchs', config)
}

export {
  user,
  misc,
  patch,
  project,
  application,
  statistics
}
