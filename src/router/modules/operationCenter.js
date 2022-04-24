export default [
  {
    name: '运营中心',
    path: '/operationCenter',
    icon: 'iconfont iconyunyingzhongxin',
    children: [
      { path: '/content', name: 'content', meta: { name: '内容广场' }, component: '/operationCenter/content' },
      { path: '/content/:id', name: 'contentEdit', meta: { name: '内容广场' }, component: '/operationCenter/contentEdit', hidden: true },
      { path: '/choice', name: 'choice', meta: { name: '精选配置' }, component: '/operationCenter/choice' },
      { path: '/choice/:id', name: 'choiceEdit', meta: { name: '内容管理 -- 新增' }, component: '/operationCenter/choiceEdit', hidden: true },
      { path: '/choice/detail/:id', name: 'choiceDetail', meta: { name: '内容详情' }, component: '/operationCenter/choiceDetail', hidden: true },
      { path: '/operationCode', name: 'operationCode', meta: { name: '运营码助手' }, component: '/operationCenter/operationCode' },
      { path: '/messageTask', name: 'messageTask', meta: { name: '短信任务' }, component: '/operationCenter/messageTask' },
      { path: '/messageTask/:id', name: 'messageTaskEdit', meta: { name: '短信任务' }, component: '/operationCenter/messageTaskEdit' },
      { path: '/messageTask/info/:id', name: 'messageTaskInfo', meta: { name: '任务详情' }, component: '/operationCenter/messageTaskInfo' },
      { path: '/messageTemp', name: 'messageTemp', meta: { name: '短信模板' }, component: '/operationCenter/messageTemp' },
      { path: '/messageTemp/:id', name: 'messageTempEdit', meta: { name: '新增短信任务' }, component: '/operationCenter/messageTempEdit' },
      { path: '/public', name: 'public', meta: { name: '公众号推送' }, component: '/operationCenter/public' },
      { path: '/public/:id', name: 'publicEdit', meta: { name: '选择职位' }, component: '/operationCenter/publicEdit', hidden: true }
    ]
  }
]
