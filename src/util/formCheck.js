/**
 * 表单验证规则check rule
 */
var check_ = {
  rules: {
    n1: /^\d*$/, // 只能是数字
    n2: /^-?\d+\.?\d*$/, // 数字（'-','.' ,'数字'）
    n3: /[A-Za-z][A-Za-z0-9_\\-]{3,19}$/, // 以字母开头，4-20位，特殊符号只允许-和_(用户名)
    n4: /^[a-zA-Z0-9]{6,20}$/, // 包含字母、数字，6-20位(密码)
    phone: /^\d{7,11}$/g, // 手机号
    pwd: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,15}$/g // 8-15位密码字母、数字及特殊符号
  },
  message: {

  },
  getRuleObj (ops) { // 默认值 {validator: _fn.checkNotNull, required: true, trigger: 'blur'}
    let ret = []
    let obj = {
      validator: typeof ops.validator === 'undefined' ? this.checkNotNull : ops.validator,
      type: ops.type || 'string',
      trigger: ops.trigger || 'blur',
      required: typeof ops.required === 'undefined' ? !ops.required : ops.required,
      message: ops.validator ? '' : (ops.message || '不能为空值')
    }
    ret.push(obj)
    if (_fn.isNumber(ops.min) || _fn.isNumber(ops.max)) {
      ret.push({
        trigger: obj.trigger,
        min: ops.min,
        max: ops.max,
        message: `必须为` + ops.min + `-` + ops.max + `个字符`
      })
    }
    if (_fn.isObject(ops.opts)) { // opts : {} 表示(只能是数字,)
      let o = ops.opts
      ret.push({
        pattern: this.rules[o.pattern || 'n1'],
        message: o.message || '必须为数字值',
        trigger: obj.trigger
      })
    }
    return ret
  },
  checkNotNull (rule, value, callback) {
    if (!value && value !== 0) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
}
export default check_

/**
 * 使用
 // 默认值 {validator: _fn.checkNotNull, required: true, trigger: 'blur'}
  name: _fn.check.getRuleObj({ message: '机构不能为空' }),
  contacter: _fn.check.getRuleObj({ message: '联系人不能为空' }),
  phone: _fn.check.getRuleObj({
    message: '联系人方式不能为空',
    opts: { pattern: _fn.check.rege.mobile2.rege, message: _fn.check.rege.mobile2.message }
  }),
  email: _fn.check.getRuleObj({
    message: '邮箱不能为空',
    opts: { pattern: _fn.check.rege.email.rege, message: _fn.check.rege.email.message }
  }),
  institutionType: _fn.check.getRuleObj({ message: '类型不能为空' }),
  license: _fn.check.getRuleObj({ message: '营业执照不能为空' }),
  address: _fn.check.getRuleObj({ message: '地址不能为空' })

  permissionName: _fn.check.getRuleObj({ message: '权限组名称不能为空' }),
  roleName: _fn.check.getRuleObj({ message: '择角色不能为空' }),
  enableIds: [{ validator: checkTree, type: 'array', required: true, trigger: 'change' }
 *
 *
 */
