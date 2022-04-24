import globalVariable from '@/util/global_variable'
/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  user_getCompanyListPage: '/company/list', // 查看企业列表
  recruitCompanyAdd: '/company/add', // 添加企业
  recruitQueryCompanyDetail: '/company/details', // 查看企业详情
  recruitCompanyUpdate: '/company/update', // 更新企业
  recruitGetAddressList: '/address/list', // 查询查看地址信息列表
  recruitAddressAdd: '/address/add', // 添加地址
  address_bind_company: '/address/bind_company', // 绑定企业
  recruitAddressDetails: '/address/details', // 地址详情
  recruitAddressUpdate: '/address/update', // 修改地址信息
  recruitAddresDisable: '/address/disable', // 停用地址信息
  recruitAddresEnable: '/address/enable', // 启用地址信息
  recruitAddressBatchDisable: '/address/batch_disable' // 批量停用地址信息
  // recruitCreate: '/recruitCharge/create', // 招聘管理-新增
  // recruitExcelExport: { url: '/recruitCharge/excelExport', type: globalVariable.requestBlobPost }, // 招聘管理-导出
  // recruitExcelImport: { url: '/recruitCharge/excelImport', type: globalVariable.requestUpload }, // 导入
  // recruitGetById: '/recruitCharge/getById', // 招聘管理-获取详细
  // recruitGetPageList: '/recruitCharge/getPageList', // 招聘管理-获取详细
  // recruitCharge_lock: '/recruitCharge/lock', // 招聘管理-锁定
  // recruitRemove: '/recruitCharge/remove', // 招聘管理-删除
  // recruitCharge_unLock: '/recruitCharge/unLock', // 招聘管理-解锁
  // recruitUpdate: '/recruitCharge/update' // 招聘管理-更新
}
