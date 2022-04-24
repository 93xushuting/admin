<template>
  <el-dialog
    :class="sideDialog ? 'sideDialog' : ''"
    v-bind="attrs"
    v-on="$listeners"
    v-if="dialog.show"
    :visible.sync="dialog.show"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :center="center"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="dialog.titleSve ? false : showClose"
    :before-close="beforeClose"
  >
    <template v-if="dialog.titleSve">
      <div slot="title" class="dialog_title">
        <template v-if="dialog.icon">
          <i :class="dialog.icon" />
          <span class="tip">{{ dialog.title || "提示" }}</span>
        </template>
        <template v-else>
          <zp-icons /> <span class="tip">{{ dialog.title || "提示" }}</span>
        </template>
      </div>
    </template>
    <template v-else>
      <span slot="title" v-html="dialog.title || '提示'">
        <slot name="subTitle"
          ><span v-html="dialog.subTitle">{{ dialog.isConfirm }}</span></slot
        >
      </span>
    </template>
    <slot name="body"></slot>
    <span
      slot="footer"
      class="dialog-footer"
      v-if="dialog.isConfirm || dialog.isCancel"
    >
      <zp-button
        :class="className"
        v-if="dialog.isConfirm"
        class="zp-btn-primary"
        @click="closeDialog('confirmCallback')"
      >
        {{ dialog.confirmText || "确 定" }}
      </zp-button>
      <zp-button
        :class="className"
        v-if="dialog.isCancel"
        @click="closeDialog('cancelCallback')"
        >{{ dialog.cancelText || "取 消" }}</zp-button
      >
      <slot name="footer-after"></slot>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'radioGroup',
  props: {
    obj: {},
    sideDialog: {
      type: Boolean,
      default: true // 弹出框动画样式 
    },
    // 是否显示 Dialog
    visible: {
      type: Boolean,
      default: false // 支持 .sync 修饰符	boolean	—	false
    },
    // Dialog 的宽度
    width: {
      type: String,
      default: '50%'
    },
    // 是否为全屏
    fullscreen: {
      type: Boolean,
      default: false
    },
    // Dialog CSS 中的 margin-top 值
    top: {
      type: String,
      default: '15vh'
    },
    // 是否需要遮罩层
    modal: {
      type: Boolean,
      default: true
    },
    // 是否对头部和底部采用居中布局
    center: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: true // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
    },
    appendToBody: {
      type: Boolean,
      default: true // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true	boolean	—	false
    },
    // 是否在 Dialog 出现时将 body 滚动锁定
    lockScroll: {
      type: Boolean,
      default: true
    },
    // Dialog 的自定义类名
    customClass: {
      type: String,
      default: ''
    },
    // 是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 是否可以通过按下 ESC 关闭 Dialog
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 闭前的回调，会暂停 Dialog 的关闭	function(done)，done 用于关闭 Dialog
    beforeClose: Function
  },
  watch: {
    obj: {
      handler (val, oldVal) {
        this.dialog = val
      },
      deep: true
    }
  },
  data () {
    return {
      dialog: {},
      attrs: {}
      // className: []
    }
  },
  created () {
    // let arr = ['zp-btn']
    // const { size, type } = this.$attrs
    // if (size === 'short') {
    //   arr.push('zp-btn-size-short')
    // } else if (size === 'long') {
    //   arr.push('zp-btn-size-long')
    // } else {
    //   arr.push('zp-btn-size-default')
    // }
    // arr.push(type === 'primary' ? 'zp-btn-primary' : 'zp-btn-primary-empty')
    // this.className = arr
  },
  methods: {
    closeDialog (callbackName) {
      if (callbackName === 'cancelCallback') {
        this.dialog.show = false
        if (this.$listeners['close']) {
          this.$listeners['close'].call(this)
        }
      }
      if (this.obj[callbackName]) {
        this.obj[callbackName].call(this)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dialog_title {
  display: flex;
  .tip {
    margin-left: 10px;
  }
  .el-icon-question {
    font-size: 24px;
    color: #ffb61a;
  }
  .el-icon-warning {
    font-size: 24px;
    color: #4a84ff;
  }
  .el-icon-error {
    font-size: 24px;
    color: #fb5146;
  }
}
.sideDialog {
  /deep/ .el-dialog {
    width: 1280px;
    height: 100%;
    margin: 0 0 0 auto !important;
    .el-dialog__header {
      height: 64px;
      padding: 0 20px;
      line-height: 64px;
      box-shadow: 0 3px 8px #f4f4f4;
      border-bottom: 0;
    }
    .el-dialog__body {
      overflow-y: auto;
      padding: 20px;
      height: calc(100% - 168px);
    }
    .el-dialog__footer {
      position: relative;
      width: 100%;
      text-align: center;
      padding: 0;
      height: 64px;
      border-top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 12px #999;
      z-index: 1999;
    }
  }
  &.dialog-fade-enter-active {
    animation: sidedialog-fade-in 0.2s;
  }
  &.dialog-fade-leave-active {
    animation: sidedialog-fade-out 0.2s;
  }
}
@keyframes sidedialog-fade-in {
  0% {
    transform: translate3d(50px, 0, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes sidedialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(50px, 0, 0);
    opacity: 0;
  }
}
</style>
