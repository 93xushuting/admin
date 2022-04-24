<template>
  <!--短信任务 编辑 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <div class="contentEdit">
      <div class="contentEdit-body">
        <div class="left">
          <el-steps direction="vertical" :active="activeSteps">
            <el-step title="短信设置" description="选择短信模板"></el-step>
            <el-step title="推送人员" description="确认推送人员"></el-step>
          </el-steps>
        </div>
        <div class="center">
          <el-form :model="searchModel.ruleForm" :rules="searchModel.rules" ref="ruleForm" label-width="120px" class="infoForm"
            style="margin:0 0 100px;">
            <template v-if="activeSteps === 1">
              <zp-dynamicFormItem :formItem="searchModel.temp.missionName" name="missionName" :obj="searchModel" />
              <zp-dynamicFormItem :formItem="searchModel.temp.smsSupplierTemplateNo" name="smsSupplierTemplateNo" :obj="searchModel" />
              <zp-dynamicFormItem :formItem="searchModel.temp.temp" name="temp" :obj="searchModel">
                <template slot="custom_temp">
                  <div class="smsTemplate">
                    <div>
                      {{smsSupplierTemplateMap[searchModel.ruleForm.smsSupplierTemplateNo]}}
                    </div>
                  </div>
                </template>
              </zp-dynamicFormItem>
            </template>
            <template v-if="activeSteps ===2">
              <zp-dynamicFormItem :formItem="searchModel.temp.fromType" name="fromType" :obj="searchModel" v-if="queryType === 0" />
              <template v-if="searchModel.ruleForm.fromType === 0 || queryType === 1">
                <div style="padding:0 22px;">
                  <positionListTemp :selectedData="searchModel.ruleForm.mobilelist" ref="positionListTemp" />
                </div>
              </template>
              <template v-else>
                <div class="file">
                  <!-- {{searchModel.ruleForm.file && searchModel.ruleForm.file.fileList}} -->
                  <zp-dynamicFormItem :formItem="searchModel.temp.file" name="file" :obj="searchModel">
                    <template v-slot:custom_file>
                      <zp-upload :limit="1" :autoUpload="true" :formModel.sync="searchModel.ruleForm.file" :show-file-list="false"
                        ref="upload-candidate" />
                      <zp-button type="text" @click="downloadTemp"> <i class="el-icon-download"></i>下载模板 </zp-button>
                      <div class="upload-success-list">
                        <div class="upload-success-list-item" v-for="item in (searchModel.ruleForm.file && searchModel.ruleForm.file.fileList)"
                          :key="item.uid">
                          <i class="el-icon-s-claim"></i>
                          <span class="file-name">{{item.name && item.name.replace(/(.*\/)*([^.]+).*/ig, "$2")}}</span>
                          <span class="file-suffix">.{{item.name &&item.name.replace(/.+\./,"")}}</span>
                          <div class="action-btn">
                            <zp-button type="text" @click="delItem(item)">
                              <i class="iconfont iconshanchu"></i>
                            </zp-button>
                          </div>
                        </div>
                      </div>
                    </template>
                  </zp-dynamicFormItem>
                </div>
              </template>
            </template>
          </el-form>

        </div>
        <div class="right">

        </div>
      </div>
      <div class="editFooter">
        <zp-button @click="prevPage" v-if="activeSteps === 2">上一步</zp-button>
        <zp-button @click="save(-1)" v-if="activeSteps === 2">保存暂不推送</zp-button>
        <zp-button @click="save(1)" class="zp-btn-primary" v-if="activeSteps === 2">立即推送</zp-button>
        <zp-button @click="nextPage" class="zp-btn-primary" v-if="activeSteps === 1">下一步</zp-button>
        <zp-button @click="toPage" v-if="activeSteps === 1">取 消</zp-button>
      </div>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
import { formatDate } from '@/util/utils'
import positionListTemp from './positionListTemp'
export default {
  name: 'contentEdit',
  components: { positionListTemp },
  data () {
    return {
      queryType: 0, // 是否是人才库邀约模板 1 是 0 否
      idx: this.$route.params.id,
      smsSupplierTemplateMap: {},
      activeSteps: 1,
      obj: {
        breadcrumb: {}
      },
      dialogTip: {},
      searchModel: {
        isShowLabel: true, // 是否显示label
        inline: true,
        labelWidth: '82px', // label宽度
        temp: {
          missionName: { formType: 'input', label: '任务名称', isShow: true, filterable: true, maxlength: 20, limit: true },
          smsSupplierTemplateNo: { formType: 'select', label: '短信模板', isShow: true, data: [] },
          temp: { formType: 'custom', label: '模板示例', isShow: true, key: 'temp' },
          fromType: { formType: 'select', label: '推送人员', isShow: true, data: _var.mobilelistTemp },
          file: { formType: 'custom', key: 'file', label: '上传文件', isShow: true }
        },
        ruleForm: {
          missionName: '', // 任务名称
          smsSupplierTemplateNo: '', // 短信模板
          temp: '', // 模板示例
          mobilelist: [], // 下拉框
          fromType: 0, // 推送人员
          file: {
            // [ { "status": "ready", "name": "短信任务模板2020-11-22 18：08：00.xlsx", "size": 8799, "percentage": 0, "uid": 1606045680123, "raw": { "uid": 1606045680123 } } ]
            fileList: []
          },
          smsTaskSendFlag: 1 // 1 立即推送 -1 保存暂不推送
        },
        rules: {
          missionName: [{ message: '请输入任务名称', required: true, trigger: 'blur' }],
          smsSupplierTemplateNo: [{ message: '请选择短信模板', required: true, trigger: 'change' }],
          fromType: [{ message: '请选择推送人员', required: true, trigger: 'change' }]
        }
      }
    }
  },
  watch: {

  },
  created () {

  },
  mounted () {
    this.$route.meta.name = this.idx === '0' ? ' 新增短信任务' : '编辑短信任务'
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      let list = await this.getSmsTaskDetail() // 短信任务下拉
      this.searchModel.temp.smsSupplierTemplateNo.data = list
      this.$nextTick(() => {
        if (+this.idx > 0) {
          this.getById()
        }
      })
    },
    delItem (item) {
      const fileList = this.searchModel.ruleForm.file.fileList.slice()
      this.searchModel.ruleForm.file = {
        fileList: fileList.filter(c => c.uid !== item.uid)
      }
    },
    downloadTemp () { // 下载模板
      // let NODE_ENV = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') ? 'prod' : 'dev'// 生产
      // window.open('https://manwei00.oss-cn-shanghai.aliyuncs.com/zp/' + NODE_ENV + '/职微你人才库模板.xlsx')
      _fn.downLoad('smsTask_exportExcelDemo', { smsSupplierTemplateNo: this.searchModel.ruleForm.smsSupplierTemplateNo }, '短信任务模板' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss'))
    },
    getSmsTaskDetail () {
      this.queryType = (+this.$route.query.type) > 0 ? 1 : 0 // 是否是人才库邀约模板 1 是 0 否
      return this._api.smsTask_getSmsTaskDetail({ talentPoolFlag: this.queryType }).then((res) => {
        let map = {}
        let d = res.data || []
        let arr = []
        d.map((item) => {
          if (item) {
            map[item.smsSupplierTemplateNo] = item.content
            arr.push({ label: item.name, value: item.smsSupplierTemplateNo })
          }
        })
        this.smsSupplierTemplateMap = map
        if (this.queryType === 1) { // 人才库邀约模板
          // this.searchModel.ruleForm.smsSupplierTemplateNo = '19'
          this.searchModel.ruleForm.smsSupplierTemplateNo = (d[0] && d[0].smsSupplierTemplateNo) || ''
          this.searchModel.ruleForm.mobilelist = JSON.parse(this.$route.query.ids)
        }
        return arr
      })
    },
    getById () {
      this._api.smsTask_selectTaskDetail({ smsTaskId: this.idx }).then((res) => {
        let d = (res && res.data) || {}
        this.searchModel.ruleForm = d
      })
    },
    nextPage () { // 下一步
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.activeSteps = 2
          this.$nextTick(() => {
            let from = this.searchModel.ruleForm
            if (from.fromType === 1) {
              console.log(11111)
              // let oo = {
              //   fileList: [
              //     { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
              //     { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
              //   ]
              // }
              if (from.excelFileName) {
                let oo = {
                  fileList: [
                    { name: from.excelFileName, url: '' }
                  ]
                }
                this.$set(this.searchModel.ruleForm, 'file', oo)
                this.searchModel.ruleForm.file = oo
              }
            }
          })
        }
      })
    },
    prevPage () { // 上一步
      this.activeSteps = 1
    },
    toPage () {
      _fn.toLocation({ name: 'messageTask' }) // -> /user/123
    },
    save (type) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = _fn.copy(this.searchModel.ruleForm)
          if (this.searchModel.ruleForm.fromType === 0 || this.queryType === 1) {
            // mobilelist
            let d = this.$refs.positionListTemp.selectedList
            let mobilelist = []
            if (d && d.length) {
              for (let i = 0; i < d.length; i++) {
                mobilelist.push({ mobile: d[i].phoneNumber, userName: d[i].name })
              }
            }
            if (!mobilelist.length) {
              // this.notify('请选择职位')
              return
            }
            let p = {
              mobilelist: mobilelist,
              missionName: param.missionName, // 任务名称
              smsSupplierTemplateNo: param.smsSupplierTemplateNo, // 短信模板
              smsTaskSendFlag: type // 1 立即推送 -1 保存暂不推送
            }
            if (+this.idx !== 0) { // 修改
              p.taskId = this.idx
            }
            console.log(22222)
            this._api.smsTask_sendSmsTaskImmediately(p).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              _fn.toLocation({ name: 'messageTask' }) // -> /user/123
            })
          } else { // 文件formdata
            let file = {}
            let flist = this.searchModel.ruleForm.file
            if (flist && flist.fileList && flist.fileList.length) {
              flist.fileList.map((item) => {
                file = item.raw
              })
            }
            let p = {
              file: file || null,
              missionName: param.missionName, // 任务名称
              smsSupplierTemplateNo: param.smsSupplierTemplateNo, // 短信模板
              smsTaskSendFlag: type // 1 立即推送 -1 保存暂不推送
            }
            if (+this.idx !== 0 && this.searchModel.ruleForm.fromType === 1) { // 修改
              delete p.file
              p.taskId = this.idx
            }
            console.log(1111)
            this._api.smsTask_import_applicants(p).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              _fn.toLocation({ name: 'messageTask' }) // -> /user/123
            }).catch(e => {
              this.searchModel.ruleForm.file = {
                fileList: []
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/color.less';
.contentEdit{
  height: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  &-body{
    display: flex;
    height: 0;
    flex-grow: 1;
  }
  .left{
    flex: 0 0 180px;
    height: 200px;
    margin: 70px 0 0 20px;
  }
  .center{
    height: 100%;
    overflow: auto;
    flex: auto;
    .smsTemplate{
      border: 1px solid #E9EAED;
      width: 440px;
      div{
        margin: 18px;
        padding: 5px;
        background: #F4F4F4;
        line-height: 25px;
      }
    }
    .file{
      /deep/.el-upload-dragger {
        width: 440px;
        height: 175px;
        i{
          margin-top: 62px;
        }
      }
      /deep/.upload-success-list{
        width: 440px;
      }
    }
  }
  .editFooter{
    position: inherit;
    width: 100%;
  }
}
    
</style>
