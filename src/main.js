import App from './App.vue'
import './api/index' // 所有接口
import '@/util/auth'
import store from './store/index'
import router from './router/index'
import globalFun from '@/util/global_fun'
import baseData from '@/util/baseData'

// 全局样式
import '@/assets/style/main.less'
import '@/components/regerist' // 引入全局公共组件
import '@/directives/index' // 全局指定
import '@/filters/index' // 全局过滤器
import '@/util/downloadBlob' // 下载文件bold post
import '@/util/tableColumnFormat' // 表格筛选
import Sortable from 'sortablejs' // 表格拖拽排序
import '@/util/oss'
import formCheck from '@/util/formCheck'
import VueClipboard from 'vue-clipboard2'
import ElTreeGrid from 'element-tree-grid'
import * as echarts from 'echarts'
Vue.use(VueClipboard)
Vue.component(ElTreeGrid.name, ElTreeGrid)

window.echarts = echarts

Vue.config.devtools = true

NProgress.configure({ showSpinner: false, easing: 'ease', speed: 500 })
window.NProgress = NProgress
Vue.prototype._baseData = window._baseData = baseData
Vue.prototype._fn = window._fn = globalFun // 公共方法

Vue.prototype.notify = function (msg = '', type = 'error', title = '提示') {
  this.$notify.closeAll()
  this.$notify({ title: title, message: decodeURIComponent(msg), offset: 60, duration: 2000, type: type })
}
window._store = store
window._router = router
window.Sortable = Sortable
window.formCheck = formCheck
if (APPNAME) {
  console.log('APPNAME log', APPNAME)
}
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
