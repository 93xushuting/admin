import formCheck from '../../util/formCheck'
import { setVerifyCode } from '../../util/utils'
export default {
  name: 'login',
  data () {
    return {
      computedErrorCount: 0,
      verifyCode: [],
      form: {
        username: '',
        password: '',
        // code: '',
        remember: false
      },
      errorMsg: '',
      codeVisible: false
    }
  },
  watch: {
    computedErrorCount (val) {
      if (val < 3) {
        return
      }
      this.codeVisible = true
      this.$nextTick(function () {
        this.drawCodehandle()
      })
    }
  },
  computed: {
    usernameCheck () {
      const obj = process.env.NODE_ENV === 'development' ? { message: '请输入手机号' } : {
        message: '请输入手机号',
        opts: {
          pattern: 'phone',
          message: '手机号为7~11位数字'
        }
      }
      return formCheck.getRuleObj(obj)
    },
    passwordCheck () {
      const obj = process.env.NODE_ENV === 'development' ? { message: '请输入密码' } : {
        message: '请输入密码',
        opts: {
          pattern: 'pwd',
          message: '密码格式不符'
        }
      }
      return formCheck.getRuleObj(obj)
    },
    codeCheck () {
      return formCheck.getRuleObj({
        validator: (rule, value, callback) => {
          if (!value) {
            return new callback(new Error('请输入验证码'))
          }
          const verifyCode = this.verifyCode.join('')
          if (value.toLocaleLowerCase() !== verifyCode.toLocaleLowerCase()) {
            return new callback(new Error('验证码不符'))
          }
          callback()
        }
      })
    }
  },
  methods: {
    drawCodehandle () {
      this.verifyCode = setVerifyCode(this.$refs['getcode-btn'])
    },
    userLogin (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.errorMsg = '帐号或密码不正确'
          const { form } = this
          this._api.login({
            password: form.password,
            remember: form.remember,
            username: form.username
          }).then(res => {
            const { data } = res
            _store.dispatch('user/setObj', data.user) // 设置用户
            localStorage.setItem('zp_userId', data.user.id)
            localStorage.setItem('zp_roleId', data.user.roleId)
            localStorage.setItem('zp_token', data.user.token)
            localStorage.setItem('user_login_info', form.remember ? encodeURI(JSON.stringify({
              username: form.username,
              password: form.password,
              remember: true
            })) : '')
            _fn.message('登录成功', { type: 'success' })
            _fn.toLocation('/index')
          }).catch(errorMsg => {
            ++this.computedErrorCount
          })
        }
      })
    }
  },
  mounted: function () {
    const remember = localStorage.getItem('user_login_info')
    const bl = !!remember
    this.form = Object.assign({}, this.form, {
      remember: bl,
      username: bl ? JSON.parse(decodeURI(remember)).username : '',
      password: bl ? JSON.parse(decodeURI(remember)).password : ''
    })
  }
}
