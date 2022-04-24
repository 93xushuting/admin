<template>
  <!-- 职位列表 -->
  <zp-page :obj="obj" ref="page" class="positionList">
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="true">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.companyId" name="companyId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.cityId" name="cityId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.timeRequired" name="timeRequired" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.headUid" name="headUid" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.recType" name="recType" :obj="obj.searchModel" />
      </template>
      <template slot="btns"></template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <div slot="tableCount" style="margin-left:20px">
      <div style="margin-bottom: 10px" class="tableCount-header">
        <div>已选择 <span style="color:#4A84FF;">{{tableSelectedData.length}} </span>个职位</div>
        <div class="toggle">
          <zp-button v-show="toggleVisible" @click="collapse = !collapse" type="text">
            {{collapse ? '收起' : '展开'}}
            <i :class="{
              iconfont: true,
              iconzhankai: !collapse,
              iconshouqi: collapse
            }" />
          </zp-button>
        </div>
      </div>
      <div :class="{'tableCountLabel-container': true, collapse: collapse}">
        <div ref="tableCountLabel-wrapper">
          <div class="tableCountLabel" v-for="(item,index) in tableSelectedData" :key="index">
            <i class="iconfont iconwenbenshanchu" @click="closeTableSelect(item,index)" />
            {{item.positionName || item.name}}
          </div>
        </div>
      </div>
    </div>
    <zp-dynamicTable @select-all="handleSelectAll" @select="handleRowSelect" @handleSelectionChange="handleSelectionChange" slot="table"
      :obj="obj.tableObj" stripe ref="operationTable">
      <template slot="customMode_tcompany" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{(scope.row.tcompany  && scope.row.tcompany.name) || ' -- '}}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_tcityList" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.tcityList && scope.row.tcityList.length">
              <span v-for="(item,index) in scope.row.tcityList" :key="index">
                {{item.label + (index === scope.row.tcityList.length - 1 ? '' : '、')|| ' -- '}}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_addresses" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.addresses && scope.row.addresses.length">
              <span v-for="(item,index) in scope.row.addresses" :key="index">
                {{item.name + (index === scope.row.addresses.length - 1 ? '' : '、')|| ' -- '}}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_industryPosition" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{(scope.row.industryPosition  && scope.row.industryPosition.title) || ' -- '}}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_timeRequired" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ _var.workNature__global(scope.row.timeRequired)  || ' -- '}}
          </template>
        </el-table-column>
      </template>

      <template slot="customMode_headUser" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{(scope.row.headUser  && scope.row.headUser.realName) || ' -- '}}
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
  name: 'position',

  props: {
    jobIds: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      toggleVisible: false,
      dialogTip: {},
      params__: {},
      collapse: false,
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'job_public_list'
          },
          breadcrumb: {
            title: this.$route.meta.name || '用户管理'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '职位名称',
                placeholder: '请输入职位名称',
                maxlength: 30,
                style: { width: '280px' },
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              companyId: {
                formType: 'select',
                label: '所属组织',
                data: [],
                isShow: true,
                style: { width: '280px' }
              },
              cityId: {
                isShow: true,
                label: '城市',
                formType: 'select',
                style: { width: '280px' },
                data: []
              },
              timeRequired: {
                formType: 'select',
                label: '工作性质',
                data: _var.workNature,
                isShow: true,
                style: { width: '280px' },
                filterable: true
              },
              headUid: {
                formType: 'select',
                label: '负责人',
                data: [],
                style: { width: '280px' },
                isShow: true
              },
              recType: { formType: 'select', label: '招聘类型', isShow: true, data: _var.recType, style: { width: '280px' } }
            },
            ruleForm: {
              name: '',
              companyId: '',
              headUid: '',
              timeRequired: '',
              cityId: '',
              recType: null, // 0-代理招聘, 1-企业直招
              state: 1
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
              { key: 'name', label: '职位名称', width: 'auto' },
              { key: 'tcompany', label: '所属组织', width: 'auto', customMode: true },
              { key: 'tcityList', label: '工作地址城市', width: 'auto', customMode: true },
              { key: 'addresses', label: '工作地址', width: 'auto', customMode: true },
              { key: 'industryPosition', label: '关联岗位', width: 'auto', customMode: true },
              { key: 'timeRequired', label: '工作性质', width: 'auto', customMode: true },
              { key: 'headUser', label: '负责人', width: 'auto', customMode: true },
              { key: 'updateTime', label: '更新时间', width: '200', formatter: this._tcolFormat.formatterMinute }
            ]
          }
        }
      }),
      tableSelectedData: []
    }
  },
  watch: {
    tableSelectedData (val) {
      this.$nextTick(function () {
        const el = this.$refs['tableCountLabel-wrapper']
        if (el) {
          const { height } = el.getBoundingClientRect()
          this.toggleVisible = height > 74
        }
      })
    }
  },
  created () { },
  mounted () {
    this.params__ = {}
    try {
      this.params__ = JSON.parse(localStorage.getItem('operationCenter_public'))
      this.tableSelectedData = this.params__.recommendPositionDTOSList.map(item => ({
        id: item.positionId || item.id,
        name: item.positionName || item.name
      }))
    } catch (e) { }
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      // 所属企业
      _fn.getAllCompony(data => {
        data.unshift({ label: '全部', value: '' })
        this.obj.searchModel.temp.companyId.data = data
      }, {}, true)
      // 负责人
      _fn.getRealNameList(data => {
        this.obj.searchModel.temp.headUid.data = data.map(item => ({ label: item.realName, value: item.id }))
      }, {}, false)
      // 城市
      _fn.getPublicCombobox(res => {
        let d = (res && res.data && res.data[0]) || []
        this.obj.searchModel.temp.cityId.data = d.map(item => ({ label: item.title, value: item.id }))
      }, { comboType: 9 })

      if (this.idx > 0) {

      }
    },
    handleSelectAll (selection) {
      const len = selection.length
      if (len) {
        const arr = selection.map(item => {
          return {
            ...item,
            pageNo: this.obj.tableObj.pager.pageNo,
            flag: true
          }
        })
        const list = JSON.parse(JSON.stringify(this.tableSelectedData))
        for (let i = 0; i < len; i++) {
          let flag = true
          for (let j = 0, length = list.length; j < length; j++) {
            if (arr[i].id === list[j].id) {
              flag = false
            }
          }
          if (flag) {
            list.push(arr[i])
          }
        }
        this.tableSelectedData = list
        return
      }
      const tableData = this.obj.tableObj.data
      const selectedData = this.tableSelectedData.slice()
      const result = []
      for (let i = 0, len = tableData.length; i < len; i++) {
        let flag = false
        let index = 0
        for (let j = 0, length = selectedData.length; j < length; j++) {
          if (tableData[i].id === selectedData[j].id) {
            flag = true
            index = j
            break
          }
        }
        if (flag) {
          selectedData.splice(index, 1)
        }
      }
      this.tableSelectedData = selectedData
    },
    handleRowSelect (selection, row) {
      const ischecked = selection.some(item => item.id === row.id)
      if (ischecked) {
        const isHave = this.tableSelectedData.some(item => item.id === row.id)
        if (isHave) {
          return
        }
        this.tableSelectedData.push(row)
        return
      }
      this.tableSelectedData.forEach((item, index) => {
        if (item.id === row.id) {
          this.tableSelectedData.splice(index, 1)
        }
      })
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      /* console.info('表格选中的数据', data)
      this.tableSelectedData = data */
    },
    setTableDataSelected (arr) { // 设置表格选中
      this.$nextTick(() => {
        this.$refs.operationTable.clearSelection()
        if (arr && arr.length) {
          let data = this.obj.tableObj.data
          let array = []
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < data.length; j++) {
              if (arr[i] === data[j].id || arr[i] === +data[j].id || (arr[i] && +arr[i].id) === +data[j].id) {
                array.push(data[j])
                break
              }
            }
          }
          console.info('111111111111111111111', array)
          array.forEach((t) => {
            this.$refs.operationTable.toggleRowSelection(t, true)
          })
        }
      })
    },
    closeTableSelect (item, index) {
      this.tableSelectedData.splice(index, 1)
      this.setTableDataSelected(this.tableSelectedData)
    },
    loadBefor (param) {
      param.queryParam.jobIds = this.jobIds
      return param
    },
    loadAfter (data, fn) {
      this.obj.tableObj.data = data.list
      this.$nextTick(() => {
        let d = this.tableSelectedData
        if (d && d.length) { // 返选中
          let arr = []
          for (var i = 0; i < d.length; i++) {
            arr.push(d[i].positionId || d[i].id)
          }
          this.setTableDataSelected(arr)
        }
      })
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    toPage () {
      if (this.params__.type__ === 'operationCenter_public') {
        _fn.toLocation({ name: 'public' }) // -> /user/123
      }
    },
    goto (name, param, isFlag = true) {
      _fn.toLocation({ name: name, params: param }) // -> /user/123
    },
    save () {
      if (this.params__.type__ === 'operationCenter_public') {
        if (this.tableSelectedData.length > 5) {
          this.notify('最多选5个职位')
        } else {
          this.params__.recommendPositionDTOSList = this.tableSelectedData.map((item) => {
            return { positionName: item.name, positionId: item.id }
          })
          this.params__.type__ = 'operationCenter_public_callback'
          localStorage.setItem('operationCenter_public', '')
          localStorage.setItem('operationCenter_public_callback', JSON.stringify(this.params__))
          _fn.toLocation({ name: 'public' }) // -> /user/123
        }
      }
    },
    getTableData () {
      return this.tableSelectedData
    }
  }
}
</script>
<style lang="less" scoped>
.positionList{
  .tableCount-header{
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    div{
      line-height: 35px;
    }
    .toggle{
      font-weight: bold;
    }
  }
  .tableCountLabel-container{
    max-height: 50px;
    overflow: hidden;
    transition: all .2s;
  }
  .tableCountLabel-container.collapse{
    max-height: 999px;
  }
  .tableCountLabel{
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid rgba(46,56,77,.1);
    color: #2e384d;
    margin: 10px 20px 5px 0;
    border-radius: 16px;
    background: #fff;
    position: relative;
    /deep/.iconwenbenshanchu{
      position: absolute;
      right: -8px;
      top: -12px;
      color: red;
      font-size: 20px;
      cursor: pointer;
    }
  }
  /deep/ .searchForm  .el-form-item {
    margin-bottom: 10px !important;
  }
  .dasheds{
    background: red;
    /deep/.infoForm .infoForm-input, 
   .infoForm .infoForm-select, 
   .infoForm .el-cascader {
      width: 280px !important;
    }
  }
}

.searchForm{
  min-height: inherit;
}
/deep/ .el-dropdown{
  margin-left: 10px;
}
.stageClass{
  width: 100%;
  border: 1px solid #eee;
  text-align: center;
  .rowClass{
    line-height: 60px;
    margin: 5px;
    border: 1px solid #eee;
    .left{
      text-align: left;
    }
  }
  .rowClass:hover{
    cursor: all-scroll;
  }
  .rowClass:first-child,.rowClass:last-child{
    background: #eee;
    cursor: default;
  }
}
.table_location.tagHot,
.table_location.tagUrgent{
  padding-left: 24px;
  &:before{
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
.table_location.tagHot::before{
  content: '\70ed';
  color: #ffb61a;
  border-color: #ffb61a1a;
  background: #ffb61a4d;
}
.table_location.tagUrgent::before{
  content: '\6025';
  color: #fb5146;
  border-color: #fb51461a;
  background: #fb51464d;
}
</style>
