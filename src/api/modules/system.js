/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  // 用户、角色
  user_delete: '/user/delete', // 删除用户
  user_list: '/user/list', // 分页查询用户列表
  user_add: '/user/add', // 新增用户
  user_info: '/user/info', // 查询当前用户的详情
  user_public_info: '/user/public/info', // 根据ID查询用户
  user_update_full_info: '/user/update_full_info', // 查询当前用户的详情2
  user_modify_pwd: '/user/modify_pwd', // 修改用户密码
  user_profile: '/user/profile', // 个人中心
  // user_update_basic_info: '/user/update_basic_info', // 修改用户
  user_public_update_simple_info: '/user/public/update_simple_info',
  user_update: '/user/update', // 修改用户信息,用户自行修改，仅修改头像、名字,上级用户修改下级，包括头像、名字、角色、层级、状态
  user_enable: '/user/enable', // 启用
  user_disable: '/user/disable', // 停用
  // 层级管理(用户)
  dept_list: '/dept/list', // 查询
  dept_add: '/dept/add', // 添加
  dept_update: '/dept/update', // 修改标签
  dept_delete: '/dept/delete', // 删除
  // 角色
  role_list: '/role/list', // 角色列表
  role_add: '/role/add', // 添加角色
  role_delete: '/role/delete', // 删除角色
  role_update: '/role/update', // 更新角色
  role_public_auths: '/role/public/auths', // 查询 权限列表
  role_public_get: '/role/public/get', // 查询 角色下拉框1
  role_public_valid_role_list: '/role/public/valid_role_list', // 查询 角色下拉框2

  // 标签管理
  tag_list: '/tag/list', // 标签列表
  reject_list: 'reject/list', // 淘汰原因-标签列表
  reject_add: '/reject/add', // 淘汰原因-添加
  reject_update: '/reject/update', // 淘汰原因-修改
  reject_disable: '/reject/disable', // 淘汰原因-禁用
  reject_enable: '/reject/enable', // 淘汰原因-启用
  reject_reject_reason_list: '/reject/public/reject_reason_list', // 获取淘汰原因下拉列表
  tag_add: '/tag/add', // 添加标签
  tag_update: '/tag/update', // 修改标签
  tag_disable: '/tag/disable', // 停用标签
  tag_enable: '/tag/enable', // 启用标签
  tag_public_combo_list: '/tag/public/combo_list', // 标签下拉列表

  // 流程
  process_template_list: '/process_template/list', // 流程模板列表
  process_template_details: '/process_template/details', // 流程模板by id
  process_template_add: '/process_template/add', // 添加
  process_template_update: '/process_template/update', // 修改
  process_template_disable: '/process_template/disable', // 停用
  process_template_enable: '/process_template/enable', // 启用
  process_template_public_all_stages: '/process_template/public/all_stages', // 全部流程
  process_template_public_valid: '/process_template/public/valid', // 流程模板 是否可编辑

  // 模板
  delivery_template_list: '/delivery_template/list', // 模板列表
  delivery_template_details: '/delivery_template/details', // 流程模板by id
  delivery_template_add: '/delivery_template/add', // 添加
  delivery_template_update: '/delivery_template/update', // 修改
  delivery_template_disable: '/delivery_template/disable', // 停用
  delivery_template_enable: '/delivery_template/enable', // 启用
  delivery_template_public_all_base_delivery_template: '/delivery_template/public/base_delivery_template', // 全部流程
  delivery_template_public_combobox: '/delivery_template/public/combobox', // 流程模板下拉列表
  delivery_template_public_get_delivery_template: '/delivery_template/public/get_delivery_template', // 获取投递模板

  // 背调方案
  value_added_item_list: '/value_added_item/list', // 背调方案列表
  value_added_item_add: '/value_added_item/add', // 背调 新增
  value_added_item_update: '/value_added_item/update', // 背调修改
  value_added_item_details: '/value_added_item/details', // 根据ID查询

  // 渠道管理 
  delivery_channel_list: '/delivery_channel/list', // 列表
  delivery_channel_add: '/delivery_channel/add', // 添加
  delivery_channel_update: '/delivery_channel/update', // 修改
  delivery_channel_disable: '/delivery_channel/disable', // 停用
  delivery_channel_enable: '/delivery_channel/enable', // 启用

  // 渠道管理 
  operation_channel_list: '/operation_channel/list', // 列表
  operation_channel_add: '/operation_channel/add', // 添加
  operation_channel_update: '/operation_channel/update', // 修改
  operation_channel_disable: '/operation_channel/disable', // 停用
  operation_channel_enable: '/operation_channel/enable', // 启用
  operation_channel_details: '/operation_channel/details', // 根据ID查询
  operation_channel_public_combo_list: '/operation_channel/public/combo_list' // 运营渠道下拉列表
}
