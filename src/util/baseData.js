export default function () {
  var param = {
    http: {
      queryUrl: '', // 查询URL
      updateUrl: '',
      addUrl: '',
      delUrl: ''
    },
    breadcrumb: { // 头
      title: ''
    },
    searchModel: {}, // 查询条件
    tableObj: {
      data: [],
      fields: [],
      operation: {
        // 全选
        selection: true,
        selection_width: 50,
        selection_fixed: true,
        // 序号
        index: false,
        index_width: 50,
        index_fixed: true,
        // 操作列  
        operation: true,
        operation_width: 140,
        operation_fixed: true
      },
      btnList: [],
      pager: { isShow: true, pageNo: 1, pageSize: 20, pageTotal: 0, callback: 'load' }
    },
    dialog: {
      ruleForm: {},
      rules: {}
    }
  }
  return function (calback) {
    var p = calback.call(this)
    let o = p.tableObj
    if (_fn.isArray(o.btnList)) {
      if (o && o.isBtnList) { // 这个属性为true 则全用外面的 btnList
        param.tableObj.btnList = []
      }
      if (o && o.btnList && o.btnList.length) {
        param.tableObj.btnList = param.tableObj.btnList.concat(o.btnList)
        o.btnList.length = 0
      }
    }
    var res = _fn.extend(true, param, p)
    console.info('参数：', res)
    return res
  }
}
