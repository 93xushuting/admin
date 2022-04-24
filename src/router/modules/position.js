export default [
  {
    name: 'position',
    path: '/position',
    icon: 'iconfont iconzhiweiguanli',
    meta: {
      name: '职位管理'
    },
    component: '/position/index'
  },
  {
    name: 'positionInfo',
    path: '/position/info/:id',
    meta: {
      name: ' 职位详情'
    },
    component: '/position/info',
    hidden: true
  },
  {
    name: 'positionEdit',
    path: '/position/edit/:id',
    meta: {
      name: ' 编辑'
    },
    component: '/position/edit',
    hidden: true
  }
]
