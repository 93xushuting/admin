import globalVariable from '@/util/global_variable'
/**
 * 全局方法
 */
let Fn = {
  notifyInstance: null,
  // 防抖
  debounce (fn, wait) {
    let cache = this.debounce.prototype.cache || {}
    let fnKey = fn.toString()
    let timeout = cache[fnKey]
    if (timeout != null) clearTimeout(timeout)
    cache[fnKey] = setTimeout(() => {
      fn()
      // 清除内存占用
      if (Object.keys(cache).length === 0) {
        this.debounce.prototype.cache = null
      } else {
        delete this.debounce.prototype.cache[fnKey]
      }
    }, wait)
    this.debounce.prototype.cache = cache
  },
  // 节流 _fn.throttle(200, () => {})
  throttle (delay, noTrailing, callback, debounceMode) {
    var timeoutID
    var cancelled = false
    var lastExec = 0
    function clearExistingTimeout () {
      if (timeoutID) {
        clearTimeout(timeoutID)
      }
    }
    function cancel () {
      clearExistingTimeout()
      cancelled = true
    }
    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback
      callback = noTrailing
      noTrailing = undefined
    }
    if (!(delay && callback)) return
    function wrapper () {
      var self = this
      var elapsed = Date.now() - lastExec
      var args = arguments
      if (cancelled) {
        return
      }
      function exec () {
        lastExec = Date.now()
        callback.apply(self, args)
      }
      function clear () {
        timeoutID = undefined
      }
      if (debounceMode && !timeoutID) {
        exec()
      }
      clearExistingTimeout()
      if (debounceMode === undefined && elapsed > delay) {
        exec()
      } else if (noTrailing !== true) {
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay)
      }
    }
    wrapper.cancel = cancel
    return wrapper()
  },
  /**
   * isPlainObject 判断一个值是否是一个js原生对象，即使用Object构造函数创建的对象 或者 拥有[[Prototype]]属性为null的对象
   */
  isPlainObject: function (obj) {
    return !!obj && this.isObject(obj) && this.isFunction(obj.isPrototypeOf)
  },
  /**
   * 浅拷贝 -- 合并对象(相当于Object.assgin)
   * 深拷贝 -- extend(true, target, object1 [, objectN])
   */
  extend: function () {
    let target = arguments[0] || {}
    let i = 1
    let length = arguments.length
    let deep = false
    let options, name, src, copy
    if (typeof target === 'boolean') {
      deep = target
      target = arguments[1] || {}
      i = 2
    }
    if (typeof target !== 'object' && !Fn.isFunction(target)) {
      target = {}
    }
    if (length === i) {
      target = this
      --i
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name]
          copy = options[name]
          if (target === copy) {
            continue
          }
          if (deep && copy && (Fn.isPlainObject(copy) || Fn.isArray(copy))) {
            let clone = (src && (Fn.isPlainObject(src) || Fn.isArray(src))) ? src : (Fn.isArray(copy) ? [] : {})
            target[name] = Fn.extend(deep, clone, copy)
          } else if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
    return target
  },
  /**
   * 判断map的长度
   */
  mapLength: function (o) {
    var len = 0
    for (var i in o) {
      if (Object.prototype.hasOwnProperty.call(o, i)) {
        len++
      }
    }
    return len
  },
  /**
   * 复制数组对象，仅对不含方法的对象有效
   */
  copy: function (o) {
    return JSON.parse(JSON.stringify(o))
  },
  /**
   * 转换成大写、小写
   */
  toLowerUpperCase: function (o, type) {
    return type ? o.toUpperCase() : o.toLowerCase()
  },
  /**
   * 去掉所有空格
   */
  trim: function (o) {
    if (typeof o === 'number') {
      return o
    }
    return o.replace(/^\s+|\s+$/g, '')
  },
  isObjectValueEqual (a, b) {
    let falg = true
    for (let i in b) {
      if (a[i]) {
        if (_fn.isArray(a[i])) {
          for (let j = 0; j < a[i].length; j++) {
            falg = Fn.isObjectValueEqual(a[i], b[i])
          }
        } else if (_fn.isObject(a[i])) {
          falg = Fn.isObjectValueEqual(a[i], b[i])
        } else if (a[i] !== b[i]) {
          falg = false
          break
        }
      }
    }
    return falg
  }
}
/**
 * isObject 判断是不是Object
 * isString 判断是不是String
 * isFunction 判断是不是Function
 * isNumber 判断是不是Number
 * isBoolean 判断是不是Boolean
 * isDate 判断是不是Date
 * isRegExp 判断是不是RegExp
 * isArray 判断是不是Array
 */
'Object String Function Number Boolean Date RegExp Array'.split(' ').forEach(ele => {
  Fn['is' + ele] = function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + ele + ']'
  }
})
/**
 * 公共业务处理
 * 
 */
Fn.extend({
  /**
   * 所有下拉框值
   * @param1 : url 请求路径
   * @param2 : param 请求参数
   * @param3 : allData boolean 默认false // true 时返回所有数据，不做处理
   * @param4 : object { value: 'id', label: 'entryConditionsName' }
   * @param5 : other { aaa: 'bbbb' } 其它参数
   * @return this.commonBox('请求路径','请求参数')
   */
  commonBox (url, param = {}, allData = false, object = {}, other) {
    if (url) {
      let flag = other && _fn.isObject(other)
      if (flag) {
        _fn.extend(object, other)
      }
      return _api[url](param).then((res) => {
        let d = (res && res.data) || []
        if (allData) {
          return d
        }
        if (d && d.length) {
          return d.map(item => {
            if ((object.value && object.label)) {
              let map = {}
              for (let i in object) {
                map[i] = i === 'disabled' ? !item[object[i]] : item[object[i]]
              }
              return map
            } else {
              return { label: item.name, value: item.id, subLabel: item.nickname, obj: item }
            }
          })
        }
        return d
      })
    }
  },
  /**
   * 弹出框提示
   */
  isShowDialog (title = '', message = '', confirmText = '', fn) {
    return _fn.extend({}, {
      title: title,
      tbody: message,
      titleSve: true,
      show: true,
      confirmText: confirmText,
      isConfirm: _fn.isFunction(fn), // 是否显示取消按钮
      isCancel: confirmText !== '我知道了', // 是否显示取消按钮
      confirmCallback: fn
    })
  },
  getTreeById (data, id) { // 树节点排除id自己
    for (let i = 0; i < data.length; i++) {
      let t = data[i]
      if (t.children && t.children.length) {
        this.getTreeById(t.children, id)
      } else {
        if (t.id === id) {
          data.splice(i, 1)
          break
        }
      }
    }
    return data
  },
  /**
   * 页面跳转
   * @param1 : object {}
   * object:{ name: 'user', params: { userId: '123' }}
   * object:{ path: 'register', query: { plan: 'private' }}
   */
  toLocation: (path) => {
    console.info('跳转页面 : ', path)
    _router.push(path)
  },
  sortable (fn) { // 表格托拽排序
    // https://github.com/SortableJS/Sortable
    const el = document.querySelectorAll('.dragTable .el-table__body-wrapper > table > tbody')[0]
    Sortable.create(el, {
      onEnd: (evt) => {
        fn && fn({
          start: evt.oldIndex,
          end: evt.newIndex
        })
      }
    })
  },
  // 下载模板
  downLoad (url, param, downLoadName) {
    _api[url](param).then((res, data) => {
      console.log('为什么我可以res', res)
      if (Object.prototype.toString.call(res) === '[object Object]' || (data && data.code === 1)) {
        Vue.prototype.notify(res.msg)
      } else { // blob
        $downloadBlob(res, downLoadName)
      }
    })
  },
  /**
 * 静态转化 global_variable（key:value）
 * var a = _var.xxxxxx__global(XXXX)
 */
  setVariable: (variable) => {
    let m = {}
    for (let ele in variable) {
      if (Object.prototype.toString.call(variable[ele]) === '[object Array]') {
        let o = getLabelOrValue(variable[ele], ele)
        m[ele + '__global'] = o
        // console.info(ele)
        if (window._var) {
          window._var[ele + '__global'] = o
        }
      }
    }
    return m
    function getLabelOrValue (data, name) {
      let _map = {}
      data.forEach((ele) => {
        _map[ele.value] = ele.label
        _map[ele.label] = ele.value
      })
      return (state) => {
        if (Object.prototype.toString.call(state) === '[object Boolean]') {
          state = state ? 1 : 0
        }
        return _map[state]
      }
    }
  },
  getStateStr (row, column, cellValue, i, cname = 'state') {
    column.cname = cname
    let val = tcolFormat.setValue(row, column, cellValue, i)
    let span = ''
    let icls = ''
    let spanCls = ''
    if (cname === 'firstSieve' || cname === 'interview' || cname === 'cards' || cname === 'trialOperation' || cname === 'backTone' || cname === 'offer' || cname === 'entry' || cname === 'out') {
      if (cellValue === 14 || cellValue === 23 || cellValue === 25 || cellValue === 34 || cellValue === 43 || cellValue === 45 || cellValue === 52 || cellValue === 54 || cellValue === 63 || cellValue === 71) {
        if (cellValue === 71) {
          icls = '#25BD99'
          spanCls = '#25BD99'
          val = '已入职'
        } else {
          icls = '#F73E3E'
          spanCls = '#F73E3E'
        }
      } else {
        if (cellValue === 81) {
          icls = '#999999'
          spanCls = '#999999'
          val = '已淘汰'
        } else {
          icls = '#4A84FF'
          spanCls = '#26334F'
        }
      }
    } else {
      if (cellValue === 1 || cellValue) { // 启用中
        icls = '#0CD4A2'
        spanCls = '#0CD4A2'
        // span = `<i class="iconfont icondian" style="color:#0CD4A2;font-size: 18px;"></i><span style="color:#0CD4A2;font-size: 14px;">${val}</span>`
      } else { // 已停用
        icls = '#999999'
        spanCls = '#999999'
        // span = `<i class="iconfont icondian" style="color:#999999;font-size: 18px;"></i><span style="color:#999999;font-size: 14px;">${val}</span>`
      }
    }
    return `<div class="statesDiv"><i class="iconfont icondian" style="color:${icls};font-size:22px;"></i><span style="color:${spanCls};font-size: 14px;">${val}</span></div>`
  },
  /**
   * 页面强提醒消息列表
   */
  forceMessageList () {
    let param = { pageReq: { page: 1, size: 20 }, queryParam: {} }
    _api.stationMessage_getForceMessageList(param).then((res) => {
      // _api.stationMessage_getStationMessageList(param).then((res) => { // 测试
      let d = (res && res.data && res.data.list) || []
      d.map((i, index) => {
        if (index < 4) { // 最多加载4条数据
          setTimeout(() => {
            ((item, index_) => {
              let title = ''
              if (item.type === 0) {
                title = '新简历提醒'
              } else if (item.type === 1) {
                title = '面试提醒'
              } else if (item.type === 2) {
                title = '入职提醒'
              }
              let str = ``
              if (item.type === 0) {
                str = `<p>“${item.jobName || ''}”岗位有新简历投递，赶快去处理吧！</p><span style="color: #4a84ff;cursor: pointer;">去处理 ></span>`
              } else if (item.type === 1) {
                str = `
              <p>即将有新面试开始，请提前准备好哦！</p>
              <div>面试岗位：${item.jobName || ''}</div>
              <div>面试时间：${item.interviewTime}</div>
              <div>面试地址：${item.interviewAddress}</div>
              <span style="color: #4a84ff;cursor: pointer;">查看候选人信息 ></span>
              `
              } if (item.type === 2) {
                str = `
              <p>即将有新同事入职，可以提前准备哦！</p>
              <div>入职岗位：${item.jobName}</div>
              <div>入职员工：${item.enrollmentName}</div>
              <div>入职时间：${item.enrollmentTime}</div>
              <span style="color: #4a84ff;cursor: pointer;">查看员工信息 ></span>
              `
              }
              let notify = Vue.prototype.$notify({
                title: title,
                dangerouslyUseHTMLString: true,
                message: str,
                duration: 3000,
                type: 'success',
                offset: 60
              })
              notify.$el.querySelector('span').onclick = () => {
                _fn.toLocation({ name: 'deliveryDetail', params: { id: item.jobApplicantId } })
                notify.close()
              }
            })(i, index)
          }, 500)
        }
      })
      _api.stationMessage_updateForceStatus({}) // 强提醒消息 更新状态
    })
  },
  /**
  * 昨日:1,今日2,上周:3,本周:4,上月:5,本月:6,本季度:7,本年8
  */
  setPickerOptionsTime (type) {
    const currentDate = new Date()
    const millisecond = 1000 * 60 * 60 * 24 // 一天的毫秒数

    const week = currentDate.getDay() // 返回date是一周中的某一天
    const minusDay = week + 1 // 减去的天数

    let currentMonth = currentDate.getMonth() // 获得当前月份0-11
    let currentYear = currentDate.getFullYear() // 获得当前年份4位年

    // 今日
    const end = new Date()
    const start = new Date()
    if (type === 1) { // 昨日
      start.setTime(start.getTime() - millisecond * 1)
      end.setTime(end.getTime() - millisecond * 1)
    } else if (type === 3) { // 上周
      let monday = null
      let sunday = null
      let count = 0
      if (week === 6) { // 星期六
        count = 0
      } else if (week === 0) { // 星期日
        count = 1
      } else { // 1-5
        count = minusDay
      }
      monday = new Date(currentDate.getTime() - count * millisecond - 1 * millisecond) // 上周 周六
      sunday = new Date(monday.getTime() - 6 * millisecond) // 本周 周五
      start.setTime(sunday)
      end.setTime(monday)
    } else if (type === 4) { // 本周
      let monday = null
      let sunday = null
      let count = 0
      if (week === 6) { // 星期六
        count = 0
      } else if (week === 0) { // 星期日
        count = 1
      } else { // 1-5
        count = minusDay
      }
      monday = new Date(currentDate.getTime() - count * millisecond) // 上周 周六
      sunday = new Date(monday.getTime() + 6 * millisecond) // 本周 周五
      start.setTime(monday)
      end.setTime(sunday)
    } else if (type === 5) { // 上月
      const currentDay = new Date(currentYear, currentMonth, 1)
      // 上个月的第一天
      // 年份为0代表,是本年的第一月,所以不能减
      if (currentMonth === 0) {
        currentMonth = 11 // 月份为上年的最后月份
        currentYear-- // 年份减1
      } else {
        currentMonth--
      }
      const firstDay = new Date(currentYear, currentMonth, 1)
      // 求出上月的最后一天
      const lastDay = new Date(currentDay.getTime() - millisecond)
      start.setTime(firstDay)
      end.setTime(lastDay)
    } else if (type === 6) { // 本月
      // 求出本月第一天
      const firstDay = new Date(currentYear, currentMonth, 1)
      // 当为12月的时候年份需要加1
      // 月份需要更新为0 也就是下一年的第一个月
      // 否则只是月份增加,以便求的下一月的第一天
      if (currentMonth === 11) {
        currentYear++
        currentMonth = 0
      } else {
        currentMonth++
      }
      // 下月的第一天
      const nextMonthDayOne = new Date(currentYear, currentMonth, 1)
      // 求出上月的最后一天
      const lastDay = new Date(nextMonthDayOne.getTime() - millisecond)
      start.setTime(firstDay)
      end.setTime(lastDay)
    } else if (type === 7) { // 本季度
      let firstDay
      let lastDay
      currentMonth = currentMonth + 1
      console.info('本季度', currentMonth)
      if (currentMonth > 3 && currentMonth <= 6) {
        firstDay = new Date(currentYear, 3, 1)
        lastDay = new Date(new Date(currentYear, 6, 1) - millisecond)
      } else if (currentMonth > 6 && currentMonth <= 9) {
        firstDay = new Date(currentYear, 6, 1)
        lastDay = new Date(new Date(currentYear, 9, 1) - millisecond)
      } else if (currentMonth > 9 && currentMonth <= 12) {
        firstDay = new Date(currentYear, 9, 1)
        lastDay = new Date(new Date(currentYear, 12, 1) - millisecond)
      } else {
        firstDay = new Date(currentYear, 0, 1)
        lastDay = new Date(new Date(currentYear, 3, 1) - millisecond)
      }
      start.setTime(firstDay)
      end.setTime(lastDay)
    } else if (type === 8) { // 本年
      start.setTime(new Date(currentYear, 0, 1))
      end.setTime(new Date(new Date(currentYear, 12, 1) - millisecond))
    }
    this.$emit && this.$emit('pick', [start, end])
    return [start, end]
  },
  /**
   * setTimeout计时器
   * _this 当前vue组件实例
   * count 计数起始值
   * KeepCallback 每间隔时间所需要执行的函数
   * stopCallback 计数为0截止执行的函数
   * step 间隔时间
  */
  timerHandleBysetTimeout ({ _this, count, KeepCallback = function () { }, stopCallback = function () { }, step = 1 }) {
    count--
    if (!count) {
      stopCallback(count)
      return
    }
    KeepCallback(count)
    let timer = setTimeout(() => {
      this.timerHandleBysetTimeout({ _this, count, KeepCallback, stopCallback, step })
    }, step * 1000)
    _this.$once('hook:beforeDestroy', function () {
      clearTimeout(timer)
      timer = null
    })
  }
})
Fn.message = (msg, ops = {}) => {
  Vue.prototype.$notify({ title: ops.title || '提示', message: msg || ops.message, type: ops.type || 'error', offset: 60, showClose: ops.showClose || true })
}
Fn.checkBtn = (key) => {
  let btnFlag = window.btns[window.BtnId]
  if (btnFlag) {
    return btnFlag[key]
  }
  return false
}
// 格式化log显示对象
Fn.log = function () {
  for (let i = 0, j = arguments.length; i < j; i++) {
    const value = arguments[i]
    if (typeof value === 'object') {
      try {
        arguments[i] = JSON.parse(JSON.stringify(value))
      } catch (e) { }
    }
  }
  console.log(...arguments)
}
// 全局业务公共请求
Fn.extend({
  getPublicCombobox (fn, p = {}, flag) {
    // comboType: 0-下拉列表，1-行业列表，2-职位分类，3-地址状态，4-标签状态，5-淘汰原因类型，6-区号, 7-省市区列表, 9-工作城市
    let params = Object.assign({}, p)
    _api.publicCombobox(params).then(res => {
      if (flag) {
        let data = params.comboType === 7 ? res.data : res.data[0].filter(item => item.name !== '未知')
        if (data && data.length) {
          res = data.map(item => { return { label: item.title || item.name, value: item.code || item.id } })
          // if (params.comboType === 7 || params.comboType === 9) { // 可能要特殊处理地址
          //   res = data.map(item => { return { label: item.title || item.name, value: item.code || item.id } })
          // }
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  // 投递渠道下拉列表
  async getDeliveryChannelList (fn, p = {}, flag = true, isReplace = true) {
    let operationChannelPublicList = []
    let operationChannelPublicListSource = []
    if (isReplace) {
      operationChannelPublicList = await new Promise((resolve, reject) => {
        _fn.getOperationChannelPublicList((res, dataSource) => {
          operationChannelPublicListSource = dataSource
          resolve(res)
        }, {}, true)
      })
    }
    function flatData (sourceList) {
      let result = []
      let obj = {}
      for (let i = 0, len = sourceList.length; i < len; i++) {
        const item = sourceList[i]
        const { type } = item
        if (obj[type]) {
          for (let k = 0, length = result.length; k < length; k++) {
            if (result[k].type === type) {
              result[k].list.push(item)
              break
            }
          }
        } else {
          obj[type] = item
          result.push({
            type: type,
            list: [item]
          })
        }
      }
      return result
    }
    const channelType = globalVariable.channelType.slice()
    _api.delivery_channel_public_channel_list({}).then(res => {
      const result = flatData(res.data)
      channelType.forEach(item => {
        result.forEach(c => {
          if (item.value === c.type) {
            const children = c.list.map(k => {
              return {
                value: k.id,
                label: k.name,
                obj: k
              }
            })
            item.children = item.type === 'SYSTEM' && isReplace ? children.concat(operationChannelPublicList) : children
          }
        })
      })
      if (flag) {
        fn && fn(channelType.map(item => {
          const children = item.children || []
          return {
            ...item,
            children: children.length ? children : null,
            disabled: !children.length
          }
        }), isReplace ? res.data.concat(operationChannelPublicListSource) : res.data)
        return
      }
      fn && fn(isReplace ? res.data.concat(operationChannelPublicListSource) : res.data)
    })
  },
  // 地址列表
  getAddress (fn, p = {}, flag) {
    let defaultParams = {}
    let params = Object.assign({}, defaultParams, p)
    _api.address_public_combo_list(params).then(res => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.name, value: item.id, disabled: !item.enabled } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  // 用户列表
  getUsers (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.job_public_header_users(params).then(res => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.realName, value: item.id } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  // 标签下拉列表  1-企业亮点,2-职位福利3-人才库
  getTag (fn, p = {}, flag) {
    const defaultParams = {
      type: 1
    }
    const param = Object.assign(defaultParams, p)
    _api.tag_public_combo_list(param).then((res) => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.name, value: item.id } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  getAllAddress (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.address_public_show_all(params).then(res => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.name, value: item.id } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  getAllCompony (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.company_public_show_all(params).then(res => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.name, value: item.id } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  // 企业列表
  getEnterprise (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.company_public_list(params).then(res => {
      let data = res.data
      if (flag) {
        if (data && data.length) {
          res = data.map(item => { return { label: item.name, value: item.id } })
        } else {
          res = []
        }
      }
      fn && fn(res)
    })
  },
  // 负责人下拉列表
  getRealNameList (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.user_public_user_list(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.map(item => ({
          label: item.realName,
          value: item.id,
          disabled: !item.enabled
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 联系人列表
  getCollaboratorsList (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.user_public_link_users(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.map(item => ({
          label: item.realName,
          value: item.id,
          disabled: !item.enabled
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 运营渠道下拉列表
  getOperationChannelPublicList (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.operation_channel_public_combo_list(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.map(item => ({
          label: item.name,
          value: item.id,
          obj: item
        }))
      } else {
        result = data
      }
      fn && fn(result, data)
    })
  },
  // 招聘流程下拉列表
  getProcessTemplate (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.process_template_public_combobox(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        data.map((item) => {
          result.push({
            label: item.name,
            value: item.id,
            obj: item
          })
        })
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 投递模板下拉列表
  getDeliveryTemplate (fn, p = { nameKey: '' }, flag) {
    let params = Object.assign({}, p)
    _api.delivery_template_public_combobox(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.map(item => ({
          label: item.name,
          value: item.id
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 背调方案下拉列表
  get_value_added_item_public_combobox (fn, p = { processStageType: 0 }, flag) {
    let params = Object.assign({}, p)
    _api.value_added_item_public_combobox(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.filter(item => item.enabled).map(item => ({
          label: item.name,
          value: item.id
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 应聘职位下拉列表
  getPositionList (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.job_public_position_list(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.map(item => ({
          label: item.name,
          value: item.id,
          obj: item
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // 栏目下拉列表
  getColumnList (fn, p = {}, flag) {
    let params = Object.assign({}, p)
    _api.selectEdition_getSelectEditionList(params).then(res => {
      let result = []
      const { data } = res
      if (flag) {
        result = data.list.map(item => ({
          label: item.editionName,
          value: item.id,
          obj: item
        }))
      } else {
        result = data
      }
      fn && fn(result)
    })
  },
  // portalRefresh () {
  //   console.info('portalRefresh')
  //   __Fn.debounce(() => {
  //     console.info('debounce    -----------------    portalRefresh')
  //     let param = {
  //       uid: localStorage.getItem('zp_userId'),
  //       username: localStorage.getItem('zp_username')
  //     }
  //     _api.portal_refresh(param).then(res => {
  //       localStorage.setItem('zp_token', res.data.token)
  //     })
  //   }, 1000 * 60)
  // },
  // addEventGlobal () { // 全局刷新token
  //   var handler = __Fn.portalRefresh
  //   document.removeEventListener('click', handler, false)
  //   document.addEventListener('click', handler, false)
  // },
  deliveryChange (row, object = {}, fn) { // 投递管理 -- 所有的操作按钮参数
    //  4-面试邀请, 6-试工邀请, 8-发送OFFER
    let btnId = object.btnId
    let obj = {
      jobApplicantIdMap: {}, // 申请记录ID，对应职位地址ID(action=4、6、8必填真实地址ID，其他可填0)
      currentStageId: object.currentId, // 当前阶段ID
      targetStageId: object.targetId, // 目标阶段ID
      action: 1, // 1-通过当前阶段, 2-推进阶段, 3-直接淘汰, 4-面试邀请, 5-办证邀请, 6-试工邀请, 7-发起背调, 8-发送OFFER, 9-批量查看, 10-面试已到面, 11-试工已到面
      isBatch: true,
      wxMsgFlag: object.wxMsgFlag,
      smsMsgFlag: object.smsMsgFlag
    }
    if (_fn.isArray(row)) {
      row.map((m) => {
        obj.jobApplicantIdMap[m.id] = {
          addressId: m.addressId,
          id: m.id, // 申请记录ID
          identityNumber: m.identityNumber, // 身份证号，背调用
          mobile: m.phoneNumber // 身份证号，背调用
        }
      })
    } else if (_fn.isObject(row)) {
      obj.jobApplicantIdMap[row.id] = {
        addressId: 0,
        id: row.id, // 申请记录ID
        identityNumber: '', // 身份证号，背调用
        mobile: '' // 身份证号，背调用
      }
    }
    if (object.goto === 'goto') { // 推进到
      obj.action = 2
      if (btnId === 18) {
        // 推进到入职，增加入职地点，时间，字段
        obj.jobApplicantIdMap[row.id].addressId = object.companyAddress
        obj.enrollmentTime = object.jobTime
      }
    } else {
      if (btnId === 5) { // 淘汰原因
        obj.targetStageId = 8
        obj.action = 3
        obj.rejectType = object.rejectType
        obj.rejectReasonId = object.rejectReasonId
      } else if (btnId === 7 || btnId === 9 || btnId === 11 || btnId === 15 || btnId === 17) { // 正常通过
        let action = btnId === 7 ? 4 : btnId === 9 ? 5 : btnId === 11 ? 6 : btnId === 15 ? 7 : 8
        obj.action = action
        obj.abstractInfo = {}
        if (action === 4 || action === 6 || action === 8) {
          obj.abstractInfo.time = object.time
          obj.abstractInfo.contact = object.contact
          obj.abstractInfo.contactId = object.contactId
          obj.abstractInfo.mobile = object.mobile
          obj.abstractInfo.notes = object.notes
        } else if (action === 5) {
          obj.abstractInfo.identityType = object.identityType
        }
      } else if (btnId === 98 || btnId === 99) { // 面试已到面|试工已到面
        obj.action = 10
      } else if (btnId === 97) { // 批量已查看
        obj.action = 9
      } if (btnId === 18) { // 确认入职
        obj.jobApplicantIdMap[row.id].addressId = object.companyAddress
        obj.enrollmentTime = object.jobTime
        obj.action = 2
        obj.targetStageId = 7
      }
    }
    _api.job_applicant_operate(obj).then(res => {
      _fn.message(res.msg || '操作成功', { type: 'success' })
      fn && fn(res)
    })
  }
})
let _vars = Fn.setVariable(globalVariable)
let maps = Object.assign({}, globalVariable, _vars)
console.info('全局常量', maps)
Vue.prototype._var = window._var = maps // 公共变量
window.__Fn = Fn
export default Fn
