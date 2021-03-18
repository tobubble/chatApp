import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //  消息框的显示配置
    snackOption: {
      visible: false,
      text: '',
      timeout: 2000,
      color: 'primary',
    },
    // badge 徽章的显示信息(添加好友的徽章)
    badgeMessage: 0,
    // messageBadge (聊天消息)徽章的显示
    msgBadge: 0,
  },
  mutations: {
    // 修改消息框的配置
    change(state, payload) {
      const option = state.snackOption
      option.visible = true
      option.text = payload.text
      option.timeout = payload.timeout
      option.color = payload.color
    },
    changeBadge(state) {  // badge 自增1
      state.badgeMessage++
    },
    badgeMinus(state) {
      state.badgeMessage--
    },
    setBadge(state, payload) { // 设置 badge (初始化)
      state.badgeMessage = payload
    },
    changeMsgBadge(state) {  // badge 自增1
      state.msgBadge++
    },
    badgeMsgMinus(state, payload) {
      state.msgBadge = state.msgBadge - payload
    },
    setMsgBadge(state, payload) { // 设置 badge (初始化)
      state.msgBadge = payload
    }
  },
  actions: {

  },
  modules: {
  }
})
