export default [
  {
    name: '招聘需求',
    path: '/recruit',
    icon: 'iconfont iconzhaopinxuqiu',
    children: [
      {
        path: '/enterpriseManage',
        name: 'enterpriseManage',
        meta: {
          name: '企业管理'
        },
        component: '/recruit/enterpriseManage/index.vue'
      },
      {
        path: '/enterpriseManage/:id',
        name: 'enterpriseManageEdit',
        meta: {
          name: '企业管理 -- 新增'
        },
        component: '/recruit/enterpriseManage/edit.vue',
        hidden: true
      },
      {
        path: '/enterpriseManage/:name/:id',
        name: 'enterpriseManageSee',
        meta: {
          name: ' 查看企业'
        },
        component: '/recruit/enterpriseManage/see.vue',
        hidden: true
      },
      {
        path: '/addressManage',
        name: 'addressManage',
        meta: {
          name: '地址管理'
        },
        component: '/recruit/addressManage/index.vue'
      },
      {
        path: '/addressManage/:id',
        name: 'addressManageEdit',
        meta: {
          name: '地址管理 -- 新增'
        },
        component: '/recruit/addressManage/edit.vue',
        hidden: true
      }
    ]
  }
]
