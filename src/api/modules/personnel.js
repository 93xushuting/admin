import globalVariable from '@/util/global_variable'
export default {
  applicant_public_export_resume_template: { // 模板
    url: '/applicant/public/export_resume_template',
    type: globalVariable.requestBlobPost
  },
  applicant_public_disable: '/applicant/public/disable',
  applicant_public_enable: '/applicant/public/enable',
  job_applicant_public_show_applicant_history: '/job_applicant/public/show_applicant_history', // 应聘历史
  applicant_public_resume_identity_update: '/applicant/public/resume_identity_update', // 上传|修改证件
  applicant_public_resume_tag_update: '/applicant/public/resume_tag_update', // 更新人才库标签
  search_template_public_combo_list: '/search_template/public/combo_list', // 搜索模板列表
  search_template_public_update: '/search_template/public/update', // 修改搜索模板
  search_template_public_add: '/search_template/public/add', // 添加搜索模板
  applicant_public_resume_wanted_update: '/applicant/public/resume_wanted_update', // 更新求职意愿
  applicant_public_resume_details: '/applicant/public/resume_details', // 获取人才详细信息
  applicant_public_resume_record: '/applicant/public/resume_record', // 获取维护轨迹
  applicant_public_resume_comment_new: '/applicant/public/resume_comment_new', // 发布评论
  applicant_public_resume_comments: '/applicant/public/resume_comments', // 获取评论列表
  applicant_public_count: '/applicant/public/count', // 人才库总数
  applicant_list: '/applicant/public/list', // 人才库列表
  applicant_update: '/applicant/public/update', // 更新人才信息
  applicant_add: '/applicant/add', // 新增人才
  applicant_export_resumes: { url: '/applicant/export_resumes', type: globalVariable.requestBlobPost }, // 导出人才
  applicant_import_applicants: { url: '/applicant/import_applicants', type: globalVariable.requestUpload }, // 导入人才
  applicant_download_template: { url: '/applicant/public/download_template', type: globalVariable.requestBlobPost } // 下载人才库模板
}
