export default [
  {
    name: '招聘设置',
    path: '/setting',
    icon: 'iconfont iconzhaopinshezhi',
    children: [
      {
        path: '/userRole',
        name: 'userRole',
        meta: {
          name: '用户角色'
        },
        component: '/setting/userRole/index'
      },
      {
        path: '/userRole/:id',
        name: 'userRoleEdit',
        meta: {
          name: '用户角色 - 新增 '
        },
        component: '/setting/userRole/edit',
        hidden: true
      },
      {
        path: '/process_template',
        name: 'zpFlow',
        meta: {
          name: '招聘流程'
        },
        component: '/setting/zpFlow/index'
      },
      {
        path: '/process_template/:id',
        name: 'zpFlowEdit',
        meta: {
          name: '招聘流程 -- 新增'
        },
        component: '/setting/zpFlow/edit',
        hidden: true
      },
      {
        path: '/template',
        name: 'template',
        meta: {
          name: '模板管理'
        },
        component: '/setting/template/index'
      },
      {
        path: '/template/:id',
        name: 'templateEdit',
        meta: {
          name: '投递模板'
        },
        component: '/setting/template/edit'
      },
      {
        path: '/value_added',
        name: 'incrementServer',
        meta: {
          name: '增值服务'
        },
        component: '/setting/incrementServer/index'
      },
      {
        path: '/value_added/:id',
        name: 'incrementServerEdit',
        meta: {
          name: '增值服务 -- 新增'
        },
        component: '/setting/incrementServer/edit'
      },
      {
        path: '/tagManage',
        name: 'tagManage',
        meta: {
          name: '标签管理'
        },
        component: '/setting/tagManage'
      },
      {
        path: '/channelManage',
        name: 'channelManage',
        meta: {
          name: '渠道管理'
        },
        component: '/setting/channelManage'
      },
      {
        path: '/messageSetting',
        name: 'messageSetting',
        meta: {
          name: '消息设置'
        },
        component: '/setting/messageSetting/index'
      }
    ]
  }
]
