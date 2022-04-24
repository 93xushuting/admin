<template>
  <!-- 职位管理 -->
  <zp-page :obj="obj" ref="page">
    <!-- <zp-tabsCustom slot="tabs" :data="tabs" v-model="tagName" @click="handleClick" /> -->

    <zp-tabsCustom slot="tabs" v-model="tagName" :summary="summary" :data="[
        { label: `招聘中(${summary.start || 0})`, value: 'start' },
        { label: `已暂停(${summary.end || 0})`, value: 'end' },
      ]" @click="tabsChangeHanle" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="true">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.companyId" name="companyId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.deptIds" name="deptIds" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.headUid" name="headUid" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.addressId" name="addressId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.cityId" name="cityId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.timeRequiredList" name="timeRequiredList" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.deliveryTemplateId" name="deliveryTemplateId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.processId" name="processId" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="_fn.checkBtn('job/add')">新增职位</zp-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown ref="dropdownRef" split-button size="medium" class="dropdown" trigger="click" @command="commandClick"
            @click.stop="dropdownBtnClick" placement="bottom-start">
            批量操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1" v-if="_fn.checkBtn('job/export_jobs')">批量导出</el-dropdown-item>
              <el-dropdown-item command="2" v-if="_fn.checkBtn('job/stick_top')">批量置顶</el-dropdown-item>
              <el-dropdown-item command="3" v-if="tagName === 'end' && _fn.checkBtn('job/deleteJobData')">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable @handleSelectionChange="handleSelectionChange" slot="table" :obj="obj.tableObj" stripe ref="position-table">
      <template slot="customMode_name" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="_fn.checkBtn('job/details')" :class="[
                'table_location',
                scope.row.label === 'HOT'
                  ? 'tagHot'
                  : scope.row.label === 'URGENT'
                  ? 'tagUrgent'
                  : '',
              ]" @click="table_location(scope.row)">{{ scope.row.name }}</span>
            <span v-else :class="[
                'table_location',
                scope.row.label === 'HOT'
                  ? 'tagHot'
                  : scope.row.label === 'URGENT'
                  ? 'tagUrgent'
                  : '',
              ]">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_tcompany" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ (scope.row.tcompany && scope.row.tcompany.name) || " -- " }}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_headUser" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ (scope.row.headUser && scope.row.headUser.realName) || " -- " }}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_addresses" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.addresses && scope.row.addresses.length">
              <span v-for="(item, index) in scope.row.addresses" :key="index">
                {{
                  item.name +
                    (index === scope.row.addresses.length - 1 ? "" : "、") ||
                  " -- "
                }}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 创建/编辑 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.dialog.temp.name" name="name" :obj="obj.dialog" :key="index" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.stage" name="stage" :obj="obj.dialog" :key="index">
          <template slot="custom_stage">
            <div class="stageClass">
              <el-row v-for="(item, index) in tabs" :key="index" class="rowClass dragTable" :draggable="item.isDarg">
                <el-col :span="4">&nbsp;</el-col>
                <el-col :span="20" class="left">
                  <el-checkbox v-model="item.isShow" :disabled="item.disabled">{{ item.label }}</el-checkbox>
                </el-col>
              </el-row>
            </div>
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem :formItem="obj.dialog.temp.range" name="range" :obj="obj.dialog" :key="index" />
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
import { customDropdownAction } from '@/mixins/index'
import { formatDate, compileTime } from '@/util/utils'
export default {
  name: 'position',
  mixins: [customDropdownAction],
  data () {
    return {
      tagName: '', // tabs 默认选中的值
      summary: {
        start: 0,
        end: 0
      },
      dialogTip: {},
      listMap: {
        address: [], // 地址 列表
        enterprise: [], // 企业 列表
        users: [] // 负责人 列表
      },
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: '',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
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
                label: '流程名称',
                placeholder: '请输入职位名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              companyId: {
                formType: 'select',
                label: '企业名',
                data: [],
                isShow: true
              },
              deptIds: {
                formType: 'select',
                label: '部门',
                data: [],
                isShow: true,
                multiple: true,
                'collapse-tags': true
              },
              headUid: {
                formType: 'select',
                label: '负责人',
                data: [],
                isShow: true
              },
              addressId: {
                formType: 'select',
                label: '工作地址',
                data: [],
                isShow: false,
                filterable: true
              },
              cityId: {
                isShow: true,
                label: '工作城市',
                formType: 'select',
                data: []
              },
              timeRequiredList: {
                formType: 'select',
                label: '工作性质',
                filterable: true,
                data: _var.workNature,
                isShow: true,
                multiple: true,
                'collapse-tags': true
              },
              deliveryTemplateId: {
                isShow: true,
                label: '投递模板',
                formType: 'select',
                data: [],
                filterable: true
              },
              processId: {
                isShow: true,
                label: '招聘流程',
                formType: 'select',
                data: [],
                filterable: true
              }
            },
            ruleForm: {
              name: '',
              companyId: '',
              deptIds: [],
              headUid: '',
              addressId: '',
              cityId: '',
              timeRequiredList: [],
              deliveryTemplateId: '',
              processId: '',
              recType: 0,
              jobSource: 0
            }
          },
          tableObj: {
            operation: {
              operation_width: 160
            },
            btnList: [
              {
                text: '暂停招聘',
                isShow: (item, obj) => {
                  return item.status === 1 && _fn.checkBtn('job/disable')
                },
                callback: this.stop
              },
              {
                text: '启动招聘',
                isShow: (item, obj) => {
                  return item.status === 0 && _fn.checkBtn('job/enable')
                },
                callback: this.start
              },
              {
                text: '编辑',
                isShow: (item, obj) => {
                  return _fn.checkBtn('job/update')
                },
                callback: this.editClick
              },
              {
                text: '删除',
                isShow: (item, obj) => {
                  return item.status === 0 && _fn.checkBtn('job/deleteJobData')
                },
                callback: this.deleteClick
              },
              {
                icon: true, // 更多操作
                isShow: (item, obj) => {
                  return this.tagName === 'start'
                },
                callback: this.table_moreOperation,
                list: [
                  {
                    value: 1,
                    label: '置顶',
                    isShow: (item, obj) => {
                      return _fn.checkBtn('job/stick_top')
                    }
                  },
                  {
                    value: 2,
                    label: '复制',
                    isShow: (item, obj) => {
                      return _fn.checkBtn('job/copy')
                    }
                  },
                  {
                    value: 3,
                    label: '添加候选人',
                    isShow: (item, obj) => {
                      return _fn.checkBtn('job/add_applicant')
                    }
                  }
                ]
              }
            ],
            fields: [
              {
                key: 'name',
                label: '职位名称',
                width: '150px',
                customMode: true
              },
              {
                key: 'tcompany',
                label: '所属企业',
                width: '150px',
                customMode: true
              },
              {
                key: 'createUser',
                label: '创建人',
                width: 'auto',
                customMode: row => {
                  return row.createUser ? row.createUser.realName || '--' : '--'
                }
              },
              {
                key: 'headUser',
                label: '负责人',
                width: '102',
                customMode: true
              },
              {
                key: 'cooperateUsers',
                label: '协作人',
                width: '102',
                customMode: row => {
                  const cooperateUsers = row.cooperateUsers || []
                  const len = cooperateUsers.length
                  if (!len) {
                    return '--'
                  }
                  return cooperateUsers.reduce((total, item, index, arr) => {
                    return total + item.realName + (index < len - 1 ? '、' : '')
                  }, '')
                }
              },
              {
                key: 'addresses',
                label: '门店名称',
                width: 'auto',
                customMode: true
              },
              {
                key: 'processingCount',
                label: '流程中人数',
                width: '130'
              },
              {
                key: 'status',
                label: '状态',
                width: '116',
                customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i, 'positionRecruitState')
              },
              {
                key: 'updateTime',
                label: '更新时间',
                width: '200',
                formatter: this._tcolFormat.formatterMinute
              }
            ]
          },
          dialog: {
            dialogWidth: '900px', // 是否显示label
            isShowLabel: true, // 是否显示label
            // labelWidth: '80px', // label宽度
            temp: {
              name: {
                label: '流程名称',
                placeholder: '请输入流程名称',
                maxlength: 40,
                isShow: true,
                style: {
                  width: '100%'
                }
              },
              stage: {
                formType: 'custom', // 自定义用到
                key: 'stage', // 自定义用到
                label: '流程阶段',
                placeholder: '请选择流程阶段',
                isShow: true
              },
              range: {
                label: '适用范围',
                isShow: true
              }
            },
            ruleForm: {
              name: '', // 流程名称 
              stage: '', // 流程阶段 
              range: '' // 适用范围
            },
            rules: {
              name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
              stage: [{ required: true, message: '请选择流程阶段', trigger: 'change' }],
              range: [{ required: true, message: '请输入淘汰理由', trigger: 'blur' }]
            }
          }
        }
      }),
      tableSelectedData: []
    }
  },
  beforeRouteLeave (to, form, next) {
    if (!to.name.match(/(positionEdit|positionInfo|deliveryEdit)/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        position: null
      })
    }
    next()
  },
  created () {
    const requestHandle = async () => {
      this.obj.searchModel.temp.deptIds.data = await _fn.commonBox('dept_public_dept_list') // 部门
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
        this.obj.searchModel.temp.deliveryTemplateId.data = data
      })
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
        this.obj.searchModel.temp.processId.data = data
      })
    }
    requestHandle()
    _fn.getPublicCombobox(res => {
      this.obj.searchModel.temp.cityId.data = res
    }, { comboType: 9 }, true)
    _fn.getAllAddress(data => { this.obj.searchModel.temp.addressId.data = data }, {}, true) // 获取地址 
    _fn.getAllCompony(data => {
      data.unshift({
        label: '全部',
        value: ''
      })
      this.obj.searchModel.temp.companyId.data = data
    }, {}, true) // 所属企业
    _fn.getRealNameList(data => {
      this.obj.searchModel.temp.headUid.data = data.map(item => ({
        label: item.realName,
        value: item.id
      }))
    }, {}, false) // 负责人
    const { keepAlive } = this.$store.state.keep_alive
    const { http, searchModel, tableObj } = this.obj
    const keepAliveRuleForm = keepAlive.position ? keepAlive.position.ruleForm : searchModel.ruleForm
    const keepAlivePager = keepAlive.position ? keepAlive.pager : {
      pageNo: 1
    }
    this.tagName = keepAlive.position ? keepAlive.position.tagName : 'start'
    this.obj = Object.assign({}, this.obj, {
      http: {
        ...http,
        queryUrl: 'job_list'
      },
      searchModel: {
        ...searchModel,
        ruleForm: { ...keepAliveRuleForm }
      },
      tableObj: {
        ...tableObj,
        pager: {
          ...tableObj.pager,
          ...keepAlivePager
        }
      }
    })
  },
  computed: {
    batchActionBtnDisabled () {
      return !!this.tableSelectedData.length
    }
  },
  methods: {
    tabsChangeHanle (val) {
      const { searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: {
            name: '',
            companyId: '',
            deptIds: [],
            headUid: '',
            addressId: '',
            cityId: '',
            timeRequiredList: [],
            deliveryTemplateId: '',
            processId: '',
            recType: 0,
            jobSource: 0
          }
        },
        tableObj: {
          ...tableObj,
          pager: {
            ...tableObj.pager,
            pageNo: 1
          }
        }
      })
      this.$nextTick(() => {
        this.$refs.page.load()
      })
    },
    getJobPublicCount () {
      const { searchModel } = this.obj
      this._api.job_public_count({
        queryParam: {
          ...searchModel.ruleForm,
          state: this.tagName === 'start' ? 1 : 0
        }
      }).then(res => {
        const { recruitingCnt, suspendCnt } = res.data
        this.summary = {
          start: recruitingCnt,
          end: suspendCnt
        }
      })
    },
    loadBefor (param) { // 查询前添加条件
      param.queryParam.state = this.tagName === 'start' ? 1 : 0
      return param
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      const ops = this.obj.tableObj.operation
      if (this.tagName === 'end') {
        // 已经暂停的职位--宽度大点
        ops.operation_width = 180
      }
      this.getJobPublicCount()
      this.$store.dispatch('keep_alive/setKeepAlive', {
        position: {
          tagName: this.tagName,
          ruleForm
        },
        pager: {
          pageNo: pager.pageNo,
          pageSize: pager.pageSize
        }
      })
      fn && fn(data.list)
    },
    resetAfter (tempSearch, callback) {
      const { searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: {
            name: '',
            companyId: '',
            deptIds: [],
            headUid: '',
            addressId: '',
            cityId: '',
            timeRequiredList: [],
            deliveryTemplateId: '',
            processId: '',
            recType: 0,
            jobSource: 0
          }
        },
        tableObj: {
          ...tableObj,
          pager: {
            ...tableObj.pager,
            pageNo: 1
          }
        }
      })
      this.$nextTick(() => {
        callback()
      })
    },
    table_location (item) { // 查询详细
      _fn.toLocation({ name: 'positionInfo', params: { id: item.id } }) // -> /user/123
    },
    table_location_add (item) { // 新增、编辑
      _fn.toLocation({ name: 'positionEdit', params: { id: encodeURI(JSON.stringify({ id: (item && item.id) || '0' })) } }) // -> /user/123
    },
    table_moreOperation (val, row, item) { // 更多操作
      if (val === 1) { // 置顶
        this.stickTop(row)
      } else if (val === 2) { // 复制
        this.copyClick(row)
        // this.stickTop(row)
      } else if (val === 3) { // 添加候选人
        _fn.toLocation({
          name: 'deliveryEdit',
          params: {
            id: '0'
          },
          query: {
            jobId: row.id
          }
        })
      }
      console.info('更多操作', val)
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    // 批量导出提交
    allExprotSubmit () {
      let obj = this.$refs['position-table'].getSelected()
      _fn.downLoad('job_export_jobs', { jobIds: obj.idx }, '职位管理列表' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss'))
      console.info('下载职位管理列表')
    },
    commandClick (val) {
      switch (val) {
        case '1':
          this.allExprotSubmit()
          break
        case '2':
          const jobIds = this.tableSelectedData.map(item => item.id)
          if (jobIds.length) {
            this._api.job_stick_top({
              jobIds
            }).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              this.$refs.page.load()
            })
          }
          break
        case '3':
          console.log(this.tableSelectedData, '+++++++++')
          this.deleteClick(this.tableSelectedData)
          break
        default:
          break
      }
    },
    editClick (data) {
      console.info('editAfter')
      // let dia = {
      //   title: '提醒',
      //   tbody: `有候选人证在使用该招聘流程，暂无法编辑修改。`,
      //   titleSve: false,
      //   isCancel: false, // 是否显示取消按钮
      //   confirmText: '我知道了',
      //   confirmCallback: () => {
      //     this.dialogTip.show = false
      //   },
      //   show: true
      // }
      // this.dialogTip = dia
      this.table_location_add(data)
    },
    deleteClick (data) {
      data = _fn.isArray(data) ? data : [data]
      let arrayContent = []
      data.map(item => {
        arrayContent.push(item.id)
      })
      let params = { jobIdList: arrayContent }
      let dia = {
        title: '删除职位',
        tbody: `您是否确认删除 <span style="color:#4a84ff;">${arrayContent.length === 1 ? data[0].name : '这些'}</span> 职位,删除后无法恢复,请慎重操作。`,
        titleSve: true,
        isCancel: true, // 是否显示取消按钮
        // confirmText: '我知道了',
        confirmCallback: () => {
          this._api.job_deleteJobData(params).then(res => {
            this.notify(res.msg || '操作成功', 'success')
            this.dialogTip.show = false
            this.$refs.page.load()
          })
        },
        show: true
      }
      this.dialogTip = dia
    },
    commitAfter (data) {
      console.info('提交前的数据', data, this.tabs)
    },
    copyClick (data, callback) { // 复制
      // this.dialogTip.title = '提示'
      // this.dialogTip.tbody = `复制成功`
      // this.dialogTip.show = true
      // console.log(data)
      // localStorage.setItem('zp_copy_click', JSON.stringify(data))
      this.notify('操作成功', 'success')
      _fn.toLocation({ name: 'positionEdit', params: { id: encodeURI(JSON.stringify({ id: '0', copyId: data.id })) } })
    },
    stickTop (row) { // 置顶
      let param = { jobIds: [row.id] }
      this._api.job_stick_top(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialogTip.show = false
        this.$refs.page.load()
      })
    },
    start (data) { // 启用
      let self = this
      let dia = {
        id: data.id,
        title: '职位启用招聘',
        tbody: `您是否确认启动招聘 <span style="color:#4a84ff;">${data.name}</span> 职位？启动招聘的职位将会同步从渠道上架展示`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.job_enable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
            self.getJobPublicCount()
          })
        }
      }
      this.dialogTip = dia
    },
    stop (data) { // 停用
      let self = this
      let dia = {
        id: data.id,
        title: '职位暂停招聘',
        tbody: `您是否确认暂停招聘 <span style="color:#4a84ff;">${data.name}</span> 职位？暂停招聘的职位将会同步从渠道下架展示`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.job_disable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
            self.getJobPublicCount()
          })
        }
      }
      this.dialogTip = dia
    }
  }
}
</script>
<style lang="less" scoped>
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
/deep/.searchForm .el-form-item {
  margin-bottom: 10px !important;
}
</style>
