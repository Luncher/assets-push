import { project } from '../../api'

const state = {
  totalNumber: 0,
  list: [],
  platforms: [
    {
      name: 'Android'
    },
    {
      name: 'IOS'
    }
  ],
  updateActions: [
    {
      name: 'OPTIONAL',
      desc: '可选'
    },
    {
      name: 'FORCE',
      desc: '强制'
    }
  ],
  channels: [],
  currentProject: {
    name: '',
    intro: '',
    id: -1
  }
}

const actions = {
  FETCH ({ commit, state }, params) {
    return project.loadList(params)
      .then(res => {
        const data = res.data.data
        commit('SET_VALUE', data)
        return res
      })
  },

  SETUP ({ commit, state }, data) {
    commit('SET_PROJECT', data)
  },

  FIND_CHANNELS ({ commit, state }, params) {
    return project.loadChannels(params)
      .then(res => {
        const data = res.data.data
        commit('SET_CHANNELS', data)
        return res
      })
  },

  FIND_ONE ({ commit, state }, params) {
    return project.findOne(params)
      .then(res => {
        const data = res.data.data
        commit('SET_PROJECT', data)
        return res
      })
  },

  CREATE ({ commit, state }, params) {
    return project.create(params)
  },

  UPDATE ({ commit, state }, params) {
    return project.update(params)
  },

  DELETE ({ commit, state }, params) {
    return project.delete(params)
  }
}

const mutations = {
  SET_VALUE (state, { list, totalNumber }) {
    state.totalNumber = totalNumber
    state.list.splice(0, state.list.length, ...list)
  },
  SET_CHANNELS (state, channels) {
    state.channels.splice(0, state.channels.length, ...channels)
  },
  SET_PROJECT (state, project) {
    state.currentProject.id = project.id
    state.currentProject.name = project.name
    state.currentProject.intro = project.intro
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
