<template>
  <!-- 职位管理 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <div class="contexts">
      <div class="positionInfo_title">
        <div class="right">
          <div class="name">
            {{ form.name
            }}<span :class="form.state == 0 ? 'tags-gray' : 'tags'">{{
              form.state == 0
                ? "已暂停"
                : _var.positionLabel__global(form.label)
            }}</span>
          </div>
          <div class="ids">
            ID:<span>{{ form.id }}</span>
          </div>
          <div class="context">
            <span>企业：{{ form.companyName }}</span>
            <span>负责人：{{ form.headUser && form.headUser.realName }}</span>
            <span
              >创建时间：{{
                _tcolFormat.formatterMinute("", "", form.createTime, "")
              }}</span
            >
          </div>
          <div>
            <zp-button
              class="zp-btn-primary"
              v-if="form.state === 1 && _fn.checkBtn('job/add_applicant')"
              @click="addUser"
              >添加候选人</zp-button
            >
            <zp-button
              class="zp-btn-primary-empty"
              @click="edit"
              v-if="_fn.checkBtn('job/update')"
              >编辑</zp-button
            >
            <el-dropdown
              ref="dropdownRef"
              @click.stop="dropdownBtnClick"
              v-if="_fn.checkBtn('job/stick_top') || _fn.checkBtn('job/add')"
              split-button
              size="medium"
              class="dropdown"
              trigger="click"
              @command="commandClick"
              placement="bottom-start"
              style="margin-left: 10px"
              >更多
              <el-dropdown-menu slot="dropdown" :appendToBody="false">
                <el-dropdown-item
                  :command="1"
                  v-if="_fn.checkBtn('job/stick_top')"
                  :disabled="!!form.stickTop"
                  >{{ form.stickTop ? "已置顶" : "置顶" }}
                </el-dropdown-item>
                <el-dropdown-item :command="2" v-if="_fn.checkBtn('job/copy')"
                  >复制</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <div class="btnLine" />
            <zp-button
              class="zp-btn-primary-empty-red"
              @click="start"
              v-if="form.state === 0 && _fn.checkBtn('job/enable')"
              >启动招聘</zp-button
            >
            <zp-button
              class="zp-btn-primary-empty-red"
              @click="stop"
              v-if="form.state === 1 && _fn.checkBtn('job/disable')"
              >暂停招聘</zp-button
            >
          </div>
        </div>
        <div class="left">
          <div class="user"><i class="iconfont iconrenshu" /></div>
          <div class="number">{{ form.headcount }}</div>
          <div class="text">招聘人数</div>
        </div>
      </div>
      <div class="positionInfo_body">
        <zp-tabsCustom
          slot="tabs"
          v-model="tagName"
          :data="[
            { label: `职位信息`, value: 1 },
            {
              label: `职位设置`,
              value: 2,
              disabled: !_fn.checkBtn('job/update_setting'),
            }, // 不显示
          ]"
        />
        <div class="tabs-item-container" v-if="tagName === 1">
          <el-form
            model="ruleForm"
            label-width="120px"
            :inline="true"
            class="infoForm editFooterMargin"
            style="margin-left: 20px"
          >
            <div class="forms_title" style="margin-top: 40px">
              <span class="line"></span>基本信息
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="职位名称：">{{ form.name }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属企业：">{{
                  form.companyName
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="工作地址："
                  :class="[
                    {
                      'empty-addresses':
                        !form.addresses.length || form.addresses.length === 1,
                    },
                    'form-item-wrapper',
                  ]"
                >
                  <template v-if="!form.addresses.length">--</template>
                  <div class="address-wrapper">
                    <div v-for="(item, index) in form.addresses" :key="index">
                      {{
                        item.name +
                        (index === form.addresses.length - 1 ? "" : "、")
                      }}
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学历要求：">{{
                  _var.educationRequirement__global(form.educationRequirement)
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="经验要求：">{{
                  form | expRequirement
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作性质：">{{
                  _var.workNature__global(form.timeRequired)
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别要求：">{{
                  form | genderRequirement
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄要求：">{{
                  form | ageRequirement
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作时间：">{{
                  form | workTime
                }}</el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.timeRequired === 2">
                <el-form-item label="兼职周期：">
                  {{_var.partTimeJob__global(form.partJobType)}}
                  {{ form.partJobType === 2 && form.partJobTypeBegin? `,${form.partJobTypeBegin} - ${form.partJobTypeEnd}` : '' }}
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.timeRequired === 2">
                <el-form-item label="兼职时段：">
                  <div class="address-wrapper">{{renderPartTime(form.partJobTime)}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="招聘人数：">{{
                  form.headcount
                }}</el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.state === 1">
                <el-form-item label="职位分类：">{{
                  form | positionIdFilter(jobClassList, jobList)
                }}</el-form-item>
              </el-col>
            </el-row>
            <div class="forms_title" v-show="!!form.description">
              <span class="line"></span>工作描述
            </div>
            <div
              class="work-desc"
              v-show="!!form.description"
              v-html="form.description"
            ></div>
            <div class="forms_title" style="margin-top: 15px">
              <span class="line"></span>薪资福利
            </div>
            <el-row>
              <el-col :span="22">
                <el-form-item label="薪资范围：">
                  {{
                    _var.salaryType__global(form.salaryType) +
                    (form.salaryType
                      ? ` ， ${form.minSalaryAmount}元/${_var.salaryTypeText__global(form.salaryType)} - ${form.maxSalaryAmount}元/${_var.salaryTypeText__global(form.salaryType)}` : "")
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="22" v-show="!!form.tags.length">
                <el-form-item label="其他福利：" class="other-benefits">
                  <div
                    class="label"
                    v-for="(item, index) in form.tags"
                    :key="index"
                  >
                    {{ item.name }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="forms_title" v-show="!!form.pics.length">
              <span class="line"></span>工作环境
            </div>
            <div class="pics-wrapper">
              <img
                :src="item.url"
                alt=""
                width="240px"
                height="180px"
                style="border-radius: 4px"
                v-for="item in form.pics"
                :key="item.id"
              />
            </div>
          </el-form>
        </div>
        <!-- 职位设置 -->
        <div class="tabs-item-container" v-if="tagName === 2">
          <el-form
            :ref="posSetObject.name"
            :inline="posSetObject.formInline"
            :model="posSetObject.ruleForm"
            :rules="posSetObject.rules"
            :label-width="posSetObject.labelWidth"
            class="infoForm"
          >
            <div class="forms_title"><span class="line"></span>人员设置</div>
            <zp-dynamicFormItem
              :obj="posSetObject"
              :formItem="posSetObject.temp.headUid"
              name="headUid"
            />
            <zp-dynamicFormItem
              :obj="posSetObject"
              :formItem="posSetObject.temp.cooperateUids"
              name="cooperateUids"
            />
            <div class="forms_title"><span class="line"></span>基本设置</div>
            <zp-dynamicFormItem
              :obj="posSetObject"
              :formItem="posSetObject.temp.processTemplateId"
              name="processTemplateId"
            />
            <zp-dynamicFormItem
              :obj="posSetObject"
              :formItem="posSetObject.temp.deliveryTemplateId"
              name="deliveryTemplateId"
            /><br />
            <zp-dynamicFormItem
              :obj="posSetObject"
              :formItem="posSetObject.temp.valueAddedItemId"
              name="valueAddedItemId"
            />
            <div>
              <el-form-item class="form-item-btn">
                <zp-button class="zp-btn-primary" @click="posSetFormSubmit"
                  >保存</zp-button
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
import { customDropdownAction } from '@/mixins/index'
import formCheck from '../../util/formCheck'

export default {
  name: 'positionInfo',
  mixins: [customDropdownAction],
  data () {
    return {
      tagName: 1,
      jobClassList: [],
      jobList: [],
      obj: {
        breadcrumb: {
          title: this.$route.meta.name
        }
      },
      form: {
        addresses: [],
        tags: [],
        pics: []
      },
      formModel: {},
      dialogTip: {},
      // 职位设置form
      posSetObject: {
        name: 'posSetForm',
        labelWidth: '120px',
        isShowLabel: true,
        formInline: true,
        temp: {
          headUid: {
            isShow: true,
            label: '负责人',
            formType: 'select',
            data: [],
            filterable: true,
            popperAppendToBody: false
          },
          cooperateUids: {
            isShow: true,
            label: '协作人',
            formType: 'select',
            data: [],
            multiple: true,
            collapseTags: true,
            filterable: true,
            popperAppendToBody: false
          },
          processTemplateId: {
            isShow: true,
            label: '招聘流程',
            formType: 'select',
            data: [],
            filterable: true,
            clearable: false,
            popperAppendToBody: false
          },
          deliveryTemplateId: {
            isShow: true,
            label: '投递模板',
            formType: 'select',
            data: [],
            filterable: true,
            clearable: false,
            popperAppendToBody: false
          },
          valueAddedItemId: {
            isShow: false,
            label: '背调方案',
            formType: 'select',
            data: [],
            filterable: true,
            popperAppendToBody: false
          }
        },
        ruleForm: {
          headUid: '',
          cooperateUids: [],
          processTemplateId: 1,
          deliveryTemplateId: 1,
          valueAddedItemId: 1
        },
        rules: {
          headUid: formCheck.getRuleObj({
            message: '请选择负责人'
          }),
          processTemplateId: formCheck.getRuleObj({
            message: '请选择招聘流程'
          }),
          deliveryTemplateId: formCheck.getRuleObj({
            message: '请选择投递模板'
          }),
          valueAddedItemId: formCheck.getRuleObj({
            message: '请选择背调方案'
          })
        }
      }
    }
  },
  filters: {
    expRequirement: function (form) {
      const { minExpRequirement, maxExpRequirement } = form
      if (minExpRequirement === 0 && maxExpRequirement === 0) {
        return '无经验'
      }
      if (!minExpRequirement && !maxExpRequirement) {
        return '不限'
      }
      if (minExpRequirement && !maxExpRequirement) {
        return `${minExpRequirement}年以上`
      }
      if (!minExpRequirement && maxExpRequirement) {
        return `0 ~ ${maxExpRequirement}年`
      }
      return minExpRequirement + `年 - ` + maxExpRequirement + `年`
    },
    genderRequirement: function (form) {
      const { genderRequirement } = form
      return _var.sex2__global(genderRequirement)
    },
    ageRequirement: function (form) {
      const { minAgeRequirement, maxAgeRequirement } = form
      if (minAgeRequirement === 0 && maxAgeRequirement === 0) {
        return '不限'
      }
      if (!minAgeRequirement && !maxAgeRequirement) {
        return '不限'
      }
      if (minAgeRequirement && !maxAgeRequirement) {
        return `${minAgeRequirement}岁以上`
      }
      if (!minAgeRequirement && maxAgeRequirement) {
        return `16 ~ ${maxAgeRequirement}岁`
      }
      return minAgeRequirement + `岁 - ` + maxAgeRequirement + `岁`
    },
    workTime: function (form) {
      const { daysPreWeek, hoursPreDay } = form
      if (!daysPreWeek && !hoursPreDay) {
        return '--'
      }
      if (daysPreWeek && !hoursPreDay) {
        return `${daysPreWeek}天/周`
      }
      if (!daysPreWeek && hoursPreDay) {
        return `${hoursPreDay}小时/天`
      }
      return daysPreWeek + `天/周，` + hoursPreDay + `小时/天`
    },
    positionIdFilter: function (form, jobClassList, jobList) {
      const { positionId } = form
      if (!positionId) {
        return '--'
      }
      const job = jobList.filter(item => item.id === positionId * 1)
      const jobClass = jobClassList.filter(item => item.id === job[0].industryId)
      return jobClass[0].name
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.tagName = from.name === 'positionEdit' && vm.$route.query.tagName ? 2 : 1
    })
  },
  watch: {
    'posSetObject.ruleForm.processTemplateId' (val) {
      this.updatePosSetObject()
    }
  },
  created: function () {
    _fn.getPublicCombobox(res => {
      this.jobClassList = res.data[0]
    }, { comboType: 1 })
    _fn.getPublicCombobox(res => {
      this.jobList = res.data[0]
    }, { comboType: 2 })
  },
  mounted () {
    this.idx = this.$route.params.id
    this.requestHandle()
  },
  methods: {
    renderPartTime (data) {
      let ret = []
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.end <= item.start) {
            ret.push(`${item.start}~次日${item.end}`)
          } else {
            ret.push(`${item.start}~${item.end}`)
          }
        })
      }
      return ret.join(', ')
    },
    requestHandle: async function () {
      // 招聘流程下拉列表
      await _fn.getProcessTemplate(res => {
        let data = []
        res.map(item => {
          if (item.enabled) {
            data.push({
              label: item.name,
              value: item.id,
              stages: item.stages
            })
          }
        })
        this.posSetObject.temp.processTemplateId.data = data
        this.updatePosSetObject()
      })
      // 投递模板下拉列表
      await _fn.getDeliveryTemplate(res => {
        let data = []
        res.forEach(item => {
          if (item.enabled) {
            data.push({
              label: item.name,
              value: item.id
            })
          }
        })
        this.posSetObject.temp.deliveryTemplateId.data = data
      })
      // 背调方案下拉列表
      await _fn.get_value_added_item_public_combobox(res => {
        this.posSetObject.temp.valueAddedItemId.data = res.map(item => {
          return {
            label: item.name,
            value: item.id,
            disabled: !item.enabled,
            itemConfig: item.itemConfig
          }
        })
      }, { processStageType: 5 })
      await this.$nextTick(() => {
        if (this.idx > 0) { // 修改
          this.getInfo(this.idx)
        }
      })
    },
    updatePosSetObject () {
      const { temp, ruleForm } = this.posSetObject
      const { processTemplateId } = ruleForm
      const { data } = temp.processTemplateId
      const currentProcess = data.filter(item => item.value === processTemplateId)
      const currentProcessStages = currentProcess.length ? currentProcess[0].stages : []
      // 背调
      const valueAddedItemId = currentProcessStages.filter(item => item.type === 5)
      this.posSetObject = Object.assign({}, this.posSetObject, {
        temp: {
          ...temp,
          valueAddedItemId: {
            ...temp.valueAddedItemId,
            isShow: valueAddedItemId.length ? valueAddedItemId[0].enabled : false
          }
        }
      })
    },
    commandClick (val) {
      if (val === 1) { // 置顶
        this.stickTop()
      } else if (val === 2) { // 复制
        this.copy()
      }
    },
    stickTop (id) { // 置顶
      let param = { jobIds: [this.idx] }
      this._api.job_stick_top(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        _fn.toLocation({
          name: 'position'
        })
      })
    },
    addUser () {
      _fn.toLocation({
        name: 'deliveryEdit',
        params: {
          id: '0'
        },
        query: {
          jobId: this.idx
        }
      })
    },
    edit () {
      _fn.toLocation({ name: 'positionEdit', params: { id: encodeURI(JSON.stringify({ id: this.idx || '0' })) } }) // -> /user/123
    },
    copy (id) {
      _fn.toLocation({ name: 'positionEdit', params: { id: encodeURI(JSON.stringify({ id: '0', copyId: this.idx })) } })
    },
    getInfo (id) {
      this._api.job_details({ id: id }).then(async (res) => {
        let item = res.data
        if (item) {
          let obj = item
          obj.addressIds = item.addresses.map((i) => {
            return i.id
          })
          this.setPicsDefaulte(item.pics)
          this.form = obj
          this.posSetObject.ruleForm = Object.assign({}, this.posSetObject.ruleForm, {
            headUid: obj.headUser.id,
            processTemplateId: obj.processTemplateId,
            deliveryTemplateId: obj.deliveryTemplateId || 1,
            valueAddedItemId: obj.itemsConfig.itemsMap[5],
            cooperateUids: (obj.cooperateUsers || []).map(item => item.id)
          })
          console.log('res.data', res.data)
          await _fn.getRealNameList(res => {
            console.log('res', res)
            let data = []
            let index = -1
            res.forEach(item => {
              if (!item.disabled) {
                if (item.value === obj.headUser.id) {
                  index = 1
                }
                data.push(item)
              }
            })
            if (index === -1) {
              data.push({
                value: obj.headUser.id,
                label: obj.headUser.realName,
                disabled: true
              })
            }
            this.posSetObject.temp.headUid.data = data
            let cooperateUids = res.sort((a, b) => {
              return a.disabled - b.disabled
            })
            console.log('res', cooperateUids)
            this.posSetObject.temp.cooperateUids.data = cooperateUids
          }, {}, true)
        }
      })
    },
    // 图片
    setPicsDefaulte (list) {
      this.formModel.fileList = list
    },
    start (data) { // 启用
      let self = this
      let dia = {
        title: '启用流程',
        tbody: `您是否确认启用 <span style="color:#4a84ff;">${this.form.name}</span> 招聘流程？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: () => {
          let param = { id: this.idx }
          this._api.job_enable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            this.dialogTip.show = false
            _fn.toLocation({
              name: 'position'
            })
          })
        }
      }
      this.dialogTip = dia
    },
    stop (data) { // 停用
      let self = this
      let dia = {
        title: '停用流程',
        tbody: `您是否确认停用 <span style="color:#4a84ff;">${this.form.name}</span> 招聘流程？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: () => {
          let param = { id: this.idx }
          this._api.job_disable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            this.dialogTip.show = false
            _fn.toLocation({
              name: 'position'
            })
          })
        }
      }
      this.dialogTip = dia
    },
    posSetFormSubmit () {
      const { name, ruleForm, temp } = this.posSetObject
      this.$refs[name].validate((valid) => {
        if (valid) {
          const { valueAddedItemId } = temp
          let itemsConfig = {
            itemsMap: {}
          }
          if (ruleForm.valueAddedItemId) {
            const itemsConfigGroup = valueAddedItemId.data.filter(item => {
              return ruleForm.valueAddedItemId === item.value
            })
            if (itemsConfigGroup.length) {
              itemsConfig.itemsMap = itemsConfigGroup[0].itemConfig
            }
          }
          const params = {
            jobId: this.idx,
            headUid: ruleForm.headUid,
            processId: ruleForm.processTemplateId,
            deliveryTemplateId: ruleForm.deliveryTemplateId,
            valueAddedItemId: ruleForm.valueAddedItemId,
            cooperateUids: ruleForm.cooperateUids,
            itemsConfig: {
              itemsMap: null
            }
          }
          this._api.job_update_setting(params).then(res => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            this.getInfo(this.idx)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/style/color.less";
.contexts {
  overflow-y: auto;
}
.positionInfo_title {
  height: 176px;
  padding: 20px 50px;
  margin: 0 20px;
  background: #f7f8fa;
  .left {
    float: right;
    text-align: center;
    padding: 0 44px 0 94px;
    border-left: 1px solid #2e384d1a;
    .user {
      color: #4a84ff;
      margin-top: 15px;
      .iconrenshu {
        font-size: 48px;
      }
    }
    .number {
      font-family: HelveticaNeue-Bold;
      font-size: 32px;
      color: #26334f;
      letter-spacing: 0;
      text-align: center;
      margin: 20px 0 4px;
    }
    .text {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #69707f;
      letter-spacing: 0;
      text-align: right;
    }
  }
  .right {
    display: inline-block;
    .name {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #26334f;
      letter-spacing: 0;
      line-height: 28px;
      .tags {
        background: #ffb61a;
        border-radius: 16px;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 20px;
        padding: 2px 10px;
        margin-left: 4px;
        display: inline-block;
        vertical-align: text-bottom;
      }
      .tags-gray {
        background: gray;
        border-radius: 16px;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 20px;
        padding: 2px 10px;
        margin-left: 4px;
        display: inline-block;
        vertical-align: text-bottom;
      }
    }
    .ids {
      font-size: 16px;
      color: #69707f;
      letter-spacing: 0;
      line-height: 24px;
      margin: 4px 0 20px;
    }
    .context {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #69707f;
      letter-spacing: 0;
      line-height: 24px;
      margin: 20px 0 40px;
      span {
        margin-right: 40px;
      }
    }
    .btnLine {
      display: inline;
      border-right: 1px solid #2e384d1a;
      line-height: 32px;
      margin: 0 40px;
    }
  }
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
.tabs-item-container {
  .el-form {
    min-height: 800px;
  }
  .forms_title {
    margin-bottom: 24px !important;
    color: @black2;
  }
  /deep/ .el-form-item {
    margin-bottom: 20px !important;
  }
  /deep/ .el-form-item__label,
  /deep/ .el-form-item__content {
    line-height: 14px;
    color: @black2;
  }
  /deep/ .el-form-item__content {
    vertical-align: middle;
    color: #69707f;
  }
}
.form-item-wrapper {
  /deep/ .el-form-item__content {
    width: calc(100% - 120px);
    vertical-align: top;
  }
  .address-wrapper {
    display: flex;
    flex-wrap: wrap;
    line-height: 24px;
  }
}
.empty-addresses {
  /deep/ .el-form-item__content {
    vertical-align: middle;
  }
}
.other-benefits {
  width: 100%;
  /deep/ .el-form-item__content {
    width: calc(69% - 120px);
    vertical-align: top;
  }
  .label {
    margin-bottom: 10px;
  }
}
.pics-wrapper {
  margin-left: 35px;
  img {
    margin-bottom: 20px;
  }
  img:not(:first-of-type) {
    margin-left: 20px;
  }
}

.form-item-btn {
  /deep/ .el-form-item__content {
    margin-left: 120px;
  }
}

.work-desc {
  margin: 0 0 20px 34px;
  max-width: 902px;
  color: #69707f;
  /deep/ ul li {
    list-style: initial;
  }
  /deep/ ol li {
    list-style: decimal;
  }
}
</style>
