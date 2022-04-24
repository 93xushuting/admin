<template>
  <!-- 栏目管理 -->
  <zp-page :obj="obj" ref="page">
    <!-- <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label: '消息列表', value: 'list'}]" /> -->
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.type" name="type" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button @click="updateReadStatus('1')">标记为已读</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable @handleSelectionChange="handleSelectionChange" slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_type" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            <span style="line-height: 40px">
              <span>{{ scope.row.type | infoTypeFilter }}</span>
              <i v-if="!scope.row.readStatus" class="iconfont icondian" style="color: #f23030; font-size: 20px"></i>
            </span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_level" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            <span class="table_location" @click="table_location(scope)">{{scope.row.level}}</span>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 查看 -->
    <customMailTips ref="custom_mailTips" />
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
import customMailTips from '@c/custom/mailTips'
export default {
  name: 'choice',
  components: { customMailTips },
  data () {
    return {
      tagName: 'list', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'stationMessage_getStationMessageList',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              type: {
                formType: 'select',
                label: '消息类型',
                placeholder: '请选择消息类型',
                data: _var.infoType,
                isShow: true
              }
            },
            ruleForm: {
              type: ''
            }
          },
          tableObj: {
            operation: {
              // 全选
              operation_width: 180
            },
            btnList: [
              {
                text: '查看',
                isShow: true,
                callback: this.checkout
              }
            ],
            fields: [
              {
                key: 'type',
                label: '消息类型',
                width: 'auto',
                customMode: true
              },
              {
                key: 'applicationName',
                label: '候选人'
              },
              {
                key: 'contactName',
                label: '联系人'
              },
              {
                key: 'bussinessTime',
                label: '任务时间'
              },
              {
                key: 'sendTime',
                label: '发送时间'
              },
              {
                key: 'readStatus',
                label: '是否已读',
                width: '120',
                customMode: (row) => {
                  return row.readStatus ? '已读' : '未读' || '--'
                }
              }
            ]
          }
        }
      }),
      tableSelectedData: []
    }
  },
  beforeRouteLeave (to, form, next) {
    if (!to.name.match(/(choiceEdit|choiceDetail)/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        information: null
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
  filters: {
    infoTypeFilter (val) {
      return _var.infoType__global(val) || '--'
    }
  },
  // mounted () {
  // },
  methods: {
    // 表格选中的数据
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    checkout (item) {
      let mailTips = this.$refs.custom_mailTips
      mailTips.show(item)
    },
    updateReadStatus (num) {
      let ids = []
      if (num === '2') {
        ids.push(this.obj.dialog.ruleForm.id)
      } else {
        ids = this.tableSelectedData.filter(item => !item.readStatus).map(item => item.id)
      }
      let param = {
        type: ids.length ? 0 : 1,
        ids: ids
      }
      this._api.stationMessage_updateReadStatus(param).then(res => {
        this.obj.dialog.show = false
        this.$refs.page.load()
      })
    },
    load () {
      this.$refs.page.load()
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        information: { ruleForm },
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
            type: ''
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
</style>
