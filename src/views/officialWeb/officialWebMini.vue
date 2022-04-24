<style lang="less" scoped>
  @import './officialWeb.less';
</style>
<template>
  <div class="officialWebMini-layout-wrapper">
    <div class="banner">
      <div class="banner-mask">
        <img src="../../../static/image/banner-mini.png" alt="">
      </div>
      <div class="banner-content">
        <div>
          <img src="../../../static/image/new-logo.png" alt="">
          <p>全国严选，真实好工作！</p>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <!-- <wx-open-launch-weapp id="launch-btn" username="gh_ab58bab2f888" :path="`pages/home/home/home`"
      style="width:100%;height:80px;position:absolute;top:0;zIndex:1;">
      <script type="text/wxtag-template">
        <div class="btn-group-no-shadow" style="width: 100%;height: 80px;opacity: 1;">跳转小程序</div>
      </script>
    </wx-open-launch-weapp> -->
    <div class="officialweb-body">
      <div class="officialweb-content wrapper">
        <div class="officialweb-box">
          <div class="img-svg">
            <img src="../../../static/image/group-Mini.png" alt="">
          </div>
          <div class="content">
            <div class="content_item">
              <img src="../../../static/image/jingxuan.png" alt="">
              <div>
                <p class="content_item_title">精选真实工作机会</p>
                <p class="content_item_desc">在线职位广场聚集精选真实工作机会，杜绝虚假招聘量身推荐，帮你匹配最合适的职位专注餐饮服务行业，门店直招免费可靠</p>
              </div>
            </div>
            <div class="content_item">
              <img src="../../../static/image/kuaijie.png" alt="">
              <div>
                <p class="content_item_title">快捷投递立即响应</p>
                <p class="content_item_desc">在线便捷投递简历，专属服务人员立即响应随时随地掌握求职进度，最新求职咨询</p>
              </div>
            </div>
            <div class="content_item">
              <img src="../../../static/image/ltv.png" alt="">
              <div>
                <p class="content_item_title">LTV求职一站式服务</p>
                <p class="content_item_desc">采用LTV服务模式，与求职者建立长期信任关系，持续提供优质服务</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <div class="logo">
          <img src="../../../static/image/new-logo.png" alt="">
        </div>
      </div>
      <div class="footer-right">
        <div class="code">
          <img src="../../../static/image/wecom-temp1.png" alt="">
          <p>扫一扫，立即关注官方公众号</p>
        </div>
        <div class="code">
          <img src="../../../static/image/wecom-temp2.png" alt="">
          <p>扫一扫，立即打开小程序</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
export default {
  data () {
    return {
      // phone: '15216763787'
      phone: this.getQueryVariable('phone')
    }
  },
  created () {
    this.loadScript('./static/libs/shanyan.min.js')
  },
  mounted () {
    // console.info('officialwebmini')
    // alert(`1 - mounted :${this.phone}`)
    this.$nextTick(() => {
      this.loadScript('https://sdk.253.com/jminstall.js', () => {
        // alert(`2 - Web SDK 集成指南 :${this.phone}`)
        this.getChenckPhoneSign() // 获取签名
      }, 'jminstall')
    })
  },
  methods: {
    getQueryVariable (variable) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] === variable) { return pair[1] }
      }
      return ''
    },
    setUrl (flag) {
      // alert(`7 - flag - :${flag}`)
      axios({
        method: 'POST',
        // data: { path: 'pagesA/pages/tempList/tempList', query: flag ? `phone=${this.phone}` : '' },
        data: { query: flag ? `phone=${this.phone}` : '' },
        url: '/public/getWxUrlScheme'
      }).then(res => {
        window.location.href = (res && res.data) || {}
      })
    },
    chenckPhone (param) { // 验证手机号
      axios({
        method: 'POST',
        data: param,
        url: '/public/getChenckPhone'
      }).then(res => {
        // alert(`5 - 验证手机号 - :${res}`)
        // alert(`6 - 验证手机号 - :${res.data}`)
        if (res && res.data) {
          this.setUrl(res.data)
        } else { // 报错直接走流程
          this.setUrl()
        }
      })
    },
    getChenckPhoneSign () { // 获取签名
      // 创建对象
      var login = new OneKeyLoginManager()
      // 获取预签名
      var preSign = login.getPreSign()
      axios({
        method: 'POST',
        data: {
          appId: 'vDV4v1CB', // 闪验应用appId
          appKey: 'Wk6Mvo2R', // 闪验应用appKey
          preSign: preSign
        },
        url: '/public/getChenckPhoneSign'
      }).then(res => {
        let ret = (res && res.data) || {}
        if (res && res.data) {
          // alert(`3 - 获取预签名:${JSON.stringify(res)}`)
          // 初始化
          login.init({
            appId: 'vDV4v1CB', // 闪验应用appId
            timestamp: ret.timestamp,
            sign: ret.sign, // 签名
            callback: (info) => {
              // alert(`4 - token -  ${JSON.stringify(info)}`)
              if (info.code === 1000) {
                this.chenckPhone({
                  appId: 'vDV4v1CB', // 闪验应用appId
                  token: (info.extra && info.extra.token) || '', // 
                  phone: this.phone, // 需校验的手机号
                  sign: ret.sign // 签名
                })
              } else { // 报错直接走流程
                // alert(`login.init - :${this.phone}`)
                this.setUrl()
              }
            }
          })
        } else { // 报错直接走流程
          // alert(`public/getChenckPhoneSign - :${this.phone}`)
          this.setUrl()
        }
      })
    },
    loadScript (src, callback, type) {
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
          if (type === 'jminstall') {
            // eslint-disable-next-line no-new
            new jminstall({
              // jminstall中应用的唯一标识，用于识别您的应用
              appKey: '5DLpCbud',
              // jminstall初始化完成的回调函数
              onready: function () {
                // alert(1)
                callback && callback()
                // var _self = this
                // 用户点击您页面上的某个按钮时(假定您的按钮id为downloadButton)，安装app
                // var button = document.getElementById('downloadButton');
                // button.onclick = function () {
                //   _self.wakeupOrInstall();
                // };
              }
            }, { a: 1, b: 2 } // 传递到APP的动态参数
            )
          }
          resolve()
        }
        script.src = src
        document.body.appendChild(script)
      })
    }
  }
}
</script>
