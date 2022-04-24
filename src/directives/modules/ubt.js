(() => {
  let UBT = function (params = {}) {
    this.type = params.type
    this.domain = params.domain
    this.version = params.version
    this.___timer = false
    this.ns = [] // 保存要发送的数据
    // this.getCurrentDate() // 获取服务器时间
  }
  UBT.prototype.init = function (...params) {
    let prop = {
      $manufacturer: 'H5',
      $os: 'H5',
      $app_version: this.version,
      $screen_width: window.screen.availWidth,
      $screen_height: window.screen.availHeight,
      $ip: '',
      $model: navigator.platform, // 编译平台Win32
      $os_version: navigator.appVersion,
      // $longitude: geo.minilongitude || '',
      // $latitude: geo.minilatitude || '',
      // $province: geo.miniprovince || '',
      // $city: geo.minicity || '',
      // $district: geo.minidistrict || '',
      $market: sessionStorage.getItem('fromChannel') || '' //  空的情况下默认值
    }
    if (this.type) {
      if (this.type.number) { // 根据条数发送
        this.notesNum = this.type.number || 100
        this.sendData('notesNum')
      } else if (this.type.custom) { // 时时发送
        this.sendCustom()
      } else if (this.type.timer && !this.___timer) { // 根据时间 发送
        this.times = this.type.timer || 10
        this.___timer = true
        this.sendAjaxTimer()
      }
    }
  }
  UBT.prototype.go = function (_action, event, prop) { // 进入、离开
    let self = this
    // console.info(event)
    _ubt.init(_action, event || _action, prop)
    self.sendData()
  }
  UBT.prototype.sign = function (_action, _event, prop, _uid) { // 登录、注册
    let self = this
    _ubt.init(_action, _event || _action, prop)
    self.sendData()
  }
  UBT.prototype.sendAjax = function (item) { // 发送数据
    console.info('ubt 发送数据:' + item)
  }
  UBT.prototype.sendData = function (_type) { // 存储数据
    let self = this
    let items = JSON.parse(self.gGet(self.stroageName))
    switch (_type) {
      case 'notesNum':
        let number = self.notesNum
        if (items.length > number) {
          let postData = items.slice(0, number)
          self.sendAjax(postData)
          self.ns = items.slice(number, items.length)
          self.gSet(self.stroageName, JSON.stringify(self.ns))
          // console.info('发送数据notesNum:'+ items)
        }
        break
      default:
        if (items && items.length > 0) {
          self.sendAjax(items)
          self.ns = []
          self.gRemove(self.stroageName)
          // console.info('发送数据All:'+ items)
        }
        break
    }
  }
  UBT.prototype.sendCustom = function () { // 及时发送数据
    this.sendData()
  }
  UBT.prototype.sendAjaxTimer = function () { // 定时发送数据
    let self = this
    let tt = 'tt_interval'
    self[tt] = setInterval(function () {
      let data = JSON.parse(self.gGet(self.stroageName))
      if (data) {
        self.sendData()
        self.___timer = false
        clearInterval(self[tt])
      }
    }, 1000 * self.times)
  }
  UBT.prototype.gSet = function (_key, _value) { // 设置缓存
    localStorage.setItem(_key, _value)
  }
  UBT.prototype.gGet = function (_key) { // 获取缓存
    return localStorage.getItem(_key)
  }
  UBT.prototype.gRemove = function (_key) { // 移除缓存
    localStorage.removeItem(_key)
  }
  UBT.prototype.merge = function (first, second) {
    let i = first.length
    let j = 0
    if (typeof second.length === 'number') {
      for (let l = second.length; j < l; j++) {
        first[i++] = second[j]
      }
    } else {
      while (second[j] && second[j] !== 0) {
        first[i++] = second[j++]
      }
    }
    first.length = i
    return first
  }
  window._ubt = new UBT({
    domain: '',
    version: '1.0.0',
    // 时间(timer)，条数(number)，自动(custom)。默认number,100条
    type: {
      // timer: 30 // 秒（默认）
      custom: true // 自动发送
      // number : 50, // 条数100
    }
  })
})(window)
export default {
  inserted (el, binding, vnode, oldVnode) {
    let { action, event, prop = {} } = binding.value
    let elInput = null
    let tagart = el.tagName
    if (tagart && tagart === 'DIV') {
      elInput = (_ubt.merge([], el.childNodes)).filter(item => {
        return item.tagName === 'INPUT' || item.tagName === 'TEXTAREA'
      })
    }
    el.addEventListener(action, () => {
      // console.info('v-ubt : ' + el.innerText, tagart)
      if (tagart && (tagart === 'INPUT' || tagart === 'TEXTAREA')) {
        prop.content = el.value
      } else if (elInput && elInput[0] && elInput[0].tagName && (elInput[0].tagName === 'INPUT' || elInput[0].tagName === 'TEXTAREA')) {
        prop.content = elInput[0].value
      }
      _ubt.init(action, event, prop)
    }, false)
  }
}
/*
  页面使用：
  2）：
  <input type="text"  v-ubt="{action: 'click', event: 'input'}" />

  // element.js
  <el-button type="primary" @click="btn_login" v-ubt="{action: 'click', event: '登陆'}">登陆</el-button>
      // 自定义 prop
  <el-button type="primary" @click="btn_login" v-ubt="{action: 'click', event: '登陆' , prop :{remake:true}}">登陆</el-button>
  <el-button type="primary" @click="btn_login" v-ubt="{action: 'click', event: '登陆' , abc : {bcd:true}}">登陆</el-button>

  // 登录、注册(action: signin , signup)
  // sign (_action, event , prop,_uid)
  _ubt.sign('signin', '登录',{},"郭志勇")
  _ubt.sign('signup', '注册',{},"郭志勇")

  // 进入、离开(action: goin , goto)
  // go (_action, _event , prop )
  _ubt.go('goin', '进入', {})// 进入、离开
  _ubt.go('goto', '离开', {})
  // 手动触发事件(必须this.stroageName中有数据才能触发)
  _ubt.sendData()
*/
