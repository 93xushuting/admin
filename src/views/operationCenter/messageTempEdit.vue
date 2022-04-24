<template>
  <!--内容广场 编辑 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <el-form :model="searchModel.ruleForm" :rules="searchModel.rules" ref="ruleForm" label-width="120px" class="infoForm messageTempEdit">
      <zp-dynamicFormItem :formItem="searchModel.temp.name" name="name" :obj="searchModel" />
      <zp-dynamicFormItem :formItem="searchModel.temp.noticeType" name="noticeType" :obj="searchModel" />
      <zp-dynamicFormItem :formItem="searchModel.temp.smsSupplierTemplateNo" name="smsSupplierTemplateNo" :obj="searchModel" />
      <zp-dynamicFormItem :formItem="searchModel.temp.content" name="content" :obj="searchModel" />
      <el-form-item label=" ">
        <el-tooltip class="item" effect="dark" placement="right"
          content="模板内容必须为半角字符,全角字符将会影响审核和短信下发,其中的数字必须从1开始顺序排列。默认以70个字符（字符包含：汉字、字母、符号、空格）为一条（以下发内容长度为准），超过长度会涉及到分割多条计费。">
          <i class="el-icon-info" style="color: #8798AD;" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-for="(domain, index) in searchModel.ruleForm.smsParamJson" :label="`变量 {${index + 1}}`" :key="domain.key"
        :prop="'smsParamJson.' + index + '.value'" :rules="{required: false, message :`变量${index + 1}不能为空`, trigger: 'blur'}">
        <el-input v-model="domain.value" style="width:440px;" :maxlength="20" show-word-limit />
        <el-button type="text" @click.prevent="addDomain(domain)" class="el-icon-circle-plus-outline" title="新增"></el-button>
        <el-button type="text" @click.prevent="removeDomain(domain)" class="el-icon-remove-outline" v-if="index > 0" title="删除"></el-button>
      </el-form-item>

      <zp-dynamicFormItem :formItem="searchModel.temp.remark" name="remark" :obj="searchModel" />
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" class="zp-btn-primary">确定</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
export default {
  name: 'messageTempEdit',
  data () {
    return {
      formModel: {
        fileList: [],
        size: true
      },
      activeSteps: 1,
      obj: {
        breadcrumb: {}
      },
      dialogTip: {},
      searchModel: {
        isShowLabel: true, // 是否显示label
        inline: true,
        labelWidth: '82px', // label宽度
        temp: {
          name: { formType: 'input', label: '模板名称', isShow: true, filterable: true, maxlength: 20, limit: true },
          noticeType: { formType: 'select', label: '模板类型', isShow: true, data: _var.noticeType },
          smsSupplierTemplateNo: { label: '模板ID', isShow: true, filterable: true },
          content: { label: '短信内容', isShow: true, key: 'status', maxlength: 500, limit: true, type: 'textarea' },
          smsParamJson: { formType: 'select', label: '变量', isShow: true, data: _var.pictureSort, maxlength: 20, limit: true },
          remark: { label: '备注', isShow: true, maxlength: 200, limit: true, type: 'textarea' }
        },
        ruleForm: {
          name: '', // 模板名称
          noticeType: '', // 模板类型
          smsSupplierTemplateNo: '', // 模板ID
          content: '', // 短信内容
          smsParamJson: [{ value: '' }], // 变量
          remark: '' // 备注
        },
        rules: {
          name: [{ message: '请输模板名称', required: true, trigger: 'blur' }],
          noticeType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
          smsSupplierTemplateNo: [{ message: '请输入模板ID', required: true, trigger: 'blur' }],
          content: [{ message: '请输入短信内容', required: true, trigger: 'blur' }],
          smsParamJson: [{ message: '请输入变量', required: true, trigger: 'blur' }]
        }
      }
    }
  },
  created () { },
  mounted () {
    this.idx = this.$route.params.id
    this.$route.meta.name = this.idx === 0 ? '新增短信任务' : '编辑短信任务'
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      // let brandNameList = await _fn.commonMyCustomers('', '', 'brandName') // 品牌名称、公司名称
      // this.form.temp.businessStatusId.data = businessStatusIdList
      if (this.idx > 0) {
        this.getById()
      }
    },
    getById () {
      this._api.smsAssistant_initSmsTemplate({ id: this.idx }).then((res) => {
        let d = res.data || {}
        if (!d.smsParamJson) {
          d.smsParamJson = [{ value: '' }]
        } else {
          d.smsParamJson = JSON.parse(d.smsParamJson)
          let p = []
          for (var i in d.smsParamJson) {
            p.push({ value: d.smsParamJson[i] })
          }
          d.smsParamJson = p
        }
        console.info(d)
        this.searchModel.ruleForm = d
        if (d.noticeType) {
          this.searchModel.ruleForm.noticeType = Number(d.noticeType)
        }
      })
    },
    save () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.info(11111111)
          let param = _fn.copy(this.searchModel.ruleForm)
          let o = {}
          param.smsParamJson.map((item, index) => {
            o['{' + (index + 1) + '}'] = item.value
          })
          param.smsParamJson = JSON.stringify(o)
          console.info(param)
          if (param.id) {
            this._api.smsAssistant_updateSmsTemplate(param).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              this.toPage()
            })
          } else {
            this._api.smsAssistant_addSmsTemplate(param).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              this.toPage()
            })
          }
        }
      })
    },
    toPage () {
      _fn.toLocation({ name: 'messageTemp' }) // -> /user/123
    },
    removeDomain (item) {
      var index = this.searchModel.ruleForm.smsParamJson.indexOf(item)
      if (index !== -1) {
        this.searchModel.ruleForm.smsParamJson.splice(index, 1)
      }
    },
    addDomain () {
      this.searchModel.ruleForm.smsParamJson.push({ value: '', key: Date.now() })
    }
  }
}
</script>
<style lang="less" scoped>
.el-icon-circle-plus-outline,.el-icon-remove-outline{
  font-size:20px
}
.messageTempEdit{
  overflow-y:auto;
      margin-bottom: 100px;
  /deep/ .el-form-item__content{
    line-height: 0;
  }
  /deep/ .el-textarea .el-input__count {
    background: none;
    bottom: 10px;
    right: 3px;
}
}
    
</style>
