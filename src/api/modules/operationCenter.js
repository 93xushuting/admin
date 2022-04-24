import globalVariable from '@/util/global_variable'
/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {

  // 公众号推送
  weChatOfficialPush_addWeChatMessageTemplates: '/weChatOfficialPush/addWeChatMessageTemplates', // 模板消息配置
  weChatOfficialPush_addWeChatOfficialMessageConfig: '/weChatOfficialPush/addWeChatOfficialMessageConfig', // 模板消息配置修改添加
  weChatOfficialPush_getWeChatOfficialMessageConfig: '/weChatOfficialPush/getWeChatOfficialMessageConfig', // 模板消息配置获取
  // 轮播图
  banner_pageList: '/banner/pageList', // 分页查询
  banner_add: '/banner/add', // 新增
  banner_count: '/banner/count', // 统计启用状态轮播图的数量
  banner_getById: '/banner/getById', // 根据id查询详情
  banner_update: '/banner/update', // 编辑
  banner_updateSort: '/banner/updateSort', // 排序
  banner_updateStatus: '/banner/updateStatus', // 启用/停用

  // 职位分享卡片
  template_job_share_list: '/job_share_template/public/list', // 分页查询
  template_job_share_add: '/job_share_template/public/add', // 新增

  // 短信模板
  smsAssistant_addSmsTemplate: '/smsAssistant/addSmsTemplate', // 新增
  smsAssistant_deleteSmsTemplateDetail: '/smsAssistant/deleteSmsTemplateDetail', // 删除
  smsAssistant_getSmsTemplateDetail: '/smsAssistant/getSmsTemplateDetail', // 预览
  smsAssistant_updateSmsTemplate: '/smsAssistant/updateSmsTemplate', // 编辑
  smsAssistant_initSmsTemplateDetail: '/smsAssistant/initSmsTemplateDetail', // 编辑短信模板初始化查询接口
  smsAssistant_listSmsTemplateDetail: '/smsAssistant/listSmsTemplateDetail', // 分页查询
  smsAssistant_initSmsTemplate: '/smsAssistant/initSmsTemplate', // 根据id查询详情
  smsAssistant_pushResumeList: '/smsAssistant/pushResumeList', // 人才库列表
  // 短信任务
  smsTask_selectTaskDetail: '/smsTask/selectTaskDetail', // 根据id查询详情
  smsTask_sendSmsTaskImmediately: '/smsTask/sendSmsTaskImmediately', // 新增
  smsTask_deleteSmsTask: '/smsTask/deleteSmsTask', // 删除
  smsTask_taskDetail: '/smsTask/taskDetail', // 详情
  smsTask_taskList: '/smsTask/taskList', // 列表
  smsTask_taskListInitParams: '/smsTask/taskListInitParams', // 列表下拉
  smsTask_sendTaskSmss_sendNowSmsTask: '/smsTask/sendTaskSmss/sendNowSmsTask', // 发送
  smsTask_updateCornTimeSmsTask: '/smsTask/updateCornTimeSmsTask', // 定时发送
  smsTask_exportExcelDemo: { url: '/smsTask/exportExcelDemo', type: globalVariable.requestBlobPost }, // 下载
  smsTask_import_applicants: { url: '/smsTask/import_applicants', type: globalVariable.requestUpload }, // 导入
  smsTask_getSmsTaskDetail: '/smsTask/public/getSmsTaskDetail', // 新增短信任务下拉接口/人才库发起短信任务邀约模板
  // 精选配置
  // 内容管理
  content_add: '/content/add', // 新增
  content_delete: '/content/delete', // 删除
  content_disable: '/content/disable', // 下线
  content_enable: '/content/enable', // 上线
  content_list: '/content/list', // 分页查询
  content_stick_top: '/content/stick_top', // 置顶
  content_sticy_down: '/content/sticy_down', // 取消置顶
  content_update: '/content/update', // 编辑
  content_updateColumn: '/content/updateColumn', // 修改栏目
  content_details: '/content/details', // 详情
  // 栏目管理
  selectEdition_add: '/selectEdition/add', // 新增
  selectEdition_update: '/selectEdition/update', // 修改
  selectEdition_changeSequence: '/selectEdition/changeSequence', // 调整栏目顺序
  selectEdition_changeStatus: '/selectEdition/changeStatus', // 更改状态
  selectEdition_getSelectEditionList: '/selectEdition/getSelectEditionList', // 分页查询
  selectEdition_public_edition_list: '/selectEdition/public/edition_list' // 栏目下拉列表
}
