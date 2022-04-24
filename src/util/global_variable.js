/**
 * 全局常量
 */
let variable = {
  ak: 'dHtmSAqh6BYbIODIQNEI9YEbmHo5Cmxe', // bmap
  requestPost: 'post',
  requestGet: 'get',
  requestGetImg: 'getImage', // 解释文件流
  requestFormDataPost: 'formDataPost', // formData
  requestGetUrl: 'getUrl',
  requestBlobFormDataPost: 'blobFormDataPost',
  requestBlobPost: 'blobPost',
  requestUpload: 'upload', // 上传文件
  staticCity: [
    { label: '北京', value: 10000 },
    { label: '上海', value: 10003 },
    { label: '广州', value: 10188 },
    { label: '深圳', value: 10335 },
    { label: '郑州', value: 10036 },
    { label: '石家庄', value: 10025 }
  ],
  sex: [
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ],
  sex2: [
    { label: '不限', value: 0 },
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ],
  positionRecruitState: [
    {
      label: '招聘中', value: 1
    },
    {
      label: '已暂停', value: 0
    }
  ],
  tagManageState: [
    {
      label: '禁用', value: 0
    },
    {
      label: '启用中', value: 1
    },
    {
      label: '全部', value: 2
    }
  ],
  stateAll: [
    { label: '全部', value: '' },
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
  ],
  state: [
    // { label: '全部', value: 2 },
    { label: '启用中', value: 1 },
    { label: '已停用', value: 0 }
  ],
  state2: [
    { label: '开', value: 1 },
    { label: '关', value: 0 }
  ],
  quhao: [ // 手机区号
    { label: '中国大陆+86', value: 1 },
    { label: '香港+852', value: 2 },
    { label: '澳门+853', value: 3 },
    { label: '台湾+886', value: 4 },
    { label: '新加坡+65', value: 5 }
  ],
  positionLabel: [ // 职位标签
    { label: '热招', value: 1 },
    { label: '急招', value: 2 },
    { label: '新发布', value: 3 }
  ],
  // 婚育
  marriageBirth: [
    { label: '未婚未育', value: 1 },
    { label: '已婚未育', value: 2 },
    { label: '已婚已育', value: 3 },
    { label: '离异', value: 4 },
    { label: '丧偶', value: 5 },
    { label: '保密', value: 6 }
  ],
  educationRequirement: [ // 学历要求
    { label: '不限', value: 0 },
    { label: '小学', value: 1 },
    { label: '初中', value: 2 },
    { label: '高中', value: 3 },
    { label: '中专', value: 4 },
    { label: '大专', value: 5 },
    { label: '本科', value: 6 },
    { label: '硕士', value: 7 },
    { label: '硕士以上', value: 8 }
  ],
  experienceRequirement: [ // 经验要求
    { label: '无经验', value: 1 },
    { label: '1年以下', value: 2 },
    { label: '1~3年', value: 3 },
    { label: '3~5年', value: 4 },
    { label: '5~10年', value: 5 },
    { label: '10年以上', value: 6 },
    { label: '不限', value: 7 }
  ],
  salaryType: [ // 薪资类型
    { label: '面议', value: 0 },
    { label: '时薪', value: 1 },
    { label: '日薪', value: 2 },
    { label: '月薪', value: 3 },
    { label: '年薪', value: 4 },
    { label: '其他', value: 5 }
  ],
  salaryTypeText: [ // 薪资类型
    { label: '面议', value: 0 },
    { label: '小时', value: 1 },
    { label: '天', value: 2 },
    { label: '月', value: 3 },
    { label: '年', value: 4 },
    { label: '次', value: 5 }
  ],
  workNature: [ // 工作性质
    { label: '全职', value: 1 },
    { label: '兼职', value: 2 },
    { label: '实习', value: 3 }
  ],
  partTimeJob: [ // 兼职类型
    { label: '长期可做', value: 1 },
    { label: '其它', value: 2 }
  ],
  dieOutType: [ // 淘汰类型
    { label: '我们淘汰候选人', value: 0 },
    { label: '候选人淘汰我们', value: 1 },
    { label: '全部', value: 2 }
  ],
  dieOutType2: [ // 淘汰类型
    { label: '我们淘汰候选人', value: 0 },
    { label: '候选人淘汰我们', value: 1 }
  ],
  firstSieve: [ // 初筛
    { label: '未查看', value: 11 },
    { label: '待初筛', value: 12 },
    { label: '通过初筛', value: 13 },
    { label: '未通过初筛', value: 14 }
  ],
  interview: [ // 面试
    { label: '待邀请面试', value: 20 },
    { label: '已邀请面试', value: 21 },
    { label: '待面试', value: 22 },
    { label: '拒绝面试', value: 23 },
    { label: '通过面试', value: 24 },
    { label: '未通过面试', value: 25 },
    { label: '已查看面试邀请', value: 26 },
    { label: '已到面', value: 27 }
  ],
  cards: [ // 办证
    { label: '待邀请办证', value: 30 },
    { label: '已邀请办证', value: 31 },
    { label: '待审核证件', value: 32 },
    { label: '通过办证', value: 33 },
    { label: '未通过办证', value: 34 },
    { label: '已查看办证邀请', value: 35 }
  ],
  trialOperation: [ // 试工
    { label: '待邀请试工', value: 40 },
    { label: '已邀请试工', value: 41 },
    { label: '待试工', value: 42 },
    { label: '拒绝试工', value: 43 },
    { label: '通过试工', value: 44 },
    { label: '未通过试工', value: 45 },
    { label: '已查看试工邀请', value: 46 },
    { label: '已到面试工', value: 47 }
  ],
  backTone: [ // 背调
    { label: '待发起背调', value: 50 },
    { label: '背调中', value: 51 },
    { label: '拒绝背调', value: 52 },
    { label: '通过背调', value: 53 },
    { label: '背调异常', value: 54 },
    { label: '未通过背调', value: 55 },
    { label: '背调发起中', value: 56 }
  ],
  offer: [ // offer
    { label: '已发offer', value: 61 },
    { label: '待发offer', value: 60 },
    { label: '待入职', value: 62 },
    { label: '拒绝offer', value: 63 },
    { label: '已查看offer', value: 64 }
  ],
  // 已入职 71 ,已淘汰 81
  deliveryChannelType: [
    { label: '职微你微信小程序', value: 11, sourceType: 'sys' },
    { label: '职微你字节小程序', value: 12, sourceType: 'sys' },
    { label: '58同城', value: 1 },
    { label: 'Boss直聘', value: 2 },
    { label: '智联招聘', value: 3 },
    { label: '前程无忧', value: 4 },
    { label: '赶集网', value: 5 },
    { label: '百姓网', value: 6 },
    { label: '第三方供应商（慧邦人力）', value: 8 },
    { label: '第三方供应商（才尊人力）', value: 9 },
    { label: '内部推荐', value: 50 },
    { label: '外部推荐', value: 60 },
    { label: '其他', value: 7 }
  ],
  // 人才库来源渠道
  _deliveryChannelType: [
    {
      label: '新增导入(58同城)',
      value: 4,
      type: 'NEW_IMPORT_58'
    },
    {
      label: '新增导入(Boss直聘)',
      value: 5,
      type: 'NEW_IMPORT_BOSS'
    },
    {
      label: '新增导入(智联招聘)',
      value: 6,
      type: 'NEW_IMPORT_ZHILIAN'
    },
    {
      label: '新增导入(前程无忧)',
      value: 7,
      type: 'NEW_IMPORT_51JOB'
    },
    {
      label: '新增导入(赶集网)',
      value: 8,
      type: 'NEW_IMPORT_GANJI'
    },
    {
      label: '新增导入(百姓网)',
      value: 9,
      type: 'NEW_IMPORT_BAIXING'
    },
    {
      label: '新增导入(慧邦人力)',
      value: 10,
      type: 'NEW_IMPORT_HUIBANG'
    },
    {
      label: '新增导入(才尊人力)',
      value: 11,
      type: 'NEW_IMPORT_CAIZUN'
    },
    {
      label: '职微你微信小程序(可微Job)',
      value: 40,
      sourceType: 'sys',
      type: 'WXAPP_KEWEI_JOB'
    },
    {
      label: '职微你微信小程序(可微人力)',
      value: 41,
      sourceType: 'sys',
      type: 'WXAPP_KEWEI_MANPOWER'
    },
    {
      label: '职微你微信小程序(职微你)',
      value: 42,
      sourceType: 'sys',
      type: 'WXAPP_SELF'
    },
    {
      label: '职微你微信小程序(官网)',
      value: 43,
      sourceType: 'sys',
      type: 'WXAPP_OFFICIAL_WEBSITE'
    },
    {
      label: '职微你微信小程序(北京)',
      value: 44,
      sourceType: 'sys',
      type: 'WXAPP_BEIJING'
    },
    {
      label: '职微你微信小程序(上海)',
      value: 45,
      sourceType: 'sys',
      type: 'WXAPP_SHANGHAI'
    },
    {
      label: '职微你微信小程序(深圳)',
      value: 46,
      sourceType: 'sys',
      type: 'WXAPP_SHENZHEN'
    },
    {
      label: '职微你微信小程序(成都)',
      value: 47,
      sourceType: 'sys',
      type: 'WXAPP_CHENGDU'
    },
    {
      label: '职微你微信小程序(微信社群)',
      value: 48,
      sourceType: 'sys',
      type: 'WXAPP_WECHAT'
    },
    {
      label: '职微你微信小程序(QQ社群)',
      value: 49,
      sourceType: 'sys',
      type: 'WXAPP_QQ'
    },
    {
      label: '职微你微信小程序(微博)',
      value: 50,
      sourceType: 'sys',
      type: 'WXAPP_MICROBLOG'
    },
    {
      label: '职微你微信小程序(头条)',
      value: 51,
      sourceType: 'sys',
      type: 'WXAPP_TOUTIAO'
    },
    {
      label: '职微你微信小程序(抖音)',
      value: 52,
      sourceType: 'sys',
      type: 'WXAPP_DOUYIN'
    }
  ],
  identityType: [ // 证件类型
    { label: '身份证', value: 1 },
    { label: '健康证', value: 2 },
    { label: '护照', value: 3 },
    { label: '港澳通行证', value: 4 },
    { label: '台湾通行证', value: 5 },
    { label: '海外证件', value: 6 },
    { label: '技能证书', value: 7 }
  ],
  // 人才库状态
  applicant_status: [
    {
      label: '未投递',
      value: 0
    },
    {
      label: '已淘汰',
      value: 1
    },
    {
      label: '投递中',
      value: 2
    },
    {
      label: '已入职',
      value: 3
    },
    {
      label: '全部',
      value: 9
    }
  ],
  applicant_status_invitation: [ // 邀约状态
    { label: '最近30天内未成功邀约过', value: 2 },
    { label: '最近15天内未成功邀约过', value: 1 },
    { label: '最近7天内未成功邀约过', value: 0 }
  ],
  mobilelistTemp: [
    { label: '从系统中选择', value: 0 },
    { label: '导入文件', value: 1 }
  ],
  // 求职状态
  jobSearchingStatus: [
    {
      label: '离职-随时到岗',
      value: 1
    },
    {
      label: '在职-考虑机会',
      value: 2
    },
    {
      label: '在职-暂不考虑',
      value: 3
    }
  ],
  // 投递渠道
  channelType: [
    {
      label: '系统微渠道',
      value: 0,
      type: 'SYSTEM'
    },
    {
      label: '招聘平台',
      value: 1,
      type: 'RECRUITMENT_PLATFORM'
    },
    {
      label: '第三方供应商',
      value: 2,
      type: 'THIRD_SUPPLIER'
    },
    {
      label: '其他',
      value: 3,
      type: 'OTHERS'
    }
  ],
  // 运营渠道
  operationCodeType: [
    { label: '全部', value: '', type: 'ALL' },
    { label: '职微你微信小程序', value: 0, type: 'WXAPP' },
    { label: '职微你字节小程序', value: 1, type: 'BDAPP' }
  ],
  // 轮播图片排序
  pictureSort: [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 }
  ],
  redirection: [ // 是否跳转
    { label: '跳转', value: 1 },
    { label: '不跳转', value: 0 }
  ],
  directionPageType: [ // 跳转页面类型
    { label: '系统页面', value: 1 },
    { label: 'H5链接', value: 2 },
    { label: '职位链接', value: 3 },
    { label: '视频号/视频号视频', value: 4 }
  ],
  setContent: [ // 内容设置
    { label: '规则抽取', value: 1 },
    { label: '人工选择', value: 0 }
  ],
  taskStatus: [ // 短信任务 状态
    { label: '待发送', value: 1 },
    { label: '已发送', value: 2 },
    { label: '发送中', value: 3 },
    { label: '待发送-定时', value: 4 }
  ],
  recType: [
    { label: '代理招聘', value: 0 },
    { label: '企业直招', value: 1 }
  ],
  recruit_status: [ // 招聘漏斗状态
    { label: '操作进度时间', value: 0 },
    { label: '投递时间', value: 1 }
  ],
  // 栏目顺序
  columnSort: [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 }
  ],
  // 上线状态
  onlineStatus: [
    { label: '全部', value: 2 },
    { label: '已上线', value: 1 },
    { label: '已下线', value: 0 }
  ],
  // 是否置顶
  stickTop: [
    { label: '全部', value: 2 },
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ],
  // 内容属性
  contentProperty: [
    { label: '娱乐', value: 1 },
    { label: '法规', value: 2 },
    { label: '技能', value: 3 },
    { label: '其它', value: 4 }
  ],
  // 启用状态
  enabledAll: [
    { label: '全部', value: '' },
    { label: '启用中', value: 1 },
    { label: '已暂停', value: 0 }
  ],
  // 模板类型
  noticeType: [
    { label: '文本(普通)', value: 1 },
    { label: '文本(营销)', value: 2 }
  ],
  // 规则抽取条件维度
  conditionFieldList: [
    { label: '所属企业', value: 'company', ruleType: 1, valueType: 'company' },
    { label: '工作地址城市', value: 'city', ruleType: 1, valueType: 'city' },
    { label: '工作性质', value: 'timeRequired', ruleType: 1, valueType: 'select', itemValue: [{ label: '全职', value: 1 }, { label: '兼职', value: 2 }, { label: '实习', value: 3 }] },
    { label: '负责人', value: 'headUid', ruleType: 1, valueType: 'user' },
    { label: '负责人所属部门', value: 'department', ruleType: 1, valueType: 'dept' },
    { label: '招聘类型', value: 'recType', ruleType: 1, valueType: 'select', itemValue: [{ label: '代理招聘', value: 0 }, { label: '企业直招', value: 1 }] },
    { label: '职位标签', value: 'label', ruleType: 1, valueType: 'select', itemValue: [{ label: '热招', value: 1 }, { label: '急招', value: 2 }, { label: '新发布', value: 3 }] },
    { label: '薪资类型', value: 'salaryType', ruleType: 1, valueType: 'select', itemValue: [{ label: '面议', value: 0 }, { label: '时薪', value: 1 }, { label: '日薪', value: 2 }, { label: '月薪', value: 3 }, { label: '年薪', value: 4 }, { label: '其他', value: 5 }] },
    { label: '薪资范围', value: 'salary', ruleType: 2, valueType: 'text' },
    { label: '经验要求', value: 'experience', ruleType: 2, valueType: 'text' },
    { label: '学历要求', value: 'education', ruleType: 1, valueType: 'select', itemValue: [{ label: '不限', value: 0 }, { label: '小学', value: 1 }, { label: '初中', value: 2 }, { label: '高中', value: 3 }, { label: '中专', value: 4 }, { label: '大专', value: 5 }, { label: '本科', value: 6 }, { label: '硕士', value: 7 }, { label: '硕士以上', value: 8 }] },
    { label: '年龄要求', value: 'age', ruleType: 2, valueType: 'text' }
  ],
  // 规则
  rule1: [
    { label: '包含', value: 1 },
    { label: '不包含', value: 2 }
  ],
  rule2: [
    { label: '大于', value: 3 },
    { label: '小于', value: 4 },
    { label: '等于', value: 5 },
    { label: '大于等于', value: 6 },
    { label: '小于等于', value: 7 },
    { label: '不等于', value: 8 }
  ],
  // 消息列表
  infoType: [
    { label: '全部', value: '' },
    { label: '新简历提醒', value: 0 },
    { label: '面试提醒', value: 1 },
    { label: '入职提醒', value: 2 }
  ],
  // 实名认证
  valid: [
    { label: '全部', value: '' },
    { label: '已实名', value: 1 },
    { label: '未实名', value: 0 }
  ]
}
export default variable
