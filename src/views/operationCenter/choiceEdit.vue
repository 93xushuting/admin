<template>
  <!-- 职位管理 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm"
      style="margin:0 0 52px 0">
      <div class="forms_title"><span class="line"></span>内容标题和内容</div>
      <zp-dynamicFormItem :formItem="form.temp.contentTitle" name="contentTitle" :obj="form" />

      <zp-dynamicFormItem :formItem="form.temp.redirection" name="redirection" :obj="form" />
      <zp-dynamicFormItem :formItem="form.temp.channelId" name="channelId" :obj="form" v-if="form.ruleForm.redirection === 2" />
      <zp-dynamicFormItem :formItem="form.temp.feedId" name="feedId" :obj="form" v-if="form.ruleForm.redirection === 2" />
      <zp-dynamicFormItem :formItem="form.temp.link" name="link" :obj="form" v-if="form.ruleForm.redirection === 1" />
      <zp-dynamicFormItem :formItem="form.temp.contentDetails" name="contentDetails" :obj="form" v-if="form.ruleForm.redirection === 0">
        <template slot="custom_contentDetails">
          <zpWangEditor placeholder="请编辑文章" :value.sync="form.ruleForm.contentDetails" :isClear="true" :style="form.temp.contentDetails.style" />
        </template>
      </zp-dynamicFormItem>
      <div class="forms_title"><span class="line"></span>内容封面和概要</div>
      <zp-dynamicFormItem :formItem="form.temp.contentCoverUrl" name="contentCoverUrl" :obj="form">
        <template slot="custom_contentCoverUrl">
          <!-- el-input只用作验证 -->
          <el-input :value="form.ruleForm.contentCoverUrl" style="display: none" />
          <zp-upload :limitSize="{ width: 172, height: 108 }" uploadType="image" :formModel.sync="formModel" :limit="1" ref="picsList" />
        </template>
      </zp-dynamicFormItem><br />
      <zp-dynamicFormItem :formItem="form.temp.contentSummary" name="contentSummary" :obj="form" />
      <div class="forms_title"><span class="line"></span>设置内容所在栏目和属性</div>
      <zp-dynamicFormItem :formItem="form.temp.columnId" name="columnId" :obj="form" />
      <zp-dynamicFormItem :formItem="form.temp.tagId" name="tagId" :obj="form" />
    </el-form>
    <div class="editFooter">
      <zp-button :disabled="submitBtnDisabled" @click="save" class="zp-btn-primary">发 布
      </zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'choiceEdit',
  data () {
    return {
      title: '',
      idx: 0,
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      formModel: {
        fileList: [],
        size: true
      },
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: false, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          contentTitle: { label: '内容标题', isShow: true, formType: 'input', placeholder: '请输入内容标题，最多不超过40字', maxlength: 40 },
          redirection: { label: '内容详情', isShow: true, formType: 'radio', placeholder: '请选择内容详情', data: [{ label: '文本', value: 0 }, { label: 'h5链接', value: 1 }, { label: '视频号/视频号视频', value: 2 }] },
          link: { label: '链接地址', isShow: true, formType: 'input', placeholder: '请输入链接地址' },
          channelId: { label: '视频号ID', isShow: true, formType: 'input', placeholder: '请输入' },
          feedId: { label: '视频feedId', isShow: true, formType: 'input', placeholder: '请输入' },
          contentDetails: {
            label: '编辑文本',
            isShow: true,
            formType: 'custom',
            limit: true,
            key: 'contentDetails',
            style: { 'margin-left': '0px', width: '1010px' }
          },
          contentCoverUrl: { formType: 'custom', label: '内容封面', isShow: true, key: 'contentCoverUrl' },
          contentSummary: { label: '内容概要', isShow: true, formType: 'input', placeholder: '请输入内容概要，限制不超过50个字', maxlength: 50 },
          columnId: { label: '选择栏目', isShow: true, filterable: true, formType: 'select', placeholder: '请选择栏目', data: [] },
          tagId: { label: '设置内容属性', isShow: true, filterable: true, formType: 'select', placeholder: '请选择内容属性', data: [] }
        },
        ruleForm: {
          contentTitle: '', // 内容标题
          redirection: 1, // 内容详情
          link: '', // 链接地址
          channelId: '', // 视频号ID
          feedId: '', // 视频FeedID
          contentDetails: '', // 编辑文本
          contentCoverUrl: '', // 内容封面
          contentSummary: '', // 内容概要
          columnId: '', // 选择栏目
          tagId: '', // 设置内容属性
          contentStatus: 0,
          stickyTop: 0
        },
        rules: {
          contentTitle: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
          redirection: [{ required: true, message: '请选择内容详情', trigger: 'blur' }],
          link: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
          channelId: [{ required: true, message: '请输入视频号ID', trigger: 'blur' }],
          contentDetails: [{ required: true, message: '请输入编辑文本', trigger: 'blur' }],
          contentCoverUrl: [{ message: '请选择内容封面', required: true, trigger: 'change' }],
          columnId: [{ required: true, message: '请选择栏目', trigger: 'change' }],
          tagId: [{ required: true, message: '请选择内容属性', trigger: 'change' }]
        }
      }
    }
  },
  watch: {
    'formModel.fileList' (list) {
      this.form.ruleForm.contentCoverUrl = list.length ? list.map(item => item.url)[0] : ''
    }
  },
  mounted () {
    this.idx = this.routeParams.id
    this.$route.meta.name = this.idx !== '0' ? '编辑内容' : '新增内容'
    this.title = this.$route.meta.name

    const requestHandle = async () => {
      await this.getColumnList() // 栏目列表
      await this.getTagList() // 内容属性
      if (this.idx !== '0') { // 修改
        await this.getInfo()
      }
    }
    requestHandle()
  },
  methods: {
    getColumnList () {
      let pageReq = { page: 1, size: 20 }
      let queryParam = { columnId: '', enabled: '' }
      _fn.getColumnList((data) => {
        this.form.temp.columnId.data = data.map(item => {
          return {
            ...item,
            disabled: item.obj.enabled !== 1
          }
        })
      }, { pageReq, queryParam }, true)
    },
    getTagList () {
      let param = {
        type: 5
      }
      this._api.tag_public_combo_list(param).then((res) => {
        // let list = []
        // let data = res.data
        // if (data && data.length) {
        //   for (var i = 0; i < data.length; i++) {
        //     let o = data[i]
        //     if (o.enabled) {
        //       list.push({ label: o.name, value: o.id })
        //     }
        //   }
        // }
        this.form.temp.tagId.data = res.data.map(item => {
          return {
            label: item.name,
            value: item.id,
            disabled: !item.enabled
          }
        })
      })
    },
    getInfo () {
      // const { id } = this
      this._api.content_details({ id: this.idx }).then(res => {
        const { data } = res
        if (data) {
          this.form.ruleForm = Object.assign({}, {
            redirection: data.redirection || 0, // 内容详情
            link: data.link, // 链接地址
            contentTitle: data.contentTitle,
            channelId: data.channelId,
            feedId: data.feedId,
            contentDetails: data.contentDetails,
            contentCoverUrl: data.contentCoverUrl,
            contentSummary: data.contentSummary,
            columnId: data.columnId.id + '',
            tagId: data.tagId.id + '',
            contentStatus: data.contentStatus,
            stickyTop: data.stickyTop
          })
          this.formModel.fileList = [{ url: data.contentCoverUrl }]
        }
      })
    },
    toPage () {
      this.$router.go(-1)
      // _fn.toLocation({ path: '/choice' }) // -> /user/123
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form.ruleForm))
          param.id = this.idx
          this._api[this.idx !== '0' ? 'content_update' : 'content_add'](param).then(res => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            this.toPage()
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
</style>
