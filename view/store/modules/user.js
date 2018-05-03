import { user } from '../../api'

const state = {
  id: '',
  avatar: '',
  username: ''
}

const getters = {
  isSignin: function (state) {
    return !!(state.id && state.username)
  }
}

const actions = {
  USER_INFO: function ({ commit, state }, params) {
    return user.getUserInfo(params)
      .then(res => {
        const profile = res.data.data
        commit('SET_VALUE', profile)
      })
  },

  SIGN_IN: function ({ commit, state }, params) {
    return user.signin(params)
      .then(res => {
        const profile = res.data.data
        commit('SET_VALUE', profile)
        return res
      })
  },

  SIGN_OUT: function ({ commit, state }) {
    user.signout()
      .then(profile => {
        commit('SET_VALUE', {})
      })
  }
}

const mutations = {
  SET_VALUE (state, profile) {
    state.id = profile.id
    state.avatar = profile.avatar
    state.username = profile.username
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
