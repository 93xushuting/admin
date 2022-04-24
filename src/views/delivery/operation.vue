<template>
  <!-- 投递管理 弹出框 -->
  <div class="element__body_info">
    <div class="breadcrumb">
      <i class="iconfont iconfanhuishangji" @click="toPage" />{{ title }}
    </div>
    <div class="deliveryOperationBody">
      <el-form
        v-if="btnId === 15"
        :model="form.tableObj"
        ref="tableForm"
        size="small"
        class="infoForm editFooterMargin"
      >
        <div class="forms_title2">
          <span class="line"></span>邀约人员
          <div class="count">
            共计 <span class="number"> {{ tableCount }} </span> 人
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
          <template slot="customMode_phoneNumber" slot-scope="props">
            <el-table-column
              :label="props.customProps.label"
              :render-header="renderHeader"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`data.${scope.$index}.phoneNumber`"
                  :rules="form.tableRules.phoneNumber"
                >
                  <zp-input v-model="scope.row.phoneNumber" />
                </el-form-item>
              </template>
            </el-table-column>
          </template>
          <template slot="customMode_identityNumber" slot-scope="props">
            <el-table-column
              :label="props.customProps.label"
              :render-header="renderHeader"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`data.${scope.$index}.identityNumber`"
                  :rules="form.tableRules.identityNumber"
                >
                  <zp-input v-model="scope.row.identityNumber" />
                </el-form-item>
              </template>
            </el-table-column>
          </template>
        </zp-dynamicTable>
      </el-form>
      <el-form
        v-else
        :model="form.ruleForm"
        :rules="form.rules"
        :label-width="form.labelWidth"
        size="small"
        :ref="form.name"
        class="infoForm editFooterMargin"
        :inline="form.inline"
      >
        <template v-if="btnId !== 10">
          <div class="forms_title2">
            <span class="line"></span>邀约人员
            <div class="count">
              共计 <span class="number"> {{ tableCount }} </span> 人
            </div>
          </div>
          <zp-dynamicTable
            @handleSelectionChange="handleSelectionChange"
            ref="deliveryOperationTable"
            :obj="form.tableObj"
            stripe
            class="deliveryOperationTable"
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
        </template>
        <div style="margin-top: 30px; width: 1010px">
          <template v-if="btnId === 5">
            <div class="forms_title">
              <span class="line"></span>淘汰类型
              <div class="reason">
                未避免候选人心理不适，确认淘汰后系统将不发送消息通知给候选人，候选人可在应聘记录中“不合适”列表中查看状态
              </div>
            </div>
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.rejectType"
              name="rejectType"
              :obj="form"
              @change="rejectChange"
            /><br />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.rejectReasonId"
              name="rejectReasonId"
              :obj="form"
            />
          </template>
          <template v-if="btnId === 9">
            <div class="forms_title"><span class="line"></span>邀约信息</div>
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.identityType"
              name="identityType"
              :obj="form"
            />
          </template>
          <!-- 代上传 -->
          <template v-if="btnId === 10">
            <div class="forms_title"><span class="line"></span>邀约信息</div>
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.identityType"
              name="identityType"
              :obj="form"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.identityName"
              name="identityName"
              :obj="form"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.identityNumber"
              name="identityNumber"
              :obj="form"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.expiryDate"
              name="expiryDate"
              :obj="form"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.identityPic"
              name="identityPic"
              :obj="form"
            >
              <template v-slot:custom_identityPic>
                <el-input
                  v-model="form.ruleForm.identityPic"
                  style="display: none"
                />
                <zp-upload
                  :limit="1"
                  uploadType="image"
                  :formModel.sync="formModel"
                />
              </template>
            </zp-dynamicFormItem>
          </template>
          <template v-if="btnId === 7 || btnId === 11 || btnId === 17">
            <!-- 邀请面试 -->
            <div class="forms_title"><span class="line"></span>邀约信息</div>
            <el-form-item
              :label="
                btnId === 7
                  ? '面试时间'
                  : btnId === 11
                  ? '试工时间'
                  : '入职时间'
              "
              required
              style="width: 568px; margin-bottom: 0"
            >
              <el-col :span="18" style="margin-right: -1px">
                <el-form-item prop="time">
                  <el-date-picker
                    type="date"
                    placeholder="请选择"
                    v-model="form.ruleForm.time"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    style="width: 100%"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="hour">
                  <el-time-picker
                    type="fixed-time"
                    placeholder="请选择"
                    v-model="form.ruleForm.hour"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width: 100%"
                  ></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.contact"
              name="contact"
              :obj="form"
              @change="contactChange"
              @clear="contactClear"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.mobile"
              name="mobile"
              :obj="form"
            />
            <zp-dynamicFormItem
              :formItem="form.temp && form.temp.notes"
              name="notes"
              :obj="form"
            />
            <div class="forms_title"><span class="line"></span>邀约方式</div>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp && form.temp.invitationMethod"
            >
              <template v-slot:custom_invitationMethod="{ customProps }">
                <el-checkbox-group v-model="form.ruleForm.invitationMethod">
                  <el-checkbox
                    v-for="item in customProps.data"
                    :key="item.value"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </zp-dynamicFormItem>
            <el-form-item
              v-show="smsMsgFlag"
              label="短信模板"
              style="width: 568px"
            >
              <el-card class="sms-template" shadow="never">
                <div class="container" v-if="btnId === 7">
                  <p>
                    <span class="cue-color">【企业名称】</span>诚邀您参加面试！
                  </p>
                  <p>面试岗位：<span class="cue-color">招聘职位名称</span></p>
                  <p>面试时间：<span class="cue-color">面试时间</span></p>
                  <p>面试地址：<span class="cue-color">面试地址</span></p>
                  <p>
                    联系方式：<span class="cue-color">联系人、联系电话</span>
                  </p>
                  <p>注意事项：<span class="cue-color">注意事项内容</span></p>
                </div>
                <div class="container" v-else-if="btnId === 11">
                  <p>
                    <span class="cue-color">【企业名称】</span>诚邀您参加试工！
                  </p>
                  <p>试工岗位：<span class="cue-color">试工名称</span></p>
                  <p>试工时间：<span class="cue-color">试工时间</span></p>
                  <p>试工地址：<span class="cue-color">试工地址</span></p>
                  <p>
                    联系方式：<span class="cue-color">联系人、联系电话</span>
                  </p>
                  <p>注意事项：<span class="cue-color">注意事项内容</span></p>
                </div>
                <div class="container" v-else>
                  <p>
                    <span class="cue-color">【企业名称】</span
                    >恭喜您通过筛选，欢迎加入我们！
                  </p>
                  <p>报到时间：<span class="cue-color">入职时间</span></p>
                  <p>报到地址：<span class="cue-color">入职地址</span></p>
                  <p>
                    联系方式：<span class="cue-color">联系人、联系电话</span>
                  </p>
                  <p>注意事项：<span class="cue-color">注意事项内容</span></p>
                </div>
              </el-card>
            </el-form-item>
          </template>
        </div>
      </el-form>
    </div>
    <div class="editFooter">
      <zp-button @click="save" type="primary">{{
        btnId === 15 ? "立即背调" : "确 定"
      }}</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
export default {
  name: 'positionEdit',
  data () {
    var validatePhoneNumber = (rule, value, callback) => {
      let a = value.split('-')
      let v = a[0]
      if (a.length > 1) {
        v = a[1]
      }
      value = _fn.trim(v)
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!/^\d{7,11}$/g.test(value)) {
        return callback(new Error('长度在7 - 11 个字符'))
      } else {
        callback()
      }
    }
    return {
      addressWantedIdx: '',
      sendParam: {},
      dialogTip: {},
      valueAddedItemIdList: [],
      formModel: {
        fileList: []
      },
      mobileMap: {},
      tableCount: 0,
      idx: '',
      btnId: 0,
      currentId: 0,
      targetId: 0,
      title: '',
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      names: '',
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          time: { formType: 'datePick', label: '面试时间', placeholder: '请选择', isShow: true },
          hour: { formType: 'datePick', label: '', placeholder: '请选择', isShow: true },
          contact: { formType: 'select', label: '联系人', placeholder: '请选择联系人', isShow: true, data: [], allowCreate: true },
          mobile: { label: '联系人电话', placeholder: '请选择联系人', isShow: true, maxlength: 20 },
          notes: { type: 'textarea', label: '注意事项', placeholder: '请输入注意事项', isShow: true, maxlength: 200, limit: true, rows: 5 },
          identityType: { formType: 'select', label: '证件类型', placeholder: '请选择证件类型', isShow: true, data: _var.identityType },
          rejectType: { formType: 'select', label: '淘汰类型', placeholder: '请选择淘汰类型', isShow: true, data: _var.dieOutType2 },
          rejectReasonId: { formType: 'select', label: '淘汰理由', placeholder: '请选择淘汰理由', isShow: true, data: [] },
          // 证件
          identityName: { isShow: true, formType: 'input', label: '证件名称', limit: true, maxlength: 20 },
          identityNumber: { isShow: true, formType: 'input', label: '证件编号', limit: true, maxlength: 20 },
          expiryDate: { isShow: true, formType: 'datePick', label: '有效期至', prefixIcon: 'el-icon-date', valueFormat: '' },
          identityPic: { isShow: true, formType: 'custom', label: '上传证件', key: 'identityPic' },
          invitationMethod: {
            isShow: true,
            formType: 'custom',
            label: '',
            key: 'invitationMethod',
            data: [
              {
                label: '发送公众号模板消息',
                value: 'wxMsgFlag',
                disabled: true
              },
              {
                label: '发送短信通知',
                value: 'smsMsgFlag'
              }
            ]
          }
        },
        ruleForm: {
          time: '', // 日期 
          hour: '', // 小时 
          mobile: '', //
          notes: '',
          contact: '',
          rejectType: '', // 淘汰类型
          rejectReasonId: '', // 淘汰理由
          identityType: '', // 证件类型
          identityName: '', // 证件名称
          identityNumber: '', // 证件编号
          expiryDate: '', // 有效期至
          identityPic: '', // 上传证件
          invitationMethod: ['wxMsgFlag', 'smsMsgFlag'] // 邀约方式
        },
        rules: {
          time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          hour: [{ required: true, message: '请选择小时', trigger: 'blur' }],
          contact: [{ required: true, message: '请选择联系人', trigger: 'blur' }],
          mobile: formCheck.getRuleObj({
            message: '请输入手机号',
            required: true,
            opts: {
              pattern: 'phone',
              message: '手机号格式不符'
            }
          }),
          rejectType: [{ required: true, message: '请选择淘汰类型', trigger: 'change' }],
          rejectReasonId: [{ required: true, message: '请选择淘汰理由', trigger: 'change' }],
          identityType: formCheck.getRuleObj({ message: '请选择证件类型', trigger: 'change' }),
          expiryDate: formCheck.getRuleObj({ message: '请选择有效期', trigger: 'change' }),
          identityPic: formCheck.getRuleObj({ message: '请上传证件', trigger: 'change' }),
          identityName: formCheck.getRuleObj({ message: '请输入证件名称' }),
          identityNumber: formCheck.getRuleObj({ required: false, validator: this.checkIdentity, trigger: 'blur' })
        },
        tableObj: {
          height: '',
          data: [],
          fields: [
            // { key: 'aa', label: '候选人姓名' },
            // { key: 'bb', label: '手机号' },
            // { key: 'cc', label: '身份证号' },
            // { key: 'dd', label: '应聘职位' },
            // { key: 'ee', label: '面试职位' },
            // { key: 'ff', label: '试工职位' },
            // { key: 'gg', label: '录用职位' },
            // { key: 'hh', label: '所属企业' },
            // { key: 'ii', label: '面试地址' },
            // { key: 'jj', label: '试工地址' },
            // { key: 'kk', label: '入职地址' }
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
          ],
          phoneNumber: [{ validator: validatePhoneNumber, trigger: 'blur' }],
          // identityNumber: formCheck.getRuleObj({ required: false, tableIdentityNumber: true, validator: this.checkIdentity, trigger: 'blur' })
          identityNumber: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { max: 18, min: 15, message: '长度在15 或 18 个字符' }
          ]
        }
      }
    }
  },
  watch: {
    'formModel.fileList' (list) {
      this.form.ruleForm.identityPic = list.map(item => item.url).join(',')
    }
  },
  computed: {
    smsMsgFlag () {
      return this.form.ruleForm.invitationMethod.indexOf('smsMsgFlag') > 0
    }
  },
  created () {
    // 背调方案下拉列表
    _fn.get_value_added_item_public_combobox(res => {
      this.valueAddedItemIdList = res
    }, { processStageType: 5 })
    _fn.getCollaboratorsList((res) => { // 联系人
      let data = res
      let map = {}
      data = data.filter((item) => item.enabled)
      data = data.map((item) => {
        map[item.id] = item.workPhoneNumber || item.mobile
        return {
          label: item.realName,
          value: item.id,
          disabled: !item.enabled
        }
      })
      console.log('我是data呀', data)
      this.form.temp.contact.data = data
      this.mobileMap = map
    }, {}, false)
  },
  mounted () {
    this.blank = Number(this.routeParams.blank)
    this.btnId = Number(this.routeParams.btnId)
    this.currentId = Number(this.routeParams.currentId)
    this.targetId = Number(this.routeParams.targetId)
    let type = this.routeParams.type
    let metaName = ''
    this.title = this.$route.meta.name = metaName
    let id__ = this.routeParams.id
    if (id__ && _fn.isArray(id__)) {
      this.idx = id__
      this.getById(this.idx, true)
    } else {
      this.idx = id__
      this.getById(this.idx, false)
    }
    console.info('淘汰 ---- ', this.btnId)
  },
  methods: {
    checkIdentity (rule, value, callback) {
      if (!value) {
        return callback()
      }
      if (rule.tableIdentityNumber) {
        const { ruleForm } = this.form
        const identityNumber = _fn.trim(ruleForm.identityNumber)
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityNumber)) {
          return callback(new Error('身份证号格式不符'))
        }
      } else {
        const { ruleForm } = this.form
        if (ruleForm.identityType === 1 && ruleForm.identityNumber) {
          const identityNumber = _fn.trim(ruleForm.identityNumber)
          if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityNumber)) {
            return callback(new Error('身份证号格式不符'))
          }
        }
      }
      callback()
    },
    contactChange (val) {
      this.form.ruleForm.mobile = this.mobileMap[val]
    },
    rejectChange (val) {
      this.form.ruleForm.rejectReasonId = ''
      this._api.reject_reject_reason_list({
        type: val
      }).then(res => {
        this.form.temp.rejectReasonId.data = res.data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
    },
    handleSelectionChange (selection) {
      this.tableCount = selection.length
    },
    getById (id, isArray) {
      this.setData(() => {
        let param = {
          jobApplicantIdList: isArray ? id : [id]
        }
        this._api.job_applicant_batch_operation_details(param).then((res) => {
          let data = res.data
          if (data && data.length) {
            data.forEach((d) => {
              if (d.taddresses && d.taddresses.length) {
                let idx__ = ''
                if (d.addressWanted && d.addressWanted.length) {
                  idx__ = d.addressWanted[0].id
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
          if (this.btnId !== 10) {
            let size = (data.length + 1)
            if (this.btnId === 15) {
              this.form.tableObj.height = size * 60 < 440 ? size * 60 : 440
            } else {
              this.form.tableObj.height = size * 40 < 440 ? size * 40 : 440
            }
            this.$nextTick(() => {
              data.forEach((t) => {
                this.$refs.deliveryOperationTable.toggleRowSelection(t, true)
              })
              this.$refs.deliveryOperationTable.selectionList(data) // 默认进来选中
            })
          }
        })
      })
    },
    renderHeader (cerateElement, { column }) {
      return (<span><font style='color:red;'>*</font>&nbsp;<label>{column.label}</label></span>)
    },
    setData (fn) {
      let index = this.btnId
      let name = ''
      let filed = []
      if (index === 5) { // 淘汰
        name = '淘汰候选人'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '应聘职位' },
          { key: 'companyName', label: '所属企业' }
        ]
      } else if (index === 7) { // 邀请面试
        name = '邀请面试'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '面试职位' },
          { key: 'companyName', label: '所属企业' },
          {
            key: 'addressWanted',
            label: '期望工作地址',
            customMode: row => {
              if (row.adjustabled) {
                return '接受调剂门店'
              }
              const list = row.addressWanted
              if (!list || !list.length) {
                return '--'
              }
              const len = list.length
              return list.reduce((total, item, index) => {
                return total + item.name + (index === len - 1 ? '' : '、')
              }, '')
            }
          },
          { key: 'taddresses', label: '面试地址', customMode: true }
        ]
      } else if (index === 9) { // 邀请办证
        name = '邀请办证'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '面试职位' },
          { key: 'companyName', label: '所属企业' }
        ]
      } else if (index === 10) { // 代上传
        name = '代上传'
      } else if (index === 11) { // 邀请试工
        name = '邀请试工'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '试工职位' },
          { key: 'companyName', label: '所属企业' },
          {
            key: 'addressWanted',
            label: '期望工作地址',
            customMode: row => {
              if (row.adjustabled) {
                return '接受调剂门店'
              }
              const list = row.addressWanted
              if (!list || !list.length) {
                return '--'
              }
              const len = list.length
              return list.reduce((total, item, index) => {
                return total + item.name + (index === len - 1 ? '' : '、')
              }, '')
            }
          },
          { key: 'taddresses', label: '试工地址', customMode: true }
        ]
      } else if (index === 15) { // 发起背调
        name = '发起背调'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '应聘职位' },
          { key: 'companyName', label: '所属企业' },
          {
            key: 'valueAddedItemId',
            label: '背调套餐',
            customMode: row => {
              const arr = this.valueAddedItemIdList.filter(item => item.id === row.valueAddedItemId)
              return arr.length ? arr[0].name : '--'
            }
          },
          { key: 'phoneNumber', label: '手机号', customMode: true },
          { key: 'identityNumber', label: '身份证号', customMode: true }
        ]
      } else if (index === 17) { // 发送offer
        name = '发送offer'
        filed = [
          { key: 'name', label: '候选人姓名' },
          { key: 'positionName', label: '录用职位' },
          { key: 'companyName', label: '所属企业' },
          {
            key: 'addressWanted',
            label: '期望工作地址',
            customMode: row => {
              if (row.adjustabled) {
                return '接受调剂门店'
              }
              const list = row.addressWanted
              if (!list || !list.length) {
                return '--'
              }
              const len = list.length
              return list.reduce((total, item, index) => {
                return total + item.name + (index === len - 1 ? '' : '、')
              }, '')
            }
          },
          { key: 'taddresses', label: '入职地址', customMode: true }
        ]
      }
      this.$route.meta.name = name
      this.title = this.$route.meta.name
      this.form.tableObj.fields = filed
      fn && fn()
    },
    toPage () {
      if (this.blank) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'delivery', params: { type: this.currentId } })
      }
    },
    save () {
      let formName = this.form.name
      if (this.btnId === 10) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.form.ruleForm))
            param.id = this.idx
            console.info('上传证件', param)
            _api.job_applicant_add_identity(param).then(res => {
              _fn.message(res.msg || '操作成功', { type: 'success' })
              this.toPage()
            })
          }
        })
      } else { // 当前时间
        let obj = this.$refs.deliveryOperationTable.getSelected()
        if (!(obj.list && obj.list.length)) {
          _fn.message('请先选择条件', { type: 'error' })
          return
        }
        let time = this.form.ruleForm.time
        let hour = this.form.ruleForm.hour
        if (time && hour) {
          var t1 = time + ' ' + hour
          let start = parseInt(new Date(t1).getTime() / 1000)
          let end = parseInt(new Date().getTime() / 1000)
          if (start < end) {
            _fn.message('不能小于当前时间 ')
            return
          }
        }
        let param = JSON.parse(JSON.stringify(this.form.ruleForm))
        param.wxMsgFlag = true
        param.smsMsgFlag = param.invitationMethod.indexOf('smsMsgFlag') > 0
        param.time = time + ' ' + hour
        delete param.invitationMethod
        this.sendParam = param
        // this.tips(['aaaa', 'bbbbb'])
        if (this.btnId === 5) {
          this.checkDieOut(this.idx, (ret) => {
            // this.tips(ret.data)
            if (ret.data && ret.data.length) { // 候选人XXX、XXXX、XXX已在人才库中，是否更新人才库信息？
              this.tips(ret.data)
            } else {
              this.send()
            }
            console.log(this.sendParam)
          })
        } else {
          this.send()
        }
      }
    },
    send () {
      let obj = this.$refs.deliveryOperationTable.getSelected()
      let formName = this.form.name
      if (this.btnId === 15) {
        formName = 'tableForm'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.info('send send send', this.sendParam)
          this.form.temp.contact.data.filter(item => {
            if (item.value === this.sendParam.contact) { // == 改成 ===
              this.sendParam.contactId = item.value
              this.sendParam.contact = item.label
            }
          })// 查找对应id的name
          let o = {
            btnId: this.btnId,
            currentId: this.currentId,
            targetId: this.targetId,
            isBatch: true,
            ...this.sendParam
          }
          _fn.deliveryChange(obj.list, o, (res) => {
            this.toPage()
          })
        }
      })
    },
    tips (tisp) {
      let self = this
      let dia = {
        title: '归档提醒',
        tbody: `候选人 <span style="color:#4a84ff;">${tisp.join('、')}</span> 已在人才库中，是否更新人才库信息？`,
        titleSve: true,
        show: true,
        confirmText: '更新',
        cancelText: '不更新',
        confirmCallback: function () {
          console.info('更新')
          self.archiveFn(() => {
            self.send()
          })
        },
        cancelCallback: function () {
          console.info('不更新')
          self.send()
        }
      }
      this.dialogTip = dia
    },
    archiveFn (fn) { // 同步到人才库
      let param = {
        jobApplicantIdList: _fn.isArray(this.idx) ? this.idx : [this.idx]
      }
      this._api.job_applicant_public_archive_update(param).then((res) => {
        fn && fn(res)
      })
    },
    checkDieOut (data, fn) { // 淘汰确定
      let param = {
        jobApplicantIdList: _fn.isArray(data) ? this.idx : [this.idx]
      }
      this._api.job_applicant_public_archive_flag(param).then((res) => {
        fn && fn(res)
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
}
</style>
