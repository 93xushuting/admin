<template>
  <!-- 栏目管理 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label: '消息设置', value: 'meSetting'}]" />
    <!-- 查询条件 -->
    <!-- <zp-condition slot="condition" :obj="obj">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.companyId" name="companyId" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button @click="this.toAddContent">标记为已读</zp-button>
        </el-form-item>
      </template>
    </zp-condition> -->
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_toast" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.toast"
              active-text="开"
              inactive-text="关"
              :active-value="1"
              :inactive-value="0"
              active-color="#4A84FF"
              inactive-color="#CCCCCC"
              @change="toast(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_timeSet" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width">
          <template slot-scope="scope">
            <span>{{ scope.row.timeSet || '--' }}</span>
            <zp-button v-if="scope.row.timeSet" type="text" @click="checkout(scope.row)">设置</zp-button>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 查看 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <div slot="dialogTips" class="tips"><zp-icons />提前一小时，则输入1；提前两天，则输入48</div>
      <template slot="form">
        <p v-if="obj.dialog.ruleForm.type === 1">当有面试安排时，提前多长时间提醒</p>
        <p v-else>当有员工入职时，提前多少时间提醒</p>
        <el-form-item label="设置为">
          <el-input v-model.number="obj.dialog.ruleForm.timeSet" placeholder="请输入" style="width:100%">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
export default {
  name: 'choice',
  data () {
    return {
      tagName: 'meSetting', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'stationMessage_getStationMessageSetList',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          tableObj: {
            searchModel: {
              temp: {}
            },
            operation: {
              selection: false, // 不显示操作列
              operation_width: 180,
              // 操作列  
              operation: false
            },
            btnList: [],
            fields: [
              {
                key: 'type',
                label: '提醒项',
                width: '180',
                customMode: (row) => {
                  return _var.infoType__global(row.type) || '--'
                }
              },
              {
                key: 'ruleInfo',
                label: '规则',
                width: '400'
              },
              {
                key: 'toast',
                label: '是否toast提醒',
                width: '180',
                customMode: true
              },
              {
                key: 'timeSet',
                label: '参数设置',
                customMode: true
              },
              {
                key: 'updateTime',
                label: '修改时间'
              },
              {
                key: 'updateUsername',
                label: '修改人'
              }
            ]
          },
          dialog: {
            slot: 'Tips',
            show: false,
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '660px',
            isShowLabel: true, // 是否显示label
            labelWidth: '60px', // label宽度
            temp: {},
            ruleForm: {
              timeSet: ''
            },
            rules: {
              timeSet: [{ required: true, message: '请输入时间', trigger: 'blur' }]
            },
            callback: this.commitTimeSet
          }
        }
      }),
      tableSelectedData: []
    }
  },
  beforeRouteLeave (to, form, next) {
    if (!to.name.match(/(choiceEdit|choiceDetail)/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        choice: null
      })
    }
    next()
  },
  created () {
    const { keepAlive } = this.$store.state.keep_alive
    const { http, searchModel, tableObj } = this.obj
    const keepAliveRuleForm = keepAlive.choice ? keepAlive.choice.ruleForm : searchModel.ruleForm
    const keepAlivePager = keepAlive.choice ? keepAlive.pager : {
      pageNo: 1
    }
    this.obj = Object.assign({}, this.obj, {
      http: {
        ...http
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
  // mounted () {
  // },
  methods: {
    loadAfter (data, fn) {
      fn && fn(data)
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    checkout (item) {
      console.log('opopopop', item)
      let title
      if (item.type === 0) {
        title = '新简历提醒'
      }
      if (item.type === 1) {
        title = '面试提醒设置'
      }
      if (item.type === 2) {
        title = '入职提醒设置'
      }
      this.obj.dialog.show = true
      this.obj.dialog.title = title
      this.obj.dialog.ruleForm = {
        id: item.id,
        type: item.type,
        toast: item.toast,
        timeSet: ''
      }
    },
    commitTimeSet () {
      let param = this.obj.dialog.ruleForm
      this._api.stationMessage_updateTimeSet(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.obj.dialog.show = false
        this.$refs.page.load()
      })
    },
    toast (data) {
      let self = this
      let dia = {
        id: data.id,
        title: 'toast提醒开关设置',
        tbody: `确定${data.toast ? '打开' : '关闭'}提醒？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        cancelCallback: function () {
          self.dialogTip.show = false
          self.$refs.page.load()
        },
        confirmCallback: function () {
          let param = { id: data.id, type: data.type, toast: data.toast }
          this._api.stationMessage_updateForce(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  margin: 6px 0px;
  span:last-child {
    flex: 1;
    color:#69707F;
  }
  .widths {
    width: 120px;
    padding: 0 12px 0 0;
    text-align: right;
    color: #26334F;
    box-sizing: border-box;
  }
}
.tips {
  width: 100%;
  height: 36px;
  line-height: 36px;
  background: rgba(74,132,255,0.04);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: -12px;
  svg {
    margin: 0px 10px;
  }
}
.contentTips {
  font-size: 16px;
  color: #26334F;
  min-width: 500px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  svg {
    margin: 0px 10px;
  }
}
.dialogContent {
  p {
    color: #26334F;
    line-height: 14px;
  }
  span {
    display: block;
    color: #69707F;
    line-height: 22px;
  }
}
/deep/ .dialogFormCenter {
  text-align: center;
}
/deep/ .el-table .cell.el-tooltip {
  max-width: 300px;
}
</style>
