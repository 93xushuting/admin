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
          <span class="line"></span>删除数据
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
        />
      </el-form>
      <p class="reason-msg">
        <i class="el-icon-warning"></i>
        <span>删除投递记录无法恢复，请慎重操作哦~</span>
      </p>
    </div>
    <div class="editFooter">
      <zp-button @click="toPage">取 消</zp-button>
      <zp-button @click="save" type="primary">确认删除</zp-button>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
export default {
  name: 'deletePage',
  data () {
    return {
      sendParam: [],
      dialogTip: {},
      tableCount: 0,
      currentId: 0,
      title: '批量删除',
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        tableObj: {
          height: '',
          data: [],
          fields: [
            { key: 'name', label: '候选人姓名' },
            { key: 'positionName', label: '入职职位' },
            { key: 'companyName', label: '所属企业' }
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
        }
      }
    }
  },
  created () {
    // 获取数据
    console.log(this.$route.params, "++++++传进来++++")
    let params = { jobApplicantIdList: JSON.parse(decodeURI(this.$route.params.id)).deleteContent };
    this._api.job_applicant_batch_operation_details(params).then((res) => {
      let data = res.data
      console.log(data, "++++++++data+++++")
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
    //选中
    handleSelectionChange (selection) {
      this.tableCount = selection.length;
      this.sendParam = selection;
    },
    toPage () {
      this.$router.go(-1)
    },
    save () {
      if (!this.sendParam.length) {
        //没有选中
        _fn.message('请至少选择一项', { type: 'error' });
        return
      }
      let deleteContent = [];
      this.sendParam.map(item => {
        deleteContent.push(item.id)
      });
      let params = {
        jobApplactionIdList: deleteContent,//参数是数组
      }
      this._api.job_entry_delete(params).then((res) => {
        if (res.code === 0) {
          //操作成功
          _fn.message(res.msg || '操作成功', { type: 'success' })
          this.toPage()
        }
      });
      return
    },
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
