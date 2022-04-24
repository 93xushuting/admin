<template>
  <zp-dialog :obj="dialog" :width="dialog.dialogWidth" :sideDialog="dialog.sideDialog" :size="dialog.long" @close="clearDialog">
    <div slot="body" class="dialogTable">
      <slot :name="'dialog'+dialog.slot" :form="dialog"></slot>
      <el-form @submit.native.prevent :inline="dialog.formInline" :model="dialog.ruleForm" :rules="dialog.rules" :ref="dialog.name"
        :label-width="dialog.labelWidth" class="infoForm" :class="dialog.dialogFormCenter ? 'dialogFormCenter' : ''">
        <slot name="form" :form="dialog.ruleForm"></slot>
      </el-form>
      <slot name="table" :form="dialog"></slot>
    </div>
  </zp-dialog>
</template>
<script>
export default {
  name: 'dialogForm',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    obj: {
      handler (val, oldVal) {
        Object.assign(this.dialog, this.obj, val)
        // console.info('克隆dialog.ruleForm', this.dialog)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      newForm: {}, // 克隆dialog.ruleForm
      dialog: {
        sideDialog: false,
        ruleForm: {},
        rules: {},
        name: 'dialog.ruleForm',
        dialogWidth: '504px', // dialog 宽度
        dialogSize: 'small',
        labelWidth: '100px', // form 宽度
        formInline: false, // form  设置 inline 属性可以让表单域变为行内的表单域
        title: '',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: true, // 是否显示确定按钮
        cancelCallback: this.clearDialog,
        confirmCallback: this.commitDialog
      }
    }
  },
  created () {
    if (this.obj.ruleForm) {
      this.newForm = JSON.parse(JSON.stringify(this.obj.ruleForm))
      // console.info('弹出框默认值', this.obj.ruleForm)
    }
  },
  methods: {
    commitDialog (fn) {
      this.$refs[this.dialog.name].validate((valid) => {
        if (valid) {
          if (fn) {
            fn(this.dialog.ruleForm)
          } else {
            let cb = this.dialog.callback || (this.$parent.commit || this.$parent.$parent.commit)
            if (cb) {
              cb(this.dialog, (res) => {
                this.clearDialog()
              })
            }
          }
        } else {
          return false
        }
      })
    },
    clearDialog () {
      this.obj.show = false
      this.obj.ruleForm = JSON.parse(JSON.stringify(this.newForm))
      this.$refs[this.dialog.name].resetFields()
    }
  }
}
</script>
<style scoped lang="less">
.dialogTable{
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
