<template>
  <!-- 编辑 用户密码-->
  <zp-dynamicDialog slot="dialog" :obj="dialog" ref="dialogForm">
    <template slot="form">
      <zp-dynamicFormItem :formItem="dialog.temp.name" name="name" :obj="dialog" :key="index" />
      <zp-dynamicFormItem :formItem="dialog.temp.type" name="type" :obj="dialog" :key="index" />
      <zp-dynamicFormItem :formItem="dialog.temp.path" name="path" :obj="dialog" :key="index" />
      <zp-dynamicFormItem v-if="dialog.temp.parentId.isShow" :formItem="dialog.temp.parentId" name="parentId" :obj="dialog">
        <template slot="custom_parentId">
          <zp-selectTree v-model="dialog.ruleForm.parentId" :options="dialog.temp.parentId.data" :props="defaultProps2" width="440" />
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem v-if="dialog.temp.deptName.isShow" :formItem="dialog.temp.deptName" name="deptName" :obj="dialog" />
      <zp-dynamicFormItem :formItem="dialog.temp.level" name="level" :obj="dialog" />
    </template>
  </zp-dynamicDialog>
</template>
<script>
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
    return {
      defaultProps2: {
        parent: 'parent',
        value: 'id',
        label: 'name',
        children: 'resourceList'
      },
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
          name: {
            formType: 'input',
            label: '名称',
            maxlength: 10,
            isShow: true
          },
          type: {
            formType: 'select',
            label: '类型',
            isShow: true,
            data: [
              { label: '菜单', value: 1 },
              { label: '按钮', value: 2 }
            ]
          },
          path: {
            formType: 'input',
            label: '访问路径',
            isShow: true
          },
          parentId: {
            key: 'parentId',
            formType: 'custom',
            label: '上级',
            isShow: true,
            data: []
          },
          deptName: {
            formType: 'input',
            label: '上级',
            isShow: false,
            disabled: true
          },
          level: {
            formType: 'input',
            label: '层级',
            isShow: true
          }
        },
        ruleForm: {
          name: '',
          type: '',
          path: '',
          parentId: '',
          level: ''
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          type: [{ required: true, message: '请选择类型', trigger: 'change' }],
          path: [{ required: true, message: '请输入访问路径', trigger: 'blur' }],
          parentId: [{ required: true, message: '请选择上级ID', trigger: 'change' }],
          level: [{ required: true, message: '请输入层级', trigger: 'blur' }]
        },
        callback: this.callbackCommit
      }
    }
  },
  mounted () {
    console.info('callback --- ', this.callback)
  },
  methods: {
    callbackCommit () {
      let url = 'resource_add'
      let param = this.dialog.ruleForm
      if (param.id) {
        url = 'resource_update'
      }
      console.info('param', url)
      this._api[url](param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialog.show = false
        this.clear()
        this.dialog.cb && this.dialog.cb()
      })
    },
    clear () {
      this.dialog.ruleForm = {
        name: '',
        type: '',
        path: '',
        parentId: '',
        level: ''
      }
    },
    show (item) {
      _fn.extend(true, this.dialog, item)
      this.dialog.show = true
      console.info('callback --- ', item.cb)
    },
    setTreeData (data, item) {
      if (data) {
        this.dialog.temp.parentId.data = data || []
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
