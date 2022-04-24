export default [
  {
    name: 'personnel',
    path: '/personnel',
    icon: 'iconfont iconrencaiku',
    meta: {
      name: '人才库'
    },
    component: '/personnel/index.vue'
  },
  {
    name: 'setrule',
    path: '/personnel/setrule/:id',
    icon: 'iconfont iconrencaiku',
    meta: {
      name: '设置订阅规则'
    },
    component: '/personnel/subscriptionRule/subscriptionRule.vue',
    hidden: true
  },
  {
    name: 'addtalent',
    path: '/personnel/addtalent/:id',
    icon: 'iconfont iconrencaiku',
    meta: {
      name: '新增人才'
    },
    component: '/personnel/addTalent/addTalent.vue',
    hidden: true
  },
  {
    name: 'talentDetail',
    path: '/personnel/detail/:id',
    icon: 'iconfont iconrencaiku',
    meta: {
      name: '人才详情'
    },
    component: '/personnel/detail/detail.vue',
    hidden: true
  },
  {
    name: 'turnPoint',
    path: '/personnel/turnpoint/:id',
    icon: 'iconfont iconrencaiku',
    meta: {
      name: '人才转投递'
    },
    component: '/personnel/turnpoint/turnpoint.vue',
    hidden: true
  },
  // {
  //   name: '人才库',
  //   path: '/personnel',
  //   icon: '',
  //   children: [
  //     {
  //       icon: '',
  //       path: '/index',
  //       name: 'index',
  //       meta: {
  //         name: '人才'
  //       },
  //       component: '/personnel/index'
  //     }
  //   ]
  // }
]
