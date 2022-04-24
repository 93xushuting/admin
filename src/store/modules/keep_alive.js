import setStore from '../store'
let map = {
  state: {
    keepAlive: {
      // 用于新增/编辑企业时无地址数据时跳转新增地址页面返回保留form数据
      updateCompany: null,
      // 地址管理
      address: null,
      // 企业管理
      enterprise: null,
      // 职位管理
      position: null,
      // 人才库
      personnel: null,
      // 招聘流程
      processTemplate: null
    }
  }
}
let obj = setStore(map)
export default obj
