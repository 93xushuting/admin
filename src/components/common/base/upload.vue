<template>
  <div class="uploadWord">
    <template v-if="uploadType === 'avatar'">
      <el-upload action="" :show-file-list="false" :http-request="avatarSubmit" :before-upload="beforeUpload" v-on="$listeners" v-bind="$attrs">
        <slot name="avatar"></slot>
      </el-upload>
    </template>
    <template v-if="uploadType === 'xlsx' || uploadType === 'zip' || uploadType === 'word'">
      <el-upload :class="{
          limitClass: formModel.fileList.length >= limit
        }" :disabled="formModel.fileList.length >= limit" v-on="$listeners" v-bind="$attrs" ref="upload" drag multiple action="" :limit="limit"
        :file-list="formModel.fileList" :auto-upload="autoUpload" :on-change="changeFile" :http-request="fileSubmit" :before-upload="beforeUpload"
        @on-exceed="exceed">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <em>点击上传{{uploadType}}表格，或将文件拖拽到此处</em>
        </div>
      </el-upload>
      <el-progress :percentage="progress" v-show="flagProgress" style="margin-top:10px;" />
    </template>
    <template v-if="uploadType === 'image'">
      <slot name="img"></slot>
      <el-upload ref="imageUpload" v-on="$listeners" v-bind="$attrs" :show-file-list="formModel.fileList.length > 0" :disabled="disabled" multiple
        :class="['companyPics-upload', formModel.fileList && formModel.fileList.length >= limit ? 'limitClass': '']" :limit="limit" action=""
        :file-list="formModel.fileList" :on-change="changeFile" list-type="picture-card" :http-request="imageSubmit" :before-upload="beforeUpload"
        :on-exceed="exceed" :on-progress="uploadVideoProcess">
        <div slot="default" class="upload-default">
          <div class="upload-default_content">
            <!-- <i class="el-icon-plus"></i> -->
            <img src="../../../../static/image/upload.png" alt="">
            <p v-if="!flagProgress" class="text">
              <span>上传图片</span><br /><br />
              <span v-if="formModel.size" style="padding-top: 10px;">图片大小：{{limitSize.width}}*{{limitSize.height}}</span>
            </p>
            <div v-else class="upload-progress">
              <span>上传中</span>
              <el-progress :percentage="progress" :format="progressFormat"></el-progress>
            </div>
          </div>
        </div>
        <div slot="file" slot-scope="{file}" class="upload-list-item" @click="handlePictureCardPreview(file)">
          <div class="img-main">
            <img :src="file.url" alt="">
          </div>
          <span class="del-btn" @click.stop="removeImage(file)">
            <i class="iconfont iconwenbenshanchu"></i>
          </span>
        </div>
        <slot name="files"></slot>
        <p v-show="isShowTip" style="color:red;" class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg文件，且不超过250k(最多 {{limit}} 张)</p>
      </el-upload>
    </template>
    <template v-if="uploadType === 'card'">
      <el-upload
        v-on="$listeners"
        v-bind="$attrs"
        :http-request="imageSubmitSingle"
        :show-file-list="false"
        :before-upload="beforeUpload">
        <slot name="card"></slot>
      </el-upload>
    </template>
    <zp-dialog :obj="dialog" :sideDialog='false'>
      <div slot="body" align="center">
        <img width="100%" :src="dialog.imageUrl" alt="">
      </div>
    </zp-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 限制图片尺寸
    limitSize: {
      type: Object,
      default: null
    },
    limit: {
      type: Number,
      default: 2
    },
    disabled: Boolean,
    autoUpload: {
      type: Boolean,
      default: false
    },
    uploadType: { // 上传文件类型
      type: String,
      default: 'xlsx'
    },
    // eslint-disable-next-line vue/require-prop-type-constructor
    callback: '', // 自定义回调
    formModel: {
      type: Object,
      default () {
        return {
          fileList: []
        }
      }
    },
    isShowTip: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'formModel.fileList': {
      handler: function (val, oldVal) {
        // console.info('this.limit ---- ', this.limit)
        if ((this.uploadType === 'image' || this.uploadType === 'avatar') && this.tag) {
          // this.formModel.fileList = val
        } else {
          this.$nextTick(function () {
            this.refresh()
          })
        }
      },
      deep: true,
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  data () {
    return {
      loading: null,
      dialog: {
        imageUrl: '',
        title: '图片预览',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: false // 是否显示确定按钮
      },
      filesMap: {},
      flagProgress: false,
      tag: true,
      progress: 0,
      submitFlag: true
    }
  },
  mounted () {
    this.$nextTick(function () {
      this._ossService && this._ossService.ossReady()
    })
  },
  methods: {
    progressFormat () {
      return ''
    },
    startLoading () { // 使用Element loading-start 方法
      this.loading = Vue.prototype.$loading({
        text: '加载中……',
        background: '#00000066'
      })
    },
    endLoading () { // 使用Element loading-close 方法
      this.loading.close()
    },
    // 所有文件提交
    submit (file, callback, progressCallback = function () { }) {
      this._ossService && this._ossService.upload(file, progressCallback).then(data => { callback && callback(data) })
    },
    // 图像上传
    avatarSubmit (res) {
      this.submit(res.file, (data) => { this.callback && this.callback(data.url) })
    },
    // 图片上传
    imageSubmit (res) {
      console.log('开始上传', res)
      // this.startLoading()
      this.submit(res.file, (data) => {
        let uploadFiles = this.$refs.imageUpload.uploadFiles.slice()
        this.filesMap[res.file.uid] = data.url
        uploadFiles.forEach(item => {
          if (item.uid === res.file.uid) {
            item.url = data.url
          }
        })
        this.$emit('update:formModel', {
          fileList: uploadFiles
        })
        this.flagProgress = false
        this.progress = 0
        // this.endLoading()
      }, (p) => {
        this.flagProgress = true
        this.progress = p.progress
        // this.loading.setText(p.progress + ' %')
        // console.info('图片上传进度：' + this.uploadType, p.progress)
      })
    },
    // 单个图片上传
    imageSubmitSingle (res) {
      this.submit(res.file, (data) => {
        console.log(data)
        this.$emit('update:formModel', data.url)
      })
    },
    // 文件上传
    fileSubmit (res) {
      if (!(this.autoUpload && this.submitFlag)) {
        console.info('3333333文件上传fileSubmit')
        // this.startLoading()
        this.submit(res.file, (data) => {
          this.flagProgress = false
          this.progress = 0
          let uploadFiles = this.$refs.upload.uploadFiles.slice()
          uploadFiles.forEach(item => {
            if (item.uid === res.file.uid) {
              item.url = data.url
            }
          })
          this.$emit('update:formModel', {
            fileList: uploadFiles
          })
          // this.endLoading()
        }, (p) => {
          this.flagProgress = true
          this.progress = p.progress
          // this.loading.setText(p.progress + ' %')
          console.info('文件上传进度：' + this.uploadType, p.progress)
        })
      } else { // autoUpload: true的情况
        let uploadFiles = this.$refs.upload.uploadFiles.slice()
        // uploadFiles.forEach(item => {
        //   if (item.uid === res.file.uid) {
        //     item.url = data.url
        //   }
        // })
        this.$emit('update:formModel', {
          fileList: uploadFiles
        })
      }
    },
    beforeUpload (file) { // 上传限制
      console.info('beforeUpload', file)
      const limitSize = new Promise((resolve, reject) => {
        if (!this.limitSize) {
          resolve()
          return
        }
        const { width, height } = this.limitSize
        const fileReader = new FileReader()
        fileReader.onload = function (e) {
          const data = e.target.result
          const image = new Image()
          image.onload = function () {
            const _width = image.width
            const _height = image.height
            const flag = _width === width && _height === height
            flag ? resolve() : reject(new Error('fail'))
          }
          image.src = data
        }
        fileReader.readAsDataURL(file)
      }).then(() => {
        return true
      }, () => {
        const { width, height } = this.limitSize
        this.$notify({ title: '提示', message: `请上传尺寸${width + '*' + height}的图片`, type: 'warning' })
        return Promise.reject(new Error('fail'))
      })
      let isTypes = ''
      let isSizes = ''
      let names = file.name.split('.')
      let _name = names[names.length - 1]
      if (file.size / 1024 / 1024 <= 0) {
        this.$notify.closeAll()
        this.$notify({ title: '提示', message: `文件不能小于0kb`, type: 'warning' })
        return false
      }
      if (this.uploadType === 'xlsx') {
        isTypes = _name === 'xlsx'
        isSizes = file.size / 1024 / 1024 < 2
        if (!isTypes) {
          this.$notify({ title: '提示', message: `允许上传的文件类型：'xlsx'`, type: 'warning' })
        }
        if (!isSizes) {
          this.$notify({ title: '提示', message: `上传的文件大小不能超过2MB!`, type: 'warning' })
        }
      } else if (this.uploadType === 'avatar') {
        isTypes = _name === 'jpeg' || _name === 'jpg' || _name === 'png'
        isSizes = file.size / 1024 / 1024 < 5
        if (!isTypes) {
          this.$message.error('上传头像图片只能是 jpg、jpeg、png 格式!')
        }
        if (!isSizes) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
      } else if (this.uploadType === 'image') {
        isTypes = _name === 'jpeg' || _name === 'jpg' || _name === 'png'
        isSizes = file.size / 1024 / 1024 < 2
        if (!isTypes) {
          this.$notify({ title: '提示', message: `上传图片只能是 jpg、jpeg、png格式!`, type: 'warning' })
        }
        if (!isSizes) {
          this.$notify({ title: '提示', message: `上传图片大小不能超过 2MB!`, type: 'warning' })
        }
      } else if (this.uploadType === 'word') {
        isTypes = _name === 'doc' || _name === 'docx' || _name === 'DOCX'
        isSizes = file.size / 1024 / 1024 < 200
        if (!isTypes) {
          this.$notify({ title: '提示', message: `允许上传的文件类型：'doc、docx'`, type: 'warning' })
        }
        if (!isSizes) {
          this.$notify({ title: '提示', message: `上传大小不能超过 200MB!`, type: 'warning' })
        }
      } else if (this.uploadType === 'zip') {
        isTypes = _name === 'zip'
        isSizes = file.size / 1024 / 1024 < 200
        if (!isTypes) {
          this.$notify({ title: '提示', message: `允许上传的文件类型：'zip'`, type: 'warning' })
        }
        if (!isSizes) {
          this.$notify({ title: '提示', message: `上传大小不能超过 200MB!`, type: 'warning' })
        }
      }
      return isTypes && isSizes && limitSize
    },
    changeFile (file, fileList) {
      console.info('changeFile', fileList)
      // this.submitFlag = this.bulidFile(fileList)
      this.$nextTick(() => {
        if (fileList && fileList.length) {
          this.refresh()
        }
      })
    },
    bulidFile (fileList) {
      if (this.uploadType === 'word' || this.uploadType === 'zip' || this.uploadType === 'xlsx' || this.uploadType === 'image') {
        if (this.limit <= 2) {
          if (fileList.length > 1) {
            fileList.splice(0, 1)
          }
          if (!this.beforeUpload(fileList[0])) {
            this.$refs.upload.clearFiles()
            return false
          }
        } else {
          if (!this.beforeUpload(fileList[fileList.length - 1])) {
            fileList.splice(fileList.length - 1, 1)
            return false
          }
        }
      }
      return true
    },
    rule (fn) {
      if (this.formModel.fileList && this.formModel.fileList.length) {
        fn && fn(this.formModel)
      } else {
        this.$notify({ title: '提示', message: `上传文件不能为空`, type: 'warning' })
      }
    },
    clear () {
      this.$refs.upload.clearFiles()
    },
    refresh () {
      // 替换 after del icon
      if (this.uploadType === 'xlsx' || this.uploadType === 'zip' || this.uploadType === 'word') {
        let iconfont = 'iconfont'
        let iconshanchu = 'iconshanchu'
        let after = this.$el.querySelectorAll('.el-icon-close')
        let label = this.$el.querySelectorAll('.el-upload-list__item-status-label')
        for (let i = 0; i < label.length; i++) {
          label[i].remove(label[i])
        }
        for (let i = 0; i < after.length; i++) {
          after[i].classList.remove('el-icon-close')
          after[i].classList.add(iconfont, iconshanchu)
        }
        // 替换 before excel icon
        let iconxls = this.uploadType === 'zip' ? 'iconzip' : this.uploadType === 'word' ? 'iconword' : 'iconxls' // xlsx
        let views = this.$el.querySelectorAll('.el-icon-document')
        for (let i = 0; i < views.length; i++) {
          views[i].classList.remove('el-icon-document')
          views[i].classList.add(iconfont, iconxls)
        }
      }
    },
    exceed (files, fileList) {
      this.$notify({ title: '提示', message: `最多可添加${this.limit}张`, type: 'warning', offset: 60 })
    },
    // 预览
    handlePictureCardPreview (file) {
      console.info('预览图片', file)
      this.dialog.imageUrl = file.url
      this.dialog.show = true
    },
    // 删除
    removeImage (file) {
      delete this.filesMap[file.uid]
      const list = this.formModel.fileList.slice()
      this.$emit('update:formModel', {
        fileList: list.filter(item => item.uid !== file.uid)
      })
    },
    getUrl (arr) {
      let ret = []
      let list = arr || this.formModel.fileList
      for (let i = 0; i < list.length; i++) {
        let o = list[i]
        if (o.status === 'success') {
          ret.push(o.url)
        } else {
          let obj = this.filesMap[o.uid]
          if (obj) {
            ret.push(obj)
          }
        }
      }
      return ret.join(',')
    }
  }
}
</script>

<style scoped lang="less">
.progress{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}
.el-upload__tip {
  margin-top: 18px;
}
.limitClass{
  /deep/ .el-upload--picture-card{
     display: none;
  }
}
.el-upload--picture-card{
  display: inline-block;
}
.el-icon-arrow-down:before {
  content: "";
}
.el-icon-arrow-down:after {
  content: '\e790';
  height: 100%;
  width: 0;
  color: #858585;
  display: inline-block;
}
/deep/ .el-upload-dragger {
width: 134px;
height: 104px;
.el-icon-upload {
  margin: 35px 0 16px;
  font-size: 30px;
  line-height: 0;
}
.el-upload__text em {
  color: #BBBBBB;
}
}
/deep/  .el-upload-list__item {
    &:hover {
      background: #fff;
    }
  .el-upload-list__item-name {
    border: 1px solid #E9E9E9;
    border-radius: 0;
    width: 255px;
    display: inline-block;
  }
  .el-upload-list__item-name [class^=el-icon] {
    width: 30px;
    border-right: 1px solid #E9E9E9;
  }
  .el-icon-document {
    display: none;
  }
  .iconword {
    width: 34px;
    height: 100%;
    margin-right: 7px;
    color: #3063AF;
    text-align: center;
    border-right: 1px solid #E9E9E9;
    display: inline-block;
    line-height: inherit;
  }
  .iconzip {
    width: 34px;
    height: 100%;
    margin-right: 7px;
    color: #3063AF;
    text-align: center;
    border-right: 1px solid #E9E9E9;
    display: inline-block;
    line-height: inherit;
  }
  .iconxls {
      width: 34px;
      height: 100%;
      margin-right: 7px;
      color: #207245;
      text-align: center;
      border-right: 1px solid #E9E9E9;
      display: inline-block;
      line-height: inherit;
    }
  .iconshanchu {
    position: absolute;
    right: 10px;
    color: #D50A19;
    cursor: pointer;
  }
}

</style>
