<template>
  <!-- 职位列表 -->
  <zp-page :obj="obj" ref="page" class="positionList">
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown2="true">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.status" name="status" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.invitationStatus" name="invitationStatus" :obj="obj.searchModel" />
      </template>
      <template slot="btns"></template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <div slot="tableCount" style="margin-left: 20px">
      <!-- {{selectedList}} -->
      <div style="margin-bottom: 10px" class="tableCount-header">
        <div>
          已选择
          <span style="color: #4a84ff">{{ selectedList.length }} </span>个人
        </div>
        <div v-show="toggleVisible" class="toggle">
          <zp-button @click="collapse = !collapse" type="text">
            {{ collapse ? "收起" : "展开" }}
            <i :class="{
                iconfont: true,
                iconzhankai: !collapse,
                iconshouqi: collapse,
              }" />
          </zp-button>
        </div>
      </div>
      <div :class="{
          'tableCountLabel-container': true,
          collapse: collapse,
        }">
        <div ref="tableCountLabel-wrapper">
          <div class="tableCountLabel" v-for="(item, index) in selectedList" :key="index">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <zp-dynamicTable @select-all="handleSelectAll" @select="handleRowSelect" @handleSelectionChange="handleSelectionChange" slot="table"
      :obj="obj.tableObj" stripe ref="operationTable">
      <template slot="customMode_deliveryStatus" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              _var.applicant_status__global(scope.row.deliveryStatus) || " -- "
            }}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_currentCity" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              (scope.row.currentCity && scope.row.currentCity.title) || " -- "
            }}
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <div class="editFooter">
      <zp-button @click="save" class="zp-btn-primary">确定</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
export default {
  name: 'positionListTemp',
  props: {
    selectedData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      toggleVisible: false,
      selectedList: [],
      dialogTip: {},
      keepAlive: {},
      collapse: false,
      queryType: this.$route.query.type,
      obj: new _baseData().call(this, () => {
        return {
          applicantStatus: 0, // 0.短信任务 1.人才库
          http: {
            queryUrl: 'smsAssistant_pushResumeList'
          },
          breadcrumb: {},
          searchModel: {
            isShowLabel: true, // 是否显示label
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '姓名',
                placeholder: '请输入人才姓名',
                maxlength: 30,
                style: { width: '280px' },
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              status: {
                formType: 'select',
                label: '人才状态',
                isShow: true,
                clearable: false,
                style: { width: '280px' },
                data: _var.applicant_status
              },
              invitationStatus: {
                formType: 'select',
                label: '邀约状态',
                isShow: true,
                style: { width: '280px' },
                data: _var.applicant_status_invitation
              }
            },
            ruleForm: {
              name: '',
              status: 9,
              invitationStatus: ''
            }
          },
          tableObj: {
            isOnresizeTable: false,
            operation: {
              // 全选
              selection: true,
              selection_width: 50,
              selection_fixed: true,
              // 序号
              index: false,
              index_width: 50,
              index_fixed: true,
              // 操作列  
              operation: false,
              operation_width: 140,
              operation_fixed: true
            },
            btnList: [],
            fields: [
              { key: 'name', label: '姓名', width: 'auto' },
              { key: 'phoneNumber', label: '手机号', width: 'auto' },
              { key: 'deliveryStatus', label: '状态', width: 'auto', customMode: true },
              { key: 'templateName', label: '最近邀约模板', width: 'auto' },
              { key: 'invitationTime', label: '最近成功推送时间', width: 'auto' },
              { key: 'updateTime', label: '更新时间', width: '200', formatter: this._tcolFormat.formatterMinute }
            ]
          }
        }
      }),
      tableSelectedData: []
    }
  },
  watch: {
    selectedList (val) {
      this.$nextTick(function () {
        const el = this.$refs['tableCountLabel-wrapper']
        const { height } = el.getBoundingClientRect()
        this.toggleVisible = height > 74
      })
    }
  },
  created () {
    this.selectedList = this.selectedData.map(item => {
      return {
        id: item.id,
        phoneNumber: (item.mobile).split('-')[1] ? (item.mobile).split('-')[1] : item.mobile,
        name: item.userName
      }
    })
    console.log('----------------((((8s88shs)', this.selectedList)
  },
  mounted () {
    this.$nextTick(() => {
      let keepAlive = this.getKeepAlive()
      if (keepAlive && _fn.isString(keepAlive.id)) {
        this.keepAlive = JSON.parse(decodeURI(keepAlive.id))
      }
    })
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      this.$nextTick(() => {
        if (+this.queryType === 0) {
          this.obj.tableObj.fields = [
            { key: 'name', label: '姓名', width: 'auto' },
            { key: 'phoneNumber', label: '手机号', width: 'auto' },
            { key: 'deliveryStatus', label: '状态', width: 'auto', customMode: true },
            { key: 'templateName', label: '最近邀约模板', width: 'auto' },
            { key: 'invitationTime', label: '最近成功推送时间', width: 'auto' },
            { key: 'updateTime', label: '更新时间', width: '200', formatter: this._tcolFormat.formatterMinute }
          ]
        } else if (+this.queryType === 1) {
          this.obj.tableObj.fields = [
            { key: 'name', label: '姓名', width: 'auto' },
            { key: 'phoneNumber', label: '手机号', width: 'auto' },
            { key: 'deliveryStatus', label: '状态', width: 'auto', customMode: true },
            { key: 'currentCity', label: '现居住地', width: 'auto', customMode: true },
            { key: 'templateName', label: '最近邀约模板', width: 'auto' },
            { key: 'invitationTime', label: '最近成功推送时间', width: 'auto' },
            { key: 'updateTime', label: '更新时间', width: '200', formatter: this._tcolFormat.formatterMinute }
          ]
        }
      })
    },
    getKeepAlive () {
      return this.$store.state.keep_alive.keepAlive
    },
    handleSelectAll (selection) {
      const len = selection.length
      // selection[i].phoneNumber === list[j].phoneNumber && selection[i].name === list[j].name      tableData[i].phoneNumber === selectedData[j].phoneNumber && tableData[i].name === selectedData[j].name
      if (len) {
        const list = this.selectedList.slice()
        for (let i = 0; i < len; i++) {
          let flag = true
          for (let j = 0, length = list.length; j < length; j++) {
            if (selection[i].id === list[j].id || (selection[i].phoneNumber === list[j].phoneNumber && selection[i].name === list[j].name)) {
              flag = false
              break
            }
          }
          if (flag) {
            list.push(selection[i])
          }
        }
        this.selectedList = list
        return
      }
      const tableData = this.obj.tableObj.data
      const selectedData = this.selectedList.slice()
      const result = []
      for (let i = 0, len = tableData.length; i < len; i++) {
        let flag = false
        let index = 0
        for (let j = 0, length = selectedData.length; j < length; j++) {
          if (tableData[i].id === selectedData[j].id || (tableData[i].phoneNumber === selectedData[j].phoneNumber && tableData[i].name === selectedData[j].name)) {
            flag = true
            index = j
            break
          }
        }
        if (flag) {
          selectedData.splice(index, 1)
        }
      }
      this.selectedList = selectedData
    },
    handleRowSelect (selection, row) {
      console.log(selection, row, 'handleRowSelect++++++++++++')
      // item => item.phoneNumber === row.phoneNumber && item.name === row.name
      const ischecked = selection.some(item => item.id === row.id || (item.phoneNumber === row.phoneNumber && item.name === row.name))
      if (ischecked) {
        const isHave = this.selectedList.some(item => item.id === row.id || (item.phoneNumber === row.phoneNumber && item.name === row.name))
        if (isHave) {
          return
        }
        this.selectedList.push(row)
        return
      }
      this.selectedList.forEach((item, index) => {
        if (item.id === row.id || (item.phoneNumber === row.phoneNumber && item.name === row.name)) {
          this.selectedList.splice(index, 1)
        }
      })
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      // console.info('表格选中的数据', data)
      // this.tableSelectedData = data
    },
    setSelected (arr) {
      /* this.tempSetSelected = arr
      this.setTableDataSelected(this.tempSetSelected)
      console.info('3333333333333', arr) */
    },
    setTableDataSelected (arr) { // 设置表格选中
      this.$nextTick(function () {
        const tableData = this.obj.tableObj.data
        console.log(tableData, '|||||||框子||||||')
        const result = []
        for (let i = 0, len = tableData.length; i < len; i++) {
          for (let j = 0, length = arr.length; j < length; j++) {
            if ((tableData[i].id === arr[j].id) || (tableData[i].phoneNumber === arr[j].phoneNumber && tableData[i].name === arr[j].name)) {
              this.$refs.operationTable.toggleRowSelection(tableData[i], true)
              break
            }
          }
        }
      })
    },
    loadAfter (data, fn) {
      this.obj.tableObj.data = data.list
      this.setTableDataSelected(this.selectedList)
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    getTableData () {
      return this.tableSelectedData
    }
  }
}
</script>
<style lang="less" scoped>
.positionList {
  .tableCount-header {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    div {
      line-height: 35px;
    }
    .toggle {
      font-weight: bold;
    }
  }
  .tableCountLabel-container {
    max-height: 74px;
    overflow: hidden;
    transition: all 0.2s;
  }
  .tableCountLabel-container.collapse {
    max-height: 999px;
  }
  .tableCountLabel {
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid rgba(46, 56, 77, 0.1);
    color: #2e384d;
    margin: 0 20px 5px 0;
    border-radius: 16px;
    cursor: pointer;
    background: #fff;
  }
  /deep/ .searchForm .el-form-item {
    margin-bottom: 10px !important;
  }
  .dasheds {
    background: red;
    /deep/.infoForm .infoForm-input,
    .infoForm .infoForm-select,
    .infoForm .el-cascader {
      width: 280px !important;
    }
  }
}

.searchForm {
  min-height: inherit;
}
/deep/ .el-dropdown {
  margin-left: 10px;
}
.stageClass {
  width: 100%;
  border: 1px solid #eee;
  text-align: center;
  .rowClass {
    line-height: 60px;
    margin: 5px;
    border: 1px solid #eee;
    .left {
      text-align: left;
    }
  }
  .rowClass:hover {
    cursor: all-scroll;
  }
  .rowClass:first-child,
  .rowClass:last-child {
    background: #eee;
    cursor: default;
  }
}
.table_location.tagHot,
.table_location.tagUrgent {
  padding-left: 24px;
  &:before {
    position: absolute;
    left: 10px;
    top: 9px;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid;
  }
}
.table_location.tagHot::before {
  content: "\70ed";
  color: #ffb61a;
  border-color: #ffb61a1a;
  background: #ffb61a4d;
}
.table_location.tagUrgent::before {
  content: "\6025";
  color: #fb5146;
  border-color: #fb51461a;
  background: #fb51464d;
}
</style>
