<template>
  <!-- 职位管理 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm"
      style="margin:0 0 52px 0">
      <!-- ruleForm: {
          // 基本
          name: '', // 职位名称
          companyId: '', // 所属企业
          positionId: '', // 职位分类
          timeRequired: '', // 工作性质 1-全职, 2-兼职, 3-实习
          addressIds: '', // 工作地址
          workTime: '', // 工作时间(daysPreWeek、hoursPreDay)
          headcount: '', // 招聘人数
          label: '', // 职位标签 1-热招, 2-急招, 3-新发布
          // 职位要求
          educationRequirement: '', // 学历要求 0-不限, 1-小学, 2-初中, 3-高中, 4-中专, 5-大专, 6-本科, 7-硕士, 8-硕士以上
          experienceRequirement: '', // 经验要求 minExpRequirement,maxExpRequirement
          genderRequirement: '', // 性别要求 0-不限, 1-男, 2-女
          minMaxAge: '', // 年龄要求(minAgeRequirement、maxAgeRequirement)
          //  薪资福利
          salaryType: '', // 薪资类型 0-面议, 1-时薪, 2-日薪, 3-月薪, 4-年薪
          tagIds: '', // 其他福利
          //  工作描述
          description : '',
          //  工作环境
          pics : '',
        }, -->
      <div class="forms_title"><span class="line"></span>基本信息</div>
      <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" />
      <zp-dynamicFormItem :formItem="form.temp.companyId" name="companyId" :obj="form" /><br />
      <zp-dynamicFormItem :formItem="form.temp.positionId" name="positionId" :obj="form">
        <template v-slot:custom_positionId>
          <el-cascader v-model="form.ruleForm.positionId" :show-all-levels="false" placeholder="请选择" :options="form.temp.positionId.data"
            :style="form.temp.positionId.style" filterable>
          </el-cascader>
        </template>
      </zp-dynamicFormItem>
      <zp-dynamicFormItem :formItem="form.temp.timeRequired" name="timeRequired" :obj="form" /><br />
      <zp-dynamicFormItem :formItem="form.temp.addressIds" name="addressIds" :obj="form" /><br />
      <el-form-item label="工作时间">
        <el-col :span="11">
          <el-form-item prop="daysPreWeek">
            <el-input v-model.number="form.ruleForm.daysPreWeek" placeholder="请输入">
              <template slot="append">天/周</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item prop="hoursPreDay">
            <el-input v-model.number="form.ruleForm.hoursPreDay" placeholder="请输入">
              <template slot="append">小时/天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="兼职周期" v-if="form.ruleForm.timeRequired === 2">
        <el-col :span="8">
          <zp-dynamicFormItem :formItem="form.temp.partJobType" name="partJobType" :obj="form" />
        </el-col>
        <el-col :span="16" v-if="form.ruleForm.partJobType === 2">
          <el-form-item prop="hoursPreDay">
            <el-date-picker v-model="form.ruleForm.partJobTypeTime" type="daterange" size="medium" style="width: 292px" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <br v-if="form.ruleForm.timeRequired === 2" />
      <el-form-item label="兼职时段" v-if="form.ruleForm.timeRequired === 2">
        <div v-for="(item, index) in form.ruleForm.partJobTime" :key="index">
          <el-col :span="10">
            <el-form-item prop="start">
              <el-time-picker value-format="HH:mm" format="HH:mm" v-model="item.start" placeholder="开始时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="10">
            <el-form-item prop="end">
              <el-time-picker value-format="HH:mm" format="HH:mm" v-model="item.end" placeholder="结束时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">
            <div class="part-time-icon">
              <i class="el-icon-circle-plus-outline" @click="addPartJobTime" v-if="index === 0 && form.ruleForm.partJobTime.length < 5"></i>
              <i class="iconfont iconshanchu" v-if="index != 0" @click="deletePartJobTime(index)"></i>
            </div>
          </el-col>
        </div>
      </el-form-item>
      <zp-dynamicFormItem :formItem="form.temp.headcount" name="headcount" :obj="form" /><br />
      <zp-dynamicFormItem :formItem="form.temp.label" name="label" :obj="form" /><br />
      <div class="forms_title"><span class="line"></span>职位要求</div>
      <zp-dynamicFormItem :formItem="form.temp.educationRequirement" name="educationRequirement" :obj="form" />

      <el-form-item label="经验要求">
        <el-col :span="11">
          <el-form-item prop="minExpRequirement">
            <el-input placeholder="请输入" v-model.number="form.ruleForm.minExpRequirement">
              <template slot="append">年</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
        <el-col :span="11">
          <el-form-item prop="maxExpRequirement">
            <el-input placeholder="请输入" v-model.number="form.ruleForm.maxExpRequirement">
              <template slot="append">年</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.genderRequirement" name="genderRequirement" :obj="form" />

      <el-form-item label="年龄要求">
        <el-col :span="11">
          <el-form-item prop="minAgeRequirement">
            <el-input placeholder="请输入" v-model.number="form.ruleForm.minAgeRequirement">
              <template slot="append">岁</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
        <el-col :span="11">
          <el-form-item prop="maxAgeRequirement">
            <el-input placeholder="请输入" v-model.number="form.ruleForm.maxAgeRequirement">
              <template slot="append">岁</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <br />
      <div class="forms_title"><span class="line"></span>薪资福利
        <el-tooltip class="item" effect="dark" content="详细的薪资福利会吸引更多的求职者" placement="right">
          <i class="el-icon-info" style="color: #8798AD;" />
        </el-tooltip>
      </div>
      <zp-dynamicFormItem :formItem="form.temp.salaryType" name="salaryType" :obj="form" />
      <el-form-item label="薪资范围" required v-if="form.ruleForm.salaryType > 0">
        <el-col :span="11">
          <el-form-item prop="minSalaryAmount">
            <el-input v-model.lazy="form.ruleForm.minSalaryAmount">
              <template slot="append">
                {{`元/${_var.salaryTypeText__global(form.ruleForm.salaryType)}`}}
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
        <el-col :span="11">
          <el-form-item prop="maxSalaryAmount">
            <el-input v-model.lazy="form.ruleForm.maxSalaryAmount">
              <template slot="append">
                {{`元/${_var.salaryTypeText__global(form.ruleForm.salaryType)}`}}
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.tagIds" name="tagIds" :obj="form" class="tags-wrapper">
        <template slot="custom_tagIds">
          <div @click="labelClick(item)" class="label" :class="item.labelActive ? 'labelActive' : ''" v-for="(item,index) in form.temp.tagIds.data"
            :key="index">{{item.label}}</div>
        </template>
      </zp-dynamicFormItem>
      <div class="forms_title" style="margin-top: 15px;"><span class="line"></span>工作描述 </div>
      <!-- <zp-dynamicFormItem :formItem="form.temp.description" name="description" :obj="form" /> -->
      <zp-dynamicFormItem :formItem="form.temp.description" name="description" :obj="form">
        <template slot="custom_description">
          <zpWangEditor placeholder="请输入工作描述" :value.sync="form.ruleForm.description" :isClear="true" :style="form.temp.description.style" />
        </template>
      </zp-dynamicFormItem>
      <div class="forms_title" style="margin-top: 15px;"><span class="line"></span>工作环境
        <span style="margin-left:4px;font-size: 12px;color: #69707F;">最多添加6张图片，每张大小不超过2M</span>
      </div>
      <zp-dynamicFormItem :formItem="form.temp.pics" name="pics" :obj="form">
        <template slot="custom_pics">
          <zp-upload uploadType="image" :formModel.sync="formModel" :limit="6" style="margin-left: 60px;" ref="picsList" />
        </template>
      </zp-dynamicFormItem>
      <!-- 
      <zp-dynamicFormItem :formItem="form.temp.pics" name="pics" :obj="form">
        <div slot="custom_pics" style="margin-left: 60px;">
          <zp-upload :uploadType="'image'" :callback="avatarFunction" :limit="5" />
        </div>
      </zp-dynamicFormItem> -->
    </el-form>
    <div class="editFooter">
      <zp-button :disabled="submitBtnDisabled" @click="save" type="primary">保 存
      </zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/util/utils'
import index from '../personnel/index.vue'
export default {
  name: 'positionEdit',
  data () {
    var daysPreWeek = (rule, value, callback) => { // 最小值
      if (value === '') {
        return callback()
      }
      if (!/^[1-7]$/g.test(value)) {
        return callback(new Error('1 到 7 之间的整数'))
      }
      callback()
    }
    var hoursPreDay = (rule, value, callback) => { // 最大值
      if (value === '') {
        return callback()
      }
      if (!/^([1-9]|1\d|2[0-4])$/g.test(value)) {
        return callback(new Error('1 到 24 之间的整数'))
      }
      callback()
    }
    var minMaxExpRequirement = (rule, value, callback) => { // 最大经验要求
      if (value === '') {
        return callback()
      }
      if (!/^(\d|[1-5]\d|60)$/g.test(value)) {
        return callback(new Error('0 到 60 之间的整数'))
      }
      callback()
    }
    var minMaxAgeRequirement = (rule, value, callback) => { // 请输入最小、最大年龄要求
      if (value === '') {
        return callback()
      }
      console.log('我明明是对的呀', value, !/^(1[69]|[2-9]\d|100)$/g.test(value))
      if (!/^(1[6-9]|[2-9]\d|100)$/g.test(value)) {
        return callback(new Error('16 到 100 之间的正整数'))
      }
      callback()
    }
    var minMaxSalaryAmount = (rule, value, callback) => { // 请输入最小、最大薪资范围
      if (!/^[1-9]\d*(\.\d{1,2})?$/g.test(value)) {
        return callback(new Error('大于0的数字（包含小数点后1-2位）'))
      }
      const { minSalaryAmount, maxSalaryAmount } = this.form.ruleForm
      if (minSalaryAmount && maxSalaryAmount) {
        if (minSalaryAmount - maxSalaryAmount > 0) {
          return callback(new Error('截止的值要大于起始的值'))
        }
      }
      callback()
    }
    var headcount = (rule, value, callback) => { // 招聘人数
      if (value === '') {
        return callback(new Error('请输入招聘人数'))
      }
      if (!/^[1-9]\d*$/g.test(value)) {
        return callback(new Error('招聘人数大于0的整数'))
      }
      callback()
    }
    return {
      partTimeValue: '', // 暂为时间
      title: '',
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      formModel: {
        fileList: []
      },
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          // 基本
          name: { label: '职位名称', isShow: true, formType: 'input', maxlength: 20 },
          companyId: {
            label: '所属企业',
            isShow: true,
            filterable: true,
            formType: 'select',
            data: []
          },
          positionId: {
            label: '职位分类',
            isShow: true,
            formType: 'custom',
            data: [],
            key: 'positionId',
            style: { width: '440px' }
          },
          timeRequired: { label: '工作性质', isShow: true, formType: 'select', data: _var.workNature },
          partJobType: { label: '', isShow: true, formType: 'select', data: _var.partTimeJob, style: 'width: 140px' }, // 未确定
          addressIds: {
            label: '工作地址',
            isShow: true,
            formType: 'select',
            data: [],
            multiple: true,
            'collapse-tags': true,
            filterable: true,
            style: { width: '1024px' }
          },
          workTime: { label: '工作时间', isShow: true, formType: 'custom', key: 'workTime' },
          headcount: { label: '招聘人数', isShow: true, formType: 'input', data: [], type: 'Number' },
          label: { label: '职位标签', isShow: true, formType: 'radio', data: _var.positionLabel },
          // 职位要求
          educationRequirement: { label: '学历要求', isShow: true, formType: 'select', data: _var.educationRequirement, clearable: false },
          experienceRequirement: { label: '经验要求', isShow: true, formType: 'custom', key: 'experienceRequirement', data: _var.experienceRequirement },
          genderRequirement: { label: '性别要求', isShow: true, formType: 'radio', data: _var.sex2, style: { width: '440px' } },
          minMaxAge: { label: '年龄要求', isShow: true, formType: 'custom', key: 'minMaxAge' },
          //  薪资福利
          salaryType: { label: '薪资类型', isShow: true, formType: 'select', data: _var.salaryType, require: true },
          salaryRange: { label: '薪资范围', isShow: true, formType: 'custom', key: 'salaryRange' },
          tagIds: {
            label: '其他福利',
            isShow: true,
            formType: 'custom',
            key: 'tagIds',
            data: [
              // { labelActive: false, label: '包吃', value: 1 },
              // { labelActive: false, label: '包住', value: 2 },
              // { labelActive: false, label: '不加班', value: 3 },
              // { labelActive: false, label: '全勤奖', value: 4 },
              // { labelActive: false, label: '五险一金', value: 5 },
              // { labelActive: false, label: '环境好', value: 6 }
            ]
          },
          //  工作描述
          description: {
            label: '工作描述',
            isShow: true,
            formType: 'custom',
            maxlength: 500,
            limit: true,
            rows: 6,
            isShowLabel: true,
            key: 'description',
            style: { 'margin-left': '60px', width: '1094px' }
          },
          //  工作环境
          pics: { label: '', isShow: true, formType: 'custom', key: 'pics' }
        },
        ruleForm: {
          partJobTime: [{ start: '', end: '' }], // 兼职时段
          partJobType: 1, // 兼职周期
          partJobTypeTime: [],
          partJobTypeBegin: '', // 开始时间
          partJobTypeEnd: '', // 结束时间
          // 基本
          name: '', // 职位名称
          companyId: '', // 所属企业
          positionId: '', // 职位分类
          timeRequired: '', // 工作性质 1-全职, 2-兼职, 3-实习
          addressIds: [], // 工作地址
          workTime: '', // 工作时间(daysPreWeek、hoursPreDay)
          daysPreWeek: '',
          hoursPreDay: '',
          headcount: '', // 招聘人数
          label: 3, // 职位标签 1-热招, 2-急招, 3-新发布
          // 职位要求
          educationRequirement: 0, // 学历要求 0-不限, 1-小学, 2-初中, 3-高中, 4-中专, 5-大专, 6-本科, 7-硕士, 8-硕士以上
          experienceRequirement: '', // 经验要求 minExpRequirement,maxExpRequirement
          minExpRequirement: '',
          maxExpRequirement: '',
          genderRequirement: 0, // 性别要求 0-不限, 1-男, 2-女
          minMaxAge: '', // 年龄要求(minAgeRequirement、maxAgeRequirement)
          minAgeRequirement: '',
          maxAgeRequirement: '',
          //  薪资福利
          salaryType: 0, // 薪资类型 0-面议, 1-时薪, 2-日薪, 3-月薪, 4-年薪
          minSalaryAmount: '', // salaryType: 0 不显示
          maxSalaryAmount: '', // salaryType: 0 不显示
          tagIds: [], // 其他福利
          //  工作描述
          description: '',
          //  工作环境
          pics: []
        },
        rules: {
          daysPreWeek: [{ validator: daysPreWeek, text: '请输入天/周', required: false, trigger: 'blur' }],
          hoursPreDay: [{ validator: hoursPreDay, text: '请输入小时/天', required: false, trigger: 'blur' }],
          minExpRequirement: [{ validator: minMaxExpRequirement, text: '请输入最小经验要求', required: false, trigger: 'blur' }],
          maxExpRequirement: [{ validator: minMaxExpRequirement, text: '请输入最大经验要求', required: false, trigger: 'blur' }],
          minAgeRequirement: [{ validator: minMaxAgeRequirement, text: '请输入最小年龄要求', required: false, trigger: 'blur' }],
          maxAgeRequirement: [{ validator: minMaxAgeRequirement, text: '请输入最大年龄要求', required: false, trigger: 'blur' }],
          salaryType: [
            {
              required: true,
              message: '请选择薪资范围',
              trigger: 'change'
            }
          ],
          minSalaryAmount: [{ validator: minMaxSalaryAmount, text: '请输入最小薪资范围', required: true, trigger: 'blur' }],
          maxSalaryAmount: [{ validator: minMaxSalaryAmount, text: '请输入最大薪资范围', required: true, trigger: 'blur' }],

          name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
          companyId: [{ required: true, message: '请选择所属企业', trigger: 'change' }],
          positionId: [{ required: true, message: '请选择职位分类', trigger: 'change' }],
          timeRequired: [{ required: true, message: '请选择工作性质', trigger: 'change' }],
          addressIds: [{ required: true, message: '请选择工作地址', trigger: 'change' }],
          headcount: [{ required: true, trigger: 'change', validator: headcount }]
        }
      }
    }
  },
  watch: {
    'form.temp.tagIds.data': {
      handler: function (params) {
        let arr = params.filter(item => item.labelActive)
        this.form.ruleForm.tagIds = arr.map((item) => {
          return item.value
        })
      },
      deep: true
    }
  },
  computed: {
    submitBtnDisabled () {
      // 去掉编辑校验
      if (this.routeParams.copyId && this.routeParams.copyId !== '0' && !_fn.checkBtn('job/add')) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.idx = this.routeParams.id
    this.$route.meta.name = this.idx !== '0' ? '编辑职位' : '新增职位'
    this.title = this.$route.meta.name
    const requestHandle = async () => {
      await _fn.getEnterprise((data) => { this.form.temp.companyId.data = data }, {}, true) // 所属企业
      await _fn.getAddress(data => {
        console.log(data)
        this.form.temp.addressIds.data = data.filter(item => !item.disabled)
      }, {}, true) // 地址
      // if (this.idx === '0') {
      //   await _fn.getAddress(data => {
      //     console.log(data)
      //     this.form.temp.addressIds.data = data.filter(item => !item.disabled)
      //   }, {}, true) // 地址
      // }
      await _fn.getTag(res => {
        this.form.temp.tagIds.data = res.data.filter(item => item.enabled).map(item => {
          return {
            labelActive: false,
            label: item.name,
            value: item.id
          }
        })
      }, { type: 2 }) // tag
      const industryList = await this.requestPublicCombobox(1)
      const positionList = await this.requestPublicCombobox(2)
      let positionIdData = []
      let result = this.dataGroupById(positionList)
      industryList.forEach(item => {
        result.forEach(c => {
          if (item.id === c.id) {
            positionIdData.push({
              label: item.name,
              value: item.id,
              children: c.list.map(k => {
                return {
                  value: k.id,
                  label: k.title
                }
              })
            })
          }
        })
      })
      this.form.temp.positionId.data = positionIdData
      if (this.idx !== '0') { // 修改
        await this.getInfo('job_details', this.idx, positionList)
      } else {
        if (this.routeParams.copyId && this.routeParams.copyId !== '0') {
          await this.getInfo('job_copy', this.routeParams.copyId, positionList)
          console.info('this.param.isCopy', this.routeParams.copyId)
        }
      }
    }
    console.log('我是全局常量', this._vars)
    requestHandle()
  },
  methods: {
    addPartJobTime () { // 增加时间段
      let len = this.form.ruleForm.partJobTime.length
      let data = this.form.ruleForm.partJobTime
      console.log('data', data)
      let flag = true
      data.forEach((item) => {
        if (!item.start || !item.end) {
          flag = false
          return this.notify('兼职时段填写完整才能提交', 'warning')
        }
      })
      if (flag) {
        this.form.ruleForm.partJobTime.push({
          start: '',
          end: ''
        })
      }
    },
    deletePartJobTime (index) { // 减少时间段
      this.form.ruleForm.partJobTime.splice(index, 1)
    },
    requestPublicCombobox (comboType) {
      return new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          resolve(res.data[0])
        }, { comboType })
      })
    },
    // 数据分类组合
    dataGroupById (sourceList) {
      let result = []
      let obj = {}
      for (let i = 0, len = sourceList.length; i < len; i++) {
        const item = sourceList[i]
        const { industryId } = item
        if (obj[industryId]) {
          for (let k = 0, length = result.length; k < length; k++) {
            if (result[k].id === industryId) {
              result[k].list.push(item)
              break
            }
          }
        } else {
          obj[industryId] = item
          result.push({
            id: industryId,
            list: [item]
          })
        }
      }
      return result
    },
    toPage () {
      this.$router.go(-1)
      // _fn.toLocation({ path: '/position' }) // -> /user/123
    },
    labelClick (item) {
      item.labelActive = !item.labelActive
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = { ...this.form.ruleForm }
          if (param.partJobType === 2 && param.partJobTypeTime && param.partJobTypeTime.length > 0) {
            param.partJobTypeBegin = formatDate(param.partJobTypeTime[0], 'yyyy-MM-dd')
            param.partJobTypeEnd = formatDate(param.partJobTypeTime[1], 'yyyy-MM-dd')
          }
          let picsList = this.$refs.picsList.getUrl()
          if (picsList) {
            param.pics = picsList.split(',').map((item) => {
              return { url: item }
            })
          }
          if (param.partJobTime && param.partJobTime.length > 0) {
            let data = []
            let flag = false
            param.partJobTime.forEach((item, index) => {
              if (!item.start && !item.end) {
                // param.partJobTime.splice(index, 1)
              } else {
                if (!item.start || !item.end) {
                  flag = true
                }
              }
              if (item.start && item.end) {
                data.push({ ...item, index })
              }
            })
            console.log('param---------------------------', param.partJobTime)
            if (flag) {
              return this.notify('兼职时段填写完整才能提交', 'warning')
            }
            if (data.length > 0) {
              param.partJobTime = data
            } else {
              param.partJobTime = []
            }
          }
          let url = ''
          if (this.idx === '0') { // 新增
            url = 'job_add'
          } else { // 修改
            url = 'job_update'
            param.id = this.idx
          }
          this._api[url]({
            ...param,
            positionId: param.positionId[1]
          }).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            if (this.idx === '0') {
              if (_fn.checkBtn('job/details')) {
                _fn.toLocation({
                  name: 'positionInfo',
                  params: {
                    id: res.data
                  },
                  query: {
                    tagName: 2
                  }
                })
              } else {
                this.toPage()
              }
            } else {
              this.toPage()
            }
          })
        }
      })
    },
    async getInfo (name, id, positionList) {
      // console.log('我执行了嘛', name, id, positionList)
      const { temp } = this.form
      const companyIdData = temp.companyId.data.slice()
      const addressIds = temp.addressIds.data
      await _fn.getAddress(data => {
        this.form.temp.addressIds.data = data
        this._api[name]({ id: id }).then((res) => {
          let item = res.data
          const companyId = item.companyId
          const companyName = item.companyName
          const addressesIds = item.addresses.map(item => ({ // 已经停用的地址
            label: item.name,
            value: item.id,
            disabled: false
          }))
          const companyIdFlag = companyIdData.some(item => item.value === companyId)
          const addressIdFlag = addressesIds.reduce((total, item) => {
            const flag = addressIds.some(a => item.value === a.value)
            if (!flag) {
              total.push(item)
            }
            return total
          }, [])
          console.log('addressIdFlag', addressIdFlag, 'companyIdFlag', companyIdFlag, temp.addressIds.data)
          if (!companyIdFlag) {
            companyIdData.push({
              label: companyName,
              value: companyId,
              disabled: true
            })
            this.$set(this.form.temp, 'companyId', {
              ...temp.companyId,
              data: companyIdData
            })
          }
          this.$set(this.form.temp, 'addressIds', {
            ...temp.addressIds,
            data: data.concat(addressIdFlag)
          })
          if (item.partJobTime && item.partJobTime.length > 0) {
            this.form.ruleForm.partJobTime = item.partJobTime
          }
          if (item.partJobTypeBegin && item.partJobTypeEnd) {
            this.form.ruleForm.partJobTypeTime = [new Date(item.partJobTypeBegin), new Date(item.partJobTypeEnd)]
          }
          if (item) {
            const pos = positionList.filter(p => p.id === Number(item.positionId))
            const positionId = pos.length ? [pos[0].industryId, pos[0].id] : ''
            this.$set(this.form, 'ruleForm', {
              ...this.form.ruleForm,
              partJobType: item.partJobType,
              name: item.name,
              companyId: companyId,
              positionId,
              timeRequired: item.timeRequired,
              addressIds: item.addresses.map(i => {
                return i.id
              }),
              daysPreWeek: item.daysPreWeek || '',
              hoursPreDay: item.hoursPreDay || '',
              headcount: item.headcount,
              label: item.label,
              educationRequirement: item.educationRequirement,
              minExpRequirement: item.minExpRequirement === 0 ? 0 : (item.minExpRequirement || ''),
              maxExpRequirement: item.maxExpRequirement === 0 ? 0 : (item.maxExpRequirement || ''),
              genderRequirement: item.genderRequirement,
              minAgeRequirement: item.minAgeRequirement || '',
              maxAgeRequirement: item.maxAgeRequirement || '',
              salaryType: item.salaryType,
              minSalaryAmount: item.minSalaryAmount || '',
              maxSalaryAmount: item.maxSalaryAmount || '',
              description: item.description || ''
            })
            this.setTagsDefaulte(item.tags)
            this.setPicsDefaulte(item.pics)
          }
        })
      }, {}, true) // 地址
    },
    // 编辑tags默认选中
    setTagsDefaulte (tags) {
      const list = this.form.temp.tagIds.data.slice()
      list.forEach(item => {
        tags.forEach(c => {
          if (item.value === c.id) {
            item.labelActive = true
          }
        })
      })
      this.form.temp.tagIds.data = list
    },
    // 图片
    setPicsDefaulte (list) {
      this.formModel.fileList = list
    }
  }
}
</script>
<style lang='less' scoped>
  .tags-wrapper{
    /deep/ .el-form-item__content{
      max-width: 64%;
    }
  }
  .part-time-icon {
    width: 40px;
    line-height: 40px;
  }
  .el-icon-circle-plus-outline, .iconshanchu {
    line-height: 40px;
    font-size: 16px;
    color: #4A84FF;
    position: absolute;
    cursor: pointer;
  }
  .iconshanchu {
    color: #F73E3E;
  }
</style>
