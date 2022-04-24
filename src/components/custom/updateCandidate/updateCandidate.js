import formCheck from '@/util/formCheck'

export default {
  name: 'UpdateCandidate',
  props: {
    // 来源人才库时不可见
    otherInfovisible: {
      type: Boolean,
      default: true
    },
    updateId: {
      type: [String, Number],
      default: ''
    },
    editFormInfo: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isShowInterviewForm: false,
      isShowInterview: true,
      mobileMap: {}, // 联系人map
      interviewForm: { // 面试邀约表单
        name: 'interviewForm.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          time: { formType: 'datePick', label: '面试时间', placeholder: '请选择', isShow: true },
          hour: { formType: 'datePick', label: '', placeholder: '请选择', isShow: true },
          contact: { formType: 'select', label: '联系人', placeholder: '请选择联系人', isShow: true, data: [], allowCreate: true },
          mobile: { label: '联系人电话', placeholder: '请选择联系人', isShow: true, maxlength: 20 },
          addressId: { formType: 'select', label: '面试地址', placeholder: '请选择', isShow: true, data: [], allowCreate: true },
          notes: { type: 'textarea', label: '注意事项', placeholder: '请输入注意事项', isShow: true, maxlength: 200, limit: true, rows: 5 },
          invitationMethod: {
            isShow: true,
            formType: 'custom',
            label: '  ',
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
          mobile: '', // 手机号
          notes: '',
          contact: '',
          addressId: '', // 默认面试地址
          invitationMethod: ['wxMsgFlag'] // 邀约方式
        },
        rules: {
          addressId: [{ required: true, message: '请选择面试地址', trigger: 'blur' }],
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
          })
        }
      },
      otherInfo_hobbyTagFlag: false,
      otherInfo_tagValue: '',
      phoneAreaCode: [],
      areaOptions: [],
      allJobIdData: [],
      candidateForm: {
        name: 'candidateForm',
        labelWidth: '130px',
        isShowLabel: true,
        formInline: true,
        temp: {
          jobId: {
            isShow: true,
            label: '应聘职位',
            formType: 'select',
            filterable: true,
            disabled: this.editFormInfo.idx > 0,
            data: []
          },
          companyId: {
            isShow: true,
            label: '所属企业',
            formType: 'select',
            disabled: this.editFormInfo.idx > 0,
            filterable: true,
            data: []
          },
          addressIds: {
            isShow: true,
            label: '期望工作地址',
            formType: 'custom',
            key: 'addressIds',
            multiple: true,
            collapseTags: true,
            multipleLimit: 5,
            data: []
          },
          partJobTime: {
            isShow: false,
            label: '可兼职时间',
            formType: 'custom',
            key: 'partJobTime',
            multiple: true,
            collapseTags: true,
            multipleLimit: 5,
            data: []
          },
          deliveryChannelType: {
            isShow: true,
            formType: 'custom',
            key: 'deliveryChannelType',
            label: '渠道来源',
            placeholder: '请选择',
            filterable: true,
            data: []
          },
          recommender: {
            isShow: true,
            label: '推荐人',
            formType: 'input',
            maxlength: 20
          },
          recommenderPhoneNumber: {
            isShow: true,
            label: '推荐人电话',
            formType: 'custom',
            key: 'recommenderPhoneNumber'
          },
          // 基本信息
          baseInfoTemplate: {
            name: {
              formType: 'custom',
              key: 'name',
              maxlength: 20
            },
            avatar: {
              formType: 'custom',
              key: 'avatar'
            },
            gender: {
              formType: 'custom',
              data: _var.sex,
              key: 'gender'
            },
            birthday: {
              formType: 'custom',
              prefixIcon: 'el-icon-date',
              key: 'birthday',
              valueFormat: ''
            },
            age: {
              formType: 'custom',
              key: 'age'
            },
            marriageBirth: {
              formType: 'custom',
              key: 'marriageBirth',
              data: _var.marriageBirth
            },
            startingTime: {
              formType: 'custom',
              prefixIcon: 'el-icon-date',
              key: 'startingTime',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: '',
              props: {
                formType: 'datePick'
              }
            },
            education: {
              formType: 'custom',
              key: 'education',
              data: _var.educationRequirement.filter(item => !!item.value)
            },
            registerLocation: {
              formType: 'custom',
              key: 'registerLocation'
            },
            currentLocation: {
              formType: 'custom',
              key: 'currentLocation'
            },
            phoneNumber: {
              formType: 'custom',
              key: 'phoneNumber'
            },
            wechat: {
              formType: 'custom',
              key: 'wechat',
              maxlength: 20
            }
          },
          // 工作经历
          experienceTemplate: {
            companyName: {
              formType: 'custom',
              maxlength: 20,
              key: 'companyName'
            },
            position: {
              formType: 'custom',
              maxlength: 20,
              key: 'position'
            },
            timeRequired: {
              formType: 'custom',
              key: 'timeRequired',
              data: _var.workNature
            },
            startTime: {
              formType: 'custom',
              key: 'startTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            endTime: {
              formType: 'custom',
              key: 'endTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            referenceName: {
              formType: 'custom',
              maxlength: 20,
              key: 'referenceName'
            },
            referencePhone: {
              formType: 'custom',
              key: 'referencePhone'
            },
            description: {
              formType: 'custom',
              key: 'description',
              maxlength: 200,
              limit: true
            }
          },
          // 教育经历
          educationTemplate: {
            education: {
              formType: 'custom',
              key: 'education',
              data: _var.educationRequirement.filter(item => !!item.value)
            },
            school: {
              formType: 'custom',
              key: 'school',
              maxlength: 20
            },
            major: {
              formType: 'custom',
              key: 'major',
              maxlength: 20
            },
            startTime: {
              formType: 'custom',
              key: 'startTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            endTime: {
              formType: 'custom',
              key: 'endTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            referenceName: {
              formType: 'custom',
              maxlength: 20,
              key: 'referenceName'
            },
            referencePhone: {
              formType: 'custom',
              key: 'referencePhone'
            },
            description: {
              formType: 'custom',
              key: 'description',
              maxlength: 200,
              limit: true,
              rows: 4
            }
          },
          // 证件信息
          identityTemplate: {
            identityType: {
              formType: 'custom',
              key: 'identityType',
              data: _var.identityType
            },
            identityName: {
              formType: 'custom',
              key: 'identityName',
              maxlength: 20
            },
            identityNumber: {
              formType: 'custom',
              key: 'identityNumber',
              maxlength: 20
            },
            expiryDate: {
              formType: 'custom',
              key: 'expiryDate',
              prefixIcon: 'el-icon-date',
              valueFormat: ''
            },
            identityPic: {
              formType: 'custom',
              key: 'identityPic'
            }
          },
          // 其他信息
          othersTemplate: {
            height: {
              formType: 'custom',
              key: 'height'
            },
            weight: {
              formType: 'custom',
              key: 'weight'
            },
            tags: {
              formType: 'custom',
              key: 'tags'
            },
            selfDesc: {
              formType: 'custom',
              rows: 4,
              limit: true,
              maxlength: 200,
              key: 'selfDesc'
            },
            pics: {
              formType: 'custom',
              key: 'pics'
            }
          }
        },
        ruleForm: {
          jobId: '',
          companyId: '',
          addressIds: [],
          partJobTime: [],
          deliveryChannelType: [],
          recommender: _store.state.user.obj.realName,
          prefix_recommenderPhoneNumber: '+86',
          recommenderPhoneNumber: _store.state.user.obj.workPhoneNumber || _store.state.user.obj.mobile || '',
          // 基本信息
          baseInfoTemplate: {},
          // 工作经历
          experienceTemplate: [],
          // 教育经历
          educationTemplate: [],
          // 证件信息
          identityTemplate: [],
          // 其他信息
          othersTemplate: {}
        },
        rules: {
          jobId: formCheck.getRuleObj({
            validator: null,
            message: '请选择应聘职位',
            trigger: 'change'
          }),
          companyId: formCheck.getRuleObj({
            validator: null,
            message: '请选择所属企业',
            trigger: 'change'
          }),
          addressIds: formCheck.getRuleObj({
            type: 'array',
            validator: null,
            message: '请选择期望工作地址',
            trigger: 'change'
          }),
          partJobTime: formCheck.getRuleObj({
            type: 'array',
            validator: null,
            message: '请选择可兼职时间',
            trigger: 'change'
          }),
          deliveryChannelType: formCheck.getRuleObj({
            type: 'array',
            validator: null,
            message: '请选择渠道来源',
            trigger: 'change'
          }),
          recommender: formCheck.getRuleObj({
            type: 'number',
            validator: null,
            message: '请选择应聘职位',
            trigger: 'blur'
          })
        }
      }
    }
  },
  created: function () {
    const requestHandle = async () => {
      const { temp, ruleForm } = this.candidateForm
      await _fn.getDeliveryChannelList(data => {
        let deliveryChannelTypeDisabled = false
        let fixDeliveryChannelTypeFlag = false
        if (this.updateId !== '0' && this.editFormInfo.deliveryChannelType) {
          deliveryChannelTypeDisabled = this.editFormInfo.deliveryChannelType[0] === 0
          fixDeliveryChannelTypeFlag = this.editFormInfo.deliveryChannelType[0] === 'fix'
        }
        this.$set(this.candidateForm.temp, 'deliveryChannelType', {
          ...temp.deliveryChannelType,
          disabled: this.otherInfovisible ? (deliveryChannelTypeDisabled || fixDeliveryChannelTypeFlag) : this.updateId !== '0',
          data: this.updateId !== '0' ? (fixDeliveryChannelTypeFlag ? _var._deliveryChannelType : data.map(item => {
            return {
              ...item,
              disabled: item.type === 'SYSTEM' ? true : item.disabled,
              children: item.children ? item.children.map(child => {
                return {
                  ...child,
                  disabled: !child.obj.enabled
                }
              }).sort((a, b) => { return a.disabled - b.disabled }) : null
            }
          })) : data.filter(item => {
            return item.type !== 'SYSTEM'
          }).map(item => {
            return {
              ...item,
              children: item.children ? item.children.map(child => {
                return {
                  ...child,
                  disabled: !child.obj.enabled
                }
              }).filter(item => !item.disabled) : null
            }
          })
        })
        if (this.otherInfovisible) {
          this.$set(this.candidateForm.temp, 'addressIds', {
            ...temp.addressIds,
            disabled: deliveryChannelTypeDisabled || fixDeliveryChannelTypeFlag
          })
        }
        if (this.otherInfovisible) {
          this.$set(this.candidateForm.temp, 'partJobTime', {
            ...temp.partJobTime,
            disabled: deliveryChannelTypeDisabled || fixDeliveryChannelTypeFlag
          })
          this.$set(this.candidateForm.temp, 'recommender', {
            ...temp.recommender,
            disabled: deliveryChannelTypeDisabled || fixDeliveryChannelTypeFlag
          })
          this.$set(this.candidateForm.temp, 'recommenderPhoneNumber', {
            ...temp.recommenderPhoneNumber,
            disabled: deliveryChannelTypeDisabled || fixDeliveryChannelTypeFlag
          })
        }
      }, {}, true, !this.otherInfovisible)
      if (this.otherInfovisible) {
        await _fn.getPositionList(res => {
          this.allJobIdData = res
          let data = res.map(item => {
            return {
              ...item,
              disabled: item.obj.state !== 1
            }
          })
          if (this.updateId === '0') {
            data = data.filter(item => item.obj.state === 1)
          }
          this.$set(this.candidateForm.temp, 'jobId', {
            ...temp.jobId,
            data: data
          })
          const list = res.map(item => {
            return {
              label: item.obj.companyName || 'null',
              value: item.obj.companyId
            }
          })
          const arr = list.reduce((total, item) => {
            const flag = total.some(c => c.value === item.value)
            if (!flag) {
              total.push(item)
            }
            return total
          }, [])
          this.$set(this.candidateForm.temp, 'companyId', {
            ...temp.companyId,
            data: arr
          })
          this.$set(this.candidateForm.ruleForm, 'jobId', this.editFormInfo.jobId || '')
        }, {}, true)
      }
      await _fn.getPublicCombobox(data => {
        this.phoneAreaCode = data
      }, { comboType: 6 }, true)
      await _fn.getPublicCombobox(res => {
        this.areaOptions = this.flatAreaOptions(res.data)
      }, { comboType: 7 })
      await this.$nextTick(function () {
        if (!this.otherInfovisible) {
          this.setCandidateFormTemp()
        }
      })
    }
    requestHandle()
    _fn.getCollaboratorsList((res) => { // 联系人
      let data = res
      let map = {}
      data = data.filter((item) => item.enabled)
      data.map((item) => {
        map[item.id] = item.workPhoneNumber || item.mobile
        item.label = item.realName
        item.value = item.id
        item.disabled = !item.enabled
      })
      this.interviewForm.temp.contact.data = data
      this.mobileMap = map
    }, {}, false)

    if (!this.candidateForm.ruleForm.othersTemplate.tags) {
      this.candidateForm.ruleForm.othersTemplate.tags = []
    }
    console.log('this.candidateForm.ruleForm.othersTemplate', this.candidateForm.ruleForm.othersTemplate)
  },
  watch: {
    'candidateForm.ruleForm.jobId': {
      handler: function (jobId, prevJobId) {
        if (!jobId) {
          return
        }
        this.jobIdChange(jobId, prevJobId)
      },
      immediate: true
    }
  },
  mounted: function () {

  },
  computed: {
    smsMsgFlag () {
      return this.interviewForm.ruleForm.invitationMethod.indexOf('smsMsgFlag') > 0
    }
  },
  methods: {
    // 新增面试邀约
    contactChange (val) {
      this.interviewForm.ruleForm.mobile = this.mobileMap[val]
    },
    // 每次应聘职位修改时触发
    async jobIdChange (jobId, prevJobId) {
      const { temp, ruleForm } = this.candidateForm
      // await this.$nextTick(function () { // 不知道写成这样干啥?
      //   const job = temp.jobId.data.filter(item => item.value === jobId)
      //   const companyId = job[0].obj.companyId
      //   this.$set(this.candidateForm.ruleForm, 'companyId', companyId)
      // })
      // const job = temp.jobId.data.filter(item => item.value === jobId)
      // const companyId = job[0].obj.companyId
      // let processTemplateId = job[0].obj.processTemplateId
      await this._api.job_details({ id: jobId }).then((res) => { // 判断是否可以直接推荐到面试
        let flag = res.data.stages.filter(item => item.type === 2)[0].enabled
        this.isShowInterviewForm = flag
        this.$set(this.candidateForm.ruleForm, 'companyId', res.data.companyId || '')
        this.candidateForm.temp.partJobTime.isShow = false
        this.$set(this.candidateForm.temp, 'partJobTime', {
          ...temp.partJobTime,
          data: []
        })
        let partJobTime = res.data.partJobTime
        if (partJobTime) {
          this.candidateForm.temp.partJobTime.isShow = true
          console.log('adjustTimeadjustTime----------------------------------------', this.editFormInfo.partJobTime)
          this.$set(this.candidateForm.temp, 'partJobTime', {
            ...temp.partJobTime,
            data: partJobTime.reduce((total, item) => {
              const node = {
                label: item.start + '~' + item.end,
                value: item.start + '~' + item.end,
                disabled: false,
                souceData: item
              }
              total.push(node)
              return total
            }, [{ label: '接受调剂时间', value: '0', disabled: false }])
          })
          this.editFormInfo.partJobTime && this.partJobTimeChangeHandle(this.editFormInfo.partJobTime)
        }
      })
      await this._api.address_public_job_addresses({
        id: jobId
      }).then(res => {
        let disabled = false
        if (this.updateId !== '0') {
          const addressIds = this.editFormInfo.addressIds
          disabled = addressIds[0] === '0'
        }
        this.$set(this.candidateForm.temp, 'addressIds', {
          ...temp.addressIds,
          data: res.data.reduce((total, item) => {
            const node = {
              label: item.name,
              value: item.id,
              disabled: this.updateId !== '0' ? (item.enabled ? disabled : true) : !item.enabled,
              souceData: item
            }
            total.push(node)
            return total
          }, [{ label: '接受调剂门店', value: '0', disabled: this.updateId !== '0' ? !disabled : false }])
        })
      })
      await this.$nextTick(() => {
        this.resetCandidateForm(jobId)
      })
    },
    // 重置候选人表单项
    resetCandidateForm (jobId) {
      console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.editFormInfo)
      let valid = this.editFormInfo.baseInfoTemplate && this.editFormInfo.baseInfoTemplate.valid ? this.editFormInfo.baseInfoTemplate.valid : false // 人才库转过来已实名
      const { temp, ruleForm } = this.candidateForm
      this.candidateForm = Object.assign({}, this.candidateForm, {
        temp: {
          ...temp,
          // 基本信息
          baseInfoTemplate: {
            name: {
              formType: 'custom',
              key: 'name',
              maxlength: 20,
              disabled: valid || this.editFormInfo.applicationType
            },
            avatar: {
              formType: 'custom',
              key: 'avatar'
            },
            gender: {
              formType: 'custom',
              data: _var.sex,
              key: 'gender',
              disabled: valid
            },
            birthday: {
              formType: 'custom',
              prefixIcon: 'el-icon-date',
              key: 'birthday',
              valueFormat: '',
              disabled: valid
            },
            age: {
              formType: 'custom',
              key: 'age',
              disabled: valid
            },
            marriageBirth: {
              formType: 'custom',
              key: 'marriageBirth',
              data: _var.marriageBirth
            },
            startingTime: {
              formType: 'custom',
              prefixIcon: 'el-icon-date',
              key: 'startingTime',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: '',
              props: {
                formType: 'datePick'
              }
            },
            education: {
              formType: 'custom',
              key: 'education',
              data: _var.educationRequirement.filter(item => !!item.value)
            },
            registerLocation: {
              formType: 'custom',
              key: 'registerLocation',
              disabled: valid
            },
            currentLocation: {
              formType: 'custom',
              key: 'currentLocation'
            },
            phoneNumber: {
              formType: 'custom',
              key: 'phoneNumber',
              disabled: valid || this.editFormInfo.applicationType
            },
            wechat: {
              formType: 'custom',
              key: 'wechat',
              maxlength: 20
            }
          },
          // 工作经历
          experienceTemplate: {
            companyName: {
              formType: 'custom',
              maxlength: 20,
              key: 'companyName'
            },
            position: {
              formType: 'custom',
              maxlength: 20,
              key: 'position'
            },
            timeRequired: {
              formType: 'custom',
              key: 'timeRequired',
              data: _var.workNature
            },
            startTime: {
              formType: 'custom',
              key: 'startTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            endTime: {
              formType: 'custom',
              key: 'endTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            referenceName: {
              formType: 'custom',
              maxlength: 20,
              key: 'referenceName'
            },
            referencePhone: {
              formType: 'custom',
              key: 'referencePhone'
            },
            description: {
              formType: 'custom',
              key: 'description',
              maxlength: 200,
              limit: true
            }
          },
          // 教育经历
          educationTemplate: {
            education: {
              formType: 'custom',
              key: 'education',
              data: _var.educationRequirement.filter(item => !!item.value)
            },
            school: {
              formType: 'custom',
              key: 'school',
              maxlength: 20
            },
            major: {
              formType: 'custom',
              key: 'major',
              maxlength: 20
            },
            startTime: {
              formType: 'custom',
              key: 'startTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            endTime: {
              formType: 'custom',
              key: 'endTime',
              prefixIcon: 'el-icon-date',
              format: 'yyyy-MM',
              type: 'month',
              valueFormat: ''
            },
            referenceName: {
              formType: 'custom',
              maxlength: 20,
              key: 'referenceName'
            },
            referencePhone: {
              formType: 'custom',
              key: 'referencePhone'
            },
            description: {
              formType: 'custom',
              key: 'description',
              maxlength: 200,
              limit: true
            }
          },
          // 证件信息
          identityTemplate: {
            identityType: {
              formType: 'custom',
              key: 'identityType',
              data: _var.identityType
            },
            identityName: {
              formType: 'custom',
              key: 'identityName',
              maxlength: 20
            },
            identityNumber: {
              formType: 'custom',
              key: 'identityNumber',
              maxlength: 20
            },
            expiryDate: {
              formType: 'custom',
              key: 'expiryDate',
              prefixIcon: 'el-icon-date',
              valueFormat: ''
            },
            identityPic: {
              formType: 'custom',
              key: 'identityPic'
            }
          },
          // 其他信息
          othersTemplate: {
            height: {
              formType: 'custom',
              key: 'height'
            },
            weight: {
              formType: 'custom',
              key: 'weight'
            },
            tags: {
              formType: 'custom',
              key: 'tags'
            },
            selfDesc: {
              formType: 'custom',
              rows: 5,
              limit: true,
              maxlength: 200,
              key: 'selfDesc'
            },
            pics: {
              formType: 'custom',
              key: 'pics'
            }
          }
        },
        ruleForm: {
          ...ruleForm,
          addressIds: [],
          partJobTime: [],
          // 基本信息
          baseInfoTemplate: {},
          // 工作经历
          experienceTemplate: [],
          // 教育经历
          educationTemplate: [],
          // 证件信息
          identityTemplate: [],
          // 其他信息
          othersTemplate: {}
        }
      })
      if (!(this.editFormInfo.idx > 0)) {
        this.candidateForm.ruleForm.recommender = _store.state.user.obj.realName
        this.candidateForm.ruleForm.recommenderPhoneNumber = _store.state.user.obj.workPhoneNumber || _store.state.user.obj.mobile || ''
      }
      this.$nextTick(() => {
        if (this.updateId !== '0') {
          this._api.delivery_template_public_original_template({
            id: this.updateId
          }).then(res => {
            this.setFormItemGroup(res.data)
          })
          return
        }
        this._api.delivery_template_public_get_delivery_template({
          id: jobId
        }).then(res => {
          this.setFormItemGroup(res.data)
        })
      })
    },
    // 设置人才库表单项
    setCandidateFormTemp () {
      const temp = {
        deliveryChannelType: this.candidateForm.temp.deliveryChannelType,
        baseInfoTemplate: {
          name: {
            label: '姓名',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'name',
            required: true,
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false, // 已实名人才库不可编辑
            maxlength: 20
          },
          avatar: {
            label: '头像',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            key: 'avatar'
          },
          gender: {
            label: '性别',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            data: _var.sex,
            required: true,
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            key: 'gender'
          },
          birthday: {
            label: '生日',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            prefixIcon: 'el-icon-date',
            key: 'birthday',
            required: true,
            valueFormat: '',
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            props: {
              formType: 'datePick'
            }
          },
          age: {
            label: '年龄',
            placeholder: '请输入',
            isShow: true,
            required: true,
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            formType: 'custom',
            key: 'age'
          },
          identityNumber: {
            isShow: true,
            label: '证件',
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            key: 'identityNumber',
            formType: 'custom'
          },
          identityType: {
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            data: _var.identityType
          },
          marriageBirth: {
            label: '婚育情况',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            key: 'marriageBirth',
            data: _var.marriageBirth,
            props: {
              formType: 'select'
            }
          },
          startingTime: {
            label: '开始工作时间',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            prefixIcon: 'el-icon-date',
            key: 'startingTime',
            valueFormat: '',
            format: 'yyyy-MM',
            type: 'month',
            props: {
              formType: 'datePick'
            }
          },
          education: {
            label: '最高学历',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'education',
            data: _var.educationRequirement.filter(item => !!item.value),
            props: {
              formType: 'select'
            }
          },
          registerLocation: {
            label: '户口所在地',
            placeholder: '请选择',
            isShow: true,
            disabled: this.editFormInfo.baseInfoTemplate ? this.editFormInfo.baseInfoTemplate.valid : false,
            formType: 'custom',
            key: 'registerLocation'
          },
          currentLocation: {
            label: '现居住地',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'currentLocation'
          },
          phoneNumber: {
            label: '手机号',
            placeholder: '请输入',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'phoneNumber'
          },
          wechat: {
            label: '微信号',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'wechat',
            maxlength: 20
          }
        },
        experienceTemplate: {
          companyName: {
            label: '公司名称',
            placeholder: '请输入',
            isShow: true,
            required: true,
            formType: 'custom',
            maxlength: 20,
            key: 'companyName'
          },
          position: {
            label: '职位',
            placeholder: '请输入',
            isShow: true,
            required: true,
            formType: 'custom',
            maxlength: 20,
            key: 'position'
          },
          timeRequired: {
            label: '工作性质',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'timeRequired',
            data: _var.workNature,
            props: {
              formType: 'select'
            }
          },
          startTime: {
            label: '开始时间',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'startTime',
            prefixIcon: 'el-icon-date',
            format: 'yyyy-MM',
            type: 'month',
            valueFormat: '',
            props: {
              formType: 'datePick'
            }
          },
          endTime: {
            label: '结束时间',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'endTime',
            prefixIcon: 'el-icon-date',
            format: 'yyyy-MM',
            type: 'month',
            valueFormat: '',
            props: {
              formType: 'datePick'
            }
          },
          referenceName: {
            label: '证明人',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            maxlength: 20,
            key: 'referenceName'
          },
          referencePhone: {
            label: '证明人电话',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'referencePhone'
          },
          description: {
            label: '工作描述',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'description',
            maxlength: 200,
            limit: true,
            props: {
              formType: 'textarea'
            }
          }
        },
        educationTemplate: {
          education: {
            label: '学历',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'education',
            data: _var.educationRequirement.filter(item => !!item.value),
            props: {
              formType: 'select'
            }
          },
          school: {
            label: '学校名称',
            placeholder: '请输入',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'school',
            maxlength: 20
          },
          major: {
            label: '专业',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'major',
            maxlength: 20
          },
          startTime: {
            label: '开始时间',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'startTime',
            prefixIcon: 'el-icon-date',
            format: 'yyyy-MM',
            type: 'month',
            valueFormat: '',
            props: {
              formType: 'datePick'
            }
          },
          endTime: {
            label: '结束时间',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'endTime',
            prefixIcon: 'el-icon-date',
            format: 'yyyy-MM',
            type: 'month',
            valueFormat: '',
            props: {
              formType: 'datePick'
            }
          },
          referenceName: {
            label: '证明人',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            maxlength: 20,
            key: 'referenceName'
          },
          referencePhone: {
            label: '证明人电话',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'referencePhone'
          },
          description: {
            label: '教育经历描述',
            placeholder: '请输入',
            isShow: true,
            required: false,
            formType: 'custom',
            key: 'description',
            maxlength: 200,
            limit: true,
            rows: 4,
            props: {
              formType: 'textarea'
            }
          }
        },
        identityTemplate: {
          identityType: {
            label: '证件类型',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'identityType',
            data: _var.identityType,
            props: {
              formType: 'select'
            }
          },
          identityName: {
            label: '证件名称',
            placeholder: '请输入',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'identityName',
            maxlength: 20,
            props: {
              formType: 'input'
            }
          },
          identityNumber: {
            label: '证件编号',
            placeholder: '请输入',
            isShow: true,
            required: false,
            formType: 'custom',
            key: 'identityNumber',
            maxlength: 20,
            props: {
              formType: 'input'
            }
          },
          expiryDate: {
            label: '有效期至',
            placeholder: '请选择',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'expiryDate',
            prefixIcon: 'el-icon-date',
            valueFormat: '',
            props: {
              formType: 'datePick'
            }
          },
          identityPic: {
            label: '上传证件',
            placeholder: '请',
            isShow: true,
            required: true,
            formType: 'custom',
            key: 'identityPic'
          }
        },
        othersTemplate: {
          height: {
            label: '身高',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'height'
          },
          weight: {
            label: '体重',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'weight'
          },
          tags: {
            label: '爱好',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            key: 'tags'
          },
          selfDesc: {
            label: '自我评价',
            placeholder: '请输入',
            isShow: true,
            formType: 'custom',
            rows: 4,
            limit: true,
            maxlength: 200,
            key: 'selfDesc',
            props: {
              formType: 'textarea'
            }
          },
          pics: {
            label: '生活照',
            placeholder: '请选择',
            isShow: true,
            formType: 'custom',
            key: 'pics'
          }
        }
      }
      const ruleForm = {
        deliveryChannelType: [],
        baseInfoTemplate: {
          name: '',
          avatar: '',
          gender: 1,
          birthday: '',
          age: '',
          identityType: 1,
          identityNumber: '',
          marriageBirth: '',
          startingTime: '',
          education: '',
          registerLocation: '',
          currentLocation: '',
          prefix_phoneNumber: '+86',
          phoneNumber: '',
          wechat: ''
        },
        experienceTemplate: [
          {
            rightNow: false,
            companyName: '',
            position: '',
            timeRequired: '',
            startTime: '',
            endTime: '',
            referenceName: '',
            prefix_referencePhone: '+86',
            referencePhone: '',
            description: ''
          }
        ],
        educationTemplate: [
          {
            rightNow: false,
            education: '',
            school: '',
            major: '',
            startTime: '',
            endTime: '',
            referenceName: '',
            prefix_referencePhone: '+86',
            referencePhone: '',
            description: ''
          }
        ],
        identityTemplate: [
          {
            identityType: '',
            identityName: '',
            identityNumber: '',
            expiryDate: '',
            identityPic: {
              fileList: []
            }
          }
        ],
        othersTemplate: {
          height: '',
          weight: '',
          tags: [],
          selfDesc: '',
          pics: {
            fileList: []
          }
        }
      }
      const editFormInfoDeliveryChannelType = this.editFormInfo.deliveryChannelType
      const editFormInfo = Object.assign({}, this.editFormInfo)
      this.candidateForm = Object.assign({}, this.candidateForm, {
        temp,
        ruleForm: Object.keys(editFormInfo).length ? Object.assign(editFormInfo, {
          deliveryChannelType: editFormInfoDeliveryChannelType ? (
            editFormInfoDeliveryChannelType[0] === 'fix' ? [editFormInfoDeliveryChannelType[1]] : editFormInfo.deliveryChannelType
          ) : editFormInfo.deliveryChannelType
        }) : ruleForm
      })

      if (!this.candidateForm.ruleForm.othersTemplate.tags) {
        this.candidateForm.ruleForm.othersTemplate.tags = []
      }
      console.info('setCandidateFormTemp', this.candidateForm)
    },
    requestPublicComboboxByPosition (comboType) {
      return new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          resolve(res.data[0])
        }, { comboType })
      })
    },
    flatAreaOptions (data) {
      function flat (node, parentNode) {
        if (parentNode) {
          node.sub = null
        }
        if (node.sub && node.sub.length) {
          node.sub.forEach(item => {
            flat(item, node)
          })
        }
      }
      data.forEach(item => {
        flat(item)
      })
      return data
    },
    // 设置候选人表单项
    setFormItemGroup (dataBase) {
      console.log('lolololollolololollolololol', dataBase)
      if (!dataBase) return
      this.filterSourceData = {
        baseInfo: dataBase.baseInfoTemplate,
        education: dataBase.educationTemplate,
        experience: dataBase.experienceTemplate,
        identity: dataBase.identityTemplate,
        others: dataBase.othersTemplate
      }
      const { temp, ruleForm } = this.candidateForm
      const data = {
        baseInfoTemplate: dataBase ? (dataBase.baseInfoTemplate || {}) : {},
        experienceTemplate: dataBase ? (dataBase.experienceTemplate || {}) : {},
        educationTemplate: dataBase ? (dataBase.educationTemplate || {}) : {},
        identityTemplate: dataBase ? (dataBase.identityTemplate || {}) : {},
        othersTemplate: dataBase ? (dataBase.othersTemplate || {}) : {}
      }
      let temp_ = {}
      let ruleForm_ = {}
      Object.keys(data).forEach(key => {
        const flag = !!Object.keys(data[key]).length
        if (flag) {
          temp_[key] = {}
          let obj = {}
          if (key.match(/(experienceTemplate|educationTemplate)/g)) {
            obj = {
              rightNow: false,
              prefix_referencePhone: '+86'
            }
          }
          if (key.match(/(experienceTemplate|educationTemplate|identityTemplate)/g)) {
            ruleForm_[key] = []
          } else {
            ruleForm_[key] = {}
          }
          data[key].props.forEach(item => {
            if (key.match(/(identityTemplate)/g)) {
              obj[item.name] = item.name.match(/(identityPic)/g) ? {
                fileList: []
              } : ''
            } else {
              obj[item.name] = ''
            }
            temp_[key][item.name] = {
              isShow: true,
              label: item.title,
              placeholder: item.text,
              required: item.sysRequired || false,
              props: {
                formType: JSON.parse(item.exts).formType
              }
            }
            if (key.match(/(baseInfoTemplate|othersTemplate)/g)) {
              if (item.name.match(/(tags)/g)) {
                ruleForm_[key][item.name] = []
              } else if (item.name.match(/(pics)/g)) {
                ruleForm_[key][item.name] = {
                  fileList: []
                }
              } else {
                ruleForm_[key][item.name] = ''
              }
              if (item.name === 'phoneNumber') {
                ruleForm_[key]['prefix_' + item.name] = '+86'
              }
            }
          })
          if (key.match(/(experienceTemplate|educationTemplate|identityTemplate)/g)) {
            ruleForm_[key].push(obj)
          }
        }
      })
      Object.keys(temp_).forEach(item => {
        for (let k in temp_[item]) {
          for (let j in temp[item]) {
            if (k === j) {
              this.$set(temp[item], k, Object.assign({}, temp[item][k], temp_[item][k]))
            }
          }
        }
      })
      const editFormInfoDeliveryChannelType = this.editFormInfo.deliveryChannelType
      const ruleFormDeliveryChannelType = ruleForm.deliveryChannelType
      let editFormInfo
      if (this.editFormInfo.applicationType) {
        delete this.editFormInfo.jobId
        delete this.editFormInfo.companyId
        editFormInfo = Object.assign({}, this.editFormInfo)
      } else {
        editFormInfo = ruleForm.jobId === this.editFormInfo.jobId ? Object.assign({}, this.editFormInfo, {
          deliveryChannelType: editFormInfoDeliveryChannelType ? (editFormInfoDeliveryChannelType[0] === 'fix' ? [editFormInfoDeliveryChannelType[1]] : editFormInfoDeliveryChannelType) : ruleFormDeliveryChannelType
        }) : {}
      }
      console.log('this.editFormInfothis.editFormInfo', this.editFormInfo)
      console.log('jjjjjjjjjjjjj', editFormInfo)
      console.log('this.candidateFormthis.candidateForm', this.candidateForm.ruleForm.recommender)
      console.log('ruleFormruleFormruleFormruleFormruleForm', ruleForm.recommender)
      console.log('this.candidateFormthis.candidateForm', this.candidateForm.ruleForm.prefix_recommenderPhoneNumber)
      this.candidateForm = Object.assign({}, this.candidateForm, {
        ruleForm: {
          ...ruleForm,
          ...ruleForm_,
          ...editFormInfo
        }
      })
      if (!(this.editFormInfo.idx > 0)) {
        this.candidateForm.ruleForm.recommender = _store.state.user.obj.realName
        this.candidateForm.ruleForm.recommenderPhoneNumber = _store.state.user.obj.workPhoneNumber || _store.state.user.obj.mobile || ''
      }
    },
    setRecommenderRule () {
      const { ruleForm } = this.candidateForm
      const deliveryChannelType = ruleForm.deliveryChannelType
      return {
        trigger: 'blur',
        required: deliveryChannelType.length ? !!((deliveryChannelType[1] + '').match(/^(1[23]{1})$/g)) : false,
        message: '请输入推荐人'
      }
    },
    setRecommenderPhoneNumberRule () {
      const { ruleForm } = this.candidateForm
      const deliveryChannelType = ruleForm.deliveryChannelType
      const flag = deliveryChannelType.length ? !!((deliveryChannelType[1] + '').match(/^(1[23]{1})$/g)) : false
      return {
        trigger: 'blur',
        required: flag,
        validator: (rule, value, callback) => {
          if (!value) {
            if (flag) {
              return callback(new Error('请输入推荐人电话'))
            }
            return callback()
          }
          if (!/^\d{7,11}$/g.test(value)) {
            return callback(new Error('手机号为7~11位数字'))
          }
          callback()
        }
      }
    },
    setTemplateShow (field) {
      const { temp } = this.candidateForm
      if (!temp[field]) {
        return false
      }
      let flag = Object.keys(temp[field]).some(key => !!temp[field][key].isShow)
      return flag
    },
    setFormItemClass (tempField, item) {
      let className = {}
      switch (item.key) {
        case 'avatar':
          className = {
            'form-item-avatar': true
          }
          break
        case 'gender':
          className = {
            'gender-wrapper': true
          }
          break
        case 'major':
          className = {
            'profession-wrapper': true
          }
          break
        case 'endTime':
          className = {
            'endTime-wrapper': true
          }
          break
        case 'description':
          className = {
            'workDesc-wrapper': true
          }
          break
        case 'tags':
          className = {
            'hobby-wrapper': true
          }
          break
        case 'pics':
          className = {
            'pics-wrapper': true
          }
          break
        case 'selfDesc':
          className = {
            'selfEvaluation-wrapper': true
          }
          break
        default:
          break
      }
      return className
    },
    setFormItemRule (type, item, listItem) {
      let obj = {
        required: item.required || false,
        message: item.placeholder + item.label,
        trigger: 'blur'
      }
      switch (item.key) {
        case 'avatar':
          obj.trigger = 'change'
          break
        case 'gender':
          obj.trigger = 'change'
          break
        case 'birthday':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              callback()
            },
            trigger: 'change'
          }
          break
        case 'age':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              if (!/^(1[6-9]|[2-9]\d|100)$/g.test(value)) {
                return callback(new Error('16 到 100 之间的正整数'))
              }
              callback()
            },
            trigger: 'blur'
          }
          break
        case 'marriageBirth':
          // obj.type = 'number'
          // obj.trigger = 'change'
          break
        case 'startingTime':
          obj.trigger = 'change'
          break
        case 'education':
          obj.trigger = 'change'
          break
        case 'registerLocation':
          obj.trigger = 'change'
          break
        case 'currentLocation':
          obj.trigger = 'change'
          break
        case 'phoneNumber':
          obj = formCheck.getRuleObj({
            required: item.required || false,
            message: item.placeholder + item.label,
            opts: {
              pattern: 'phone',
              message: '手机号为7~11位数字'
            }
          })
          break
        case 'wechat':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              if (!/^[\w\d_-]{6,20}$/g.test(value)) {
                return callback(new Error('可使用6-20个字母、数字、下划线和减号'))
              }
              callback()
            },
            trigger: 'blur'
          }
          break
        case 'timeRequired':
          obj.trigger = 'change'
          break
        case 'startTime':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              this.formDateRule(rule, value, callback, listItem, item.key)
            },
            trigger: 'change'
          }
          break
        case 'endTime':
          obj = {
            required: listItem.rightNow ? false : (item.required || false),
            validator: (rule, value, callback) => {
              this.formDateRule(rule, value, callback, listItem, item.key)
            },
            trigger: 'change'
          }
          break
        case 'referencePhone':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              if (!/^\d{7,11}$/g.test(value)) {
                return callback(new Error('手机号为7~11位数字'))
              }
              callback()
            }
          }
          break
        case 'tags':
          obj.type = 'array'
          obj.trigger = 'change'
          break
        case 'pics':
          obj.type = 'object'
          obj.trigger = 'change'
          obj.fields = {
            fileList: {
              required: item.required,
              type: 'array',
              message: item.placeholder + item.label
            }
          }
          break
        case 'identityType':
          obj.trigger = 'change'
          break
        case 'identityNumber':
          if (this.editFormInfo.baseInfoTemplate.valid) return obj
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              this.identityNumberRule(rule, value, callback, listItem, type)
            },
            trigger: 'blur'
          }
          break
        case 'expiryDate':
          obj.trigger = 'change'
          break
        case 'identityPic':
          obj.type = 'object'
          obj.trigger = 'change'
          obj.fields = {
            fileList: {
              required: item.required,
              type: 'array',
              message: item.placeholder + item.label
            }
          }
          break
        case 'height':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              if (!(value > 0 && value <= 300)) {
                return callback(new Error('请输入大于0的正数，最大值不超过300'))
              }
              callback()
            },
            trigger: 'blur'
          }
          break
        case 'weight':
          obj = {
            required: item.required || false,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                if (item.required) {
                  return callback(new Error(item.placeholder + item.label))
                }
                return callback()
              }
              if (!(value > 0)) {
                return callback(new Error('请输入大于0的正数'))
              }
              callback()
            },
            trigger: 'blur'
          }
          break
        default:
          break
      }
      return obj
    },
    formDateRule (rule, value, callback, item, key = 'startTime') {
      const { startTime, endTime, rightNow } = item
      const startTimestamp = new Date(startTime).getTime()
      const endTimestamp = new Date(endTime).getTime()
      if (key === 'endTime' && rightNow) {
        return callback()
      }
      if (!value) {
        return callback(new Error('请选择时间'))
      }
      if (startTimestamp > endTimestamp && !rightNow) {
        return callback(new Error('结束时间不能早于开始时间'))
      }
      callback()
    },
    identityNumberRule (rule, value, callback, item, type) {
      if (item.identityType === 1 && item.identityNumber) {
        const identityNumber = _fn.trim(item.identityNumber)
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityNumber)) {
          return callback(new Error('身份证号格式不符'))
        }
      }
      if (type === 'baseInfoTemplate' && item.identityType === 1) {
        const { ruleForm } = this.candidateForm
        this.candidateForm = Object.assign({}, this.candidateForm, {
          ruleForm: {
            ...ruleForm,
            baseInfoTemplate: {
              ...ruleForm.baseInfoTemplate,
              gender: this.getSex(value),
              birthday: new Date(this.getBirth(value))
            }
          }
        })
        this.$nextTick(function () {
          this.datePickChangeHandle('baseInfoTemplate', 'birthday', new Date(this.getBirth(value)))
        })
      }
      callback()
    },
    companyIdChange (id) {
      const { temp } = this.candidateForm
      this.$set(this.candidateForm.ruleForm, 'jobId', '')
      let positionData = id ? this.allJobIdData.filter(item => item.obj.companyId === id).map(item => {
        return {
          ...item,
          disabled: item.obj.state !== 1
        }
      }) : this.allJobIdData.slice().map(item => {
        return {
          ...item,
          disabled: item.obj.state !== 1
        }
      })
      if (this.updateId === '0') {
        positionData = positionData.filter(item => !item.disabled)
      }
      this.$set(this.candidateForm.temp, 'jobId', {
        ...temp.jobId,
        data: positionData
      })
      const obj = {}
      const arr = ['baseInfoTemplate', 'experienceTemplate', 'educationTemplate', 'identityTemplate', 'othersTemplate']
      for (let k in temp) {
        const flag = arr.some(item => item === k)
        if (flag) {
          break
        }
        obj[k] = Object.assign({}, temp[k])
      }
      this.$set(this.candidateForm, 'temp', obj)
    },
    addressIdsChangeHandle (data) { // 期望工作地址编辑中处理面试地址
      const { temp } = this.candidateForm
      const arr = temp.addressIds.data.slice()
      let interviewArr = []
      arr.forEach(item => {
        item.disabled = data.length ? (data[0] === '0' ? item.value !== '0' : (item.value === '0' ? true : !item.souceData.enabled)) : (
          item.value === '0' ? false : !item.souceData.enabled
        )
        let flag = data.includes(item.value)
        console.log('flag', flag)
        if (flag) {
          interviewArr.push({ ...item, disabled: false })
        }
      })
      if (data[0] === '0') {
        interviewArr = temp.addressIds.data.slice()
        interviewArr.shift()
        interviewArr = interviewArr.map(item => {
          return {
            ...item,
            disabled: false
          }
        })
      }
      console.log('编辑地址', data, arr, interviewArr)
      this.interviewForm.temp.addressId.data = interviewArr
      this.candidateForm = Object.assign({}, this.candidateForm, {
        temp: {
          ...temp,
          addressIds: {
            ...temp.addressIds,
            data: arr
          }
        }
      })
    },
    partJobTimeChangeHandle (data) {
      const { temp } = this.candidateForm
      const arr = temp.partJobTime.data.slice()
      // let interviewArr = []
      arr.forEach(item => {
        item.disabled = data.length ? (data[0] === '0' ? item.value !== '0' : item.value === '0') : false
        // let flag = data.includes(item.value)
        // if (flag) {
        //   interviewArr.push({ ...item, disabled: false })
        // }
      })
      // if (data[0] === '0') {
      //   interviewArr = temp.partJobTime.data.slice()
      //   interviewArr.shift()
      //   interviewArr = interviewArr.map(item => {
      //     return {
      //       ...item,
      //       disabled: false
      //     }
      //   })
      // }
      this.candidateForm = Object.assign({}, this.candidateForm, {
        temp: {
          ...temp,
          partJobTime: {
            ...temp.partJobTime,
            data: arr
          }
        }
      })
    },
    datePickChangeHandle (type, key, e) {
      const { ruleForm } = this.candidateForm
      const { baseInfoTemplate } = ruleForm
      if (!e) {
        return
      }
      if (type === 'baseInfoTemplate' && key === 'birthday') {
        if (Object.prototype.hasOwnProperty.call(baseInfoTemplate, 'age')) {
          const sysDate = new Date().getFullYear()
          const b = new Date(e).getFullYear()
          const age = sysDate - b
          this.candidateForm = Object.assign({}, this.candidateForm, {
            ruleForm: {
              ...ruleForm,
              baseInfoTemplate: {
                ...baseInfoTemplate,
                age: age < 0 ? '0' : age + ''
              }
            }
          })
          return
        }
      }
      console.log(type)
      console.log(key)
      console.log(e)
    },
    // 基本信息
    avatarUploadSuccess (url) {
      const { ruleForm } = this.candidateForm
      this.candidateForm = Object.assign({}, this.candidateForm, {
        ruleForm: {
          ...ruleForm,
          baseInfoTemplate: {
            ...ruleForm.baseInfoTemplate,
            avatar: url
          }
        }
      })
    },
    getBirth (idCard) {
      let birthday = ''
      if (idCard) {
        if (idCard.length === 15) {
          birthday = '19' + idCard.slice(6, 12)
        } else if (idCard.length === 18) {
          birthday = idCard.slice(6, 14)
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      }
      return birthday
    },
    getSex (idCard) {
      let sexStr = ''
      if (parseInt(idCard.slice(-2, -1)) % 2 === 1) {
        sexStr = 1
      } else {
        sexStr = 2
      }
      return sexStr
    },
    addItem (key) {
      let item = {
        rightNow: false,
        startTime: '',
        endTime: '',
        referenceName: '',
        prefix_referencePhone: '+86',
        referencePhone: '',
        description: ''
      }
      switch (key) {
        // 工作经历
        case 'experienceTemplate':
          item = Object.assign(item, {
            companyName: '',
            position: ''
          })
          break
        // 教育经历
        case 'educationTemplate':
          item = Object.assign(item, {
            education: '',
            school: '',
            major: ''
          })
          break
        // 证件信息
        case 'identityTemplate':
          item = {
            identityType: '',
            identityName: '',
            identityNumber: '',
            expiryDate: '',
            identityPic: {
              fileList: []
            }
          }
          break
        default:
          break
      }
      const { name } = this.candidateForm
      const props = this.candidateForm.ruleForm[key].reduce((total, item, index) => {
        let arr = []
        for (let k in item) {
          arr.push(key + '.' + index + '.' + k)
        }
        return total.concat(arr)
      }, [])
      let errorFlagList = []
      this.$refs[name].validateField(props, errorMsg => {
        errorFlagList.push(!errorMsg)
      })
      const flag = errorFlagList.every(item => item)
      if (!flag) {
        return
      }
      this.candidateForm.ruleForm[key].unshift(item)
    },
    delItem (key, index) {
      this.candidateForm.ruleForm[key].splice(index, 1)
    },
    // 其他信息
    otherInfo_tagBtnShow (value) {
      return value ? (value.length < 10) : false
    },
    otherInfo_addTag (field, key, e) {
      if (!this.otherInfo_tagValue) {
        return
      }
      const { ruleForm } = this.candidateForm
      let hobby = ruleForm[field][key].slice()
      hobby.push({
        value: this.otherInfo_tagValue
      })
      this.candidateForm = Object.assign({}, this.candidateForm, {
        ruleForm: {
          ...ruleForm,
          [field]: {
            ...ruleForm[field],
            [key]: hobby
          }
        }
      })
      this.otherInfo_hobbyTagFlag = false
      this.otherInfo_tagValue = ''
    },
    otherInfo_delTag (field, key, index) {
      const { ruleForm } = this.candidateForm
      this.candidateForm = Object.assign({}, this.candidateForm, {
        ruleForm: {
          ...ruleForm,
          [field]: {
            ...ruleForm[field],
            [key]: ruleForm[field][key].filter((c, i) => index !== i)
          }
        }
      })
    },
    // 表单提交
    formSubmit () {
      const { name, ruleForm } = this.candidateForm
      let interviewName = this.interviewForm.name
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 先进行面试的校验
          if (this.isShowInterview && this.isShowInterviewForm && this.updateId === '0' && _fn.checkBtn('job_applicant/operate')) {
            let interviewRuleForm = this.interviewForm.ruleForm
            this.interviewForm.temp.contact.data.filter(item => {
              if (item.value === interviewRuleForm.contact) { // == 改成 ===
                interviewRuleForm.contactId = item.value
                interviewRuleForm.contact = item.label
              }
            })// 查找对应id的name
            let time = interviewRuleForm.time
            let hour = interviewRuleForm.hour
            if (time && hour) {
              var t1 = time + ' ' + hour
              let start = parseInt(new Date(t1).getTime() / 1000)
              let end = parseInt(new Date().getTime() / 1000)
              if (start < end) {
                _fn.message('面试时间不能小于当前时间 ')
                return
              }
            }
            console.log('我是现在的数据', ruleForm)
            this.$refs[interviewName].validate((valid) => {
              console.log('我是校验的结果', valid)
              if (valid) {
                this.submit(ruleForm).then(res => {
                  console.log('我是执行完成之后的数据', res)
                  let object = {
                    wxMsgFlag: true,
                    smsMsgFlag: this.smsMsgFlag
                  }
                  let objPre = { // 先推进到面试阶段
                    jobApplicantIdMap: { // 进行面试邀约
                      [res.data]: {
                        id: res.data,
                        mobile: ruleForm.baseInfoTemplate.phoneNumber,
                        addressId: interviewRuleForm.addressId,
                        identityNumber: null
                      }
                    },
                    currentStageId: 1,
                    targetStageId: 2,
                    action: 2,
                    isBatch: true
                  }
                  let obj = {
                    jobApplicantIdMap: { // 进行面试邀约
                      [res.data]: {
                        id: res.data,
                        mobile: ruleForm.baseInfoTemplate.phoneNumber,
                        addressId: interviewRuleForm.addressId,
                        identityNumber: null
                      }
                    },
                    abstractInfo: {
                      time: time + ' ' + hour,
                      contact: interviewRuleForm.contact,
                      contactId: interviewRuleForm.contactId,
                      mobile: interviewRuleForm.mobile,
                      notes: interviewRuleForm.notes
                    },
                    currentStageId: 2,
                    targetStageId: 2,
                    action: 4,
                    isBatch: true,
                    wxMsgFlag: object.wxMsgFlag,
                    smsMsgFlag: object.smsMsgFlag
                  }
                  this._api.job_applicant_operate(objPre).then(res => {
                    if (res.code === 0) {
                      this._api.job_applicant_operate(obj).then(res => {
                        if (res.code === 0) {
                          _fn.message(res.msg || '操作成功', { type: 'success' })
                          this.formReset()
                        }
                      })
                    }
                  })
                })
              }
            })
          } else {
            this.submit(ruleForm).then(res => {
              this.formReset()
            })
          }
        }
      })
    },
    submit (ruleForm) {
      return new Promise((resolve, reject) => {
        // 基本信息
        const baseInfoTemplateFlat = {}
        for (let k in ruleForm.baseInfoTemplate) {
          const item = ruleForm.baseInfoTemplate[k]
          if (k.match(/^(prefix_phoneNumber|identityType)$/g)) {
            continue
          }
          if (k === 'age') {
            baseInfoTemplateFlat[k] = item ? Number(item) : ''
          } else if (k === 'identityNumber' && item) {
            baseInfoTemplateFlat[k] = ruleForm.baseInfoTemplate['identityType'] + '-' + item
          } else if (k.match(/(registerLocation|currentLocation)/g) && item) {
            baseInfoTemplateFlat[k] = item[1] || ''
          } else if (k === 'phoneNumber' && item) {
            baseInfoTemplateFlat[k] = ruleForm.baseInfoTemplate.prefix_phoneNumber + '-' + item
          } else {
            baseInfoTemplateFlat[k] = item
          }
        }
        // 经验
        const experienceTemplateFlat = ruleForm.experienceTemplate.map(item => {
          let experienceItem = {}
          for (let k in item) {
            if (k.match(/(prefix_referencePhone|rightNow)/g)) {
              continue
            }
            if (k === 'endTime' && item.rightNow) {
              experienceItem[k] = ''
            } else if (k === 'referencePhone' && item[k]) {
              experienceItem[k] = item.prefix_referencePhone + '-' + item[k]
            } else {
              experienceItem[k] = item[k]
            }
          }
          return experienceItem
        })
        // 教育
        const educationTemplateFlat = ruleForm.educationTemplate.map(item => {
          let experienceItem = {}
          for (let k in item) {
            if (k.match(/(prefix_referencePhone|rightNow)/g)) {
              continue
            }
            if (k === 'endTime' && item.rightNow) {
              experienceItem[k] = ''
            } else if (k === 'referencePhone' && item[k]) {
              experienceItem[k] = item.prefix_referencePhone + '-' + item[k]
            } else {
              experienceItem[k] = item[k]
            }
          }
          return experienceItem
        })
        // 证件
        const identityTemplateFlat = (ruleForm.identityTemplate || []).map(item => {
          return {
            ...item,
            identityPic: item.identityPic.fileList.map(item => {
              return item.url
            }).join(',')
          }
        })
        // 其他
        const othersTemplateFlat = {}
        for (let k in ruleForm.othersTemplate) {
          const item = ruleForm.othersTemplate[k]
          if (k.match(/^(height|weight)$/g)) {
            othersTemplateFlat[k] = item ? Number(item) : ''
          } else if (k === 'pics' && item) {
            othersTemplateFlat[k] = item.fileList.map(item => {
              return item.url
            }).join(',')
          } else if (k === 'tags' && item) {
            othersTemplateFlat[k] = item.map(item => {
              return item.value
            }).join(',')
          } else {
            othersTemplateFlat[k] = item
          }
        }
        // 渠道来源
        const deliveryChannelType = ruleForm.deliveryChannelType
        const deliveryChannelTypeLen = deliveryChannelType.length
        const deliveryChannelTypeValue = deliveryChannelTypeLen ? deliveryChannelType[deliveryChannelTypeLen - 1] : ''
        const params = {
          jobId: ruleForm.jobId,
          companyId: ruleForm.companyId,
          deliveryChannelType: deliveryChannelTypeValue,
          recommender: ruleForm.recommender,
          recommenderPhoneNumber: ruleForm.recommenderPhoneNumber ? ruleForm.prefix_recommenderPhoneNumber + '-' + ruleForm.recommenderPhoneNumber : '',
          baseInfo: baseInfoTemplateFlat,
          experience: experienceTemplateFlat,
          education: educationTemplateFlat,
          identity: identityTemplateFlat,
          others: othersTemplateFlat
        }
        if (this.otherInfovisible) {
          // 期望工作地址
          const addressIds = ruleForm.addressIds
          params.adjustabled = !!addressIds.length && addressIds[0] === '0'
          params.addressIds = addressIds.length && addressIds[0] === '0' ? [] : addressIds
          // 可兼职时间
          if (this.candidateForm.temp.partJobTime.isShow) {
            const partJobTime = ruleForm.partJobTime
            params.adjustTime = !!partJobTime.length && partJobTime[0] === '0'
            params.partJobTime = partJobTime.length && partJobTime[0] === '0' ? [] : partJobTime
          }
          Object.keys(this.filterSourceData).forEach(key => {
            if (!this.filterSourceData[key]) {
              delete params[key]
            }
          })
          console.log('候选人----', params)
          if (this.editFormInfo.applicationType) {
            params.applicationType = 1
            params.resumeId = this.editFormInfo.resumeId
          }
          delete params.baseInfo.valid
          // 候选人
          this._api[this.updateId !== '0' ? 'job_applicant_update' : 'job_applicant_add']({
            id: this.updateId === '0' ? '' : this.updateId,
            ...params
          }).then(res => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            resolve(res)
            // this.formReset()
          })
        } else {
          delete params.jobId
          delete params.companyId
          delete params.recommender
          delete params.recommenderPhoneNumber
          console.log('人才库----', params)
          // 人才库
          this._api[this.updateId !== '0' ? 'applicant_update' : 'applicant_add']({
            id: this.updateId === '0' ? '' : this.updateId,
            sourceChannelType: deliveryChannelTypeValue,
            baseInfo: baseInfoTemplateFlat,
            experiences: experienceTemplateFlat,
            educations: educationTemplateFlat,
            identitys: identityTemplateFlat,
            others: othersTemplateFlat
          }).then(res => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            resolve(res)
            // this.formReset()
          })
        }
      })
    },
    formReset () {
      this.$parent.toPage()
    }
  }
}
