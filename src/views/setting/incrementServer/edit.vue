<template>
  <!-- 增值服务 -->
  <div class="element__body_info incrementServerEdit">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm"
      style="margin:0 0 52px 0;padding-top:40px" :disabled="type === 'see'">
      <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" :key="index" />
      <zp-dynamicFormItem :formItem="form.temp.setting" name="setting" :obj="form" :key="index">
        <template slot="custom_setting">
          <div class="box" v-if="idx === '1'">
            <div class="row">
              <div class="title">身份风险</div>
              <el-checkbox class="text1" disabled v-model="settingContext1">身份证照比对</el-checkbox>
              <el-checkbox class="text2" disabled>户籍信息核实</el-checkbox>
            </div>
            <div class="row">
              <div class="title">职位风险</div>
              <el-checkbox class="text1" disabled v-model="settingContext1">服务风险评估</el-checkbox>
              <el-checkbox class="text2" disabled>职位风险评估</el-checkbox>
            </div>
            <div class="row">
              <div class="title">涉诉及处罚风险</div>
              <el-checkbox class="text1" disabled>个人涉诉记录核实</el-checkbox>
              <el-checkbox class="text2" disabled v-model="settingContext1">欺诈关注记录核实</el-checkbox>
            </div>
            <div class="row">
              <div class="title">金融信用风险</div>
              <el-checkbox class="text1" disabled>小贷历史负债</el-checkbox>
              <el-checkbox class="text2" disabled>网贷金融风险核实</el-checkbox>
            </div>
          </div>
          <div class="box" v-if="idx === '2'">
            <div class="row">
              <div class="title">身份风险</div>
              <el-checkbox class="text1" disabled v-model="settingContext2">身份证照比对</el-checkbox>
              <el-checkbox class="text2" disabled v-model="settingContext2">户籍信息核实</el-checkbox>
            </div>
            <div class="row">
              <div class="title">职位风险</div>
              <el-checkbox class="text1" disabled>服务风险评估</el-checkbox>
              <el-checkbox class="text2" disabled>职位风险评估</el-checkbox>
            </div>
            <div class="row">
              <div class="title">涉诉及处罚风险</div>
              <el-checkbox class="text1" disabled v-model="settingContext2">个人涉诉记录核实</el-checkbox>
              <el-checkbox class="text2" disabled v-model="settingContext2">欺诈关注记录核实</el-checkbox>
            </div>
            <div class="row">
              <div class="title">金融信用风险</div>
              <el-checkbox class="text1" disabled v-model="settingContext2">小贷历史负债</el-checkbox>
              <el-checkbox class="text2" disabled v-model="settingContext2">网贷金融风险核实</el-checkbox>
            </div>
          </div>
        </template>
      </zp-dynamicFormItem>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.status" name="status" :obj="form" :key="index">
        <template slot="custom_status">
          <el-switch disabled v-model="form.ruleForm.status" active-text="开" inactive-color="#ff4949" inactive-text="关" active-value="1"
            inactive-value="0" />
        </template>
      </zp-dynamicFormItem>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.description" name="description" :obj="form" :key="index" /><br />
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" type="primary" v-if="type === 'edit'">保 存</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'incrementServerEdit',
  data () {
    return {
      type: '',
      tagName: 'start',
      title: '',
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      settingContext1: true,
      settingContext2: true,
      form: {
        name: 'form.ruleForm',
        labelWidth: '140px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          name: { label: '方案名称', isShow: true, formType: 'input', maxlength: 40, style: { width: '1010px' } },
          setting: { label: '方案配置', isShow: true, formType: 'custom', key: 'setting' },
          status: { label: '启用状态', isShow: true, formType: 'custom', key: 'status' },
          description: {
            label: '方案说明',
            isShow: true,
            type: 'textarea',
            maxlength: 200,
            limit: true,
            rows: 3,
            style: { width: '1010px' }
          }
        },
        ruleForm: {
          name: '', // 职位名称
          itemConfig: { identityVerify: [], positionVerify: [], lawsuitVerify: [], loadVerify: [] },
          setting: [],
          status: '1',
          description: ''
        },
        rules: {
          name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
          status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
          // setting: [{ required: true, message: '请选择流程阶段', trigger: 'change', type: 'array' }]
        }
      }
    }
  },
  mounted () {
    this.idx = this.routeParams.id
    let type = this.routeParams.type
    this.type = type
    let metaName = ''
    if (type === 'see') {
      metaName = '查看背调方案'
    } else if (type === 'edit') {
      metaName = '编辑背调方案'
    }
    this.title = this.$route.meta.name = metaName
    this.$nextTick(() => {
      this.getById()
    })
  },
  methods: {
    getById () {
      this._api.value_added_item_details({ id: this.idx }).then((res) => {
        let data = res.data
        this.form.ruleForm = {
          name: data.name,
          itemConfig: data.itemConfig,
          status: data.enabled ? '1' : '0',
          description: data.description
        }
      })
    },
    toPage () {
      _fn.toLocation({ name: 'incrementServer' }) // -> /user/123
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form.ruleForm))
          param.enabled = param.status === '1'
          if (this.type === 'edit') {
            param.id = this.idx
          }
          this._api.value_added_item_update(param).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            this.toPage()
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.incrementServerEdit{
  .box{
    border:1px solid #26334F1a;
    height:180px;
    width:1010px;
    .row{
      line-height: 45px;
      .title{
        display: inline-block;
        width:178px;
        background:  #F7F8FA;
        padding-left: 20px;
      }
      .text1{
        display: inline-block;
        width:150px;
        color: #999;
        padding-left: 20px;
      }
      .text2{
        display: inline-block;
        color: #999;
        padding-left: 20px;
      }
    }
  }
}

</style>
