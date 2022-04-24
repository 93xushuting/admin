import globalVariable from '@/util/global_variable'
export default {
  report_form_public_echart: '/report_form/public/echart',
  report_form_public_table: '/report_form/public/table',
  company_public_list: '/company/public/list', // 企业
  dept_public_dept_list: '/dept/public/dept_list', // 部门
  report_form_public_default_dept: '/report_form/public/default_dept', // 当前用户所在部门
  report_form_public_export: { url: '/report_form/public/export', type: globalVariable.requestBlobPost }
}
