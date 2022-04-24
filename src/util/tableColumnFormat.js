// import Vue from 'vue'
import { formatDate, compileTime } from '../util/utils'
/**
 * 表格列 动态格式化
 */
let _format = {
  format: (row, column, cellValue, index) => {
    return _fn.isNumber(cellValue) ? cellValue : (cellValue || '--')
  },
  setValue: (row, column, cellValue, index) => {
    let fn = _var[(column.cname || column.property) + '__global']
    if (fn) {
      // console.info(column.label)
      return fn(cellValue) || ' -- '
    } else {
      return ' -- '
    }
  },
  formatterDate: (row, column, cellValue, index) => {
    if (!cellValue) return '--'
    const time = compileTime(cellValue)
    return formatDate(new Date(time), 'yyyy-MM-dd')
  },
  formatterMinute: (row, column, cellValue, index) => {
    if (!cellValue) return '--'
    const time = compileTime(cellValue)
    return formatDate(new Date(time), 'yyyy-MM-dd HH:mm')
  },
  // 直接set值
  setShowValue (val) {
    return val || '--'
  },
  // 根据code值转value
  getValueByCode (code, list) {
    // list [{label: '1111', value: 2222}]
    const values = list.filter(item => item.value === code)
    return values.length ? values[0].label : '--'
  }
}
window.tcolFormat = Vue.prototype._tcolFormat = _format
