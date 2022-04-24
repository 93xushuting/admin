<template>
  <!-- 创建/编辑 用户基本信息-->
  <zp-dynamicDialog slot="dialog" :obj="dialog" ref="dialogForm">
    <template slot="form">
      <!-- avatar: '', // 头像
          realName: '', // 名称 
          mobile: '', // 手机号
          password: '', // 密码
          roleId: '', // 角色 
          deptId: '', // 部门 
          enabled: true // 启用 -->
      <zp-dynamicFormItem :formItem="dialog.temp.avatar" name="avatar" :obj="dialog" class="avatar" style="margin-bottom: 5px;">
        <template slot="custom_avatar">
          <zp-upload uploadType="avatar" :callback="avatarFunction">
            <template slot="avatar">
              <div class="imgUpload">
                <div class="header">
                  <el-avatar :size="64">
                    <img v-if="dialog.ruleForm.avatar" :src="dialog.ruleForm.avatar" />
                    <img v-else src="../../assets/image/header.png" />
                  </el-avatar>
                </div>
                <div style="text-align: left;">
                  <zp-button @click="save" icon="el-icon-upload2">点击上传</zp-button><br />
                  <div class="message">请选择大小不超过2M 的照片</div>
                </div>
              </div>
              <!-- <span class="changeImg">更换头像</span>
              <el-avatar :size="120" v-if="!form.ruleForm.headUrl"> {{form.ruleForm.realName && form.ruleForm.realName.substring(0,1)}}</el-avatar>
              <el-avatar :size="120" v-else><img :src="form.ruleForm.headUrl" /></el-avatar> -->
            </template>
          </zp-upload>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="dialog.temp.realName" name="realName" :obj="dialog" />
      <zp-dynamicFormItem :formItem="dialog.temp.mobile" name="mobile" :obj="dialog">
        <template slot="custom_mobile">
          <el-input placeholder="请输入内容" v-model="dialog.ruleForm.mobile" style="width:440px;"
            :disabled="dialog.temp.mobile.disabled || dialog.ruleForm.id">
            <el-select v-model="dialog.ruleForm.mobile2" slot="prepend" placeholder="请选择" style="width:130px;"
              :disabled="dialog.temp.mobile.disabled || dialog.ruleForm.id">
              <template v-for="(itme,index) in _var.quhao">
                <el-option :label="itme.label" :value="itme.value" :key="index" />
              </template>
            </el-select>
          </el-input>
          <el-tooltip class="item" effect="dark" content="手机号将作为登录系统的用户名" placement="top">
            <i class="el-icon-info" style="color: #8798AD;" />
          </el-tooltip>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="dialog.temp.workPhoneNumber" name="workPhoneNumber" :obj="dialog">
        <template slot="custom_workPhoneNumber">
          <el-input placeholder="请输入工作号码" v-model="dialog.ruleForm.workPhoneNumber" style="width:440px;">
            <el-select v-model="dialog.ruleForm.workAreaCode" slot="prepend" placeholder="请选择" style="width:130px;">
              <template v-for="(item,index) in areaCode">
                <el-option :label="item.label" :value="item.value" :key="index" />
              </template>
            </el-select>
          </el-input>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="dialog.temp.password" name="password" :obj="dialog" v-if="!dialog.temp.password.disabled && !dialog.ruleForm.id">
        <template slot="custom_password">
          <el-input v-if="isShowPsw" v-model="dialog.ruleForm.password" type='password' autocomplete="new-password"
            placeholder="请输入8~15位密码，密码由字母、数字及符号组成" style="width:440px;">
            <i slot="suffix" class="iconfont iconyincangmima" @click="toggerPsw" />
          </el-input>
          <el-input v-if="!isShowPsw" v-model="dialog.ruleForm.password" placeholder="请输入8~15位密码，密码由字母、数字及符号组成" style="width:440px;">
            <i slot="suffix" class="iconfont iconxianshimima" @click="toggerPsw" />
          </el-input>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem v-if="dialog.temp.roleName.isShow" :formItem="dialog.temp.roleName" name="roleName" :obj="dialog" />
      <zp-dynamicFormItem v-if="dialog.temp.roleId.isShow" :formItem="dialog.temp.roleId" name="roleId" :obj="dialog" />

      <zp-dynamicFormItem v-if="dialog.temp.deptId.isShow" :formItem="dialog.temp.deptId" name="deptId" :obj="dialog">
        <template slot="custom_deptId">
          <zp-selectTree v-model="dialog.ruleForm.deptId" :options="dialog.temp.deptId.data" :props="defaultProps2" width="440" />
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem v-if="dialog.temp.deptName.isShow" :formItem="dialog.temp.deptName" name="deptName" :obj="dialog" />

      <!-- <zp-dynamicFormItem :formItem="dialog.temp.deptId" name="deptId" :obj="dialog">
        <template slot="custom_deptId">
          <zp-selectTree v-if="!dialog.temp.deptId.disabled" v-model="dialog.ruleForm.deptId" :options="dialog.temp.deptId.data"
            :props="defaultProps2" width="440" />
          <zp-input v-else :disabled="dialog.temp.deptId.disabled" v-model="dialog.ruleForm.deptId" style="width:440px" />
        </template>
      </zp-dynamicFormItem> -->
      <zp-dynamicFormItem :formItem="dialog.temp.enabled" name="enabled" :obj="dialog" />
      <zp-dynamicFormItem :formItem="dialog.temp.gender" name="gender" :obj="dialog" />
    </template>
  </zp-dynamicDialog>
</template>
<script>
export default {
  name: 'customUserInfo',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      isShowPsw: true,
      defaultProps2: {
        parent: 'parentId',
        value: 'id',
        label: 'name',
        children: 'childList'
      },
      roldList: [],
      areaCode: [], // 区号
      dialog: {
        isUpdate: false,
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
          avatar: {
            key: 'avatar',
            formType: 'custom',
            label: '头像',
            isShow: true
          },
          realName: {
            label: '姓名',
            isShow: true,
            maxlength: 10
          },
          mobile: {
            key: 'mobile',
            formType: 'custom',
            label: '手机号',
            isShow: true
          },
          workPhoneNumber: {
            key: 'workPhoneNumber',
            formType: 'custom',
            label: '工作号码',
            isShow: true
          },
          password: {
            key: 'password',
            formType: 'custom',
            label: '初始密码',
            isShow: true
          },
          roleId: {
            formType: 'select',
            label: '角色',
            isShow: true,
            data: []
          },
          roleName: {
            formType: 'input',
            label: '角色',
            isShow: false,
            disabled: true
          },
          deptId: {
            key: 'deptId',
            formType: 'custom',
            label: '部门',
            isShow: true,
            data: []
          },
          deptName: {
            formType: 'input',
            label: '部门',
            isShow: false,
            disabled: true
          },
          enabled: {
            formType: 'radio',
            label: '状态',
            isShow: true,
            data: _var.state
          },
          gender: {
            formType: 'radio',
            label: '性别',
            isShow: true,
            data: _var.sex
          }
        },
        ruleForm: {
          avatar: '', // 头像
          realName: '', // 名称 
          mobile: '', // 手机号
          mobile2: 1, // 区号
          workPhoneNumber: '', // 工作号码
          workAreaCode: '+86', // 区号
          password: '', // 密码
          roleId: '', // 角色 
          deptId: '', // 部门 
          enabled: 1, // 启用
          gender: '' // 性别
        },
        rules: {
          realName: formCheck.getRuleObj({ message: '请输入名称' }),
          mobile: formCheck.getRuleObj({
            message: '请输入手机号',
            opts: {
              pattern: 'phone',
              message: '手机号格式不符'
            }
          }),
          workPhoneNumber: formCheck.getRuleObj({
            validator: null,
            required: false,
            message: '请输入工作号码',
            opts: {
              pattern: 'phone',
              message: '工作号码格式不符'
            }
          }),
          password: formCheck.getRuleObj({
            message: '请输入密码',
            opts: {
              pattern: 'pwd',
              message: '请输入8~15位密码，密码由字母、数字及符号组成'
            }
          }),
          roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
          roleName: [{ required: true, message: '请选择角色' }],
          deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
          deptName: [{ required: true, message: '请选择部门' }],
          enabled: [{ required: true, message: '请选择状态', trigger: 'blur' }],
          gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
        },
        callback: this.callbackCommit
      }
    }
  },
  created: function () {
    _fn.getPublicCombobox(res => {
      this.areaCode = res
    }, { comboType: 6 }, true)
  },
  mounted () {

  },
  methods: {
    callbackCommit () {
      let user = null
      if (_store.state.user.obj.id === this.dialog.ruleForm.id) {
        user = _fn.extend({}, _store.state.user.obj, this.dialog.ruleForm)
      }
      let callback = this.$parent.$parent.addEditCommit
      if (_fn.isFunction(callback)) {
        callback(this.dialog.ruleForm, () => {
          this.clean()
          this.dialog.show = false
          user && _store.dispatch('user/setObj', user) // 设置用户
        })
      } else {
        let url = this.dialog.updateUrl
        let param = this.dialog.ruleForm
        console.info('user_update', param)
        this._api[url](param).then((res) => {
          this.notify(res.msg || '操作成功', 'success')
          this.clean()
          this.dialog.show = false
          user && _store.dispatch('user/setObj', user) // 设置用户
        })
      }
    },
    getRoleData (item) {
      let param = {
        id: localStorage.getItem('zp_roleId'),
        userId: localStorage.getItem('zp_userId')
      }
      if (item && item.roleId) {
        param.id = item.roleId
      }
      this._api.role_public_valid_role_list(param).then((res) => {
        let list = []
        let data = res.data
        if (data && data.length) {
          for (var i = 0; i < data.length; i++) {
            let o = data[i]
            list.push({ label: o.name, value: o.id })
          }
        }
        this.dialog.temp.roleId.data = list
      })

      // let param = {
      //   pageReq: { page: 1, size: 1000 }
      // }
      // this._api.role_list(param).then((res) => {
      //   let list = []
      //   let data = res.data.list
      //   if (data && data.length) {
      //     for (var i = 0; i < data.length; i++) {
      //       let o = data[i]
      //       list.push({ label: o.name, value: o.id })
      //     }
      //   }
      //   this.dialog.temp.roleId.data = list
      // })
    },
    setTreeData (data, item) {
      if (data) {
        this.dialog.temp.deptId.data = data || []
      }
      this.getRoleData(item)
    },
    avatarFunction (url) {
      console.info('avatarFunction', url)
      this.dialog.ruleForm.avatar = url
    },
    toggerPsw () {
      this.isShowPsw = !this.isShowPsw
    },
    show (item) {
      _fn.extend(true, this.dialog, item)
      this.dialog.show = true
    },
    clean () {
      this.dialog.ruleForm = {
        avatar: '', // 头像
        realName: '', // 名称 
        mobile: '', // 手机号
        mobile2: 1, // 区号
        workAreaCode: '+86',
        workPhoneNumber: '',
        password: '', // 密码
        roleId: '', // 角色 
        deptId: '', // 部门 
        enabled: 1, // 启用
        gender: ''
      }
    },
    getForm () {

    },
    setForm () {

    }
  }
}
</script>
<style lang="less" scoped>
.iconyincangmima,.iconxianshimima{
  cursor: pointer;
}
.imgUpload{
    display: flex;
    >div{
      display:inline-block;
    }
    .header{
      width: 64px; 
      height: 64px;
      background: #26334F;
      color: #fff;
      border-radius: 50%;
      margin-right: 10px;
      line-height: 64px;
      img{
        width: 100%;
      }
    }
    .message{
      color:#69707F;
      font-size:12px;
      margin-top: -5px;
    }
  }
</style>
