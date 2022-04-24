export default [
  {
    name: '数据分析',
    path: '/dataAnalysis',
    icon: 'iconfont iconyunyingzhongxin',
    children: [
      { path: '/recruitReport', name: 'recruitReport', meta: { name: '招聘漏斗' }, component: '/dataAnalysis/recruitReport' }
    ]
  }
]
