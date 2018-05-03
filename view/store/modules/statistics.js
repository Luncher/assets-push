import { statistics } from '../../api'

const state = {
  patchStatistics: {
    totalNumber: 0,
    list: []
  }
}

const actions = {
  FETCH ({ commit, state }, params) {
    return statistics.loadPatchList(params)
      .then(res => {
        const data = res.data.data
        commit('SET_VALUE', data)
        return res
      })
  }
}

const mutations = {
  SET_VALUE (state, { list, totalNumber }) {
    state.patchStatistics.totalNumber = totalNumber
    state.patchStatistics.list.splice(0, state.patchStatistics.list.length, ...list)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
