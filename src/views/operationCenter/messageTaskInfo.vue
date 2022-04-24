<template>
  <!--短信任务 编辑 -->
  <zp-page :obj="obj" ref="page">
    <zp-bread :obj="obj" />
    <div class="messageTaskInfo">
      <div class="left">
        <div>任务名称：<span>{{obj.tableObj.obj.missionName || '--'}}</span></div>
        <div>
          状态：<span>{{obj.tableObj.obj.sendStatus === 1 ?'待发送' : obj.tableObj.obj.sendStatus === 2 ?'已发送' : obj.tableObj.obj.sendStatus === 3 ?'发送中' : '待发送-定时'}}</span>
        </div>
        <div>成功率：<span>{{obj.tableObj.obj.successRate + '%'}}</span></div>
        <div>短信模板：<span>{{obj.tableObj.obj.smsSupplierTemplateName || '--'}}</span></div>
        <div>创建人：<span>{{obj.tableObj.obj.createUsername || '--'}}</span></div>
        <div>创建时间：<span>{{obj.tableObj.obj.createDate || '--'}}</span></div>
        <div>完成时间：<span>{{obj.tableObj.obj.updateDate || '--'}}</span></div>
      </div>
      <div class="center">
        <div class="title">
          <el-row>
            <el-col :span="8">
              <div class="name">发送人数</div>
              <div class="count">{{obj.tableObj.obj.totalNums || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="name">发送成功</div>
              <div class="count">{{obj.tableObj.obj.totalSuccessNums || '--'}}</div>
            </el-col>
            <el-col :span="8">
              <div class="name">发送失败</div>
              <div class="count">{{obj.tableObj.obj.faileNums || '--'}}</div>
            </el-col>
          </el-row>
        </div>
        <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe ref="messageTaskInfoTable">
          <template slot="customMode_code" slot-scope="props">
            <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <i v-if="scope.row.code === '200'" class="iconfont icondian" style="color:#0CD4A2;font-size:22px;"></i>
                <span v-if="scope.row.code === '200'" style="font-size: 14px;color: #0CD4A2;">发送成功</span>
                <i v-if="scope.row.code === '500'" class="iconfont icondian" style="color:#F73E3E;font-size:22px;"></i>
                <span v-if="scope.row.code === '500'" style="font-size: 14px;color: #F73E3E;">发送失败</span>
                <span v-if="scope.row.code === '--'">--</span>
              </template>
            </el-table-column>
          </template>
        </zp-dynamicTable>
      </div>
      <div class="editFooter">
        <!-- { label: '待发送', value: 1 },
        { label: '已发送', value: 2 },
        { label: '发送中', value: 3 },
        { label: '待发送-定时', value: 4 } -->

        <zp-button v-if="obj.tableObj.obj.sendStatus === 1" @click="toEdit">编辑</zp-button>
        <zp-button v-if="obj.tableObj.obj.sendStatus === 1" @click="toSendTiem">定时发送</zp-button>
        <zp-button v-if="obj.tableObj.obj.sendStatus === 4" @click="toDel">删除</zp-button>
        <zp-button v-if="obj.tableObj.obj.sendStatus === 1 || obj.tableObj.obj.sendStatus === 4" class="zp-btn-primary" @click="toSend">发送</zp-button>
        <zp-button class="zp-btn-primary" @click="toPage" v-if="obj.tableObj.obj.sendStatus === 2">返 回</zp-button>
      </div>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
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
// import positionList from './positionList'
export default {
  name: 'messageTaskInfo',
  // components: { positionList },
  data () {
    return {
      dialogTip: {},
      idx: this.$route.params.id,
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'smsTask_taskDetail'
          },
          breadcrumb: {
            title: this.$route.meta.name || '用户管理'
          },
          tableObj: {
            obj: {},
            operation: {
              // 全选
              selection: false,
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
              { key: 'mobile', label: '手机号', width: 'auto' },
              { key: 'code', label: '发送状态', width: 'auto', customMode: true },
              { key: 'failReason', label: '失败原因', width: 'auto' },
              { key: 'createDate', label: '发送时间', width: 'auto' }
            ],
            data: []
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
          move: { formType: 'datetime', label: '发送时间', isShow: true, 'value-format': 'yyyy-MM-dd HH:mm', format: 'yyyy-MM-dd HH:mm', style: { width: '250px' } }
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
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      this.$nextTick(() => {
        if (this.idx > 0) {

        }
      })
    },
    loadBefor (param) {
      param.queryParam.messageTaskId = this.idx
      console.info(param)
      return param
    },
    loadAfter (data) {
      this.obj.tableObj.obj = data
      this.obj.tableObj.data = (data.tmessageTemplateLogVOByPages && data.tmessageTemplateLogVOByPages.list) || []

      console.info('11111111', data)
    },
    toDel () {
      let self = this
      let dia = {
        title: '删除任务',
        tbody: `您是否确认删除 <span style="color:#4a84ff;">${this.obj.tableObj.obj.missionName}</span> 短信任务？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          this._api.smsTask_deleteSmsTask({ smsTaskId: self.idx }).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.toPage()
          })
        }
      }
      this.dialogTip = dia
    },
    toEdit () {
      _fn.toLocation({ name: 'messageTaskEdit', params: { id: this.idx } }) // -> /user/123
    },
    toPage () {
      _fn.toLocation({ name: 'messageTask' }) // -> /user/123
    },
    toSendTiem (item) { // 定时发送
      let self = this
      this.dialogSendTime.show = true
      this.$nextTick(() => {
        this.dialogSendTime.callback = (res, cb) => {
          let cornTime = new Date(this.dialogSendTime.ruleForm.move).getTime()
          this._api.smsTask_updateCornTimeSmsTask({ smsTaskId: this.idx, cornTime: cornTime }).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogSendTime.show = false
            self.toPage()
          })
        }
      })
      console.info(item)
    },
    toSend () { // 立即发送
      this._api.smsTask_sendTaskSmss_sendNowSmsTask({ smsTaskId: this.idx }).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.$refs.page.load()
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/color.less';
.breadcrumb{
    line-height: 47px !important;
    margin-bottom: 0;
  }
.messageTaskInfo{
  overflow-y: auto;
  .left{
    width: 282px;
    height: 100vh;
    position: fixed;
    margin: 0 0 0 20px;
    border-right: 1px solid #EAEAEA;
    div:first-child{
      margin-top:20px;
    }
    div{
      font-size: 14px;
      color: #26334F;
      margin-bottom:20px;
    }
    span{
      font-size: 14px;
      color: #69707F;
    }
  }
  .center{
    flex:1;
    margin: -0 0 0 310px;
    .title{
      background: #F7F8FA;
      height: 84px;
      text-align: center;
      margin: 0 20px 16px;
      .name{
        margin-top: 20px;
        font-size: 14px;
        color: #26334F;
        font-family: 'PingFangSC-Regular';
      }
      .count{
        font-size: 32px;
        color: #23304D;
        font-family: 'Helvetica-Bold';
      }
    }
  }
}
    
</style>
