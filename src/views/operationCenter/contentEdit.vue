<template>
  <!--内容广场 编辑 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <div class="contentEdit">
      <div class="contentEdit-wrapper">
        <div class="left">
          <el-steps direction="vertical" :active="activeSteps">
            <el-step title="基本信息"></el-step>
            <el-step title="跳转配置"></el-step>
          </el-steps>
        </div>
        <div class="center">
          <div>
            <el-form :model="searchModel.ruleForm" :rules="searchModel.rules" ref="ruleForm" label-width="120px" class="infoForm"
              style="margin:50px 0 100px;padding-top: 30px;">
              <template v-if="activeSteps === 1">
                <zp-dynamicFormItem :formItem="searchModel.temp.name" name="name" :obj="searchModel" key="name" />
                <zp-dynamicFormItem :formItem="searchModel.temp.status" name="status" :obj="searchModel" key="status">
                  <template slot="custom_status">
                    <el-switch v-model="searchModel.ruleForm.status" active-text="开" inactive-color="#ff4949"
                      inactive-text="关" active-value="1" inactive-value="0" /> &nbsp;&nbsp;
                    <el-tooltip class="item" effect="dark" content="启用后职微你求职者小程序首页将同步发布轮播图。" placement="right">
                      <i class="el-icon-info" style="color: #8798AD;font-size:14px" />
                    </el-tooltip>
                  </template>
                </zp-dynamicFormItem>
                <zp-dynamicFormItem :formItem="searchModel.temp.sort" name="sort" :obj="searchModel" key="sort" />
                <zp-dynamicFormItem :formItem="searchModel.temp.cityId" name="cityId" :obj="searchModel" key="cityId" />
                <zp-dynamicFormItem :formItem="searchModel.temp.pictureUrl" name="pictureUrl" :obj="searchModel" key="pictureUrl">
                  <template slot="custom_pictureUrl">
                    <!-- el-input只用作验证 -->
                    <el-input :value="searchModel.ruleForm.pictureUrl" style="display: none" />
                    <zp-upload :limitSize="{
                    width: 750,
                    height: 400
                  }" uploadType="image" :formModel.sync="formModel" :limit="1" ref="picsList" />
                  </template>
                </zp-dynamicFormItem>
              </template>
              <template v-if="activeSteps ===2">
                <zp-dynamicFormItem :formItem="searchModel.temp.redirection" name="redirection" :obj="searchModel" key="redirection" />
                <template v-if="searchModel.ruleForm.redirection === 1">
                  <zp-dynamicFormItem class="pageTypeW" :formItem="searchModel.temp.pageType" name="pageType" :obj="searchModel" @change="pageTypeChange"
                    key="pageType" />
                  <zp-dynamicFormItem v-if="searchModel.ruleForm.pageType === 2" :formItem="searchModel.temp.link" name="link" :obj="searchModel"
                    key="link" />
                  <zp-dynamicFormItem v-if="searchModel.ruleForm.pageType === 4" :formItem="searchModel.temp.channelId" name="channelId" :obj="searchModel"
                    key="channelId" />
                  <zp-dynamicFormItem v-if="searchModel.ruleForm.pageType === 4" :formItem="searchModel.temp.feedId" name="feedId" :obj="searchModel"
                    key="feedId" />
                  <zp-dynamicFormItem v-if="searchModel.ruleForm.pageType === 1" :formItem="searchModel.temp.pageConfiguration"
                    name="pageConfiguration" :obj="searchModel" key="pageConfiguration">
                    <template slot="custom_pageConfiguration">
                      <!-- el-input只用作验证 -->
                      <el-input :value="searchModel.ruleForm.pageConfiguration" style="display: none" />
                      <zpWangEditor :height="400" placeholder="请输入页面配置" :value.sync="searchModel.ruleForm.pageConfiguration" :isClear="true" />
                    </template>
                  </zp-dynamicFormItem>
                  <template v-if="searchModel.ruleForm.pageType === 3">
                    <zp-dynamicFormItem :formItem="searchModel.temp.regulationType" name="regulationType" :obj="searchModel" key="regulationType" />
                    <template v-if="searchModel.ruleForm.regulationType === 1">
                      <div class="rule-wrapper">
                        <div class="rule-list" v-for="(conditions, indexs) in searchModel.ruleForm.conditionList" :key="indexs">
                          <div class="rule-item">
                            <div class="rule-title">
                              <span>条件组{{indexs + 1}}</span>
                              <zp-button @click="delConditions(conditions)" type="text" class="delStyle"><i class="iconfont iconshanchu"></i>删除
                              </zp-button>
                            </div>
                            <div class="rule-content" v-for="(condition, index) in conditions" :key="index">
                              <div class="ruleText">{{index >=1 ? '且' : '当'}}</div>
                              <div class="rule-line">
                                <el-form-item :prop="'conditionList.' + indexs + '.' + index + '.name'" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                                  <el-select v-model="condition.name" placeholder="请选择" clearable filterable @change="conditionFieldChange(condition)">
                                    <el-option v-for="(item, conditionIndex) in condition.conditionList" :key="conditionIndex" :label="item.label" :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item :prop="'conditionList.' + indexs + '.' + index + '.type'" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                                  <el-select v-model="condition.type" placeholder="请选择">
                                    <el-option v-for="(item, ruleIndex) in condition.ruleList" :key="ruleIndex" :label="item.label" :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item v-if="condition.name === 'salary'" :prop="'conditionList.' + indexs + '.' + index + '.value'" :rules="salaryCheck">
                                  <el-input type="number" v-model.number="condition.value" placeholder="请输入">
                                  </el-input>
                                </el-form-item>
                                <el-form-item v-else-if="condition.name === 'experience'" :prop="'conditionList.' + indexs + '.' + index + '.value'" :rules="experienceCheck">
                                  <el-input type="number" v-model.number="condition.value" placeholder="请输入">
                                  </el-input>
                                </el-form-item>
                                <el-form-item v-else-if="condition.name === 'age'" :prop="'conditionList.' + indexs + '.' + index + '.value'" :rules="ageCheck">
                                  <el-input type="number" v-model.number="condition.value" placeholder="请输入">
                                  </el-input>
                                </el-form-item>
                                <el-form-item v-else :prop="'conditionList.' + indexs + '.' + index + '.value'" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                                  <el-select v-model="condition.value" multiple collapse-tags filterable placeholder="请选择" >
                                    <el-option v-for="(item) in condition.optionList" :key="item.label" :label="item.label" :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <zp-button @click="delCondition(conditions, condition)" type="text" class="delStyle"><i
                                    class="iconfont iconshanchu"></i></zp-button>
                              </div>
                            </div>
                            <div class="addCondition">
                              <el-button type="text" @click="addCondition(conditions)" :disabled="conditions.length >= 10">
                                <i class="el-icon-plus"></i> 添加条件
                              </el-button>
                            </div>
                          </div>
                          <div style="margin: 10px 20px" v-if="indexs != searchModel.ruleForm.conditionList.length-1">或</div>
                        </div>
                        <div class="addConditions">
                          <el-button type="text" @click="addConditions" :disabled="searchModel.ruleForm.conditionList.length >= 10">
                            <i class="iconfont iconzhankai2"></i> 添加条件组
                          </el-button>
                        </div>
                      </div>
                    </template>
                    <template v-if="searchModel.ruleForm.regulationType === 0">
                      <positionList ref="positionList" :jobIds="jobIds" />
                    </template>
                  </template>
                </template>
              </template>
            </el-form>
          </div>
        </div>
        <div v-if="activeSteps === 1" :class="{
        right: true,
        'right-content-html': contentVisiblie
      }">
          <div class="title">
            <img v-if="formModel.fileList && formModel.fileList.length" :src="formModel.fileList[0].url" />
          </div>
          <!-- <div class="title">
          <img v-if="formModel.fileList && formModel.fileList.length" :src="formModel.fileList[0].url" />
        </div>
        <div class="content" v-if="contentVisiblie && searchModel.ruleForm.pageType === 1">
          <div class="content-html" v-html="searchModel.ruleForm.pageConfiguration"></div>
        </div>
        <div class="content content-link" v-if="activeSteps === 2 && searchModel.ruleForm.pageType === 2">
          <img src="../../assets/image/phone_body.png" />
        </div>
        <div class="arrow"
          v-if="activeSteps === 2 && searchModel.ruleForm.redirection === 1 && searchModel.ruleForm.pageType === 1 && searchModel.ruleForm.pageConfiguration"
          @click="contentVisiblie = true">
          <i class="el-icon-arrow-right"></i>
        </div> -->
        </div>
      </div>
      <div class="editFooter">
        <zp-button @click="save" class="zp-btn-primary" v-if="activeSteps === 2">确定</zp-button>
        <zp-button @click="prevPage" v-if="activeSteps === 2">上一步</zp-button>
        <zp-button @click="nextPage" class="zp-btn-primary" v-if="activeSteps === 1">下一步</zp-button>
        <zp-button @click="toPage" v-if="activeSteps === 1">取 消</zp-button>
      </div>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </div>
</template>
<script>
import positionList from './positionList'
export default {
  name: 'contentEdit',
  components: { positionList },
  data () {
    var sortRequirement = (rule, value, callback) => { // 最大经验要求
      if (value === '') {
        return callback()
      }
      if (!/^([1-9]\d{0,3}|10000)$/g.test(value)) {
        return callback(new Error('1 到 10000 之间的整数'))
      }
      callback()
    }
    return {
      jobIds: '',
      contentVisiblie: false,
      formModel: {
        fileList: [],
        size: true
      },
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
          name: { formType: 'input', label: '标题', isShow: true, filterable: true, maxlength: 20, limit: true },
          status: { formType: 'custom', label: '状态', isShow: true, key: 'status' },
          sort: { formType: 'input', label: '排序', isShow: true },
          cityId: { formType: 'select', label: '城市', data: [], isShow: true },
          pictureUrl: { formType: 'custom', label: '轮播图片', isShow: true, key: 'pictureUrl' },
          redirection: { formType: 'radio', label: '是否跳转', isShow: true, data: _var.redirection },
          pageType: { formType: 'radio', label: '跳转页面类型', isShow: true, data: _var.directionPageType },
          link: { formType: 'input', label: '链接地址', isShow: true },
          channelId: { label: '视频号ID', isShow: true, formType: 'input', placeholder: '请输入' },
          feedId: { label: '视频feedId', isShow: true, formType: 'input', placeholder: '请输入' },
          pageConfiguration: { formType: 'custom', label: '页面配置', isShow: true, key: 'pageConfiguration' },
          regulationType: { formType: 'radio', label: '内容设置', isShow: true, data: _var.setContent },
          conditionTemplate: { formType: 'select', label: '条件维度', isShow: true, isShowLabel: true, data: _var.conditionFieldList },
          ruleTemplate: { formType: 'select', label: '规则', isShow: true, isShowLabel: true, data: [] },
          valueTemplate: { formType: 'select', label: '值', isShow: true, isShowLabel: true, data: [] }
        },
        ruleForm: {
          name: '', // 标题
          status: this.$route.query.max ? '0' : '1', // 状态，0_停用，1_启用
          sort: 1, // 启用状态的排序，1-6
          cityId: '0',
          pictureUrl: '', // 图片地址
          redirection: 1, // 是否跳转，1_是，0_否
          pageType: 1, // 跳转页面类型，1_系统页面，2_H5链接，3_职位链接
          pageUrl: '', // 系统页面的地址，
          pictureData: '',
          link: '', // 链接
          channelId: '', // 视频号ID
          feedId: '', // 视频FeedID
          pageConfiguration: '', // pageConfiguration
          regulationType: 1, // 内容设置，1_规则抽取，0_人工选择
          conditionTemplate: '',
          ruleTemplate: '',
          valueTemplate: '',
          conditionList: []
        },
        rules: {
          name: [{ message: '请输入标题', required: true, trigger: 'blur' }],
          status: [{ message: '请选择状态', required: true, trigger: 'change' }],
          sort: [{ validator: sortRequirement, text: '请输入排序', required: true, trigger: 'blur' }],
          cityId: [{ message: '请选择城市', required: true, trigger: 'change' }],
          pictureUrl: [{ message: '请选择轮播图片', required: true, trigger: 'change' }],
          redirection: [{ message: '请选择是否跳转', required: true, trigger: 'change' }],
          pageType: [{ message: '请选择跳转页面类型', required: true, trigger: 'change' }],
          // pageUrl: [{ message: '请输入最大经验要求', required: true, trigger: 'blur' }],
          link: [{ message: '请输入链接地址', required: true, trigger: 'blur' }],
          channelId: [{ required: true, message: '请输入视频号ID', trigger: 'blur' }],
          pageConfiguration: [{ message: '请输入页面配置', required: true, trigger: 'change' }],
          regulationType: [{ message: '请选择内容设置', required: true, trigger: 'change' }]
        }
      },
      conditionList: []
    }
  },
  computed: {
    salaryCheck () {
      return [
        {
          required: true,
          message: '请输入薪资范围',
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (!/^[1-9]\d*(\.\d{1,2})?$/g.test(value)) {
              return callback(new Error('大于0的数字（包含小数点后1-2位）'))
            }
            callback()
          }
        }
      ]
    },
    experienceCheck () {
      return [
        {
          required: true,
          message: '请输入经验要求',
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback()
            }
            if (!/^(\d|[1-5]\d|60)$/g.test(value)) {
              return callback(new Error('0 到 60 之间的整数'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ]
    },
    ageCheck () {
      return [
        {
          required: true,
          message: '请输入年龄要求',
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback()
            }
            if (!/^(1[6-9]|[2-9]\d|100)$/g.test(value)) {
              return callback(new Error('16 到 100 之间的正整数'))
            }
            callback()
          }
        }
      ]
    }
  },
  watch: {
    'formModel.fileList' (list) {
      this.searchModel.ruleForm.pictureData = list.length ? JSON.stringify(list) : ''
      this.searchModel.ruleForm.pictureUrl = list.length ? list.map(item => item.url)[0] : ''
      console.info('formModel.fileList', list)
    }
  },
  created () {

  },
  mounted () {
    this.idx = this.$route.params.id
    this.$route.meta.name = this.idx === 0 ? '新增轮播图' : '编辑轮播图'
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      // let brandNameList = await _fn.commonMyCustomers('', '', 'brandName') // 品牌名称、公司名称
      // this.form.temp.businessStatusId.data = businessStatusIdList
      
      _fn.getPublicCombobox(res => {
        let allArr = [{ label: '全国', value: '0' }]
        let cityArr = res.map(item => {
          return {
            label: item.label,
            value: String(item.value)
          }
        })
        this.searchModel.temp.cityId.data = allArr.concat(cityArr)
      }, { comboType: 9 }, true)

      this.$nextTick(() => {
        if (this.idx > 0) {
          this.getById()
        }
        localStorage.setItem('operationCenter_public', JSON.stringify({
          recommendPositionDTOSList: []
        }))
      })
    },
    pageTypeChange (v) {
      if (v === 3) {
        // console.info('2222222222222222222', this.searchModel.ruleForm.jobList)
        // localStorage.setItem('operationCenter_public', this.searchModel.ruleForm.jobList)
        // console.log('pageTypeChange', v)
        // setTimeout(() => {
        //   this.$refs.positionList.setTableDataSelected(this.searchModel.ruleForm.jobList)
        // }, 3000)
      }
    },
    getById () {
      this._api.banner_getById({ id: this.idx }).then((res) => {
        let d = res.data || {}
        // d.regulationType = 1
        d.status = String(d.status)
        if (d.pictureData) {
          if (d.pictureData.indexOf('[') > -1) {
            let url = JSON.parse(d.pictureData)
            this.formModel.fileList = url
          } else {
            this.formModel.fileList = [{ url: d.pictureData }]
          }
        } else if (d.pictureUrl) {
          this.formModel.fileList = [{ url: d.pictureUrl }]
        }
        if (d.pageType === 1) {
          d.link = ''
          d.jobList = ''
          d.channelId = ''
          d.feedId = ''
        }
        if (d.pageType === 2) {
          d.pageConfiguration = ''
          d.jobList = ''
          d.channelId = ''
          d.feedId = ''
        }
        if (d.pageType === 4) {
          d.link = ''
          d.jobList = ''
          d.pageConfiguration = ''
        }
        if (d.pageType === 3) {
          d.pageConfiguration = ''
          d.link = ''
          d.channelId = ''
          d.feedId = ''
          if (d.regulationType === 1) {
            // let dd = "[[{\"name\":\"company\",\"type\":1,\"value\":\"1409339667152769024,1409444332695588864\"}]]"
            let conditionList = d.regulationCondition ? JSON.parse(d.regulationCondition) : []
            for (let conditionsItem of conditionList) {
              for (let conditionItem of conditionsItem) {
                conditionItem.conditionList = _var.conditionFieldList
                let field = _var.conditionFieldList.filter((item) => {
                  return item.value === conditionItem.name
                })[0]
                if (field.ruleType === 1) {
                  conditionItem.ruleList = _var.rule1
                } else {
                  conditionItem.ruleList = _var.rule2
                }
                conditionItem.valueType = field.valueType
                const requestHandle = async () => {
                  await this.getOptionList(field, conditionItem)
                  // console.log('wwwwww', conditionItem)
                  if (conditionItem['value']) {
                    // console.log('wwwwww1111', conditionItem)
                    if (!_fn.isNumber(conditionItem.value)) {
                      if (field.itemValue || field.value === 'city') {
                        conditionItem.value = conditionItem.value.split(',').map(item => {
                          return Number(item)
                        })
                      } else {
                        conditionItem.value = conditionItem.value.split(',')
                      }
                    }
                  }
                }
                requestHandle()
              }
            }
            this.searchModel.ruleForm.conditionList = conditionList
          }
          this.jobIds = d.jobList
          console.info('this.jobIds', this.jobIds)
          if (d.jobList && d.jobList.indexOf('[') > -1) {
            d.jobList = JSON.parse(d.jobList)
            localStorage.setItem('operationCenter_public', JSON.stringify({
              recommendPositionDTOSList: d.jobListVO.map(item => {
                return {
                  id: item.id,
                  name: item.name
                }
              })
            }))
          }
          console.info('this.jobIds2222222', d.jobList)
        }
        this.searchModel.ruleForm = Object.assign({}, this.searchModel.ruleForm, d)
      })
    },
    nextPage () { // 下一步
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.activeSteps = 2
        }
      })
    },
    prevPage () { // 上一步
      this.contentVisiblie = false
      this.activeSteps = 1
    },
    toPage () {
      _fn.toLocation({ name: 'content' }) // -> /user/123
    },
    save () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let d = null
          let param = _fn.copy(this.searchModel.ruleForm)
          if (this.searchModel.ruleForm.redirection === 1) {
            if (this.searchModel.ruleForm.pageType === 3) { // pageType = 3 时有数据
              if (this.searchModel.ruleForm.regulationType === 1) {
                let conditionList = []
                if (this.searchModel.ruleForm.conditionList && this.searchModel.ruleForm.conditionList.length > 0) {
                  let keyList = ['name', 'type', 'value']
                  for (let conditionsItem of this.searchModel.ruleForm.conditionList) {
                    if (conditionsItem.length === 0) {
                      this.notify('请配置规则', 'info')
                      return
                    }
                    let conditions = []
                    for (let conditionItem of conditionsItem) {
                      let obj = {}
                      for (let key of keyList) {
                        if (!conditionItem[key] && conditionItem[key] !== 0) {
                          _fn.message('请完善条件')
                          return
                        } else {
                          if ((Object.prototype.toString.call(conditionItem[key]) === '[object Array]') && (conditionItem[key].length === 0)) {
                            _fn.message('请完善条件')
                            return
                          }
                          obj[key] = conditionItem[key]
                        }
                      }
                      conditions.push(obj)
                    }
                    conditionList.push(conditions)
                  }
                  for (let conditionsItem of conditionList) {
                    for (let conditionItem of conditionsItem) {
                      if (conditionItem.value && Object.prototype.toString.call(conditionItem.value) === '[object Array]') {
                        conditionItem.value = conditionItem.value.join(',')
                      } else {
                        conditionItem.value = conditionItem.value + ''
                      }
                    }
                  }
                } else {
                  this.notify('请配置规则', 'info')
                  return
                }
                param.regulationCondition = JSON.stringify(conditionList)
                param.jobList = ''
                delete param.jobListVO
              } else if (this.searchModel.ruleForm.regulationType === 0) {
                d = this.$refs.positionList.getTableData()
                if (d && d.length) {
                  param.jobList = JSON.stringify(d.map(i => i.id))
                } else {
                  this.notify('请选择职位', 'info')
                  return
                }
              }
            } else {
              param.jobList = param.jobList && JSON.stringify(param.jobList)
            }
          } else {
            param.jobList = param.jobList && JSON.stringify(param.jobList)
          }
          param.type = 0
          if (param.id) {
            this._api.banner_update(param).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              _fn.toLocation({ name: 'content' }) // -> /user/123
              localStorage.setItem('operationCenter_public', JSON.stringify({ recommendPositionDTOSList: d }))
            })
          } else {
            this._api.banner_add(param).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              _fn.toLocation({ name: 'content' }) // -> /user/123
            })
          }
        }
      })
    },
    addConditions () { // 添加条件组
      this.searchModel.ruleForm.conditionList.push(
        [{
          name: '',
          type: '',
          value: [],
          conditionList: _var.conditionFieldList,
          ruleList: [],
          optionList: [] // 字段为下拉框属性时的下拉
        }]
      )
    },
    delConditions (conditions) {
      this.searchModel.ruleForm.conditionList.splice(this.searchModel.ruleForm.conditionList.indexOf(conditions), 1)
    },
    addCondition (conditions) {
      if (conditions.length === 10) {
        _fn.message('最多添加10个条件')
        return
      }
      conditions.push({
        name: '',
        type: '',
        value: [],
        conditionList: _var.conditionFieldList,
        ruleList: [],
        optionList: [] // 字段为下拉框属性时的下拉
      })
    },
    delCondition (conditions, condition) {
      conditions.splice(conditions.indexOf(condition), 1)
    },
    conditionFieldChange (condition) {
      condition.type = ''
      condition.value = [] || ''
      if (!condition.name) {
        condition.ruleList = []
        condition.optionList = []
        return
      }
      let field = _var.conditionFieldList.filter((item) => {
        return item.value === condition.name
      })[0]
      if (field.ruleType === 1) {
        condition.ruleList = _var.rule1
      } else {
        condition.ruleList = _var.rule2
      }
      condition.valueType = field.valueType
      this.getOptionList(field, condition)
    },
    // 切换条件，获取值的下拉数据
    async getOptionList (field, condition) {
      condition.optionList = []
      switch (field.valueType) {
        case 'select':
          condition.optionList = field.itemValue
          break
        case 'company':
          await _fn.getAllCompony(res => {
            condition.optionList = res
          }, {}, true) // 所属企业
          break
        case 'city':
          await _fn.getPublicCombobox(res => {
            condition.optionList = res
          }, { comboType: 9 }, true) // 工作地址城市
          break
        case 'user':
          await _fn.getRealNameList(data => {
            condition.optionList = data.map(item => ({
              label: item.realName,
              value: item.id
            }))
          }, {}, false) // 负责人
          break
        case 'dept':
          condition.optionList = await _fn.commonBox('dept_public_dept_list') // 部门
          break
        default:
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/color.less';
.contentEdit{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 0;
  overflow: auto;
  .infoForm {
    overflow-y: hidden;
  }
  &-wrapper{
    display: flex;
    flex: 1;
  }
  .left{
    height: 200px;
    margin: 70px 0 0 20px;
    flex: 0 0 180px;
  }
  .right{
    position: relative;
    margin: 0 20px;
    width: 375px;
    height: 667px;
    display: flex;
    flex-direction: column;
    &::after{
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('../../assets/image/phone.png') no-repeat left top;
      background-size: 375px 667px;
    }
    .title{
      margin: 21px 26px 0;
      height: 114px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      margin: 44px 27px;
      flex: 1;
      height: 0;
      z-index: 1;
      overflow: auto;
    }
    .content-link{
      margin: 0;
      padding: 21px 26px;
      z-index: 0;
      overflow: initial;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .arrow{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -24px;
      cursor: pointer;
      .el-icon-arrow-right{
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
  .right-content-html{
    .title{
      display: none;
    }
  }
  .center{
    flex: 1;
    width: 0;
    height: 100%;
    overflow: auto;
    position: relative;
    border-left: 1px solid #E9EAED;
    & > div{
      position: absolute;
      width: 100%;
    }
  }
  .editFooter{
    position: initial;
    width: 100%;
  }
  .rule-wrapper {
    .rule-list {
      width: 920px;
      .rule-item {
        border: 1px solid #E9EAED;
        border-radius: 4px;
        overflow: hidden;
        padding-bottom: 20px;
      }
    }
    .rule-title {
      height: 44px;
      background: #F7F7F8;
      border-radius: 4px;
      font-size: 16px;
      color: #26334F;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 500;
      padding: 0px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .delStyle {
        color: #F73E3E;
        font-size: 14px;
        i {
          margin-right: 8px;
        }
      }
    }
    .ruleText {
      font-size: 16px;
      color: #26334F;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 500;
      margin: 20px 0px;
    }
    .rule-content {
      padding: 0px 20px;
      .rule-line {
        .el-form-item {
          width: 260px;
          margin-right: 20px;
          display: inline-block;
          /deep/ .el-form-item__content {
            margin-left: 0px !important;
            .el-select {
              display: block !important;
            }
          }
          /deep/ .el-tag {
            display: flex;
            align-items: baseline;
          }
          /deep/ .el-select__tags-text {
            max-width: 180px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .el-input {
          width: 260px;
          margin-right: 20px;
        }
        .delStyle {
          color: #F73E3E;
          margin-left: -4px;
        }
      }
    }
    .addCondition {
      padding-left: 20px;
    }
    .addConditions {
      width: 920px;
      height: 32px;
      background: #FFFFFF;
      border: 1px solid rgba(38,51,79,0.1);
      border-radius: 4px;
      text-align: center;
      margin-top: 8px;
      i {
        width: 16px;
        height: 16px;
      }
      .el-button {
        padding-top: 8px;
        width: 100%;
      }
    }
    /deep/ .el-form-item__content {
      margin-left: 20px !important;
      .infoForm-input {
        width: 300px;
      }
    }
  }
  .element__body_info .infoForm {
    overflow-y: hidden;
  }
  .pageTypeW {
    /deep/ .el-radio-group {
      width: 500px;
    }
  }
}
/deep/ .breadcrumb {
  margin-bottom: 0px;
}

</style>
