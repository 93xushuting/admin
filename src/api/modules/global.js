import globalVariable from '@/util/global_variable'
/**
 * 公共服务
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  stationMessage_getForceMessageList: '/stationMessage/public/getForceMessageList', // 强提醒消息 列表
  stationMessage_updateForceStatus: '/stationMessage/public/updateForceStatus', // 强提醒消息 更新状态
  address_public_show_all: '/address/public/show_all', // 地址全部下拉列表
  company_public_show_all: '/company/public/show_all', // 所有企业 下拉框
  delivery_channel_public_channel_list: '/delivery_channel/public/channel_list', // 投递渠道下拉列表
  portal_refresh: '/portal/refresh', // 刷新token
  tag_public_combo_list: '/tag/public/combo_list', // 标签下拉列表
  public_find_Jobs_more: '/company/public/find_Jobs_more', // 查询简历 --  获取更多职位
  public_job_for_wechat: '/company/public/job_for_wechat', // 查询简历 -- 微信求职
  public_getOssConfig: '/public/oss_key', // oss
  public_menu_list: '/public/menu_list', // 菜单
  publicCombobox: '/public/combobox', // 下拉框
  address_public_combo_list: '/address/public/combo_list', // 地址列表 下拉框
  company_public_list: '/company/public/list', // 所属企业 下拉框
  job_public_header_users: '/job/public/header_users', // 职位负责人
  user_public_user_list: '/user/public/user_list', // 职位负责人
  user_public_link_users: '/user/public/link_users', // 联系人下拉列表 
  process_template_public_combobox: '/process_template/public/combobox', // 流程模板下拉列表
  job_public_position_list: '/job/public/position_list', // 应聘职位下拉列表
  delivery_template_public_combobox: '/delivery_template/public/combobox', // 投递模板下拉选项
  value_added_item_public_combobox: '/value_added_item/public/combobox', // 增值服务下拉列表
  job_applicant_add: '/job_applicant/add', // 添加候选人
  job_applicant_update: '/job_applicant/update', // 修改候选人信息
  resource_add: '/resource/add', // 添加菜单
  resource_delete: '/resource/delete', // 删除菜单
  resource_detail: '/resource/detail', // 菜单详情
  resource_list: '/resource/list', // 获取菜单树
  resource_update: '/resource/update' // 添加菜单
}
