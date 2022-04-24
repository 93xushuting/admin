// import Vue from 'vue'
const requireComponent = require.context(
  './common', // 其组件目录的相对路径
  true, // 是否查询其子目录
  /([A-Z]|\w+)\.(vue)$/ // 匹配基础组件文件名的正则表达式
)
let hyphenate = (s) => {
  return s.replace(s.charAt(0), s.charAt(0).toUpperCase()) // 首字母大写
}
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  let name = fileName.split('/').pop().replace(/\.\w+$/, '')
  let componentName = 'zp' + hyphenate(name)
  console.info('全局注册组件:' + componentName)
  Vue.component(componentName, componentConfig.default || componentConfig) // 全局注册组件
})

/**
 * test -- zpButton
 * <zpButton :type="'primary'" @click="testBtn">测试zp-button</zpButton>
 * <zp-button :type="'primary'" @click="testBtn">测试zp-button</zp-button>
 */
