// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
const requireComponent = require.context(
  './modules', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /([A-Z]|\w+)\.(js)$/ // 匹配基础组件文件名的正则表达式
)
let stroe = {
  modules: ((keys) => {
    let map = {}
    keys.forEach(fileName => {
      const componentConfig = requireComponent(fileName)
      let name = fileName.split('/').pop().replace(/\.\w+$/, '')
      map[name] = (componentConfig.default || componentConfig)
    })
    return map
  })(requireComponent.keys()),
  state: {},
  mutations: {},
  actions: {},
  strict: false
}
export default new Vuex.Store(stroe)
