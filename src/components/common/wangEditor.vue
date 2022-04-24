<style lang="less" scoped>
  .wangEditor-wrapper{
    position: relative;
    /deep/ .w-e-text ul {
      li{
        list-style: initial;
      }
    }
    /deep/ .w-e-text ol {
      li{
        list-style: decimal;
      }
    }
    .wangEditor-count{
      position: absolute;
      right: 10px;
      bottom: 0;
      z-index: 2;
    }
  }
</style>

<template>
  <div v-bind="$attrs" class="wangEditor-wrapper">
    {{initValue}}
    <div id="wangEditor"></div>
    <!-- <span class="wangEditor-count">{{count + '/1000'}}</span> -->
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'editoritem',
  data () {
    return {
      count: 0,
      editor: null
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 200
    },
    placeholder: String
  },
  watch: {
    isClear (val) {
      // 触发清除文本域内容
      val && this.editor.txt.clear()
    }
  },
  computed: {
    initValue () {
      if (this.editor && this.value) {
        const val = this.value
        const html = this.editor.txt.html()
        if (val && val !== html) {
          this.editor.txt.html(val)
        }
      }
      return ''
    }
  },
  mounted () {
    this.$nextTick(function () {
      this._ossService && this._ossService.ossReady()
    })
    this.setEditor()
  },
  beforeDestroy () {
    this.editor = null
  },
  methods: {
    setEditor () {
      this.editor = new E('#wangEditor')
      if (_fn.isObject(this.editor)) {
        this.editor.config.height = this.height
        this.editor.config.zIndex = 1
        this.editor.config.placeholder = this.placeholder || '请输入'
        this.editor.config.focus = false
        // 配置菜单
        this.editor.config.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          // 'link', // 插入链接
          // 'list', // 列表
          'justify', // 对齐方式
          // 'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          // 'table', // 表格
          // 'video', // 插入视频
          // 'code', // 插入代码
          'undo', // 撤销
          'redo', // 重复
          'fullscreen' // 全屏
        ]
        this.editor.config.showLinkImg = false
        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        this.editor.config.uploadImgShowBase64 = false // 使用 base64 保存图片
        // this.editor.config.uploadImgServer = '/upload'  // 上传图片到服务器
        this.editor.config.customUploadImg = function (file, insert) {
          window._ossService.upload(file[0]).then(res => {
            insert(res.url)
          })
        }
        this.editor.config.onchange = this.editorChangeHandle
        // 创建富文本编辑器
        this.editor.create()
      }
    },
    editorChangeHandle (html) {
      this.$emit('update:value', html)
    }
  }
}
</script>
