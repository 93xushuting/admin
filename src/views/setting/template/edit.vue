<template>
  <!-- 模板管理 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" label-width="120px" class="formOverflow infoForm editFooterMargin"
      id="formOverflow">
      <div class="templateBox">
        <div class="left" @click.stop="cleanEditProps">
          <div class="baseClass">
            <div class="title" @click="toArrowDown">
              基础信息
              <i :class="arrowFlag?'el-icon-arrow-down':'el-icon-arrow-up'" />
            </div>
            <div class="baseBody" v-show="!arrowFlag">
              <div v-for="(item,index) in form.leftTemp.base" :key='index' :class="item.exts.cls" @click="leftTempChange(item)">
                <span>{{item.title}}</span>
                <div class="checkbox">
                  <el-checkbox v-model="item.selected" disabled />
                </div>
              </div>
            </div>
          </div>
          <div class="baseClass" :class="form.leftTemp.work.exts.cls" @click="leftTempChange(form.leftTemp.work,'components')">
            <div class="title"><span>{{form.leftTemp.work.label}}</span> </div>
            <div class="checkbox">
              <el-checkbox v-model="form.leftTemp.work.selected" disabled />
            </div>
          </div>
          <div class="baseClass" :class="form.leftTemp.education.exts.cls" @click="leftTempChange(form.leftTemp.education,'components')">
            <div class="title"><span>{{form.leftTemp.education.label}}</span> </div>
            <div class="checkbox">
              <el-checkbox v-model="form.leftTemp.education.selected" disabled />
            </div>
          </div>
          <div class="baseClass" :class="form.leftTemp.cards.exts.cls" @click="leftTempChange(form.leftTemp.cards,'components')">
            <div class="title"><span>{{form.leftTemp.cards.label}}</span> </div>
            <div class="checkbox">
              <el-checkbox v-model="form.leftTemp.cards.selected" disabled />
            </div>
          </div>
          <div class="baseClass">
            <div class="title" @click="toArrowDown2">
              其他信息
              <i :class="arrowFlag2?'el-icon-arrow-down':'el-icon-arrow-up'" />
            </div>
            <div class="baseBody" v-show="!arrowFlag2">
              <div v-for="(item,index) in form.leftTemp.more" :key='index' :class="item.exts.cls" @click="leftTempChange(item)">
                <span>{{item.title}}</span>
                <div class="checkbox">
                  <el-checkbox v-model="item.selected" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="center" @click.stop="cleanEditProps">
          <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`表单设计 `,value: 'start'}]" style="padding:0px;" />
          <div class="title">
            <el-form-item label="模板名称" prop="name">
              <zp-input v-model="form.ruleForm.name" />
            </el-form-item>
            <el-form-item label="模板说明" prop="description">
              <zp-input v-model="form.ruleForm.description" :maxlength="500" rows="3" type="textarea" limit="true" />
            </el-form-item>
          </div>
          <div class="base">
            <div class="message">基础信息</div>
            <template v-for="(item,index) in showList">
              <template v-if="item.isComponent">
                <div :key="index" draggable="true" class="components draggable" :id="'anchor_'+item.name" @click.stop="cleanEditProps(item)">
                  <div class="message2" :key="index">{{item.label.replace('（组件）','')}}</div>
                  <i class="iconfont icontuozhuai" />
                  <template v-for="(child,index2) in item.data">
                    <el-form-item :label="child.title" :required="child.sysRequired" :key="index2">
                      <template v-if="child.exts.formType === 'select'">
                        <zp-select v-model="form.ruleForm[child.name]" :data="child.data" style="width:100%" :placeholder="child.text" disabled />
                      </template>
                      <template v-if="child.exts.formType === 'file'">
                        <zp-upload uploadType="image" disabled />
                      </template>
                      <template v-if="child.exts.formType === 'input'">
                        <zp-input v-model.trim="form.ruleForm[child.name]" :placeholder="child.text" disabled />
                      </template>
                      <template v-if="child.exts.formType === 'textarea'">
                        <zp-input type="textarea" v-model.trim="form.ruleForm[child.name]" :placeholder="child.text" disabled :maxlength="500"
                          rows="3" limit="true" />
                      </template>
                      <template v-if="child.exts.formType === 'datePick'">
                        <template v-if="child.name === 'work_endTime' || child.name === 'education_endTime'">
                          <el-date-picker type="date" v-model="form.ruleForm[child.name]" style="width:79%;" :placeholder="child.text" disabled />
                          <el-checkbox disbled style="width:20%;text-align: right;">到今</el-checkbox>
                        </template>
                        <template v-else>
                          <el-date-picker type="date" v-model="form.ruleForm[child.name]" style="width:100%;" :placeholder="child.text" disabled />
                        </template>
                      </template>

                    </el-form-item>
                  </template>
                  <i class="iconfont iconshanchu" @click="deleteNode(item)" />
                </div>
              </template>
              <template v-else>
                <template v-if="item.name === 'base_name'">
                  <el-form-item :key="index" label="姓名" required="true" class="noDashed">
                    <zp-input v-model="form.ruleForm.base_name" :placeholder="item.text" disabled />
                  </el-form-item>
                </template>
                <template v-else>
                  <div :key="index" draggable="true" class="elements draggable" @click.stop="editProps(item,index)" :id="'anchor_'+item.name">
                    <el-form-item :label="item.title" :required="item.sysRequired">
                      <i class="iconfont icontuozhuai" />
                      <template v-if="item.exts.formType === 'select'">
                        <zp-select v-model="form.ruleForm[item.name]" :data="item.data" style="width:100%" :placeholder="item.text" disabled />
                      </template>
                      <template v-if="item.exts.formType === 'input'">
                        <template v-if="item.name === 'more_height' || item.name === 'more_weight' || item.name === 'base_phoneNumber'">
                          <template v-if="item.name === 'base_phoneNumber'">
                            <el-input v-model.trim="form.ruleForm[item.name]" :placeholder="item.text" required="true"
                              style="width:100%;margin-left:0;margin-bottom:0" disabled>
                              <el-select slot="prepend" placeholder="请选择" style="width:130px;" disabled></el-select>
                            </el-input>
                          </template>
                          <template v-else>
                            <el-input v-model.trim="form.ruleForm[item.name]" :placeholder="item.text" disabled style="width:100%">
                              <template slot="append">{{item.name === 'more_height'? 'CM' : 'KG'}}</template>
                            </el-input>
                          </template>
                        </template>
                        <template v-else>
                          <zp-input v-model.trim="form.ruleForm[item.name]" :placeholder="item.text" disabled />
                        </template>
                      </template>
                      <template v-if="item.exts.formType === 'textarea'">
                        <zp-input type="textarea" v-model.trim="form.ruleForm[item.name]" :placeholder="item.text" disabled :maxlength="500" rows="3"
                          limit="true" />
                      </template>
                      <template v-if="item.exts.formType === 'datePick'">
                        <el-date-picker type="date" v-model="form.ruleForm[item.name]" style="width:100%" :placeholder="item.text" disabled />
                      </template>
                      <template v-if="item.exts.formType === 'file'">
                        <zp-upload uploadType="image" disabled />
                      </template>
                      <i class="iconfont iconshanchu" @click="deleteNode(item)" v-if="item.name !== 'base_phoneNumber'" />
                    </el-form-item>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
        <div class="right">
          <div class="baseClass">
            <div class="title">字段属性</div>
            <div class="baseBody baseBody2">
              <template v-if="isShowSetting">
                <el-form-item label="字段名称" prop="propsName">
                  <el-input disabled v-model="form.ruleForm.propsName" />
                </el-form-item>
                <el-form-item label="提示语" prop="propsPlaceholder">
                  <el-input :maxlength="20" v-model="form.ruleForm.propsPlaceholder" :placeholder="form.ruleForm.propsPlaceholder"
                    @input="propsPlaceholderChange" />
                </el-form-item>
                <el-form-item label="校验规则">
                  <el-checkbox v-model="form.ruleForm.propsIsCheck" @input="propsIsCheckChange" :disabled="form.ruleForm.propsName === '手机号'">必填
                  </el-checkbox>
                </el-form-item>
              </template>
              <p v-else>
                <i class="iconfont iconxiugaizhanghuxinxi" /><br />
                组件暂无配置项
              </p>
            </div>
          </div>
        </div>
        <div class="editFooter">
          <zp-button @click="save" type="primary">保 存</zp-button>
          <zp-button @click="toPage">取 消</zp-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'zpFlowEdit',
  data () {
    return {
      obj: {
        breadcrumb: {
          // title: this.$route.meta.name
        }
      },
      tagName: 'start',
      arrowFlag: false,
      arrowFlag2: false,
      title: '',
      routeParams: JSON.parse(decodeURI(this.$route.params.id)),
      // 展示列表，添加到未尾
      showList: [
        { name: 'base_name', title: '姓名', hasComboBox: false, exts: { formType: 'input', cls: 'borders' }, type: 'String', sysRequired: true, text: '请输入', selected: true }
      ],
      showListMap: {}, // 与showList 同步，防止重复添加数据
      isShowSetting: false,
      clickElement: {}, // 点击对象展示 属性
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        leftTemp: {
          // {
          //   name : '', // 英文名
          //   title : '', // 中文名
          //   hasComboBox: true, // 是不是组件
          //   required: true, // 是否验证
          //   sysRequired: true,
          //   text: '', // 提示语
          //   type:  // 类型
          // } 
          base: {
            base_avatar: { name: 'base_avatar', title: '头像', hasComboBox: false, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入', selected: false },
            base_name: { name: 'base_name', title: '姓名', hasComboBox: false, exts: { formType: 'input', cls: 'borders' }, type: 'String', sysRequired: true, text: '请输入', selected: true },
            base_gender: { name: 'base_gender', title: '性别', hasComboBox: false, exts: { formType: 'select' }, type: 'Integer', sysRequired: false, text: '请选择', selected: false },
            base_birthday: { name: 'base_birthday', title: '生日', hasComboBox: false, exts: { formType: 'datePick' }, type: 'Date', sysRequired: false, text: '请输入', selected: false },
            base_age: { name: 'base_age', title: '年龄', hasComboBox: false, exts: { formType: 'input' }, type: 'Integer', sysRequired: false, text: '请输入', selected: false },
            base_education: { name: 'base_education', title: '最高学历', hasComboBox: false, exts: { formType: 'select' }, type: 'Integer', sysRequired: false, text: '请输入', selected: false },
            base_registerLocation: { name: 'base_registerLocation', title: '家乡', hasComboBox: false, exts: { formType: 'select' }, type: 'Integer', sysRequired: false, text: '请选择', selected: false },
            base_currentLocation: { name: 'base_currentLocation', title: '现居住地', hasComboBox: false, exts: { formType: 'select' }, type: 'Integer', sysRequired: false, text: '请选择', selected: false },
            base_startingTime: { name: 'base_startingTime', title: '开始工作时间', hasComboBox: false, exts: { formType: 'datePick' }, type: 'Date', sysRequired: false, text: '请输入', selected: false },
            base_marriageBirth: { name: 'base_marriageBirth', title: '婚育情况', hasComboBox: false, exts: { formType: 'select' }, type: 'String', sysRequired: false, text: '请选择', selected: false },
            base_phoneNumber: { name: 'base_phoneNumber', title: '手机号', hasComboBox: false, exts: { formType: 'input' }, type: 'String', sysRequired: true, text: '请输入', selected: false },
            base_wechat: { name: 'base_wechat', title: '微信号', hasComboBox: false, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入', selected: false }
          },
          work: {
            name: 'work',
            exts: {
              cls: ''
            },
            label: '工作经历（组件）',
            selected: false,
            isComponent: true,
            data: {
              work_companyName: { name: 'work_companyName', title: '公司名称', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: true, text: '请输入' },
              work_position: { name: 'work_position', title: '职位名称', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: true, text: '请输入' },
              work_timeRequired: { name: 'work_timeRequired', title: '工作性质', hasComboBox: true, exts: { formType: 'select' }, type: 'Integer', sysRequired: true, text: '请选择' },
              work_startTime: { name: 'work_startTime', title: '开始时间', hasComboBox: true, exts: { formType: 'datePick' }, type: 'Date', sysRequired: true, text: '请选择' },
              work_endTime: { name: 'work_endTime', title: '结束时间', hasComboBox: true, exts: { formType: 'datePick' }, type: 'Date', sysRequired: true, text: '请选择' },
              work_referenceName: { name: 'work_referenceName', title: '证明人', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入' },
              work_referencePhone: { name: 'work_referencePhone', title: '证明人电话', hasComboBox: true, exts: { formType: 'input' }, type: 'input', sysRequired: false, text: '请输入' },
              work_description: { name: 'work_description', title: '工作描述', hasComboBox: true, exts: { formType: 'textarea' }, type: 'String', sysRequired: false, text: '请输入' }
            }
          },
          education: {
            name: 'education',
            exts: {
              cls: ''
            },
            label: '教育经历（组件）',
            selected: false,
            isComponent: true,
            data: {
              education_education: { name: 'education_education', title: '学历', hasComboBox: true, exts: { formType: 'select' }, type: 'Integer', sysRequired: true, text: '请输入' },
              education_school: { name: 'education_school', title: '学校名称', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: true, text: '请输入' },
              education_major: { name: 'education_major', title: '专业', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入' },
              education_startTime: { name: 'education_startTime', title: '开始时间', hasComboBox: true, exts: { formType: 'datePick' }, type: 'Date', sysRequired: true, text: '请选择' },
              education_endTime: { name: 'education_endTime', title: '结束时间', hasComboBox: true, exts: { formType: 'datePick' }, type: 'Date', sysRequired: true, text: '请选择' },
              education_referenceName: { name: 'education_referenceName', title: '证明人', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入' },
              education_referencePhone: { name: 'education_referencePhone', title: '证明人电话', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入' },
              education_description: { name: 'education_description', title: '教育经历描述', hasComboBox: true, exts: { formType: 'textarea' }, type: 'String', sysRequired: false, text: '请输入' }
            }
          },
          cards: {
            name: 'cards',
            exts: {
              cls: ''
            },
            label: '证件（组件）',
            selected: false,
            isComponent: true,
            data: {
              cards_identityType: { name: 'cards_identityType', title: '证件类型', hasComboBox: true, exts: { formType: 'select' }, type: 'Integer', sysRequired: true, text: '请输入' },
              cards_identityName: { name: 'cards_identityName', title: '证件名称', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: true, text: '请输入' },
              cards_identityNumber: { name: 'cards_identityNumber', title: '证件编号', hasComboBox: true, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入' },
              cards_expiryDate: { name: 'cards_expiryDate', title: '有效期至', hasComboBox: true, exts: { formType: 'datePick' }, type: 'Date', sysRequired: true, text: '请选择' },
              cards_identityPic: { name: 'cards_identityPic', title: '上传证件', hasComboBox: true, exts: { formType: 'file' }, type: 'String', sysRequired: true, text: '请选择' }
            }
          },
          more: {
            more_height: { name: 'more_height', title: '身高', hasComboBox: false, exts: { formType: 'input' }, type: 'Integer', sysRequired: false, text: '请输入', selected: false },
            more_weight: { name: 'more_weight', title: '体重', hasComboBox: false, exts: { formType: 'input' }, type: 'Integer', sysRequired: false, text: '请输入', selected: false },
            more_tags: { name: 'more_tags', title: '爱好', hasComboBox: false, exts: { formType: 'input' }, type: 'String', sysRequired: false, text: '请输入', selected: false },
            more_selfDesc: { name: 'more_selfDesc', title: '自我评价', hasComboBox: false, exts: { formType: 'textarea' }, type: 'String', sysRequired: false, text: '请选择', selected: false },
            more_pics: { name: 'more_pics', title: '生活照', hasComboBox: false, exts: { formType: 'file' }, type: 'String', sysRequired: false, text: '请选择', selected: false }
          }
        },
        ruleForm: {
          name: '',
          description: '',
          // 字段属性
          propsName: '',
          propsPlaceholder: '',
          propsIsCheck: ''
        },
        rules: {
          name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
          description: [{ required: true, message: '请输入模板说明', trigger: 'change' }],
          // // base 
          // base_avatar: [{ required: true, message: '请选择头像', trigger: 'blur' }],
          // base_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          // base_sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
          // base_birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
          // base_age: [{ required: true, message: '请选择年龄', trigger: 'change' }],
          // base_education: [{ required: true, message: '请选择最高学历', trigger: 'change' }],
          // base_hometown: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
          // base_address: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
          // base_workTime: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
          // base_isMarry: [{ required: true, message: '请选择婚育情况', trigger: 'change' }],
          // base_phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          // base_wechart: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
          // // work
          // work_companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
          // work_name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
          // work_workNature: [{ required: true, message: '请选择工作性质', trigger: 'change' }],
          // work_startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          // work_entTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          // // education
          // education_education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
          // education_name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
          // education_startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          // education_entTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          // // card 
          // cards_type: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
          // cards_name: [{ required: true, message: '请输入证件名称', trigger: 'blur' }],
          // cards_time: [{ required: true, message: '请选择有效期至', trigger: 'change' }],
          // cards_upload: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          // other

          // 字段属性
          propsName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
          propsPlaceholder: [{ required: true, message: '请输入提示语', trigger: 'blur' }]
        }
      }
    }
  },
  mounted () {
    this.idx = this.routeParams.id
    let type = this.routeParams.type
    let metaName = ''
    if (type === 'copy') { // copy
      this.getById(this.routeParams.copyId, () => {
        this.$nextTick(() => {
          this.$route.meta.name = '新增模板'
          this.sortTable() // 添加拖拽事件
        })
      })
    } else if (type === 'edit') {
      this.getById(this.idx, () => {
        this.$nextTick(() => {
          this.$route.meta.name = this.idx === '1' ? '默认投递模板' : '编辑模板'
          this.sortTable() // 添加拖拽事件
        })
      })
    } else if (type === 'add') {
      this.$nextTick(() => {
        this.$route.meta.name = '新增模板'
        let phone = this.form.leftTemp.base.base_phoneNumber
        phone.selected = !phone.selected
        phone.exts.cls = phone.selected ? 'borders' : ''
        this.showList.push(phone)
        this.showListMap[phone.name] = phone
        this.leftTempChange(phone) // 默认点击手机选中
      })
    }
  },
  methods: {
    getById (id, fn) {
      this._api.delivery_template_details({ id: id }).then((res) => {
        let self = this
        let obj = res.data
        this.form.ruleForm.name = obj.name
        this.form.ruleForm.description = obj.description
        setParam(obj)
        fn && fn()
        function setParam (data) {
          let oo = {} // 左侧
          let array = [] // 右侧
          if (data.baseInfoTemplate && data.baseInfoTemplate.props && data.baseInfoTemplate.props.length) {
            oo.baseInfoTemplate = data.baseInfoTemplate.props.map((ele) => {
              if (ele.exts && ele.exts.length) {
                ele.exts = JSON.parse(ele.exts)
              }
              ele.name = 'base_' + ele.name
              self.form.leftTemp.base[ele.name] = ele
              array.push(ele)
              return ele
            })
          }
          if (data.experienceTemplate) {
            let works = self.form.leftTemp.work
            if (data.experienceTemplate.props && data.experienceTemplate.props.length) {
              data.experienceTemplate.props.map((ele) => {
                if (ele.exts && ele.exts.length) {
                  ele.exts = JSON.parse(ele.exts)
                }
                ele.name = 'work_' + ele.name
                works.data[ele.name] = ele
                return ele
              })
            }
            works.exts.cls = 'borders'
            works.selected = true
            works.sequence = works.data.work_companyName.sequence
            array.push(works)
            oo.experienceTemplate = works
          }
          if (data.educationTemplate) {
            let education = self.form.leftTemp.education
            if (data.educationTemplate.props && data.educationTemplate.props.length) {
              data.educationTemplate.props.map((ele) => {
                if (ele.exts && ele.exts.length) {
                  ele.exts = JSON.parse(ele.exts)
                }
                ele.name = 'education_' + ele.name
                education.data[ele.name] = ele
                return ele
              })
            }
            education.exts.cls = 'borders'
            education.selected = true
            education.sequence = education.data.education_education.sequence
            array.push(education)
            oo.educationTemplate = education
          }
          if (data.identityTemplate) {
            let cards = self.form.leftTemp.cards
            if (data.identityTemplate.props && data.identityTemplate.props.length) {
              data.identityTemplate.props.map((ele) => {
                if (ele.exts && ele.exts.length) {
                  ele.exts = JSON.parse(ele.exts)
                }
                ele.name = 'cards_' + ele.name
                cards.data[ele.name] = ele
                return ele
              })
            }
            cards.exts.cls = 'borders'
            cards.selected = true
            cards.sequence = cards.data.cards_identityType.sequence
            array.push(cards)
            oo.identityTemplate = cards
          }
          if (data.othersTemplate && data.othersTemplate.props && data.othersTemplate.props.length) {
            oo.othersTemplate = data.othersTemplate.props.map((ele) => {
              if (ele.exts && ele.exts.length) {
                ele.exts = JSON.parse(ele.exts)
              }
              ele.name = 'more_' + ele.name
              self.form.leftTemp.more[ele.name] = ele
              array.push(ele)
              return ele
            })
          }
          self.showList = array.sort((a, b) => { return a.sequence - b.sequence })
          console.info(oo, array)
          return oo
        }
      })
    },
    toPage () {
      _fn.toLocation({ name: 'template' }) // -> /user/123
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let url = ''
          let param = this.getParam()
          if (this.idx === '0') { // 新增
            url = 'delivery_template_add'
          } else { // 修改
            url = 'delivery_template_update'
            param.id = this.idx
          }
          this._api[url](param).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            this.toPage()
          })
        }
      })
    },
    getParam () { // 获取参数值
      let data = JSON.parse(JSON.stringify(this.showList))
      let p = this.form.ruleForm
      let d = getComponentInfo(data)
      console.info('获取参数值', d)
      let obj = {
        name: p.name,
        description: p.description
      }
      if (d.baseInfoTemplate.props && d.baseInfoTemplate.props.length) {
        obj.baseInfoTemplate = d.baseInfoTemplate
      }
      if (d.experienceTemplate.props && d.experienceTemplate.props.length) {
        obj.experienceTemplate = d.experienceTemplate
      }
      if (d.educationTemplate.props && d.educationTemplate.props.length) {
        obj.educationTemplate = d.educationTemplate
      }
      if (d.identityTemplate.props && d.identityTemplate.props.length) {
        obj.identityTemplate = d.identityTemplate
      }
      if (d.othersTemplate.props && d.othersTemplate.props.length) {
        obj.othersTemplate = d.othersTemplate
      }
      return obj
      function getComponentInfo (data) {
        let arr = []
        let map = {
          baseInfoTemplate: { code: '', name: '基础信息', order: 1, props: [] },
          experienceTemplate: { code: '', name: '工作经历', order: 2, props: [] },
          educationTemplate: { code: '', name: '教育经历', order: 3, props: [] },
          identityTemplate: { code: '', name: '证件', order: 4, props: [] },
          othersTemplate: { code: '', name: '其他', order: 5, props: [] }
        }
        for (let j = 0; j < data.length; j++) {
          let d = data[j]
          if (d.isComponent) { // 组件
            let child = d.data
            for (let i in child) {
              let v = child[i]
              arr.push(v)
            }
          } else { // 元素
            arr.push(d)
          }
        }
        arr.map((item, index) => {
          item.sequence = ++index
          item.required = item.sysRequired
          item.exts = JSON.stringify(item.exts)
          if (item.name.indexOf('base_') > -1) { // base
            item.name = item.name.replace('base_', '')
            map.baseInfoTemplate.props.push(item)
          } else if (item.name.indexOf('work_') > -1) { // work_
            item.name = item.name.replace('work_', '')
            map.experienceTemplate.props.push(item)
          } else if (item.name.indexOf('education_') > -1) { // education
            item.name = item.name.replace('education_', '')
            map.educationTemplate.props.push(item)
          } else if (item.name.indexOf('cards_') > -1) { // cards
            item.name = item.name.replace('cards_', '')
            map.identityTemplate.props.push(item)
          } else if (item.name.indexOf('more_') > -1) { // more
            item.name = item.name.replace('more_', '')
            map.othersTemplate.props.push(item)
          }
          return item
        })
        // map.list = arr
        return map
      }
    },
    editProps (item) { // 编辑属性
      this.isShowSetting = true
      this.form.ruleForm.propsName = item.title
      this.form.ruleForm.propsPlaceholder = item.text
      this.form.ruleForm.propsIsCheck = item.sysRequired
      this.$set(this, 'clickElement', item)
      // this.clickElement = item
      console.info(' 编辑属性 ', item.name)
    },
    propsPlaceholderChange (val) {
      this.clickElement.text = val
      // if (this.clickElement.name === 'base_phoneNumber') {
      //   this.$set(this.clickElement, 'text', val)
      // }
      // let phone = this.form.leftTemp.base.base_phoneNumber.text
      // console.info('propsPlaceholderChange', phone)
    },
    propsIsCheckChange (val) {
      this.clickElement.sysRequired = val
      console.info('propsPlaceholderChange', val)
    },
    cleanEditProps (item) { // 清空属性
      this.isShowSetting = false
      console.info(' 清空属性 ')
    },
    deleteNode (item) { // 删除节点
      this.leftTempChange(item)
    },
    leftTempChange (item) { // 左侧点击
      // if (item.name === 'base_name' || item.name === 'base_phoneNumber') { return }
      if (item.name === 'base_name' || item.name === 'base_phoneNumber') { return }
      item.selected = !item.selected
      item.exts.cls = item.selected ? 'borders' : ''
      this.isShowSetting = false // 清空属性
      if (item.selected) {
        this.showList.push(item)
        this.showListMap[item.name] = item
      } else {
        this.showList.forEach((i, j) => {
          if (i.name === item.name) {
            this.showList.splice(j, 1)
          }
        })
        delete this.showListMap[item.name]
      }
      this.$nextTick(() => {
        this.sortTable() // 添加拖拽事件
        if (item.selected) { // 描点
          let formOverflow = document.getElementById('formOverflow')
          let id = document.getElementById('anchor_' + item.name)
          formOverflow.scrollTop = id.offsetTop
          console.info('描点', formOverflow.scrollTop)

          if (id) {
            formOverflow.scrollTop = id.offsetTop
            let childClass = null
            if (id.className.indexOf('components draggable') > -1) {
              childClass = id
            } else {
              childClass = id.getElementsByClassName('el-form-item')[0]
            }
            if (childClass) {
              console.info(id.className)
              childClass.className = childClass.className + ' heart'
              childClass.timer = setTimeout(function () {
                childClass.className = childClass.className.replace(' heart', '')
                clearTimeout(childClass.timer)
                childClass.timer = null
              }, 3000)
            }
          }
        }
      })
      console.info(' ---- ', this.showListMap)
    },
    toArrowDown () {
      this.arrowFlag = !this.arrowFlag
    },
    toArrowDown2 () {
      this.arrowFlag2 = !this.arrowFlag2
    },
    sortTable () {
      let self = this
      let list = document.querySelectorAll('.draggable')
      console.info('draggable', list)
      let start = -1
      let end = -1
      for (let i = 0; i < list.length; i++) {
        let dom = list[i]
        dom.__index = i
        dom.ondragstart = null
        dom.ondragstart = function () {
          console.info('ondragstart', dom.__index)
          start = dom.__index
        }
        dom.ondragover = null
        dom.ondragover = function (ev) {
          ev.preventDefault()
        }
        dom.ondrop = null
        dom.ondrop = function (ev) {
          console.info('ondrop', dom.__index)
          end = dom.__index
          self.swapArr(self.showList, start + 1, end + 1)
          self.$nextTick(() => {
            self.sortTable() // 添加拖拽事件
          })
        }
      }
    },
    // 两个元素换位子
    swapArr (arr, dom1, dom2) {
      arr[dom1] = arr.splice(dom2, 1, arr[dom1])[0]
      return arr
    }
  }
}
</script>
<style lang="less" scoped>
.formOverflow{
  overflow-y: auto;
  height: 100%;
  margin-bottom: 54px;
  .templateBox{
    display:flex;
    position: relative;
    /deep/ .el-textarea{
      line-height: 0px;
      .el-input__count {
        bottom: 10px;
      }
    }
    /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #fff;
    }
    /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #409EFF !important;
      border-color: #409EFF !important;
      cursor: pointer !important;
    }
    /deep/.el-input__inner{
      height:38px;
      line-height: 36px;
    }
    /deep/.el-form-item {
      margin-bottom: 18px;
    }
    .left{
      width:320px;
      margin: 0 20px;
      position: fixed;
      margin-left: 20px;
      overflow-y: auto;
      height: calc(100% - 250px);
    }
    .right{
      width:320px;
      position: fixed;
      right:30px;
      /deep/.el-form-item {
        .el-form-item__label{
          width: 88px !important;
        }
        .el-form-item__content{
          margin-left:88px !important;
        }
      }
    }  
    .borders{
      border:1px solid #4A84FF !important;
      .checkbox{
        display:inline-block !important;
      }
    }
    .baseClass{
      /deep/.el-input__inner{
        line-height: 36px;
        height: 36px;
        width: 200px;
      }
      border: 1px solid #26334f1a;
      position: relative;
      margin-bottom: 5px;
      .checkbox{
        display: none;
        position: absolute;
        right: 10px;
        top: 6px;
      }
      .title{
        padding: 8px;
        font-size: 14px;
        padding-left: 20px; 
        background: #e5e5e5;
        i{
          font-size: 18px;
          float: right;
        }
      }
      .title:first-child,title:last-child{
        cursor: pointer;
      }
      .baseBody{
        overflow-y: auto;
        height: 245px;
        .borders{
          border:1px solid #4A84FF;
          .checkbox{
            display:inline-block;
          }
        }
        >div{
          border: 1px solid #26334f1a;
          padding: 8px 10px 8px 16px;
          margin: 10px 18px;
          font-size: 14px;
          position: relative;
          border-radius: 4px;
          cursor: pointer;
          .checkbox{
            display: none;
            position: absolute;
            right: 10px;
          }
        }
        p{
          font-size: 14px;
          color: #69707F;
          text-align: center;
          margin-top: 80px;
          i{
            font-size: 40px;
          }
        }
      }
      .baseBody2{
        margin-top: 18px;
        >div{
          border: 0 solid #26334f1a; 
          padding: 0;
          margin: 0;
          margin-bottom: 18px;
        }
      }
    }
    .center{
      flex:1;
      margin: -20px 360px 0;
      .title{
        padding:16px 66px 0 20px;
        border:1px solid #26334F1a;
        margin: 10px 0;
      }
      .base{
        border:1px solid #26334F1a;
        margin-bottom: 10px;
        .message{
          font-family: 'PingFangSC-Medium';
          font-size: 14px;
          color: #26334F;
          letter-spacing: 0;
          line-height: 30px;
          padding: 15px 0 10px 20px;
        }
        .noDashed{
          border: 0px dashed #eee;
          margin: 0 66px 18px 10px;
        }
        .components.draggable{
          border-radius: 4px;
          margin: 0 10px 10px;
          border: 1px dashed #BFC5D2;
          position: relative;
          .message2{
            font-family: 'PingFangSC-Medium';
            font-size: 14px;
            color: #26334F;
            letter-spacing: 0;
            line-height: 30px;
            padding: 15px 0 10px 30px;
          }
          i.icontuozhuai{
            position: absolute;
            left: 6px;
            top: 50%;
            display: none;
          }
          i.iconshanchu{
            position: absolute;
            right: 18px;
            top: 50%;
            display: none;
          }
          &:hover{
            background: #F7F8FA;
            border-radius: 4px;
            i.icontuozhuai{
              display: block;
              cursor: all-scroll;
            }
            i.iconshanchu{
              display: block;
              cursor:pointer;
            }
          }
          /deep/.el-form-item{
            .el-form-item__content{
              margin-right: 56px;
            }
          }
        }
        .elements.draggable{
          /deep/.el-form-item{
            margin: 0 10px 10px;
            border: 1px dashed #BFC5D2;
            border-radius: 4px;
            position: relative;
            i.icontuozhuai{
              position: absolute;
              left: -114px;
              display: none;
            }
            i.iconshanchu{
              position: absolute;
              right: -35px;
              top: 10px;
              display: none;
            }
            &:hover{
              background: #F7F8FA;
              border-radius: 4px;
              i.icontuozhuai{
                display: block;
                cursor: all-scroll;
              }
              i.iconshanchu{
                display: block;
                cursor:pointer;
              }
            }
            .el-form-item__label{
              padding: 10px 12px 0 0;
            }
            .el-form-item__content{
              margin-right: 56px;
              padding: 10px 0;
            }
          }
        }
      }
    }
  }
}

/* 添加元素后动画 */
.heart{
  animation: heart 0.5s infinite;
}
@keyframes heart{
  0%{border:1px dashed #BFC5D2}
  50%{border:1px dashed red}
  100%{border:1px dashed #BFC5D2} 
}

/* 滚动条 */
.baseBody,.formOverflow,.left{
  &::-webkit-scrollbar {
    z-index: 11;
    width: 8px;
  }
  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-corner {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 8px;
    background: #e5e5e5;
  }
  &::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 8px;
  }
}
</style>
