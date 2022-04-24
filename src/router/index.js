import { tryHideFullScreenLoading } from '../api/http'

let requireComponent = require.context('./modules', false, /([A-Z]|\w+)\.(js)$/) // p 端
function lazy (pages) {
  return resolve => {
    return require([`@/views${pages}`], resolve)
  }
}
const buildPage = function (array) {
  let childrenList = []
  for (let i = 0; i < array.length; i++) {
    let item = array[i]
    if (item.children) {
      for (let childItem of item.children) {
        let obj = Object.assign({}, childItem)
        obj.path = item.path + obj.path
        obj.component = lazy(childItem.component)
        childrenList.push(obj)
        // console.info('childrenList', obj)
      }
    } else {
      let obj = Object.assign({}, item)
      obj.component = lazy(obj.component)
      childrenList.push(obj)
    }
  }
  return childrenList
}
window.allStaticRouter = ((list) => {
  let listRouter = []
  list.forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    listRouter = listRouter.concat(buildPage(componentConfig.default || componentConfig))
  })
  return listRouter
})(requireComponent.keys())
console.info('aaaaaaaaaa', window.allStaticRouter)

const router = new VueRouter({
  mode: 'history', // 去掉#
  routes: [
    // { path: '/index', name: 'home', redirect: '/home', component: lazy('/home'), children: window.allStaticRouter },
    { path: '/index', name: 'home', redirect: '/home', component: lazy('/home'), children: [] },
    { path: '/', redirect: 'login' },
    { path: '/login', name: 'login', component: lazy('/login/login.vue') },
    { path: '/resetpwd', name: 'resetPwd', component: lazy('/resetPwd/resetPwd.vue') },
    { path: '/job', name: 'job', component: lazy('/job.vue') },
    { path: '/douyin', name: 'douyin', component: lazy('/douyin.vue') },
    { path: '/officialweb', name: 'officialWeb', component: lazy('/officialWeb/officialWeb.vue') },
    { path: '/officialwebmini', name: 'officialWebMini', component: lazy('/officialWeb/officialWebMini.vue') },
    { path: '/officialwebLink', name: 'officialwebLink', component: lazy('/officialWeb/officialwebLink.vue') },
    { path: '/404', name: '404', component: lazy('/404') }
  ]
})
// 在跳转之前执行
window.startGoTime = new Date().getTime()
router.beforeEach((to, from, next) => {
  window.BtnId = (to.meta && to.meta.btnId) || -1
  Vue.BtnId = window.BtnId
  // console.info('在跳转之前执行', BtnId)
  if (to.path === '/officialweb' || to.path === '/officialwebmini' || to.path === '/officialwebLink') {
    document.title = '微海招聘'
  } else {
    document.title = '职微你'
  }
  if (to.path === '/douyin' || to.path === '/job' || to.path === '/resetpwd' || to.path === '/officialweb' || to.path === '/officialwebmini' || to.path === '/officialwebLink') {
    next()
  } else {
    // _fn.addEventGlobal() // 全局刷新token
    window.BtnId = (to.meta && to.meta.btnId) || -1
    console.info('在跳转之前执行', BtnId)
    if (!_store.state.menu.obj.menus || _store.state.menu.obj.menus.length === 0) { // 添加动态路由
      if (to.path !== '/login') {
        _auth.addRoute((paths) => {
          startGoTime = new Date().getTime()
          let diff = ((parseInt(startGoTime) - parseInt(window.endGoTime)) / 1000).toFixed(2)
          _ubt.go('goin', '进入' + to.path + ' 在' + from.path + ' 页面停留了 ' + diff + ' S', {}) // 进入、离开
          if (paths && paths.length) {
            let isTrue = paths.some((item) => {
              return to.path.indexOf(item.path) > -1
            })
            if (!isTrue) {
              if (to.path !== '/login') {
                next({ path: '/404' })
              }
            }
          }
        })
      }
    } else if (_store.state.menu.obj.token !== localStorage.getItem('zp_token')) {
      _store.state.menu.obj.menus = []
      _router.push('/login')
    }
    Vue._axiosPromiseArr && Vue._axiosPromiseArr.forEach((ele, index) => {
      ele.cancel()
      delete Vue._axiosPromiseArr[index]
      tryHideFullScreenLoading()
    })
    next()
  }
})

// 在跳转之后执行
router.afterEach((to, from, next) => {
  window.endGoTime = new Date().getTime()
  _ubt.go('goto', '离开' + from.path, {}) // 进入、离开
  NProgress.done()
  console.info('在跳转之后执行 --------------- ')

  if (!(to.path === '/douyin' || to.path === '/job' || to.path === '/resetpwd' || to.path === '/officialweb' || to.path === '/officialwebmini' || to.path === '/officialwebLink' || to.path === '/login')) {
    _fn.forceMessageList() // 页面强提醒消息列表
  }
})
export default router
