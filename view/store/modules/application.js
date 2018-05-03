import { application } from '../../api'

const state = {
  totalNumber: 0,
  list: []
}

const actions = {
  FETCH ({ commit, state }, params) {
    return application.loadList(params)
      .then(res => {
        const data = res.data.data
        commit('SET_VALUE', data)
        return res
      })
  },

  CREATE ({ commit, state }, params) {
    return application.create(params)
  },

  UPDATE ({ commit, state }, params) {
    return application.update(params)
  },

  DELETE ({ commit, state }, params) {
    return application.delete(params)
  }
}

const mutations = {
  SET_VALUE (state, { list, totalNumber }) {
    state.totalNumber = totalNumber
    state.list.splice(0, state.list.length, ...list)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
