import formCheck from '../../util/formCheck'
import { setVerifyCode } from '../../util/utils'
export default {
  name: 'resetPwd',
  data () {
    return {
      stepsActvie: 0,
      verifyCode: [],
      getsmscodeBtnText: '获取验证码',
      getsmscodeBtnDisabled: false,
      step1form: {
        phoneNumber: '',
        code: '',
        smsCode: ''
      },
      step2form: {
        newPwd: '',
        repeatPwd: ''
      },
      backTimeText: '5s后将自动返回登录页面，或点击立即登录'
    }
  },
  computed: {
    phoneCheck () {
      return [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          pattern: /^1[3456789]\d{9}$/,
          message: '手机号格式不符',
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            this._api.user_public_check_phone({
              mobile: value
            }).then(res => {
              if (!res.data) {
                return callback(new Error('该手机号不存在'))
              }
              callback()
            })
          },
          trigger: 'blur'
        }
      ]
    },
    codeCheck () {
      return formCheck.getRuleObj({
        validator: (rule, value, callback) => {
          if (!value) {
            return new callback(new Error('请输入验证码'))
          }
          const verifyCode = this.verifyCode.join('')
          if (value.toLocaleLowerCase() !== verifyCode.toLocaleLowerCase()) {
            return new callback(new Error('校验码不符'))
          }
          callback()
        }
      })
    },
    smsCode () {
      return [
        {
          required: true,
          message: '请输入短信验证码',
          trigger: 'blur'
        }
      ]
    },
    pwdCheck () {
      return formCheck.getRuleObj({
        message: '请输入密码',
        opts: {
          pattern: 'pwd',
          message: '密码格式不符'
        }
      })
    },
    repeatPwdCheck () {
      return formCheck.getRuleObj({
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请再次输入密码'))
          }
          const { newPwd } = this.step2form
          if (value !== newPwd) {
            return callback(new Error('两次密码输入不一致'))
          }
          callback()
        }
      })
    }
  },
  watch: {
    stepsActvie (val) {
      if (val === 2) {
        this.computedTime()
      }
    }
  },
  methods: {
    drawCodehandle () {
      this.verifyCode = setVerifyCode(this.$refs['getcode-btn'])
    },
    // 短信验证码
    getsmscode () {
      let arr = []
      this.$refs.step1form.validateField(['phoneNumber', 'code'], (errorMessage) => {
        arr.push(!errorMessage)
      })
      const flag = arr.every(item => item)
      if (!flag) {
        return
      }
      this.getsmscodeBtnDisabled = true
      _fn.timerHandleBysetTimeout({
        _this: this,
        count: 60,
        KeepCallback: (count) => {
          this.getsmscodeBtnText = `${count}s再次发送`
        },
        stopCallback: (count) => {
          this.getsmscodeBtnText = '获取验证码'
          this.getsmscodeBtnDisabled = false
        }
      })
      this._api.user_public_send_code({
        phone: this.step1form.phoneNumber
      }).then(res => {
        _fn.message(res.msg || '发送成功', { type: 'success' })
      })
    },
    userSubmit (name) {
      if (name === 'step1form') {
        this.$refs[name].validate(valid => {
          if (valid) {
            this._api.user_public_check_code({
              mobile: this.step1form.phoneNumber,
              code: this.step1form.smsCode
            }).then(res => {
              console.log(res)
              this.stepsActvie = 1
            })
          }
        })
      }
      if (name === 'step2form') {
        this.$refs[name].validate(valid => {
          if (valid) {
            this._api.user_public_forget_password({
              mobile: this.step1form.phoneNumber,
              newPassword: this.step2form.newPwd
            }).then(res => {
              _fn.message(res.msg || '保存成功', { type: 'success' })
              this.stepsActvie = 2
            })
          }
        })
      }
    },
    // 自动返回登录页面5s
    computedTime () {
      _fn.timerHandleBysetTimeout({
        _this: this,
        count: 6,
        KeepCallback: (count) => {
          this.backTimeText = `${count}s后将自动返回登录页面，或点击立即登录`
        },
        stopCallback: (count) => {
          _fn.toLocation({
            name: 'login'
          })
        }
      })
    }
  },
  mounted: function () {
    this.verifyCode = setVerifyCode(this.$refs['getcode-btn'])
  }
}
