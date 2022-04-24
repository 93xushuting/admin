import globalVariable from '@/util/global_variable'
export default {
  job_copy: 'job/copy',
  job_list: '/job/public/list', // 查询
  job_add: '/job/add', // 添加
  job_details: '/job/details', // 根据ID查询
  job_update: '/job/update', // 修改
  job_stick_top: '/job/stick_top', // 置顶
  job_enable: '/job/enable', // 启用
  job_disable: '/job/disable', // 停用
  job_public_count: '/job/public/count', // 招聘数量统计
  job_update_setting: '/job/update_setting', // 修改职位设置
  job_deleteJobData: '/job/deleteJobData', // 删除已经暂停的职位
  job_export_jobs: { url: '/job/export_jobs', type: globalVariable.requestBlobPost } // 下载
}
