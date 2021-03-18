import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './assets/css/base.css'

import socket from './plugins/socketCon'

// 导入全局组件
import SnackBar from 'components/SnackBar'
Vue.use(SnackBar)
Vue.component('snack-bar', SnackBar)

Vue.config.productionTip = false

Vue.prototype.$socket = socket

// 创建公共管理 bus
const bus = new Vue()
Vue.prototype.$bus = bus

router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  if (to.name !== 'login' && !token) {
    store.commit('change', {
      text: '请先登录',
      color: 'red',
      timeout: 1300
    })
    return next('/login')
  }
  next()
})


new Vue({
  router,
  store,
  vuetify,
  component: {
    SnackBar
  },
  render: h => h(App)
}).$mount('#app')