/**
 * axios 使用方法
 * this._api.['方法名']('参数').then(() => {})
 */
// import Vue from 'vue'
import Http from './http'

const requireComponent = require.context(
  './modules', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /([A-Z]|\w+)\.(js)$/ // 匹配基础组件文件名的正则表达式
)
let maps = {}
requireComponent.keys().forEach((fileName, index) => {
  const componentConfig = requireComponent(fileName)
  let page = componentConfig.default || componentConfig
  Object.assign(maps, page)
})

let http = new Http()
window._api = Vue.prototype._api = ((m) => {
  let obj = {}
  for (let key in m) {
    obj[key] = (o => {
      return params => {
        if (window._fn.isObject(o)) {
          return http[o.type](o.url, params)
        } else {
          return http.post(o, params)
        }
      }
    })(m[key])
  }
  console.info('http:', obj)
  return obj
})(maps)
