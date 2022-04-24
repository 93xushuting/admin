<template>
  <!-- 编辑 用户密码-->
  <zp-dynamicDialog slot="dialog" :obj="dialog" ref="dialogForm">
    <template slot="form">
      <zp-dynamicFormItem :formItem="dialog.temp.userId" name="userId" :obj="dialog" :key="index" />
      <zp-dynamicFormItem :formItem="dialog.temp.userName" name="userName" :obj="dialog" :key="index" />
      <zp-dynamicFormItem :formItem="dialog.temp.oldPassword" name="oldPassword" :obj="dialog" :key="index">
        <template slot="custom_oldPassword">
          <el-input v-if="dialog.temp.oldPassword.isShowPsw" v-model="dialog.ruleForm.oldPassword" type='password' autocomplete="new-password"
            placeholder="请输入8~15位密码，密码由字母、数字及符号组成" style="width:440px;">
            <i slot="suffix" class="iconfont iconyincangmima" @click="toggerPsw(dialog.temp.oldPassword)" />
          </el-input>
          <el-input v-if="!dialog.temp.oldPassword.isShowPsw" v-model="dialog.ruleForm.oldPassword" placeholder="请输入8~15位密码，密码由字母、数字及符号组成"
            style="width:440px;">
            <i slot="suffix" class="iconfont iconxianshimima" @click="toggerPsw(dialog.temp.oldPassword)" />
          </el-input>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="dialog.temp.newPassword" name="newPassword" :obj="dialog" :key="index">
        <template slot="custom_newPassword">
          <el-input v-if="dialog.temp.newPassword.isShowPsw" v-model="dialog.ruleForm.newPassword" type='password' autocomplete="new-password"
            placeholder="请输入8~15位密码，密码由字母、数字及符号组成" style="width:440px;">
            <i slot="suffix" class="iconfont iconyincangmima" @click="toggerPsw(dialog.temp.newPassword)" />
          </el-input>
          <el-input v-if="!dialog.temp.newPassword.isShowPsw" v-model="dialog.ruleForm.newPassword" placeholder="请输入8~15位密码，密码由字母、数字及符号组成"
            style="width:440px;">
            <i slot="suffix" class="iconfont iconxianshimima" @click="toggerPsw(dialog.temp.newPassword)" />
          </el-input>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="dialog.temp.alginNewPassword" name="alginNewPassword" :obj="dialog" :key="index">
        <template slot="custom_alginNewPassword">
          <el-input v-if="dialog.temp.alginNewPassword.isShowPsw" v-model="dialog.ruleForm.alginNewPassword" type='password'
            autocomplete="new-password" placeholder="请输入8~15位密码，密码由字母、数字及符号组成" style="width:440px;">
            <i slot="suffix" class="iconfont iconyincangmima" @click="toggerPsw(dialog.temp.alginNewPassword)" />
          </el-input>
          <el-input v-if="!dialog.temp.alginNewPassword.isShowPsw" v-model="dialog.ruleForm.alginNewPassword" placeholder="请输入8~15位密码，密码由字母、数字及符号组成"
            style="width:440px;">
            <i slot="suffix" class="iconfont iconxianshimima" @click="toggerPsw(dialog.temp.alginNewPassword)" />
          </el-input>
        </template>
      </zp-dynamicFormItem>
    </template>
  </zp-dynamicDialog>
</template>
<script>
import { callbackify } from 'util'
export default {
  name: 'customUserPws',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dialog.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialog: {
        dialogFormCenter: true, // 所有内空居中显示
        isShowLabel: true, // 是否显示label
        // labelWidth: '80px', // label宽度
        sideDialog: false,
        name: 'dialog.ruleForm',
        dialogWidth: '1000px', // dialog 宽度
        dialogSize: 'small',
        labelWidth: '100px', // form 宽度
        formInline: false, // form  设置 inline 属性可以让表单域变为行内的表单域
        title: '',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: true, // 是否显示确定按钮
        temp: {
          userName: {
            label: '用户名',
            disabled: true,
            isShow: true
          },
          oldPassword: {
            key: 'oldPassword',
            formType: 'custom',
            label: '旧密码',
            isShowPsw: true,
            isShow: true
          },
          newPassword: {
            key: 'newPassword',
            formType: 'custom',
            label: '新密码',
            isShowPsw: true,
            isShow: true
          },
          alginNewPassword: {
            key: 'alginNewPassword',
            formType: 'custom',
            label: '确认新密码',
            isShowPsw: true,
            isShow: true
          }
        },
        ruleForm: {
          userId: '',
          userName: '',
          oldPassword: '', // 旧密码
          newPassword: '', // 新密码 
          alginNewPassword: '' // 新密码 
        },
        rules: {
          oldPassword: formCheck.getRuleObj({
            message: '请输入原密码',
            opts: {
              pattern: 'pwd',
              message: '请输入8~15位密码，密码由字母、数字及符号组成'
            }
          }),
          newPassword: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('请输入新密码'))
                }
                const reg = formCheck.rules.pwd
                if (!value.match(reg)) {
                  return callback(new Error('请输入8~15位密码，密码由字母、数字及符号组成'))
                }
                const { oldPassword } = this.dialog.ruleForm
                if (oldPassword === value) {
                  callback(new Error('新旧密码相同'))
                  return
                }
                callback()
              }
            }
          ],
          alginNewPassword: [{ validator: validatePass2, required: true, trigger: 'blur' }]
        },
        callback: this.callbackCommit
      }
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   console.info('userPsw', _store.state.user.obj.realName)
    // })
  },
  methods: {
    callbackCommit () {
      let param = this.dialog.ruleForm
      this._api.user_modify_pwd(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialog.show = false
        _fn.toLocation('/login')
      })
    },
    toggerPsw (item) {
      item.isShowPsw = !item.isShowPsw
    },
    show (item) {
      this.dialog.ruleForm.userId = _store.state.user.obj.id
      this.dialog.ruleForm.userName = _store.state.user.obj.realName
      _fn.extend(true, this.dialog, item)
      this.dialog.show = true
    },
    clean () {
      this.dialog.ruleForm = {

      }
    }
  }
}
</script>
<style lang="less" scoped>
.iconyincangmima,.iconxianshimima{
  cursor: pointer;
}
</style>
