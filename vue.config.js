module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        network: '@/network',
        components: '@/components',
        views: '@/views',
        assets: '@/assets',
      }
    }
  },
  chainWebpack: config => {
    // 判断当前的环境 -------------- 生产环境
    config.when(process.env.NODE_env === 'production' || 'development', (config) => {
      // 设置入口函数
      config.entry('app').clear().add('./src/main-prod.js')

      // 配置当前的扩展, 如果文件使用了 import 语句的时候，不会将其打包，而是先看有没有外部资源能够使用
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        'vuetify': 'Vuetify',
        'vuex': 'Vuex'
      })

      // 给这个环境做一个标记, 以便于能在不同的环境使用不同的 Html
    })
  }
}