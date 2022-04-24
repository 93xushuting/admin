import globalVariable from '@/util/global_variable'
/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  job_applicant_import_candidate: { // 批量导入候选人
    type: globalVariable.requestUpload,
    url: '/job_applicant/import_candidate'
  },
  job_applicant_public_export_applicant_template: { // 模板文件下载
    type: globalVariable.requestBlobFormDataPost,
    url: '/job_applicant/public/export_applicant_template'
  },
  job_applicant_public_show_stage_statuses: '/job_applicant/public/show_stage_statuses', // 候选人状态下拉列表
  address_public_job_addresses: '/address/public/job_addresses', // 该职位下所有工作地址
  delivery_template_public_original_template: '/delivery_template/public/original_template', // 初始投递模板
  job_applicant_public_show_resume_tags: '/job_applicant/public/show_resume_tags', // 获取人才库标签
  job_applicant_update_identity: '/job_applicant/public/update_identity', // 修改证件
  job_applicant_public_comment_new: '/job_applicant/public/comment_new', // 发布评论
  job_applicant_public_comment_list: '/job_applicant/public/comment_list', // 获取评论列表
  job_applicant_add_identity: '/job_applicant/public/add_identity', // 添加证件
  job_applicant_update: '/job_applicant/update', // 修改候选人信息
  job_applicant_list: '/job_applicant/public/list', // 投递 列表
  job_applicant_operate: '/job_applicant/operate', // 操作候选人状态
  job_applicant_public_count: '/job_applicant/public/count', // 职位投递数量统计
  job_applicant_batch_operation_details: '/job_applicant/public/batch_operation_details', // 根据IDX查询
  job_applicant_details: '/job_applicant/details', // 根据ID查询
  job_applicant_switch_status: '/job_applicant/public/switch_status', // 流程状态切换
  job_applicant_public_archive_flag: '/job_applicant/public/archive_flag', // 淘汰归档
  job_applicant_public_archive_update: '/job_applicant/public/archive_update', // 淘汰归档 -- 更新
  job_applicant_export_applicant: { url: '/job_applicant/export_applicant', type: globalVariable.requestBlobPost }, // 下载
  job_public_list: '/job/public/list', // 查询职位信息
  job_entry_write: '/job_applicant/public/update_endtime_address', // 编辑入职信息
  job_entry_delete: '/job_applicant/deleteJobApplactionOnAction' // 删除淘汰以及入职信息
}
