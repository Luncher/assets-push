import { misc } from '../../api'

const state = {
  qiniuToken: ''
}

const actions = {
  QINIU_TOKEN ({ commit, state }, params) {
    return misc.getQiniuToken()
      .then(res => {
        const data = res.data.data
        commit('SET_TOKEN', data)
        return res
      })
  },
  QINIU_MD5 ({ commit, state }, params) {
    console.log('params: ', params)
    return misc.getResourceMD5(params)
      .then(res => res.data && res.data.data)
  }
}

const mutations = {
  SET_TOKEN (state, token) {
    state.qiniuToken = token
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
