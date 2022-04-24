<template>
  <zp-dialog :obj="dialog" :sideDialog='false' :width="width" class="tipDialog">
    <div slot="body" v-html="dialog.tbody"></div>
  </zp-dialog>
</template>
<script>
export default {
  name: 'dialogTip',
  props: {
    width: {
      type: String,
      default: '436px'
    },
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
        // console.info('克隆tipdialog', this.dialog)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      dialog: { // 删除
        id: '',
        title: '提示',
        icon: '',
        tbody: '',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: true, // 是否显示确定按钮
        cancelCallback: () => { },
        confirmCallback: () => { }
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
</style>
