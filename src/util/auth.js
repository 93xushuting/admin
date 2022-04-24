import menus from '@/router/menu'
// 权限
window.allPath_ = {}
window._auth = Vue.prototype._auth = {
  /* 动态路由 */
  addRoute (fn) {
    // console.info(' ---------------', _store.state.menu.obj)
    if (!(_store.state.menu.obj && _store.state.menu.obj.length)) { // 添加动态路由
      window.allPath_ = {}
      _api.public_menu_list().then((res2) => {
        let _menus = []
        let data = res2.data || []
        if (data) {
          let sortMenus = this.sortData(data)
          _store.dispatch('menu/setObj', sortMenus) // 设置菜单
          // // 动态添加路由
          _menus = this.buildRouter(data, window.allStaticRouter)
          // console.info(' ---------------', _menus)
          window.btns = this.getBtns(data, {})
          window.btnsIds = this.getBtns2(data, {}) // 权限按钮时用到
          console.info('btns......', btns)
          console.info('btnsIds......', btnsIds)
          var curRouter = _router.options.routes
          curRouter[0].children = [...[], ..._menus]
          _router.addRoutes(curRouter)
          // console.info('bbbbbbbbb', curRouter)
        }
        fn && fn(_menus)
      })
    } else {
      fn && fn()
    }
  },
  sortData (data) { // 前端菜单排序
    let sortMenus = []
    let menuMap = {}
    let srotMenu = {
      home: 1, // 首页
      recruit: 2, // 招聘需求
      position: 3, // 职位
      delivery: 4, // 投递
      personnel: 5, // 人才库
      operationCenter: 6, // 运营中心
      dataAnalysis: 7, // 数据分析
      // reminder: 8, // 站内提醒
      setting: 9 // 设置
    }
    data.forEach((element, index) => {
      menuMap[element.path.replace('/', '')] = element
      if (data.length - 1 === index) {
        for (var i in srotMenu) {
          if (menuMap[i]) {
            sortMenus.push(menuMap[i])
          }
        }
      }
    })
    return sortMenus
  },
  buildRouter (server, local) {
    let ret = []
    if (server && server.length) {
      let maps = this.build(server, {})
      // console.info('getRouter -----------------------------', maps)
      for (let i = 0; i < local.length; i++) {
        let item = local[i]
        if (item.path.indexOf(':id') >= 0) {
          let obj = maps['/' + item.path.split('/')[1]]
          if (obj) {
            item.meta = Object.assign({ btnId: obj.id }, item.meta)
          }
          window.allPath_[item.path] = item
          // console.info('item -------------------------------- ', item)
          ret.push(item)
        } else {
          let obj = maps[item.path]
          if (obj) {
            obj.component = item.component
            obj.redirect = item.redirect
            obj.name = item.name
            obj.path = item.path
            obj.meta = Object.assign({ btnId: obj.id }, item.meta)
            window.allPath_[item.path] = obj
            ret.push(obj)
            // console.info('obj -------------------------------- ', obj)
          }
        }
      }
    }
    // console.info(JSON.stringify(ret))
    return ret
  },
  build (server = [], map, path) {
    for (let i = 0; i < server.length; i++) {
      let item = server[i]
      if (item.name === '招聘设置') {
        let str = item.resourceList.filter(i => { return i.name === '消息设置' })
        if (!str.length) {
          item.resourceList.push({
            path: '/messageSetting',
            name: 'messageSetting',
            meta: {
              name: '消息设置'
            },
            component: '/setting/messageSetting/index',
            hidden: true
          })
        }
      }
      if (item.resourceList && item.resourceList.length && item.resourceList[0].type === 'MENU') {
        this.build(item.resourceList, map, item.path)
      } else {
        map[path ? path + item.path : item.path] = {
          id: item.id,
          name: item.name,
          icon: item.icon,
          path: item.path,
          meta: Object.assign({ btnId: item.id })
        }
      }
    }
    return map
  },
  getBtns (server = [], map) { // 获取所有的页在的按钮
    for (let i = 0; i < server.length; i++) {
      let item = server[i]
      if (item.resourceList && item.resourceList.length) {
        this.getBtns(item.resourceList, map)
      } else {
        if (item.type === 'BUTTON') {
          if (!map[item.parent]) {
            map[item.parent] = {}
          }
          map[item.parent][item.path] = item.name
        }
      }
    }
    return map
  },
  getBtns2 (server = [], map) { // 获取所有的页在的按钮
    for (let i = 0; i < server.length; i++) {
      let item = server[i]
      if (item.resourceList && item.resourceList.length) {
        this.getBtns2(item.resourceList, map)
      } else {
        if (item.type === 'BUTTON') {
          if (!map[item.parent]) {
            map[item.parent] = []
          }
          map[item.parent].push(item.id)
        }
      }
    }
    return map
  }
}
