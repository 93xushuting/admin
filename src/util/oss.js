// 阿里云oss服务
class OssService {
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    this.client = null
  }
  // 配置参数
  config ({ accessKeyId, accessKeySecret, bucket, endpoint, path }) {
    this._config = {
      accessKeyId, accessKeySecret, bucket, endpoint, path
    }
  }
  // 上传成功后的事件（自定义事件）
  // onsuccess (args): void

  /**
   * 上传文件
   * @param {File} file - 文件
   * @param {Function} cb - 上传进度事件（可选）
   * @param {Object} args - 每次上传成功后，需要带给后端的参数（可选）
   */
  async upload (file, cb, args) {
    // 一次只能上传一个文件
    // if (this.client !== null) {
    //   throw new Error({
    //     code: 1,
    //     msg: '正在上传中，请勿重复上传'
    //   })
    // }
    const { _config } = this
    // 加上文件后缀名
    let ossPath = `${_config.path}/${Date.now()}${Math.random().toString(34).substr(-4)}${file.name.substr(file.name.lastIndexOf('.'))}`

    try {
      // 实例上传对象
      let client = new window.OSS.Wrapper({
        secure: true,
        ..._config
      })
      this.client = client
      // 自定义参数
      client.__extern_params__ = {}
      // 开始上传
      await client.multipartUpload(ossPath, file, {
        progress: async (p, checkpoint) => {
          if (!checkpoint) return
          client.__extern_params__['checkpoint'] = checkpoint
          if ((typeof cb).toLocaleLowerCase() === 'function') {
            let result = {
              progress: Math.floor(p * 100), // 进度速度
              ossPath: ossPath, // oss文件名称
              sourceFileName: file.name // 源文件名称
            }
            cb(result)
          }
        }
      })
      // 生成可访问URL地址
      let url = client.signatureUrl(ossPath, { expires: 31536000000 })
      if ((typeof this.onsuccess).toLocaleLowerCase() === 'function') { this.onsuccess(args) }
      // 如果成功，则将client重置
      this.client = null

      return {
        ossPath: ossPath,
        url: url.substr(0, url.indexOf('?')) // 将生成的签名截断
      }
    } catch (ex) {
      // 如果出错，则将client重置
      this.client = null
      throw new Error({
        code: 1,
        msg: ex
      })
    }
  }

  // 取消上传
  async cancel () {
    if (this.client !== null) {
      this.client.cancel()
      this.client = null
    }
  }
  // 预览/下载文件
  formatUrl (params) {
    if (!this._config) {
      throw new Error('this._config: ' + this._config)
    }
    const path = this._config.path.replace(/\d*$/g, '')
    const str = params.fileUrl.split(path)[1]
    const client = new window.OSS.Wrapper({
      accessKeyId: this._config.accessKeyId,
      accessKeySecret: this._config.accessKeySecret,
      bucket: this._config.bucket,
      endpoint: this._config.endpoint
    })
    let response = ''
    if (params.fileName) {
      response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(params.fileName + '.png')}`
      }
    }
    return client.signatureUrl(path + str, response ? { response } : {})
  }
  // 预览文件
  previewFile (fileUrl) {
    return this.formatUrl({
      fileUrl
    })
  }
  // 下载文件
  downLoad (fileUrl, fileName) {
    return this.formatUrl({
      fileUrl,
      fileName
    })
  }
  async loadAliOssLib () {
    // 如果视频点播上传和OSS上传没有定义，则加载对应的js库
    if (typeof window.OSS === 'undefined') {
      await this.loadScript('/static/libs/aliyun-oss-sdk-5.2.0.min.js') // 图片
    }
  }
  loadScript (src) {
    return new Promise((resolve, reject) => {
      const id = `loadScript_${src.replace(/[^a-zA-Z0-9]/g, '')}`
      let script = document.getElementById(id)
      if (script !== null) {
        resolve()
        return
      }
      script = document.createElement('script')
      script.id = id
      script.onload = function () {
        resolve()
      }
      script.src = src
      document.body.appendChild(script)
    })
  }
  ossReady (fn) {
    this.loadAliOssLib().then(() => {
      if (_store.state.oss.obj.bucket) {
        typeof fn === 'object' && fn.loadPdf()
      }
    })
    if (!_store.state.oss.obj.bucket) {
      _api.public_getOssConfig({}).then((res) => {
        console.info('ossReady ajax')
        let data = res.data
        let param = {
          accessKeyId: data.accessKey,
          accessKeySecret: data.accessSecret,
          bucket: data.bucket,
          endpoint: 'https://' + data.endpoint,
          path: data.path || 'zp/dev'
        }
        this.config(param)
        typeof fn === 'object' && fn.loadPdf()
        this.onsuccess = (args) => {
          fn && fn(args) // 这里请求接口，通知后端上传成功了
        }
        _ossService.config(param)
        _ossService.onsuccess = (args) => {
          fn && fn(args) // 这里请求接口，通知后端上传成功了
        }
        _store.dispatch('oss/setObj', param)
      })
    }
  }
}
Vue.prototype._ossService = window._ossService = new OssService() // 文件上传
export default OssService
