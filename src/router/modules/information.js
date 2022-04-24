export default [
  {
    name: '站内提醒',
    path: '/reminder',
    icon: 'iconfont iconrencaiku',
    children: [
      {
        path: '/information',
        name: 'information',
        meta: {
          name: '消息列表'
        },
        component: '/reminder/information/index.vue'
      },
      {
        path: '/messageSetting',
        name: 'messageSetting',
        meta: {
          name: '消息设置'
        },
        component: '/reminder/messageSetting/index.vue'
      }
    ]
  }
]
