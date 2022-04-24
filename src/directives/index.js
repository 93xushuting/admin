// import Vue from 'vue'
const requireComponent = require.context(
  './modules', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /([A-Z]|\w+)\.(js|vue)$/ // 匹配基础组件文件名的正则表达式
)
// 注册全局指令
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  let componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
  console.info('注册全局指令 : ' + componentName)
  Vue.directive(componentName, componentConfig.default || componentConfig) // 全局注册组件
})
