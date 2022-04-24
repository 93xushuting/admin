<template>
  <!-- 招聘流程 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`短信任务`,value: 'start'}]" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="true">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.missionName" name="missionName" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.createUserName" name="createUserName" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.sendStatus" name="sendStatus" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.smsName" name="smsName" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item v-if="_fn.checkBtn('smsTask/public/getSmsTaskDetail')">
          <zp-button class="zp-btn-primary" @click="this.toAdd">新增短信任务</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_missionName" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{
              table_location: scope.row.sendStatus !== 3
            }" @click="toSee(scope.row)">{{scope.row.missionName}}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_sendStatus" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="iconfont icondian" style="color:#999999;font-size:22px;" v-if="scope.row.sendStatus === 1" />
            <span style="color:#999999;" v-if="scope.row.sendStatus === 1">待发送</span>
            <i class="iconfont icondian" style="color:#999999;font-size:22px;" v-if="scope.row.sendStatus === 4" />
            <span style="color:#999999;" v-if="scope.row.sendStatus === 4">
              待发送<span style="color:#26334F;"> ({{scope.row.cornTime}}) </span>
            </span>
            <i class="iconfont icondian" style="color:#0CD4A2;font-size:22px;" v-if="scope.row.sendStatus === 2" />
            <span style="color:#0CD4A2;" v-if="scope.row.sendStatus === 2">已发送</span>
            <i class="iconfont icondian" style="color:#FFB61A;font-size:22px;" v-if="scope.row.sendStatus === 3" />
            <span style="color:#FFB61A;" v-if="scope.row.sendStatus === 3">发送中</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_successRate" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#26334F;" v-if="scope.row.successRate === 100">{{scope.row.successRate + '%'}}</span>
            <span style="color:#4A84FF;" v-else>{{scope.row.successRate + '%'}}</span>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <zp-tipDialog :obj="dialogTip" width="504px" />
    <!-- 定时发送时间 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogSendTime" ref="dialogForm" class="dialogDelete">
      <template slot="form">
        <zp-dynamicFormItem :formItem="dialogSendTime.temp.move" name="move" :obj="dialogSendTime" />
        <div style="text-align:center;">系统将于 {{dialogSendTime.ruleForm.move || '年-月-日 时-分'}} 执行短信任务。</div>
      </template>
    </zp-dynamicDialog>
  </zp-page>
</template>
<script>
export default {
  name: 'messageTask',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'smsTask_taskList'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '100px', // label宽度
            inline: true,
            temp: {
              missionName: {
                formType: 'input',
                label: '模板名称',
                placeholder: '请输入任务名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              createUserName: {
                formType: 'select',
                label: '创建人',
                data: [],
                isShow: true
              },
              sendStatus: {
                formType: 'select',
                label: '发送执行状态',
                data: _var.taskStatus,
                isShow: true
              },
              smsName: {
                formType: 'select',
                label: '短信模板',
                data: [],
                isShow: true
              }
            },
            ruleForm: {
              missionName: '',
              sendStatus: '',
              createUserName: '',
              smsName: ''
            }
          },
          tableObj: {
            operation: {
              // 全选
              selection: false,
              operation_width: 160
            },
            btnList: [
              {
                text: '报告',
                isShow: (item) => item.sendStatus === 2 && _fn.checkBtn('smsTask/taskDetail'),
                callback: this.toSee
              },
              {
                text: '详情',
                isShow: (item) => {
                  return (item.sendStatus === 4 || item.sendStatus === 1) && _fn.checkBtn('smsTask/taskDetail')
                },
                callback: this.toSee
              },
              {
                text: '发送',
                isShow: (item) => {
                  return (item.sendStatus === 4 || item.sendStatus === 1) && _fn.checkBtn('smsTask/sendTaskSmss/sendNowSmsTask')
                },
                callback: this.toSend
              },
              {
                index: 1,
                icon: true, // 点击图按下拉 -- 更多操作
                isShow: (item) => {
                  return item.sendStatus === 1
                },
                callback: this.gotoCallbackMore,
                list: [
                  {
                    value: 100,
                    label: '定时发送',
                    isShow: () => _fn.checkBtn('smsTask/updateCornTimeSmsTask'),
                    callback: this.toSendTiem
                  },
                  { value: 101, label: '编辑', isShow: true },
                  {
                    value: 102,
                    label: '删除',
                    isShow: () => _fn.checkBtn('smsTask/deleteSmsTask'),
                    class: 'isDelete'
                  }
                ]
              },
              {
                text: '删除',
                isShow: (item) => _fn.checkBtn('smsTask/deleteSmsTask') && item.sendStatus === 4,
                callback: this.toDel,
                class: 'isDelete'
              }
            ],
            fields: [
              { key: 'missionName', label: '任务名称', customMode: true, width: '200px' },
              { key: 'sendStatus', label: '发送状态', customMode: true, width: '250px' },
              { key: 'smsSupplierTemplateName', label: '短信模板' },
              { key: 'snedUserNums', label: '发送人数' },
              { key: 'successRate', label: '成功率', customMode: true },
              { key: 'createUsername', label: '创建人' },
              { key: 'completionTime', label: '完成发送时间' },
              { key: 'createDate', label: '创建时间' }
            ]
          }
        }
      }),
      dialogSendTime: { // 发送时间
        tipName: '',
        title: '定时发送任务',
        dialogFormCenter: false, // 所有内空居中显示
        dialogWidth: '420px',
        isShowLabel: true, // 是否显示label
        // labelWidth: '80px', // label宽度
        show: false,
        temp: {
          move: {
            formType: 'datetime',
            label: '发送时间',
            isShow: true,
            'value-format': 'yyyy-MM-dd HH:mm',
            format: 'yyyy-MM-dd HH:mm',
            style: { width: '250px' },
            popperClass: 'timed-task-wrapper',
            pickerOptions: {
              disabledDate: function (date) {
                return date.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
              }
            }
          }
        },
        ruleForm: { move: '' },
        rules: {
          move: [{ required: true, message: '请选择发送时间', trigger: 'change' }]
        },
        callback: null
      }
    }
  },
  mounted () {
    this.taskListInitParams()
  },
  methods: {
    loadAfter (data) {
      this.obj.tableObj.pager.pageTotal = data.pageInfoTMessageTaskListVO.total
      this.obj.tableObj.data = data.pageInfoTMessageTaskListVO.list
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    toAdd () {
      _fn.toLocation({ name: 'messageTaskEdit', params: { id: '0' } }) // -> /user/123
    },
    toSee (item) {
      if (item.sendStatus === 3) {
        return
      }
      _fn.toLocation({ name: 'messageTaskInfo', params: { id: item.id } }) // -> /user/123
    },
    toEdit (item) {
      _fn.toLocation({ name: 'messageTaskEdit', params: { id: item.id } }) // -> /user/123
    },
    toDel (item) {
      this.isAddShow('删除任务', `您是否确认删除 <span style="color: #4a84ff">${item.missionName}</span> 短信任务？`, '', () => {
        this.dialogTip.show = false
        this._api.smsTask_deleteSmsTask({ smsTaskId: item.id }).then((res) => {
          this.notify(res.msg || '操作成功', 'success')
          this.dialogTip.show = false
          this.$refs.page.load()
        })
      })
    },
    toSend (item) { // 发送
      this.isAddShow('发送确认', `您是否确认立即执行 <span style="color: #4a84ff">${item.missionName}</span> 短信任务？`, '', () => {
        this.dialogTip.show = false
        this._api.smsTask_sendTaskSmss_sendNowSmsTask({ smsTaskId: item.id }).then((res) => {
          this.notify(res.msg || '操作成功', 'success')
          this.dialogTip.show = false
          this.$refs.page.load()
        })
      })
    },
    toSendTiem (item) { // 定时发送
      let self = this
      this.dialogSendTime.show = true
      this.$nextTick(() => {
        this.dialogSendTime.callback = (res, cb) => {
          let cornTime = new Date(this.dialogSendTime.ruleForm.move).getTime()
          this._api.smsTask_updateCornTimeSmsTask({ smsTaskId: item.id, cornTime: cornTime }).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogSendTime.show = false
            self.$refs.page.load()
          })
        }
      })
      console.info(item)
    },
    gotoCallbackMore (value, row, item) { // 更多
      if (value === 100) { // 定时发送
        this.toSendTiem(row, item)
      } else if (value === 101) { // 编辑
        this.toEdit(row, item)
      } else if (value === 102) { // 删除
        this.toDel(row, item)
      }
    },
    isAddShow (title = '', message = '', confirmText = '', fn) {
      let self = this
      let dia = {
        title: title,
        tbody: message,
        titleSve: true,
        show: true,
        confirmText: confirmText,
        isConfirm: _fn.isFunction(fn), // 是否显示取消按钮
        isCancel: confirmText !== '我知道了', // 是否显示取消按钮
        confirmCallback: fn
      }
      this.dialogTip = dia
    },
    taskListInitParams () {
      this._api.smsTask_taskListInitParams({}).then((res) => {
        if (res && res.data) {
          if (res.data.smsNameList && res.data.smsNameList.length) {
            this.obj.searchModel.temp.smsName.data = res.data.smsNameList.map((item) => {
              return { label: item, value: item }
            })
          }
          if (res.data.createUserNameList && res.data.createUserNameList.length) {
            this.obj.searchModel.temp.createUserName.data = res.data.createUserNameList.map((item) => {
              return { label: item, value: item }
            })
          }
        }
      })
    }
  }
}
</script>
