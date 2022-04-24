// eslint-disable-next-line no-unused-expressions
!(function () {
  /**
   * 日期的加减
   * @param dateType 1天 2月 3年 4时 5分 6秒
   * @param num 加减的量
   */
  // eslint-disable-next-line no-extend-native
  Date.prototype.calendar = function (dateType, num) {
    switch (dateType) {
      case 1:
        let d = this.getDate()
        this.setDate(d + num)
        return this
      case 2:
        let m = this.getMonth()
        this.setMonth(m + num)
        return this
      case 3:
        let y = this.getFullYear()
        this.setFullYear(y + num)
        return this
      case 4:
        let h = this.getHours()
        this.setHours(h + num)
        return this
      case 5:
        let M = this.getMinutes()
        this.setMinutes(M + num)
        return this
      case 6:
        let s = this.getSeconds()
        this.setSeconds(s + num)
        return this
    }
  }

  Date.format = formatDate
}())

// 数字千分位处理
const formatThound = (num) => {
  if (!num) return 0
  return (String(num)).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
}

/**
 * 处理ie解析2017-10-10为NAN
 * @param {*} val 
 * 
 */
const compileTime = function (val) {
  if (!val) {
    return ''
  }
  let time = ''
  if (typeof val === 'number') {
    time = val
  } else {
    const _time = val.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3')
    time = new Date(_time).getTime()
  }
  return time
}
/**
 * 日期格式化
 * @param {*} date
 * @param {*} format  yyyy-MM-dd HH:mm:ss 默认
 */
function formatDate (date, format) {
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    w: formatNum(date.getDay()), // 星期
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) { if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return format
}

const formatNum = function (num) {
  let cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let n = (num + '').split('')
  let s = ''
  n.forEach((m) => {
    s += cnum[m]
  })
  return s
}

const moneyNum = function (value, suffix) {
  if (!value) return 0
  let negative = false
  if (String(value).indexOf('-') === 0) {
    value = value.substr(1)
    negative = true
  }
  let number = parseInt(value).toFixed(2).split('.')
  let s = number[1]
  let n = number[0].split('').reverse()

  let str = ''
  let arr = []
  let l = n.length
  let numft = ''
  if (l >= 3) {
    n.forEach((b, i) => {
      str = b + str
      if ((i + 1) % 3 === 0) {
        arr.push(str)
        str = ''
      }
      if (l - 1 === i && str) {
        arr.push(str)
      }
    })
    numft = arr.reverse().join(',')
  } else {
    numft = number[0] + ''
  }
  return (negative ? '-' : '') + numft + '.' + s + (suffix || '')
}

/**
 * 按指定份数分割数组
 * @param {*} array
 * @param {*} num
 */
const arrayslice = function (array, num) {
  let ar = []
  let _ar = null
  let _num = num
  // eslint-disable-next-line no-sequences
  while (_ar = array.slice(0 - _num + num, num), _ar.length > 0 && ar.push(_ar), _ar.length === _num) {
    num += _num
  }
  return ar
}

const jiecheng = function jiecheng (m) { // 求阶乘
  if (m <= 1) return 1
  else return m * (jiecheng(m - 1)) // 递归算:法n!=n*(n-1)!
}

function toQueryPair (key, value) {
  if (typeof value === 'undefined') {
    return key
  }
  return key + '=' + encodeURIComponent(!value ? '' : String(value))
}

const toBodyString = function (obj) {
  let ret = []
  for (let key in obj) {
    let values = obj[key]
    if (values && values.constructor === Array) { // 数组
      let queryValues = []
      for (let i = 0, len = values.length, value; i < len; i++) {
        value = values[i]
        queryValues.push(toQueryPair(key, value))
      }
      ret = ret.concat(queryValues)
    } else { // 字符串
      ret.push(toQueryPair(key, values))
    }
  }
  return ret.join('&')
}

const maxArr = function (arr, attr) {
  var max = arr[0][attr]
  for (var i = 1; i < arr.length; i++) {
    if (max < arr[i][attr]) max = arr[i][attr]
  }
  return max
}

const unique = function (array) {
  var n = []
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) === -1) n.push(array[i])
  }
  return n
}

// 获取前几天的日期
const getBeforeDate = function (n) {
  var d = new Date()
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  var s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
  return s
}

// 根据数据里某个字段排序小到大
const comparearr = function (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}
// 大到小
const comparearrdes = function (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value2 - value1
  }
}

const isRepeat = function (arr) {
  var hash = {}

  for (var i in arr) {
    if (hash[arr[i].value]) { return true }

    hash[arr[i].value] = true
  }

  return false
}

const isEmptyObject = function (obj) {
  for (var key in obj) {
    return false// 返回false，不为空对象
  }
  return true// 返回true，为空对象
}

function convertCurrency (money) {
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var cnIntRadice = ['', '拾', '佰', '仟']
  var cnIntUnits = ['', '万', '亿', '兆']
  var cnDecUnits = ['角', '分', '毫', '厘']
  var cnInteger = '整'
  var cnIntLast = '元'
  var maxNum = 999999999999999.9999
  var integerNum // 整数  
  var decimalNum // 小数
  var chineseStr = ''
  var parts
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  if (!money) { return '' }
  money = parseFloat(money)
  if (money >= maxNum) {
    return ''
  }

  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 处理整数部分
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 处理小数部分
  if (decimalNum) {
    var decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (!chineseStr) {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (!decimalNum) {
    chineseStr += cnInteger
  }
  return chineseStr
}

function accMul (a, b) {
  if (typeof a === 'undefined' || typeof b === 'undefined' || !a || !b) {
    return NaN
  }
  var c = 0
  var d = a.toString()
  var e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) { }
  try {
    c += e.split('.')[1].length
  } catch (f) { }
  return Number((Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)).toFixed(2))
}

// 加的时候解决精度丢失的问题
function clearFloat (arg1 = 0, arg2 = 0) {
  var r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

// 解决精度丢失问题
let accuracyLoss = {
  multiple: function (arg1, arg2) {
    return accMul(arg1, arg2)
  }
}

// 判断是否是数字
const isRealNum = function (val) {
  if (!val) {
    return false
  }
  if (!isNaN(val)) {
    return true
  } else {
    return false
  }
}

const SectionToChinese = function (section, num) {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chnUnitChar = ['', '十', '百', '千']
  var strIns = ''; var chnStr = ''
  var unitPos = 0
  var zero = true
  while (section > 0) {
    var v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr
}

const NumberToChinese = function (num) {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
  var unitPos = 0
  var strIns = ''; var chnStr = ''
  var needZero = false
  if (num === 0) {
    return chnNumChar[0]
  }
  while (num > 0) {
    var section = num % 10000
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = SectionToChinese(section, num)
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = (section < 1000) && (section > 0)
    num = Math.floor(num / 10000)
    unitPos++
  }
  return chnStr
}
// 设置地图自定义覆盖物
const setMapSquareOverlay = function (Bmap) {
  function SquareOverlay ({ center, length, color, iconFontClassName }) {
    this._center = center
    this._length = length
    this._color = color
    this._iconFontClassName = iconFontClassName
  }
  SquareOverlay.prototype = new BMap.Overlay()
  SquareOverlay.prototype.initialize = function (map) {
    // 保存map对象实例
    this._map = map
    // 创建div元素，作为自定义覆盖物的容器
    let icon = document.createElement('i')
    icon.className = 'iconfont ' + this._iconFontClassName
    icon.style.fontSize = '24px'
    icon.style.color = '#26334F'
    let div = document.createElement('div')
    div.style.position = 'absolute'
    // 可以根据参数设置元素外观
    div.style.width = this._length + 'px'
    div.style.height = this._length + 'px'
    div.style.borderRadius = '50%'
    div.style.textAlign = 'center'
    div.style.lineHeight = this._length + 'px'
    div.style.backgroundColor = this._color
    div.appendChild(icon)
    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div)
    // 保存div实例
    this._div = div
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div
  }
  // 实现绘制方法   
  SquareOverlay.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器    
    let position = this._map.pointToOverlayPixel(this._center)
    this._div.style.left = position.x - this._length / 2 + 'px'
    this._div.style.top = position.y - this._length / 2 + 'px'
  }
  return SquareOverlay
}
// 计算字符串字节
const getByteVal = function (val, max) {
  let byteValLen = 0
  let len = val.length
  if (len) {
    for (var i = 0; i < len; i++) {
      if (val.charCodeAt(i) > 255) {
        byteValLen += 2
      } else {
        byteValLen++
      }
    }
    return byteValLen
  } else {
    return 0
  }
}
// 图片下载
const userDownLoadImage = function (imgsrc, name) {
  const loading = Vue.prototype.$loading({
    text: '下载中……',
    target: '.bodyNav',
    fullscreen: false
  })
  window.open(imgsrc, '_self')
  setTimeout(() => {
    loading.close()
  }, 1000)
  /* const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据\
    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = name || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc */
}

// 生成校验码
const setVerifyCode = function (dom) {
  let verifyCode = []
  const canvasContainer = dom
  const canvas = canvasContainer.getElementsByTagName('canvas')[0]
  const canvasWidth = canvasContainer.clientWidth
  const canvasHeight = canvasContainer.clientHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const context = canvas.getContext('2d')
  const sCode = 'a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0'
  const aCode = sCode.split(',')
  const aLength = aCode.length
  // 这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
  for (let i = 0; i < 4; i++) {
    // 获取到随机的索引值
    const j = Math.floor(Math.random() * aLength)
    // var const = Math.random() * 30 * Math.PI / 180 // 产生0~30之间的随机弧度
    // 产生一个随机弧度
    const deg = Math.random() - 0.5
    // 得到随机的一个内容
    const txt = aCode[j]
    verifyCode[i] = txt.toLowerCase()
    // 文字在canvas上的x坐标
    const x = 10 + i * 20
    // 文字在canvas上的y坐标
    const y = 20 + Math.random() * 8
    context.font = 'bold 23px 微软雅黑'

    context.translate(x, y)
    context.rotate(deg)

    context.fillStyle = randomColor()
    context.fillText(txt, 0, 0)

    context.rotate(-deg)
    context.translate(-x, -y)
  }
  // 验证码上显示线条
  for (let i = 0; i <= 5; i++) {
    context.strokeStyle = randomColor()
    context.beginPath()
    context.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.stroke()
  }
  // 验证码上显示小点
  for (let i = 0; i <= 30; i++) {
    context.strokeStyle = randomColor()
    context.beginPath()
    const x = Math.random() * canvasWidth
    const y = Math.random() * canvasHeight
    context.moveTo(x, y)
    context.lineTo(x + 1, y + 1)
    context.stroke()
  }
  function randomColor () {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
  return verifyCode
}

export {
  compileTime,
  formatDate,
  formatNum,
  moneyNum,
  arrayslice,
  jiecheng,
  toBodyString,
  maxArr,
  unique,
  getBeforeDate,
  comparearr,
  comparearrdes,
  isRepeat,
  isEmptyObject,
  convertCurrency,
  accuracyLoss,
  isRealNum,
  SectionToChinese,
  clearFloat,
  NumberToChinese,
  setMapSquareOverlay,
  getByteVal,
  userDownLoadImage,
  setVerifyCode,
  formatThound
}
