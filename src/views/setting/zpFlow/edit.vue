<template>
  <!-- 招聘流程 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm"
      style="margin:0 0 52px 0;padding-top:40px">
      <template v-if="routeParams.type === 'see'">
        <el-form-item :label="form.temp.name.label"> {{routeParams.name}}</el-form-item><br />
      </template>
      <template v-else>
        <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" :key="index" /><br />
      </template>
      <zp-dynamicFormItem :formItem="form.temp.stages" name="stages" :obj="form" :key="index">
        <template slot="custom_stages">
          <div class="stageClass">
            <div class="rowClass padding60">初筛</div>
            <template v-for="(item,index) in tabs">
              <template v-if="routeParams && routeParams.type === 'see'">
                <div v-if="item.enabled" :key="index" class="rowClass see">{{item.name}}</div>
              </template>
              <template v-else>
                <div :key="index" class="rowClass dragTable" draggable="true">
                  <i class="iconfont icontuozhuai" />
                  <el-checkbox v-model="item.enabled" @change="checkboxChange">{{item.name}}</el-checkbox>
                </div>
              </template>
            </template>
            <div class="rowClass padding60">入职</div>
          </div>
        </template>
      </zp-dynamicFormItem>
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" type="primary" v-if="routeParams.type !== 'see'">保 存</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'zpFlowEdit',
  data () {
    return {
      title: '',
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      // 初筛firstSieve,面试interview,办证cards,试工trialOperation,背调backTone,offer,入职entry,淘汰out
      tabs: [
        // { type: 1,key: 'firstSieve', name: '初筛', enabled: true, isDarg: true, disabled: true },
        // { type: 2, key: 'interview', name: '面试', enabled: false },
        // { type: 3, key: 'cards', name: '办证', enabled: false },
        // { type: 4, key: 'trialOperation', name: '试工', enabled: false },
        // { type: 5, key: 'backTone', name: '背调', enabled: false },
        // { type: 6, key: 'offer', name: 'offer', enabled: false }
        // { type: 7,key: 'entry', name: '已入职', enabled: true, isDarg: true, disabled: true }
      ],
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          name: { label: '流程名称', isShow: true, formType: 'input', maxlength: 20, style: { width: '1010px' } },
          stages: { label: '流程阶段', isShow: true, formType: 'custom', key: 'stages' }
        },
        ruleForm: {
          name: '', // 职位名称
          stages: []
        },
        rules: {
          name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
          stages: [{ required: true, message: '请选择流程阶段', trigger: 'change', type: 'array' }]
        }
      }
    }
  },
  mounted () {
    this.idx = this.routeParams.id
    let type = this.routeParams.type
    let metaName = ''
    if (type === 'copy') { // copy
      metaName = '新增招聘流程'
    } else if (type === 'see') {
      metaName = this.routeParams.name + ' 招聘流程'
    } else if (type === 'edit') {
      metaName = '编辑招聘流程'
    } else if (type === 'add') {
      metaName = '新增招聘流程'
    }
    this.title = this.$route.meta.name = metaName
    if (type === 'add') {
      this.tabs = [
        { type: 2, key: 'interview', name: '面试', enabled: true },
        { type: 3, key: 'cards', name: '办证', enabled: true },
        { type: 4, key: 'trialOperation', name: '试工', enabled: true },
        { type: 5, key: 'backTone', name: '背调', enabled: true },
        { type: 6, key: 'offer', name: 'offer', enabled: true }
      ]
      this.$nextTick(() => {
        this.form.ruleForm.stages = [1, 2, 3, 4, 5, 6, 7]
        this.sortTable()
      })
    } else {
      this.tabs = [
        { type: 2, name: '面试', enabled: false },
        { type: 3, name: '办证', enabled: false },
        { type: 4, name: '试工', enabled: false },
        { type: 5, name: '背调', enabled: false },
        { type: 6, name: 'offer', enabled: false }
      ]
      this.$nextTick(() => {
        this.sortTable(() => {
          this.getById()
        })
      })
    }
  },
  methods: {
    getById () {
      this._api.process_template_details({ id: this.idx }).then((res) => {
        let obj = res.data
        let array = obj.stages || []
        if (array[0] && array[0].type === 1) {
          array.shift() // 删除最后 一位
        }
        if (array[array.length - 1] && array[array.length - 1].type === 7) {
          array.pop() // 删除第 一位
        }
        let checkeds = array.map(function (item) {
          if (item.enabled) {
            return item.type
          }
        })
        this.tabs = array
        this.form.ruleForm = { name: obj.name, stages: checkeds }
      })
    },
    toPage () {
      _fn.toLocation({ name: 'zpFlow' }) // -> /user/123
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form.ruleForm))
          let parts = param.stages
          let tabs = JSON.parse(JSON.stringify(this.tabs))
          for (let j = 0; j < tabs.length; j++) {
            while (parts.length) {
              let selector = parts.shift()
              if (tabs[j].type === selector) {
                tabs[j].enabled = true
                break
              }
            }
          }
          tabs.unshift({ enabled: true, name: '初筛', type: 1 }) // 初筛
          tabs.push({ enabled: true, name: '已入职', type: 7 }) // 已入职
          console.info(tabs)
          let ret = {
            name: param.name,
            stages: tabs
          }
          let type = this.routeParams.type
          let url = ''
          if (type === 'add' || type === 'copy') {
            url = 'process_template_add'
          } else if (type === 'edit') {
            url = 'process_template_update'
            ret.id = this.idx
          }
          this._api[url](ret).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            this.toPage()
          })
        }
      })
    },
    sortTable (fn) {
      let self = this
      let list = document.querySelectorAll('.stageClass .dragTable')
      console.info('sortTable', list)
      let start = -1
      let end = -1
      for (let i = 0; i < list.length; i++) {
        let dom = list[i]
        dom.__index = i
        dom.ondragstart = function () {
          console.info('ondragstart', dom.__index)
          start = dom.__index
        }
        dom.ondragover = function (ev) {
          ev.preventDefault()
        }
        dom.ondrop = function (ev) {
          console.info('ondrop', dom.__index)
          end = dom.__index
          self.swapArr(self.tabs, start, end)
          self.checkboxChange()
        }
      }
      fn && fn()
    },
    // 两个元素换位子
    swapArr (arr, dom1, dom2) {
      arr[dom1] = arr.splice(dom2, 1, arr[dom1])[0]
      return arr
    },
    checkboxChange (val) {
      let arr = [1, 7]
      this.tabs.map((item) => {
        if (item.enabled) {
          arr.push(item.type)
        }
      })
      this.form.ruleForm.stages = arr
      console.info('checkboxChange', arr)
    }
  }
}
</script>
<style lang="less" scoped>
.stageClass{
  width: 1008px;
  border: 1px solid #eee;
  .rowClass{
    line-height: 38px;
    margin: 5px;
    border: 1px solid #eee;
    i{
      margin: 0 10px;
    }
  }
  .padding60,.see{
    padding-left:60px;
  }
  .rowClass:hover{
    cursor: all-scroll;
  }
  .see:hover{
    cursor: default;
  }
  .rowClass:first-child,.rowClass:last-child{
    background: #eee;
    cursor: default;
  }
}
</style>
