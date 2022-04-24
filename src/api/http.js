import qs from 'qs'

axios.defaults.withCredentials = true
axios.defaults.timeout = 120000 // 请求超时时间
export const baseURL = '/api/v1/admin/' // 线上
// export const baseURL = '/api/' // 阿义

axios.defaults.baseURL = baseURL
// axios.defaults.headers.common['Bearer Authorization'] = localStorage.getItem('zp_token') || ''

const CancelToken = axios.CancelToken
let defaultCancelHandler = () => { }
Vue._axiosPromiseArr = []

// 请求的时候loading
let loading
let loginoutCount = true
function startLoading () { // 使用Element loading-start 方法
  loading = Vue.prototype.$loading({
    text: '加载中……'
    // background: 'rgba(255, 255, 255, 0)'
  })
}
export function endLoading () { // 使用Element loading-close 方法
  loading.close()
}
// 那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
// 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading (config) {
  if (needLoadingRequestCount === 0) {
    startLoading()
    NProgress.start()
  }
  needLoadingRequestCount++
  console.info('showFullScreenLoading', needLoadingRequestCount)
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    setTimeout(() => {
      if (needLoadingRequestCount === 0) {
        loginoutCount = true
        loading.close()
        NProgress.done()
        console.info('tryHideFullScreenLoading', needLoadingRequestCount)
      }
    }, 0)
  }
}

// axios 请求拦截器
axios.interceptors.request.use(
  config => {
    NProgress.start()
    showFullScreenLoading()
    if (config.url !== '/portal/login') {
      // console.info('axios 请求拦截器')
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('zp_token') || ''
    } else {
      config.headers['Authorization'] = 'Bearer ' + ''
    }
    if (config.url === '/findJobs_more' || config.url === '/job_for_wechat') {
      config.baseURL = '/CompanyInfo/'
    }
    return config
  },
  error => {
    tryHideFullScreenLoading()
    return Promise.error(error)
  }
)
// 响应拦截
axios.interceptors.response.use(
  response => {
    NProgress.done()
    if (response.statusText === 'OK' || response.status === 200) {
      tryHideFullScreenLoading()
      let types = Object.prototype.toString.call(response.data)
      if (types === '[object ArrayBuffer]' || types === '[object Blob]') {
        let ret = {}
        if (types === '[object ArrayBuffer]') { // 处理图片
          ret = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        } else if (types === '[object Blob]') { // 处理文件流
          ret = response.data
        }
        return Promise.resolve(ret)
      } else {
        if (response.data.code === 0) {
          return Promise.resolve(response.data)
        } else if (response.data.code === 2007 || response.data.code === 2000) { // 登录态失效
          if (loginoutCount) {
            _fn.message(response.data.msg)
            loginoutCount = false
          }
          _store.dispatch('menu/setObj', {})
          _router.replace('/login')
          return Promise.reject(response.data.msg)
        } else {
          _fn.message(response.data.msg)
          return Promise.reject(response.data.msg)
        }
      }
    }
    if (response.status === 504) {
      _fn.message('请求超时')
    }
  },
  error => {
    tryHideFullScreenLoading()
    console.info(error.response)
    if (error.response) {
      if (error.response.data.code === 2007 || error.response.data.code === 2000) {
        if (loginoutCount) {
          _fn.message(error.response.data.msg)
          loginoutCount = false
        }
        _store.dispatch('menu/setObj', {})
        _router.replace('/login')
        return Promise.resolve({ data: [], result: [], msg: '登录状态失效' })
      } else if (error.response) { // 统一处理错误
        NProgress.done()
        console.info('统一处理错误')
        if (loginoutCount) {
          loginoutCount = false
        }
        return Promise.reject(error) // 返回错误信息
      }
    } else {
      if (loginoutCount) {
        loginoutCount = false
      }
      console.info('error', error.response, error.message)
      return Promise.resolve({ data: [], result: [] })
    }
  }
)

// 用于取消请求
// refs: http://www.axios-js.com/docs/#Cancellation

class Http {
  getImage (url, params = {}) {
    return axios.get(url, {
      params: params,
      responseType: 'arraybuffer'
    })
  }
  get (url, params = {}) {
    return axios.get(url, {
      params: params
    })
  }
  /**
   * POST请求
   * @param {String} url - 接口地址
   * @param {Object} params - json
   */
  getUrl (url, param = {}) {
    let search = qs.stringify(param)
    if (search) {
      return url + '?' + search
    }
    return url
  }
  /**
   * POST请求
   * @param {String} url - 接口地址
   * @param {Object} params - 当为数组时，第一个为body值，第二个为query值
   * @param {String} contentType - json
   */
  post (url, params = {}) {
    const options = {
      method: 'POST',
      data: params,
      url: url
    }
    return axios(options)
  }
  formDataPost (url, params = {}) {
    const options = {
      method: 'POST',
      data: qs.stringify(params),
      url: url
    }
    return axios(options)
  }
  /**
   * 上传文件
   * @param {String} url - API地址
   * @param {FormData} formData 表单数据
   */
  upload (url, body = {}) {
    let f = new FormData()
    Object.keys(body).forEach(key => {
      f.append(key, body[key])
    })
    return axios.post(url, f)
  }
  blobFormDataPost (url, params = {}, baseUrl) {
    const options = {
      method: 'POST',
      data: qs.stringify(params),
      url: url,
      responseType: 'blob',
      baseURL: baseUrl || baseURL
    }
    return axios(options)
  }
  blobPost (url, params = {}, baseUrl) {
    const options = {
      method: 'POST',
      data: params,
      url: url,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      },
      baseURL: baseUrl || baseURL
    }
    return axios(options)
  }
  // 并发请求
  all (data, num) {
    return axios.all(data).then(axios.spread(function (res1, res2) {
      return new Promise((resolve, reject) => {
        resolve([res1, res2])
      })
    }))
  }
}
export default Http
