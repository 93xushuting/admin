import formCheck from '@/util/formCheck'
import {
  formatDate,
  compileTime,
  userDownLoadImage
} from '@/util/utils'

export default {
  name: 'TalentDetail',
  props: {
    // 是否来源人才库标识
    isSourceTalentPoolFlag: {
      type: Boolean,
      default: false
    },
    queryId: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      BtnId: -1,
      totalPdfPages: 0,
      processOptions: [], //
      areaOptions: [], // 省市区
      areaCityIdWithParentId: [], // 每个市所对应的省id数据
      channelList: [],
      // jobIdOptions: [],
      positionList: [], // 职位数据
      positionIdData: [], // 每个行业下对应的职位数据
      dropdownMenuOptions: [], // 推进到下拉菜单
      activeTabName: '0',
      commentListData: [], // 备注列表
      commentNewValue: '', // 备注值
      tabsData: [], // tab栏
      showResumeTags: [],
      tagList: [], // 人才库标签
      fieldToggle: {
        baseInfoTemplate: true,
        educationTemplate: true,
        experienceTemplate: true,
        identityTemplate: true,
        othersTemplate: true
      },
      // 简历
      resumeDetailForm: {
        jobVo: {
          id: ''
        },
        // 基本信息
        baseInfo: {
          name: '',
          avatar: '',
          gender: '',
          birthday: '',
          age: '',
          marriageBirth: '',
          startingTime: '',
          education: '',
          registerLocation: '',
          currentLocation: '',
          phoneNumber: '',
          wechat: ''
        },
        // 工作经历
        experience: [],
        // 教育经历
        education: [],
        // 证件信息
        identity: [],
        // 其他信息
        others: [],
        // 求职意愿
        wantedSetting: {
          status: '',
          positions: [],
          citys: [],
          minSalary: '',
          maxSalary: ''
        },
        turningData: '',
        interviewInvitation: {},
        offerInvitation: {}
      },
      tagToggleFlag: false, // 控制标签最大高度
      dialogObj: {
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '1000px',
        isShowLabel: true // 是否显示label
      },
      dialogTip: {},
      formModel: {
        fileList: []
      },
      tablePageObj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: '',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          tableObj: {
            operation: false,
            fields: [{
              key: 'companyName',
              label: '企业名称'
            },
            {
              key: 'jobName',
              label: '职位名称'
            },
            {
              key: 'createTime',
              label: '投递时间',
              customMode: row => {
                const time = compileTime(row.createTime)
                return time ? formatDate(new Date(time), 'yyyy-MM-dd') : '--'
              }
            },
            {
              key: 'status',
              label: '投递状态',
              customMode: row => {
                const list = [{
                  label: '已入职',
                  value: 71
                },
                {
                  label: '已淘汰',
                  value: 81
                }
                ].concat(_var.firstSieve, _var.interview, _var.cards, _var.trialOperation, _var.backTone, _var.offer)
                const status = list.filter(item => item.value === row.status)
                return status.length ? status[0].label : '--'
              }
            },
            {
              key: 'rejectReason',
              label: '淘汰原因',
              customMode: row => {
                return row.rejectReason || '--'
              }
            }
            ],
            data: []
          }
        }
      }),
      // 入职编辑按钮相应内容
      entryDialog: {
        name: 'form',
        show: false,
        dialogWidth: '1000px',
        title: '编辑入职信息',
        isShowLabel: true,
        dialogFormCenter: true,
        callback: this.entryWriteAgain,
        temp: {
          content: '',
          jobTime: {
            isShow: true,
            label: '入职时间',
            formType: 'datetime',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            format: 'yyyy-MM-dd HH:mm:ss',
            data: ''
          },
          companyAddress: {
            isShow: true,
            label: '入职地址',
            formType: 'select',
            data: ''
          }
        },
        ruleForm: {
          jobTime: '',
          companyAddress: '',
          id: ''
        },
        rules: {
          jobTime: [{
            required: true,
            message: '请选择'
          }],
          companyAddress: [{
            required: true,
            message: '请选择'
          }]
        }
      },
      activities: []
    }
  },
  created: function () {
    this.BtnId = window.BtnId
    this.requestHandle()
  },
  filters: {
    salaryFilter (obj) {
      let minSalary = 0
      let maxSalary = 0
      if (obj.minSalary && !obj.maxSalary) {
        minSalary = ((obj.minSalary / 1000) * 100) / 100
        return minSalary + 'K/月起'
      }
      if (obj.maxSalary && !obj.minSalary) {
        maxSalary = ((obj.maxSalary / 1000) * 100) / 100
        return maxSalary + 'K/月以下'
      }
      minSalary = ((obj.minSalary / 1000) * 100) / 100
      maxSalary = ((obj.maxSalary / 1000) * 100) / 100
      return minSalary + '-' + maxSalary + 'K/月'
    },
    wantedStatusFilter (val) {
      return _var.jobSearchingStatus__global(val) || '--'
    },
    genderFilter (val) {
      if (val === '') {
        return '--'
      }
      if (typeof val === 'object') {
        return '--'
      }
      return _var.sex__global(val)
    },
    marriageBirthFilter (val) {
      if (!val) {
        return '--'
      }
      return _var.marriageBirth__global(val)
    },
    identityTypeFilter1 (val) {
      if (!val) {
        return '身份证：'
      }
      if (val.split('-')[1]) {
        return _var.identityType__global(val.split('-')[0]) + '：'
      } else {
        return '身份证：'
      }
    },
    identityNumberFilter (val) {
      if (!val) {
        return '--'
      }
      return val.split('-')[1] ? val.split('-')[1] : val
    },
    identityTypeFilter (val) {
      return _var.identityType__global(val)
    },
    educationFilter (val) {
      if (!val) {
        return '--'
      }
      return _var.educationRequirement__global(val)
    },
    timeRequiredFilter (val) {
      return _var.workNature__global(val)
    },
    dateTimeFilter (val, bl = false, format = 'yyyy-MM', type) {
      const param = bl ? 'yyyy-MM-dd HH:mm:ss' : format
      if (!val && type === 'endTime') {
        return '至今'
      }
      const time = compileTime(val)
      return time ? formatDate(new Date(time), param) : '--'
    },
    jobIdFilter (val, list) {
      const job = list.filter(item => item.id === val)
      return job.length ? job[0].name : '--'
    },
    statusFilter (val) {
      const allStatus = [{
        label: '已淘汰',
        value: 81
      },
      {
        label: '已入职',
        value: 71
      }
      ].concat(_var.firstSieve, _var.interview, _var.cards, _var.trialOperation, _var.backTone, _var.offer)
      const status = allStatus.filter(item => item.value === val)
      return status.length ? status[0].label : '--'
    },
    companyNameFilter (data) {
      if (data.jobVo && data.jobVo.company && data.jobVo.company.name) {
        return data.jobVo.company.name
      }
      return '--'
    },
    addressWantedFilter (data) {
      if (data.adjustabled) {
        return '接受调剂门店'
      }
      const list = data.addressWanted
      if (!list || !list.length) {
        return '--'
      }
      const len = list.length
      return list.reduce((total, item, index) => {
        return total + item.name + (index === len - 1 ? '' : '、')
      }, '')
    },
    partJobTimeFilter (data) {
      if (data.adjustTime) {
        return '接受调剂时间'
      }
      const list = data.partJobTime
      if (!list || !list.length) {
        return '--'
      }
      const len = list.length
      return list.reduce((total, item, index) => {
        return total + item + (index === len - 1 ? '' : '、')
      }, '')
    },
    deliveryChannelTypeFilter (val, channelList) {
      const deliveryChannelType = channelList.filter(item => item.id === val)
      if (deliveryChannelType.length) {
        return deliveryChannelType[0].name
      }
      return _var._deliveryChannelType__global(val) || '--'
    },
    activitiesFilter (val) {
      let text = ''
      switch (val) {
        case 1:
          text = '编辑人才简历信息'
          break
        case 2:
          text = '编辑人才求职意愿'
          break
        case 3:
          text = '操作人才转投递'
          break
        case 4:
          text = '向人才发送短信邀约'
          break
        default:
          break
      }
      return text
    }
  },
  watch: {
    '$route' () {
      this.requestHandle()
    },
    // queryId: {
    //   handler (val, oldVal) {
    //     console.log('pappppppppppppppppppppppp')
    //     this.requestHandle()
    //   },
    //   immediate: true
    // },
    isSourceTalentPoolFlag: {
      handler: function (bl) {
        if (bl) {
          this.tabsData = [{
            label: '简历',
            value: '0'
          },
          {
            label: '证件',
            value: '1'
          },
          {
            label: '应聘历史',
            value: '2'
          },
          {
            label: '背调历史',
            value: '3'
          }
          ]
        } else {
          this.tabsData = [{
            label: '简历',
            value: '0'
          },
          {
            label: '证件',
            value: '1'
          },
          {
            label: '背调',
            value: '3'
          },
          {
            label: '面试',
            value: '4'
          },
          {
            label: 'offer',
            value: '5'
          }
          ]
        }
      },
      immediate: true
    },
    'formModel.fileList' (list) {
      const {
        ruleForm
      } = this.dialogObj
      let obj = {
        identityPic: list.map(item => item.url).join(',')
      }
      this.dialogObj = Object.assign({}, this.dialogObj, {
        ruleForm: {
          ...ruleForm,
          ...obj
        }
      })
    },
    'resumeDetailForm.status': function (val) {
      this.tabsData.forEach(item => {
        if (item.value === '3') {
          this.$set(item, 'icon', val === 54 ? 'el-icon-warning' : '')
        }
      })
    },
    'resumeDetailForm.turningData': function (val) {
      if (!val) {
        return
      }
      this._ossService.ossReady({
        loadPdf: () => {
          const url = this._ossService.previewFile(val)
          if (!url) {
            return
          }
          this.setPdf(url)
        }
      })
    }
  },
  computed: {
    othersTemplateVisiblie () {
      const others = this.resumeDetailForm.others
      const _others = []
      others.forEach(item => {
        const obj = {
          height: item.height,
          pics: item.pics,
          selfDesc: item.selfDesc,
          tags: item.tags,
          weight: item.weight
        }
        const flag = Object.keys(obj).some(key => !!obj[key])
        if (flag) {
          _others.push(item)
        }
      })
      return !!this.fieldToggle.othersTemplate && !!_others.length
    },
    identityNumber () {
      const {
        identity
      } = this.resumeDetailForm
      const list = identity.filter(item => item.identityType === 1).sort((a, b) => {
        return b.updateTime - a.updateTime
      })
      return list.length ? (list[0].identityNumber || '--') : '--'
    },
    // 推进到按钮展示
    /* dropdownToggle () {
      const { stage, status } = this.resumeDetailForm
      const stage_ = stage + ''
      const status_ = status + ''
      return stage_.match(/^(1|2|3|4|5)$/g) && status_.match(/^(12|13|21|20|22|24|31|30|32|33|41|40|42|44|51|56|50|53)$/g)
    }, */
    // 淘汰按钮展示
    eliminated () {
      const {
        stage,
        status
      } = this.resumeDetailForm
      const status_ = status + ''
      return !status_.match(/^(71|81)$/g)
    },
    // 不通过按钮展示
    failBtn () {
      const {
        stage,
        status
      } = this.resumeDetailForm
      const stage_ = stage + ''
      const status_ = status + ''
      // return stage_.match(/^(1|2|4|5)$/g) && status_.match(/^(12|21|22|41|42|51|54)$/g)
      return status_.match(/(1[12]{1}|2[1267]{1}|4[1267]{1}|5[14]{1})/)
    }
  },
  methods: {
    //
    async requestHandle () {
      // 查询人才库标签
      await _fn.getTag(res => {
        this.tagList = res.data.filter(item => item.enabled).map(item => {
          return {
            id: item.id,
            name: item.name,
            checked: false
          }
        })
      }, {
        type: 3
      })
      await _fn.getPublicCombobox(res => {
        this.areaOptions = this.flatAreaOptions(res.data)
      }, {
        comboType: 7
      })
      await this.queryCommentList()
      await this.isSourceTalentPoolFlag ? this.requestHandleB() : this.requestHandleA()
    },
    // 候选人请求
    async requestHandleA () {
      await _fn.getDeliveryChannelList(data => {
        this.channelList = data
      }, {}, false, false)
      this.processOptions = await new Promise((resolve, reject) => {
        _fn.getProcessTemplate(res => {
          resolve(res)
        })
      })
      /* await _fn.getPositionList(res => {
        this.jobIdOptions = res
      }) */
      await this.requestDetailInfo(this.processOptions)
    },
    // 人才库请求
    async requestHandleB () {
      const _this = this
      const industryList = await this.requestPublicCombobox(1)
      const positionList = await this.requestPublicCombobox(2)
      this.positionList = positionList
      let positionIdData = []
      let result_ = this.dataGroupById(positionList)
      industryList.forEach(item => {
        result_.forEach(c => {
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
      this.positionIdData = positionIdData
      await (function () {
        _this._api.job_applicant_public_show_applicant_history({
          id: _this.queryId
        }).then(res => {
          const {
            data
          } = res
          const {
            tableObj
          } = _this.tablePageObj
          _this.tablePageObj = Object.assign({}, _this.tablePageObj, {
            tableObj: {
              ...tableObj,
              pager: {
                isShow: false
              },
              data: data
            }
          })
        })
      }())
      await this.$nextTick(function () {
        this.requestDetailInfo()
      })
    },
    requestPublicCombobox (comboType) {
      return new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          resolve(res.data[0])
        }, {
          comboType
        })
      })
    },
    // 数据分类组合
    dataGroupById (sourceList) {
      let result = []
      let obj = {}
      for (let i = 0, len = sourceList.length; i < len; i++) {
        const item = sourceList[i]
        const {
          industryId
        } = item
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
    // 查询详情
    async requestDetailInfo (processOptions) {
      if (!this.isSourceTalentPoolFlag) {
        await this._api.job_applicant_public_show_resume_tags({
          id: this.queryId
        }).then(res => {
          this.showResumeTags = res.data
        })
        this._api.job_applicant_details({
          id: this.queryId
        }).then(res => {
          const {
            data
          } = res
          if (data.status === 11) {
            this._api.job_applicant_switch_status({
              id: data.id,
              status: 12
            })
          }
          this.setFieldToggle(data.id, (params) => {
            const {
              baseInfo
            } = this.resumeDetailForm
            const baseInfoProps = params.baseInfoTemplate.props
            const otherProps = params.othersTemplate ? params.othersTemplate.props : []
            const baseInfoTemplate = Object.assign({}, baseInfo)
            const otherTemplate = data.others || []
            for (let key in baseInfoTemplate) {
              const flag = baseInfoProps.some(item => item.name === key)
              baseInfoTemplate[key] = flag ? (data.baseInfo[key] || '') : ''
            }
            otherTemplate.forEach(item => {
              for (let k in item) {
                const flag = otherProps.some(c => c.name === k)
                item[k] = flag ? item[k] : ''
              }
            })
            const tags = this.showResumeTags.slice()
            const identitys = data.identity || []
            this.resumeDetailForm = Object.assign({}, this.resumeDetailForm, {
              id: data.id,
              processTemplateId: data.processTemplateId,
              recommender: data.recommender,
              recommenderPhoneNumber: data.recommenderPhoneNumber,
              createTime: data.createTime,
              deliveryChannelType: data.deliveryChannelType,
              stage: data.stage,
              status: data.status === 11 ? 12 : data.status,
              nextStage: data.nextStage,
              nextStatus: data.nextStatus,
              processStages: data.processStages,
              currentProvinceId: data.currentProvinceId,
              registeProvinceId: data.registeProvinceId,
              jobVo: data.jobVo,
              adjustabled: data.adjustabled,
              addressWanted: data.addressWanted || [],
              adjustTime: data.adjustTime,
              partJobTime: data.partJobTime || [],
              baseInfo: baseInfoTemplate,
              experience: data.experience || [],
              education: data.education || [],
              identity: identitys.reduce((total, item) => {
                const identityPics = item.identityPic.split(',').map(pic => {
                  return {
                    id: item.id,
                    identityType: item.identityType,
                    identityName: item.identityName,
                    identityNumber: item.identityNumber,
                    identityPic: pic,
                    expiryDate: item.expiryDate,
                    updateTime: item.updateTime
                  }
                })
                return total.concat(identityPics)
              }, []),
              others: otherTemplate,
              tags,
              turningData: data.turingData,
              interviewInvitation: data.interviewInvitation || [],
              offerInvitation: data.offerInvitation || []
            })
            this.tagList.forEach(item => {
              tags.forEach(c => {
                if (item.id === c.id) {
                  this.$set(item, 'checked', true)
                }
              })
            })
            if (data.processStages) {
              this.dropdownMenuOptions = data.processStages.filter(item => item.enabled).map(item => {
                return {
                  ...item,
                  name: item.name === '已入职' ? '入职' : item.name
                }
              })
            }
            /* if (!processOptions) {
              return
            }
            let nextMap = {}
            const tabs = processOptions.filter(item => item.id === data.processTemplateId)[0].stages
            let r = tabs.filter((m) => {
              m.name = m.name.replace('已入职', '入职')
              return m.enabled === true
            })
            for (let i = 0; i < r.length; i++) {
              let m = r[i]
              m.show = true
              if (m.enabled && m.type === data.stage) {
                let n = r[i + 1]
                if (n) {
                  nextMap[n.type] = true
                  console.info(' ----------------- ', m.name)
                  break
                }
              }
            }
            this.dropdownMenuOptions = r */
          })
        })
        return
      }
      // 人才库详情
      this._api.applicant_public_resume_details({
        id: this.queryId
      }).then(res => {
        const {
          data
        } = res
        const tags = data.tags ? data.tags : []
        const identitys = data.identities || []
        this.resumeDetailForm = Object.assign({}, this.resumeDetailForm, {
          id: data.id,
          currentProvinceId: this.setLocation(data.baseInfo, 'currentLocation'),
          registeProvinceId: this.setLocation(data.baseInfo, 'registerLocation'),
          baseInfo: data.baseInfo,
          experience: data.experiences || [],
          education: data.educations || [],
          identity: identitys.reduce((total, item) => {
            const identityPics = item.identityPic.split(',').map(pic => {
              return {
                id: item.id,
                identityType: item.identityType,
                identityName: item.identityName,
                identityNumber: item.identityNumber,
                identityPic: pic,
                expiryDate: item.expiryDate,
                updateTime: item.updateTime
              }
            })
            return total.concat(identityPics)
          }, []),
          others: data.others ? [data.others] : [],
          wantedSetting: {
            id: data.wantedSetting ? (data.wantedSetting.id || '') : '',
            status: data.wantedSetting ? (data.wantedSetting.status || '') : '',
            positions: data.wantedSetting ? (data.wantedSetting.positions || []) : [],
            citys: data.wantedSetting ? (data.wantedSetting.citys || []) : [],
            minSalary: data.wantedSetting ? (data.wantedSetting.minSalary || '') : '',
            maxSalary: data.wantedSetting ? (data.wantedSetting.maxSalary || '') : ''
          },
          tags,
          turningData: data.turingData
        })
        const tagList = this.tagList.slice()
        tagList.forEach(item => {
          tags.forEach(c => {
            if (item.id === c.id) {
              item.checked = true
            }
          })
        })
        this.tagList = tagList
      })
      // 维护轨迹
      this._api.applicant_public_resume_record({
        id: this.queryId
      }).then(res => {
        // this.activities = res.data || []
        let result = res.data
        result.forEach((item, index) => {
          if (item.type === 2) {
            item.resumeRecordInfoVos = this.deWeight(item.resumeRecordInfoVos)
          }
        })
        this.activities = result
        console.log('oooopp', result)
      })
    },
    deWeight (data) {
      let maps = {}
      data.map((j) => {
        if (!maps[j.columnName]) {
          maps[j.columnName] = {
            newValue: [],
            oldValue: []
          }
          j.newValue && maps[j.columnName]['newValue'].push(j.newValue)
          j.oldValue && maps[j.columnName]['oldValue'].push(j.oldValue)
        } else {
          maps[j.columnName] && j.newValue && maps[j.columnName]['newValue'].push(j.newValue)
          maps[j.columnName] && j.oldValue && maps[j.columnName]['oldValue'].push(j.oldValue)
        }
      })
      console.log('mapsmapsmaps', maps)
      data.forEach((j) => {
        if (maps[j.columnName]) {
          j.newValue = (maps[j.columnName]['newValue'] || []).join(',')
          j.oldValue = (maps[j.columnName]['oldValue'] || []).join(',')
        }
      })
      let reaData = this.reduceData(data)
      return reaData
    },
    reduceData (arr) {
      let obj = {}
      arr = arr.reduce((a, b) => {
        if (!obj[b.columnName]) {
          obj[b.columnName] = true && a.push(b)
        }
        // obj[b.columnName] ? '' : obj[b.columnName] = true && a.push(b)
        return a
      }, [])
      return arr
    },
    // 详情展示字段
    setFieldToggle (id, fn) {
      this._api.delivery_template_public_original_template({
        id: id
      }).then(res => {
        this.fieldToggle = {
          baseInfoTemplate: !!res.data.baseInfoTemplate,
          educationTemplate: !!res.data.educationTemplate,
          experienceTemplate: !!res.data.experienceTemplate,
          identityTemplate: !!res.data.identityTemplate,
          othersTemplate: !!res.data.othersTemplate
        }
        fn(res.data)
      })
    },
    // 设置pdf
    setPdf (url) {
      const _this = this
      pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../../static/libs/pdf.worker.min.js'
      const loadingTask = pdfjsLib.getDocument({
        url,
        withCredentials: false
      })
      loadingTask.promise.then(function (pdf) {
        _this.totalPdfPages = pdf._pdfInfo.numPages
        _this.$nextTick(function () {
          for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
            (function (index) {
              pdf.getPage(i).then(function (page) {
                const scale = 1.5
                const viewport = page.getViewport(scale)
                const canvas = document.getElementById('the-canvas-' + index)
                const context = canvas.getContext('2d')
                canvas.height = viewport.height
                canvas.width = viewport.width
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                }
                page.render(renderContext)
              })
            })(i)
          }
        })
      })
    },
    setStateBtn (row, index) { // 设置操作按钮
      // index 5淘汰 3推进到
      let state = row.nextStatus
      if (!state) {
        return
      }
      if (state === 11 || state === 12) {
        return index === 6 || index === 3
      }
      if (state === 13 || state === 20) {
        return index === 7 || index === 3
      }
      if (state === 21 || state === 22 || state === 26) {
        return index === 8 || index === 3 || index === 98
      }
      if (state === 27) {
        return index === 8 || index === 3
      }
      if (state === 24 || state === 30) {
        return index === 9 || index === 3
      }
      if (state === 31 || state === 35) {
        return index === 10 || index === 11 || index === 3
      }
      if (state === 32) {
        return index === 12 || index === 3
      }
      if (state === 33 || state === 40) {
        return index === 11 || index === 3
      }
      if (state === 41 || state === 42 || state === 46) {
        return index === 14 || index === 99 || index === 3
      }
      if (state === 44 || state === 50) {
        return index === 15 || index === 3
      }
      if (state === 47) {
        return index === 14 || index === 3
      }
      if (state === 51) {
        return index === 16 || index === 3
      }
      if (state === 53 || state === 60) {
        return index === 17 || index === 3
      }
      if (state === 54) {
        return index === 16
      }
      if (state === 56) {
        return index === 3
      }
      if (state === 60) {
        return index === 17
      }
      if (state === 61 || state === 62 || state === 64 || state === 71) {
        return index === 18 || index === 3
      }
      return false
    },
    // 可兼职时间
    setJobTime (data) {
      if (data.adjustTime) {
        return true
      }
      const list = data.partJobTime
      if (!list || !list.length) {
        return false
      } else {
        return true
      }
    },
    // 查询备注
    queryCommentList () {
      this._api[this.isSourceTalentPoolFlag ? 'applicant_public_resume_comments' : 'job_applicant_public_comment_list']({
        id: this.queryId
      }).then(res => {
        this.commentListData = res.data
      })
    },
    infoTagFilter () {
      const {
        currentProvinceId,
        baseInfo,
        experience
      } = this.resumeDetailForm
      const {
        age,
        education,
        currentLocation
      } = baseInfo
      const ageStr = age ? `${age}岁` : ''
      const educationStr = education ? `${_var.educationRequirement__global(education)}` : ''
      const currentAddress = this.addressTitleIdParseHandle(currentProvinceId, currentLocation)
      const cityStr = `${currentAddress.length ? currentAddress[1] : ''}`
      // 工作经验
      const currentTimesTamp = new Date().getTime()
      const startTimesTamp = baseInfo.startingTime ? (
        !isNaN(baseInfo.startingTime) ? baseInfo.startingTime : new Date(baseInfo.startingTime).getTime()
      ) : (experience.length ? experience.reduce((total, item) => {
        const _startTime = !isNaN(total.startTime) ? total.startTime : new Date(total.startTime).getTime()
        const __startTime = !isNaN(item.startTime) ? item.startTime : new Date(item.startTime).getTime()
        return Math.min(_startTime, __startTime)
      }, {
        startTime: currentTimesTamp
      }) : currentTimesTamp)
      const durationTime = currentTimesTamp - startTimesTamp
      const _experience = this.humanise(Math.floor(durationTime / 1000 / 60 / 60 / 24))
      const experienceStr = _experience ? _experience + '工作经验' : ''
      const list = [ageStr, educationStr, cityStr, experienceStr].filter(item => !!item)
      const str = list.reduce((total, item, index, arr) => {
        const separator = index < list.length - 1 ? ' / ' : ''
        return total + item + separator
      }, '')
      return str
    },
    humanise (diff) {
      let str = ''
      const values = [
        ['年', 365],
        ['月', 30]
      ]
      for (let i = 0, len = values.length; i < len; i++) {
        const amount = Math.floor(diff / values[i][1])
        if (amount >= 1) {
          str += amount + values[i][0]
          diff -= amount * values[i][1]
        }
      }
      return str
    },
    hukouLocation (key) {
      const {
        currentProvinceId,
        registeProvinceId,
        baseInfo
      } = this.resumeDetailForm
      const {
        currentLocation,
        registerLocation
      } = baseInfo
      const provinceId = key === '0' ? registeProvinceId : currentProvinceId
      const cityId = key === '0' ? registerLocation : currentLocation
      const address = this.addressTitleIdParseHandle(provinceId, cityId)
      return address.length ? address[0] + ' - ' + address[1] : '--'
    },
    // 省市区数据改造
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
      data.forEach(item => {
        if (item.sub && item.sub.length) {
          item.sub.forEach(city => {
            this.areaCityIdWithParentId.push({
              provinceId: item.id,
              cityId: city.id,
              title: city.title
            })
          })
        } else {
          this.areaCityIdWithParentId.push({
            provinceId: item.id,
            cityId: '',
            title: ''
          })
        }
      })
      return data
    },
    // 根据市id查省id
    setLocation (baseInfo, key) {
      if (!baseInfo[key]) {
        return ''
      }
      const list = this.areaCityIdWithParentId.filter(item => item.cityId === Number(baseInfo[key]))
      return list.length ? list[0].provinceId : ''
    },
    // 根据省市id解析汉字
    addressTitleIdParseHandle (p, c) {
      if (!p || !c) {
        return []
      }
      const _p = Number(p)
      const _c = Number(c)
      const field = /^\d+$/g.test(_p) ? 'id' : 'title'
      const setFeld = field === 'id' ? 'title' : 'id'
      let province = ''
      let city = ''
      let provinceGroup = this.areaOptions.filter(item => {
        return field === 'id' ? (item[field] === _p) : (!!_p.match(item[field]))
      })
      if (provinceGroup.length) {
        const {
          sub
        } = provinceGroup[0]
        province = provinceGroup[0][setFeld]
        if (sub && sub.length) {
          const cityGroup = sub.filter(item => {
            return field === 'id' ? (item[field] === _c) : (!!_c.match(item[field]))
          })
          if (cityGroup.length) {
            const {
              sub
            } = cityGroup[0]
            city = cityGroup[0][setFeld]
          }
        }
      }
      return [province, city]
    },
    // 证件是否过期
    expiryDateFilter (val) {
      const time = compileTime(val)
      if (!time) {
        return false
      }
      const currentDate = formatDate(new Date(), 'yyyy-MM-dd')
      const expiryDate = formatDate(new Date(time), 'yyyy-MM-dd')
      return Date.parse(expiryDate) < Date.parse(currentDate)
    },
    // 用户下载证件
    userDownLoadFile (item) {
      const fileName = item.identityName || this.$options.filters.identityTypeFilter(item.identityType)
      const url = this._ossService.downLoad(item.identityPic, fileName)
      userDownLoadImage(url, fileName)
    },
    // 
    processChangeHandle (index) {
      let row = JSON.parse(JSON.stringify(this.resumeDetailForm))
      let processStages = row.processStages
      let target = row.nextStatus === row.status ? row.stage : (processStages && processStages.length ? processStages[0].type : row.nextStage)
      const params = {
        btnId: index,
        currentId: row.stage, // 当前流程ID
        targetId: target // 目标流程ID
      }
      console.info('表格中按钮事件---', target)
      if (index === 5 || index === 7 || index === 9 || index === 10 || index === 11 || index === 15 || index === 17) {
        _fn.toLocation({
          name: 'deliveryOperation',
          params: {
            id: encodeURI(JSON.stringify({
              id: row.id,
              ...params,
              blank: true
            }))
          }
        })
      } else {
        if (index === 18) { // 确定入职
          let row = this.resumeDetailForm
          let o = {
            goto: 'goto', // 按钮ID
            currentId: row.stage, // 当前流程ID
            targetId: target, // 目标流程ID
            btnId: 18 // 按钮ID
          }
          const targetStage = this.dropdownMenuOptions.filter(item => item.type === target)
          this.entryDialog.temp.content = `您是否确认将候选人 <span style = "color:#4a84ff;">${row.baseInfo.name}</span > 推进到 <span style = "color:#4a84ff;">${targetStage[0].name}</span> 阶段？`
          // row.enrollmentTime && (this.entryDialog.ruleForm.jobTime = new Date(row.enrollmentTime));
          let addresses = []
          row.jobVo.addresses.map(item => {
            addresses.push({
              label: item.name,
              value: item.id
            })
          })
          this.entryDialog.temp.companyAddress.data = addresses
          // this.entryDialog.ruleForm.companyAddress = row.enrollmentAddressId;
          this.entryDialog.ruleForm.id = row.id
          this.entryDialog.ruleForm.row = row
          this.entryDialog.ruleForm.o = o
          this.entryDialog.callback = this.entryWriteAgain
          this.entryDialog.show = true
          
          // this.checkDieOut([row.id], (ret) => {
          //   if (ret.data && ret.data.length) { // 候选人XXX、XXXX、XXX已在人才库中，是否更新人才库信息？
          //     this.tips(row.id, ret.data, () => {
          //       _fn.deliveryChange(row, params, (res) => {
          //         this.requestDetailInfo()
          //       })
          //     })
          //   } else {
          //     _fn.deliveryChange(row, params, (res) => {
          //       this.requestDetailInfo()
          //     })
          //   }
          // })
        } else {
          _fn.deliveryChange(row, params, (res) => {
            this.requestDetailInfo()
          })
        }
      }
    },
    checkDieOut (data, fn) { // 淘汰确定
      let param = {
        jobApplicantIdList: data
      }
      this._api.job_applicant_public_archive_flag(param).then((res) => {
        fn && fn(res)
      })
    },
    // 代上传
    uploadIdentity () {
      this.updateModal('0')
    },
    archiveFn (id, fn) { // 同步到人才库
      let param = {
        jobApplicantIdList: _fn.isArray(id) ? id : [id]
      }
      this._api.job_applicant_public_archive_update(param).then((res) => {
        fn && fn(res)
      })
    },
    tips (idx, tisp, fn) {
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
          self.archiveFn(idx, () => {
            self.dialogTip.show = false
            fn && fn()
          })
        },
        cancelCallback: function () {
          console.info('不更新')
          fn && fn()
        }
      }
      this.dialogTip = dia
    },
    // 推进到
    commandChangeHandle (targetId) {
      const {
        id,
        stage,
        processTemplateId
      } = this.resumeDetailForm
      const currentStages = this.processOptions.filter(item => item.id === processTemplateId)[0].stages
      const currentStage = currentStages.filter(item => item.type === stage)
      const targetStage = this.dropdownMenuOptions.filter(item => item.type === targetId)
      const dialogTip = {
        id: id,
        title: '推进流程',
        tbody: `您是否确认将候选人 <span style = "color:#4a84ff;">${currentStage[0].name}</span > 推进到 <span style = "color:#4a84ff;">${targetStage[0].name}</span> 阶段？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true,
        confirmCallback: () => {
          const params = {
            goto: 'goto', // 按钮ID
            currentId: stage, // 当前流程ID
            targetId: targetId // 目标流程ID
          }
          _fn.deliveryChange({
            id
          }, params, res => {
            this.requestDetailInfo(this.processOptions)
          })
          this.dialogTip.show = false
        }
      }
      if (targetId === 7) { // 入职
        console.log(this.resumeDetailForm, '++++++this.resumeDetailForm+++')
        let row = this.resumeDetailForm
        let o = {
          goto: 'goto', // 按钮ID
          currentId: stage, // 当前流程ID
          targetId: targetId, // 目标流程ID
          btnId: 18 // 按钮ID
        }
        this.entryDialog.temp.content = `您是否确认将候选人 <span style = "color:#4a84ff;">${row.baseInfo.name}</span > 推进到 <span style = "color:#4a84ff;">${targetStage[0].name}</span> 阶段？`
        // row.enrollmentTime && (this.entryDialog.ruleForm.jobTime = new Date(row.enrollmentTime));
        let addresses = []
        row.jobVo.addresses.map(item => {
          addresses.push({
            label: item.name,
            value: item.id
          })
        })
        this.entryDialog.temp.companyAddress.data = addresses
        // this.entryDialog.ruleForm.companyAddress = row.enrollmentAddressId;
        this.entryDialog.ruleForm.id = row.id
        this.entryDialog.ruleForm.row = row
        this.entryDialog.ruleForm.o = o
        this.entryDialog.callback = this.entryWriteAgain
        this.entryDialog.show = true
        return
      }
      this.dialogTip = dialogTip
    },
    // 入职编辑--
    entryWriteAgain () {
      let {
        companyAddress,
        jobTime,
        id,
        row,
        o
      } = this.entryDialog.ruleForm
      o.companyAddress = companyAddress
      o.jobTime = compileTime(jobTime)
      // new Date(jobTime).getTime().toString()
      // if (new Date(jobTime) < new Date()) {
      //   _fn.message("入职时间不可小于当前时间", { type: "error" });
      //   return
      // }
      this.entryDialog.show = false
      console.log(companyAddress, jobTime, id, row, o, '|||||||||||||||||')
      this.checkDieOut([id], (ret) => {
        _fn.deliveryChange(row, o, (res) => {
          this.tips(id, ret.data, (res) => {
            this.requestDetailInfo()
          })
        })
        // 候选人XXX、XXXX、XXX已在人才库中，是否更新人才库信息？
      })
    },
    // 不通过
    failBtnHandle () {
      const {
        id,
        status
      } = this.resumeDetailForm
      let _status = 0
      if (status === 11 || status === 12) { // 未查看、待初筛
        _status = 14
      } else if (status === 21 || status === 22 || status === 27) { // 已邀请面试、待面试、已到面
        _status = 25
      } else if (status === 32) { // 待审核证件
        _status = 34
      } else if (status === 41 || status === 42 || status === 47) { // 已邀请试工、待试工、已到面试工
        _status = 45
      } else if (status === 51 || status === 54) { // 背调中、背调异常
        _status = 55
      }
      this._api.job_applicant_switch_status({
        id,
        status: _status
      }).then((res) => {
        _fn.message(res.msg || '操作成功', {
          type: 'success'
        })
        this.requestDetailInfo()
      })
    },
    // modal
    updateModal (type) {
      this.formModel = {
        fileList: []
      }
      const title = type === '0' ? '添加证件' : '编辑求职意愿'
      let temp = null
      let ruleForm = null
      let rules = null
      if (type === '0') {
        temp = {
          identityType: {
            isShow: true,
            formType: 'select',
            label: '证件类型',
            data: _var.identityType
          },
          identityName: {
            isShow: true,
            formType: 'input',
            label: '证件名称',
            limit: true,
            maxlength: 20
          },
          identityNumber: {
            isShow: true,
            formType: 'input',
            label: '证件编号',
            limit: true,
            maxlength: 20
          },
          expiryDate: {
            isShow: true,
            formType: 'datePick',
            label: '有效期至',
            prefixIcon: 'el-icon-date',
            valueFormat: ''
          },
          identityPic: {
            isShow: true,
            formType: 'custom',
            label: '上传证件',
            key: 'identityPic'
          }
        }
        ruleForm = {
          identityType: '',
          identityName: '',
          identityNumber: '',
          expiryDate: '',
          identityPic: ''
        }
        if (this.isSourceTalentPoolFlag) {
          ruleForm.id = ''
          ruleForm.resumeId = this.queryId
        }
        rules = {
          identityType: formCheck.getRuleObj({
            message: '请选择证件类型',
            trigger: 'change'
          }),
          identityName: formCheck.getRuleObj({
            message: '请输入证件名称'
          }),
          identityNumber: formCheck.getRuleObj({
            required: false,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback()
              }
              const {
                ruleForm
              } = this.dialogObj
              if (ruleForm.identityType === 1 && ruleForm.identityNumber) {
                const identityNumber = _fn.trim(ruleForm.identityNumber)
                if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityNumber)) {
                  return callback(new Error('身份证号格式不符'))
                }
              }
              callback()
            },
            trigger: 'blur'
          }),
          expiryDate: formCheck.getRuleObj({
            message: '请选择有效期',
            trigger: 'change'
          }),
          identityPic: formCheck.getRuleObj({
            message: '请上传证件',
            trigger: 'change'
          })
        }
      }
      if (type === '1') {
        let {
          wantedSetting
        } = this.resumeDetailForm
        wantedSetting = wantedSetting || {
          status: '',
          positions: [],
          citys: [],
          minSalary: '',
          maxSalary: ''
        }
        const positionsGroup = wantedSetting.positions || []
        let positions = []
        this.positionList.forEach(item => {
          positionsGroup.forEach(c => {
            if (item.id === parseInt(c.id)) {
              positions.push([item.industryId, item.id])
            }
          })
        })
        temp = {
          status: {
            isShow: true,
            formType: 'select',
            label: '求职状态',
            data: _var.jobSearchingStatus
          },
          positions: {
            isShow: true,
            formType: 'custom',
            key: 'positions',
            label: '期望职位'
          },
          citys: {
            isShow: true,
            formType: 'select',
            label: '期望城市',
            filterable: true,
            multiple: true,
            multipleLimit: 3,
            data: this.areaCityIdWithParentId.filter(item => !!item.cityId).map(item => {
              return {
                label: item.title,
                value: item.cityId
              }
            })
          },
          dreamMoney: {
            isShow: true,
            formType: 'custom',
            label: '期望薪资',
            key: 'dreamMoney'
          },
          minSalary: {
            isShow: true,
            formType: 'custom',
            label: '',
            key: 'minSalary'
          },
          maxSalary: {
            isShow: true,
            formType: 'custom',
            label: '',
            key: 'maxSalary'
          }
        }
        ruleForm = {
          id: wantedSetting.id || '',
          status: wantedSetting.status || '',
          positions: positions,
          citys: (wantedSetting.citys || []).map(item => parseInt(item.cityId)),
          minSalary: wantedSetting.minSalary || '',
          maxSalary: wantedSetting.maxSalary || ''
        }
        rules = {
          status: [{
            required: true,
            message: '请选择求职状态'
          }],
          positions: [{
            required: true,
            message: '请选择职位'
          },
          {
            type: 'array',
            max: 5,
            message: '最多选5个'
          }
          ],
          citys: [{
            required: true,
            message: '请选择期望城市'
          }],
          minSalary: [{
            required: true,
            message: '请输入期望薪资'
          },
          {
            validator: (rule, value, callback) => this.validatorMoney(rule, value, callback),
            trigger: 'blur'
          }
          ],
          maxSalary: [{
            required: true,
            message: '请输入期望薪资'
          },
          {
            validator: (rule, value, callback) => this.validatorMoney(rule, value, callback),
            trigger: 'blur'
          }
          ]
        }
      }
      this.dialogObj = Object.assign({}, this.dialogObj, {
        show: true,
        title,
        temp,
        ruleForm,
        rules,
        callback: (form) => {
          if (type === '0') {
            this.saveIdentityModal(form, 'add')
            return
          }
          this.saveJobSearch(form)
        }
      })
    },
    // 修改证件信息modal
    updateIdentityHandle (item) {
      const temp = {
        identityType: {
          isShow: true,
          formType: 'select',
          label: '证件类型',
          data: _var.identityType
        },
        identityName: {
          isShow: true,
          formType: 'input',
          label: '证件名称',
          limit: true,
          maxlength: 20
        },
        identityNumber: {
          isShow: true,
          formType: 'input',
          label: '证件编号',
          limit: true,
          maxlength: 20
        },
        expiryDate: {
          isShow: true,
          formType: 'datePick',
          label: '有效期至',
          prefixIcon: 'el-icon-date',
          valueFormat: ''
        },
        identityPic: {
          isShow: true,
          formType: 'custom',
          label: '上传证件',
          key: 'identityPic'
        }
      }
      const ruleForm = {
        id: item.id,
        identityType: item.identityType || '',
        identityName: item.identityName || this.$options.filters.identityTypeFilter(item.identityType),
        identityNumber: item.identityNumber || '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : '',
        identityPic: ''
      }
      if (this.isSourceTalentPoolFlag) {
        ruleForm.resumeId = this.queryId
      }
      const rules = {
        identityType: formCheck.getRuleObj({
          message: '请选择证件类型',
          trigger: 'change'
        }),
        identityName: formCheck.getRuleObj({
          message: '请输入证件名称'
        }),
        identityNumber: formCheck.getRuleObj({
          required: false,
          validator: (rule, value, callback) => {
            if (!value) {
              return callback()
            }
            const {
              ruleForm
            } = this.dialogObj
            if (ruleForm.identityType === 1 && ruleForm.identityNumber) {
              const identityNumber = _fn.trim(ruleForm.identityNumber)
              if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityNumber)) {
                return callback(new Error('身份证号格式不符'))
              }
            }
            callback()
          },
          trigger: 'blur'
        }),
        expiryDate: formCheck.getRuleObj({
          message: '请选择有效期',
          trigger: 'change'
        }),
        identityPic: formCheck.getRuleObj({
          message: '请上传证件',
          trigger: 'change'
        })
      }
      this.formModel = {
        fileList: item.identityPic ? [{
          url: item.identityPic
        }] : []
      }
      this.dialogObj = Object.assign({}, this.dialogObj, {
        show: true,
        title: '编辑证件',
        temp,
        ruleForm,
        rules,
        callback: (form) => {
          this.saveIdentityModal(form, 'update')
        }
      })
    },
    // 证件信息modal
    saveIdentityModal (form, type = 'add') {
      let key = ''
      if (this.isSourceTalentPoolFlag) {
        key = 'applicant_public_resume_identity_update'
      } else {
        key = type === 'add' ? 'job_applicant_add_identity' : 'job_applicant_update_identity'
      }
      this._api[key]({
        id: this.queryId,
        ...form.ruleForm
      }).then(res => {
        _fn.message(res.msg || '保存成功', {
          type: 'success'
        })
        this.dialogObj = Object.assign({}, this.dialogObj, {
          show: false
        })
        this.requestDetailInfo()
      })
    },
    // 求职意愿modal
    validatorMoney (rule, value, callback) {
      const {
        ruleForm
      } = this.dialogObj
      if (!value) {
        return callback()
      }
      if (!/^(0|[1-9][0-9]*)(\.\d+)?$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      const minSalary = Number(ruleForm.minSalary)
      const maxSalary = Number(ruleForm.maxSalary)
      if (minSalary && maxSalary) {
        if (minSalary > maxSalary) {
          return callback(new Error('最小期望薪资不能大于最大期望薪资'))
        }
      }
      callback()
    },
    setPositions (positions) {
      let result = []
      let _this = this

      function positionIdByindustry (industryId, positionId) {
        const industry = _this.positionIdData.filter(item => item.value === industryId)
        let position = []
        if (industry.length) {
          position = industry[0].children.filter(item => item.value === positionId)
        }
        return position.length ? {
          id: position[0].value,
          title: position[0].label
        } : ''
      }
      positions.forEach(item => {
        result.push(positionIdByindustry(item[0], item[1]))
      })
      return result
    },
    setCitys (citys) {
      let result = []
      this.areaCityIdWithParentId.forEach(item => {
        citys.forEach(c => {
          if (item.cityId === c) {
            result.push({
              cityId: item.cityId,
              cityName: item.title
            })
          }
        })
      })
      return result
    },
    saveJobSearch ({
      ruleForm
    }) {
      const positions = this.setPositions(ruleForm.positions)
      const citys = this.setCitys(ruleForm.citys)
      const params = {
        id: ruleForm.id,
        status: ruleForm.status,
        resumeId: this.queryId,
        positions,
        citys,
        minSalary: ruleForm.minSalary,
        maxSalary: ruleForm.maxSalary
      }
      console.log(params)
      this._api.applicant_public_resume_wanted_update(params).then(res => {
        _fn.message(res.msg || '保存成功', {
          type: 'success'
        })
        this.dialogObj = Object.assign({}, this.dialogObj, {
          show: false
        })
        this.requestDetailInfo()
      })
    },
    // 标签选中切换
    tagItemChecked (item) {
      /* if (!item.enabled) {
        // _fn.message('该标签已被禁用', { type: 'warning' })
        return
      } */
      const list = this.tagList.slice()
      list.forEach(c => {
        if (c.id === item.id) {
          c.checked = !c.checked
        }
      })
      this._api.applicant_public_resume_tag_update({
        resumeId: this.queryId,
        tagIds: list.filter(item => item.checked).map(item => item.id),
        sourceType: this.isSourceTalentPoolFlag ? 2 : 1
      }).then(res => {
        this.requestDetailInfo()
      })
    },
    // 发布备注
    commentNewHandle () {
      if (!this.commentNewValue) {
        return
      }
      this._api[this.isSourceTalentPoolFlag ? 'applicant_public_resume_comment_new' : 'job_applicant_public_comment_new']({
        [this.isSourceTalentPoolFlag ? 'resumeId' : 'jobApplicantId']: this.queryId,
        content: this.commentNewValue
      }).then(res => {
        _fn.message(res.msg || '发布成功', {
          type: 'success'
        })
        this.queryCommentList()
        this.commentNewValue = ''
      })
    },
    // 转投递
    turnPoint () { // 转投递
      if (!(window.btns['4'] && window.btns['4']['job_applicant/add'])) {
        return _fn.message('无投递管理新增候选人的权限', { type: 'error' })
      }
      if (this.isSourceTalentPoolFlag) {
        _fn.toLocation({ name: 'deliveryEdit', params: { id: '0' }, query: { queryId: this.queryId } })
      }
      // this.goto('deliveryEdit', { id: '0' }, true)
    },
    goto (name, param, row) {
      if (row && this.isSourceTalentPoolFlag) {
        this.$store.dispatch('keep_alive/setKeepAlive', {
          deliveryUserInfo: {
            id: this.queryId
          }
        })
      }
      _fn.toLocation({ name: name, params: param }) // -> /user/123
    }
  },
  mounted: function () {
    this._ossService.ossReady()
  }
}
