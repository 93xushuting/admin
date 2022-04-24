export default [
  {
    name: 'delivery',
    path: '/delivery',
    icon: 'iconfont icontoudiguanli',
    meta: {
      name: '投递管理'
    },
    component: '/delivery/index'
  },
  {
    name: 'deliveryOperation',
    path: '/delivery/operation/:id',
    meta: {
      name: '投递管理 -- 弹框'
    },
    component: '/delivery/operation',
    hidden: true
  },
  {
    name: 'deliveryDetail',
    path: '/delivery/detail/:id',
    meta: {
      name: '候选人详情'
    },
    component: '/delivery/detail/detail.vue',
    hidden: true
  },
  {
    name: 'deliveryEdit',
    path: '/delivery/edit/:id',
    meta: {
      name: ' 编辑候选人信息'
    },
    component: '/delivery/edit/edit.vue',
    hidden: true
  },
  {
    name: 'deliveryDelete',
    path: '/delivery/delete/:id',
    meta: {
      name: '批量删除'
    },
    component: '/delivery/delete',
    hidden: true
  },
  {
    name: 'deliverySure',
    path: '/delivery/sure/:id',
    meta: {
      name: '批量确认入职'
    },
    component: '/delivery/sure',
    hidden: true
  },
]
