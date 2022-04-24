<template>
  <!-- 投递管理 弹出框 -->
  <div class="element__body_info">
    <div class="breadcrumb">
      <i class="iconfont iconfanhuishangji" @click="toPage" />{{ title }}
    </div>
    <div class="deliveryOperationBody">
      <!-- v-if="btnId === 15"class="infoForm editFooterMargin" -->
      <el-form
        :model="form.tableObj"
        ref="tableForm"
        size="small"
        class="editFooterMargin"
      >
        <div class="forms_title2">
          <span class="line"></span>入职人员
          <div class="count">
            共计 <span class="number"> {{ tableCount }} </span> 条
          </div>
        </div>
        <zp-dynamicTable
          @handleSelectionChange="handleSelectionChange"
          ref="deliveryOperationTable"
          :obj="form.tableObj"
          stripe
          class="deliveryOperationTable fqbd"
          :height="form.tableObj.height"
          v-if="form.tableObj.height > 0"
        >
          <template
            slot="customMode_taddresses"
            slot-scope="props"
            v-if="props.customProps.key === 'taddresses'"
          >
            <el-table-column
              :label="props.customProps.label"
              :render-header="renderHeader"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.addressId" placeholder="请选择">
                  <el-option
                    v-for="item in scope.row.addrList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>
        </zp-dynamicTable>
      </el-form>
      <el-form
        :model="form.ruleForm"
        :rules="form.rules"
        :label-width="form.labelWidth"
        size="small"
        :ref="form.name"
        class="infoForm editFooterMargin"
        :inline="form.inline"
      >
        <div class="forms_title2"><span class="line"></span>入职人员</div>
        <template>
          <zp-dynamicFormItem
            :formItem="form.temp && form.temp.expiryDate"
            name="expiryDate"
            :obj="form"
          />
        </template>
      </el-form>
    </div>
    <div class="editFooter">
      <zp-button @click="toPage">取消</zp-button>
      <zp-button @click="save" type="primary">确定</zp-button>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
import { compileTime } from '@/util/utils'

export default {
  name: 'deletePage',
  data () {
    return {
      sendParam: [],
      dialogTip: {},
      tableCount: 0,
      currentId: 0,
      title: '确认入职',
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          expiryDate: {
            formType: 'datetime',
            label: '入职时间',
            prefixIcon: 'el-icon-date',
            isShow: true,
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            format: 'yyyy-MM-dd HH:mm:ss'
          }
        },
        ruleForm: {
          expiryDate: '' // 入职时间
        },
        rules: {
          expiryDate: formCheck.getRuleObj({ message: '请选择入职时间', trigger: 'change' })
        },
        tableObj: {
          height: '',
          data: [],
          fields: [
            { key: 'name', label: '候选人姓名' },
            { key: 'positionName', label: '入职职位' },
            { key: 'companyName', label: '所属企业' },
            { key: 'addressWanted', label: '期望工作地址' },
            { key: 'taddresses', label: '入职地址', customMode: true }
          ],
          operation: {
            selection: true // 是否显示全选列
            // index: false, // 是否显示序号
            // index_width: 50, // 并设置列宽
            // operation: false, // 是否显示操作列
            // operation_width: 200, // 并设置列宽
            // selection_fixed: true,
            // index_fixed: true,
            // operation_fixed: true
          }
        },
        tableRules: {
          addressId: [
            { required: true, message: '请选择地址', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created () {
    // 获取数据
    console.log(this.$route.params, '++++++传进来++++')
    let params = { jobApplicantIdList: JSON.parse(decodeURI(this.$route.params.id)).deleteContent }
    this._api.job_applicant_batch_operation_details(params).then((res) => {
      let data = res.data
      console.log(data, '++++++++data+++++')
      if (data && data.length) {
        data.forEach((d) => {
          if (d.taddresses && d.taddresses.length) {
            let idx__ = ''
            if (d.addressWanted && d.addressWanted.length) {
              idx__ = d.addressWanted[0].id
              let allAddress = []
              d.addressWanted.map(item => {
                allAddress.push(item.name)
              })
              d.addressWanted = allAddress.join('、')
            } else {
              d.addressWanted = '接受调剂门店'
            }
            let array = []
            d.taddresses.map((item, index) => {
              if (index === 0) {
                d.addressId = idx__ || item.id
              }
              array.push({ label: item.name, value: item.id })
            })
            d.addrList = array
          }
        })
      }
      this.form.tableObj.data = data
      this.tableCount = data.length
      let size = (data.length + 1)
      this.form.tableObj.height = size * 40 < 440 ? size * 40 : 440
      this.$nextTick(() => {
        data.forEach((t) => {
          this.$refs.deliveryOperationTable.toggleRowSelection(t, true)
        })
        this.$refs.deliveryOperationTable.selectionList(data) // 默认进来选中
      })
    })
  },
  methods: {
    // 选中
    handleSelectionChange (selection) {
      this.tableCount = selection.length
      this.sendParam = selection
    },
    toPage () {
      this.$router.go(-1)
    },
    save () {
      if (!this.sendParam.length) {
        // 没有选中
        _fn.message('请至少选择一项', { type: 'error' })
        return
      }
      if (!this.form.ruleForm.expiryDate) {
        // 没有选择时间
        _fn.message('请选择入职时间', { type: 'error' })
        return
      }
      console.log(this.sendParam, '+++++++this.sendParam++++++', this.form.ruleForm)
      // if (new Date(this.form.ruleForm.expiryDate) < new Date()) {
      //   _fn.message("入职时间不可小于当前时间", { type: "error" });
      //   return
      // }
      let obj = {
        jobApplicantIdMap: {}, // 申请记录ID，对应职位地址ID(action=4、6、8必填真实地址ID，其他可填0)
        currentStageId: 6, // 当前阶段ID
        targetStageId: 7, // 目标阶段ID
        action: 2, // 1-通过当前阶段, 2-推进阶段, 3-直接淘汰, 4-面试邀请, 5-办证邀请, 6-试工邀请, 7-发起背调, 8-发送OFFER, 9-批量查看, 10-面试已到面, 11-试工已到面
        isBatch: true
      }
      this.sendParam.map((m) => {
        obj.jobApplicantIdMap[m.id] = {
          addressId: m.addressId,
          id: m.id, // 申请记录ID
          identityNumber: m.identityNumber, // 身份证号，背调用
          mobile: m.phoneNumber // 身份证号，背调用
        }
      })
      obj.enrollmentTime = compileTime(this.form.ruleForm.expiryDate)
      // new Date(this.form.ruleForm.expiryDate).getTime().toString();
      _api.job_applicant_operate(obj).then(res => {
        if (res.code === 0) {
          _fn.message(res.msg || '操作成功', { type: 'success' })
          this.toPage()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.deliveryOperationBody {
  overflow-y: auto;
  margin-bottom: 64px;
  flex: 1;
  height: 100%;
  .editFooterMargin {
    margin-bottom: 18px;
  }
  .fqbd {
    .el-form-item {
      margin: 18px 0 !important;
    }
  }
  .deliveryOperationTable {
    width: 1010px;
    display: block;
    /deep/.el-table__fixed {
      height: 100% !important;
      &::before,
      &::before {
        position: static;
      }
    }
    /deep/ th div {
      line-height: 24px;
    }
    /deep/.el-input__inner {
      height: 36px;
      line-height: 36px;
    }
  }
  .sms-template {
    /deep/ .el-card__body {
      padding: 10px 0 10px 16px;
    }
    .container {
      width: 331px;
      background: #f4f4f4;
      border-radius: 5px;
      padding: 13px 0 19px 12px;
      color: #26334f;
      p {
        line-height: initial;
        margin: 0;
      }
    }
  }
  .cue-color {
    color: #409eff;
  }
  .reason-msg {
    margin: 0 0 0 20px;
    color: #777474;
    font-size: 15px;
  }
}
</style>
