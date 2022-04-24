import { formatDate, compileTime, userDownLoadImage } from '@/util/utils'
import { customDropdownAction } from '@/mixins/index'

let jobWantedContent = [{ value: 1, label: '离职-随时到岗' }, { value: 2, label: '在职-考虑机会' }, { value: 3, label: '在职-暂不考虑' }]// 职业状态
export default {
  mixins: [customDropdownAction],
  data () {
    return {
      activeTab: '000',
      areaOptions: [],
      jobContent: [], // 职位信息
      wantedCityGather: [], // 期望城市
      channelList: [],
      count: 0,
      pageObject: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: '',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          tableObj: {
            operation: {
              operation_width: 200 // 并设置列宽
            },
            btnList: [
              {
                text: '转投递',
                isShow: (row) => !(row.deliveryStatus + '').match(/[3]{1}/g) && row.enabled && _fn.checkBtn('deliveryStatus'),
                // isShow: true,
                callback: this.turnPoint
              },
              {
                text: '编辑',
                isShow: (row) => !(row.deliveryStatus + '').match(/[23]{1}/g),
                // isShow: true,
                callback: this.itemEdit
              },
              {
                text: '恢复可用',
                isShow: (row) => !row.enabled,
                callback: this.updateItemEnabled
              },
              {
                text: '暂不可用',
                isShow: (row) => row.enabled,
                callback: this.updateItemEnabled
              }
            ],
            fields: [
              {
                key: 'name',
                label: '姓名',
                customMode: true
              },
              {
                key: 'birthday',
                label: '出生日期',
                width: '100',
                customMode: (row) => {
                  const time = compileTime(row.birthday)
                  return time ? formatDate(new Date(time), 'yyyy-MM-dd') : '--'
                }
              },
              {
                key: 'registerLocation',
                label: '户籍地址',
                customMode: (row) => {
                  const registerLocation = this.areaOptions.filter(item => {
                    return row.registerLocation && item.city.id === Number(row.registerLocation)
                  })
                  return registerLocation.length ? registerLocation[0].province.name + '-' + registerLocation[0].city.name : '--'
                }
              },
              {
                key: 'valid',
                label: '实名状态',
                customMode: (row) => {
                  return _var.valid__global(row.valid) || '--'
                }
              },
              {
                key: 'gender',
                label: '性别',
                width: '80',
                customMode: (row) => {
                  return _var.sex2__global(row.gender) || '--'
                }
              },
              {
                key: 'age',
                label: '年龄',
                width: '80',
                customMode: (row) => {
                  return row.age || '--'
                }
              },
              {
                key: 'education',
                label: '最高学历',
                width: '80',
                customMode: (row) => {
                  return _var.educationRequirement__global(row.education) || '--'
                }
              },
              {
                key: 'currentLocation',
                label: '现居住地',
                customMode: (row) => {
                  const currentLocation = this.areaOptions.filter(item => {
                    return row.currentLocation && item.city.id === Number(row.currentLocation)
                  })
                  return currentLocation.length ? currentLocation[0].province.name + '-' + currentLocation[0].city.name : '--'
                }
              },
              {
                key: 'deliveryStatus',
                label: '状态',
                customMode: (row) => {
                  return _var.applicant_status__global(row.deliveryStatus) || '--'
                }
              },
              {
                key: 'sourceChannelType',
                label: '渠道来源',
                customMode: (row) => {
                  const deliveryChannelTypeGroup = this.channelList.filter(item => item.id === row.sourceChannelType)
                  if (deliveryChannelTypeGroup.length) {
                    return deliveryChannelTypeGroup[0].name
                  }
                  return _var._deliveryChannelType__global(row.sourceChannelType) || '--'
                }
              },
              {
                key: 'updateTime',
                label: '更新时间',
                width: '100',
                customMode: (row) => {
                  const time = compileTime(row.updateTime)
                  return time ? formatDate(new Date(time), 'yyyy-MM-dd') : '--'
                }
              }
            ],
            data: []
          },
          searchModel: {
            isShowLabel: true,
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '',
                placeholder: '请输入人才姓名、手机号',
                isShow: true,
                isShowLabel: true,
                'prefix-icon': 'el-icon-search'
              },
              channelTypes: {
                formType: 'custom',
                key: 'channelTypes',
                label: '来源渠道',
                placeholder: '请选择',
                filterable: false,
                isShow: true,
                props: {
                  multiple: true,
                  emitPath: true
                },
                collapseTags: true,
                data: []
              },
              valid: {
                formType: 'select',
                label: '实名认证',
                isShow: true,
                clearable: false,
                data: _var.valid
              },
              status: {
                formType: 'select',
                label: '状态',
                isShow: true,
                clearable: false,
                data: _var.applicant_status
              },
              rule: {
                formType: 'select',
                label: '订阅规则',
                isShow: true,
                data: []
              },
              tags: {
                formType: 'custom',
                label: '规则条件',
                isShow: true,
                key: 'tags'
              }
            },
            ruleForm: {
              name: '',
              channelTypes: [],
              status: 9,
              valid: '',
              rule: ''
            }
          },
          dialog: {
            slot: 'upload',
            dialogWidth: '1000px',
            title: '批量导入人才',
            callback: this.improtPersonnel,
            temp: {
              file: {
                formType: 'custom',
                label: '',
                isShow: true,
                key: 'file'
              }
            },
            ruleForm: {
              file: ''
            },
            rule: {
              file: ''
            }
          }
        }
      }),
      formModel: {
        fileList: []
      },
      ruleParams: [],
      updateRule: {},
      tableSelectedData: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!to.name.match(/^(setrule|addtalent|talentDetail|deliveryEdit)$/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        personnel: null
      })
    }
    next()
  },
  created: function () {
    this.requestHandle()
  },
  computed: {
    batchActionBtnDisabled () {
      return !!this.tableSelectedData.length
    }
  },
  watch: {
    'pageObject.searchModel.ruleForm.rule': {
      handler: function (val) {
        const tagsData = this.pageObject.searchModel.temp.rule.data.filter(item => item.value === val)
        if (!tagsData.length) {
          this.ruleParams = []
          this.updateRule = {}
          return
        }
        const searchParams = tagsData[0].searchParams
        this.updateRule = {
          id: val,
          name: tagsData[0].label,
          searchParams
        }
        let list = []
        Object.keys(searchParams).forEach(key => {
          if (key === 'gender') {
            list.push((searchParams[key] ? '' : '性别') + _var.sex2__global(searchParams[key]))
          }
          if (key === 'minAge' && searchParams[key] && !searchParams.maxAge) {
            list.push(searchParams[key] + '岁以上')
          }
          if (key === 'minAge' && searchParams[key] && searchParams.maxAge) {
            list.push(searchParams[key] + '~' + searchParams.maxAge + '岁')
          }
          if (key === 'maxAge' && searchParams[key] && !searchParams.minAge) {
            list.push(searchParams[key] + '岁以下')
          }
          if (key === 'registerLocation' && searchParams[key]) {
            const registerLocation = this.areaOptions.filter(item => {
              return item.city.id === Number(searchParams[key])
            })
            const str = registerLocation.length ? registerLocation[0].province.name + '-' + registerLocation[0].city.name : ''
            if (str) {
              list.push(str)
            }
          }
          if (key === 'currentLocation' && searchParams[key]) {
            const currentLocation = this.areaOptions.filter(item => {
              return item.city.id === Number(searchParams[key])
            })
            const str = currentLocation.length ? currentLocation[0].province.name + '-' + currentLocation[0].city.name : '--'
            if (str) {
              list.push(str)
            }
          }
          if (key === 'education' && searchParams[key]) {
            list.push(_var.educationRequirement__global(searchParams[key]))
          }
          if (key === 'minExp') {
            const minExp = searchParams[key]
            const maxExp = searchParams.maxExp
            if (minExp === 0) {
              if (maxExp === 0) {
                list.push('无经验')
              } else {
                list.push(maxExp ? minExp + '~' + maxExp + '年经验' : minExp + '年经验以上')
              }
            } else if (minExp) {
              list.push(maxExp ? minExp + '~' + maxExp + '年经验' : minExp + '年经验以上')
            } else {
              if (maxExp === 0) {
                list.push('无经验')
              } else {
                list.push(maxExp ? maxExp + '年经验以下' : '经验不限')
              }
            }
          }
          /* if (key === 'minExp' && searchParams[key] && !searchParams.maxExp) {
            list.push(searchParams[key] + '年经验以上')
          }
          if (key === 'minExp' && searchParams[key] && searchParams.maxExp) {
            list.push(searchParams[key] + '~' + searchParams.maxExp + '年经验')
          }
          if (key === 'maxExp' && searchParams[key] && !searchParams.minExp) {
            list.push(searchParams[key] + '年经验以下')
          } */
          if (key === 'marriageBirth' && searchParams[key]) {
            list.push(_var.marriageBirth__global(searchParams[key]))
          }
          if (key === 'tags' && searchParams[key].length) {
            searchParams[key].forEach(item => {
              list.push(item.name)
            })
          }
        })
        if (!(searchParams['minSalary'] && searchParams['maxSalary'])) {
          list.push('薪资不限')
        }
        if (searchParams['minSalary'] && (!searchParams['maxSalary'])) {
          list.push('薪资10000以上')
        }
        if (searchParams['minSalary'] && searchParams['maxSalary']) {
          list.push(`薪资范围${searchParams['minSalary']}"-"${searchParams['maxSalary']}`)
        }
        if (searchParams['expectWantedStatusCodeList'] && searchParams['expectWantedStatusCodeList'].length) {
          searchParams['expectWantedStatusCodeList'].map(item => {
            list.push(jobWantedContent.find(code => code.value === item).label)
          })
        }
        if (searchParams['expectPositionListIdList'] && searchParams['expectPositionListIdList'].length) {
          searchParams['expectPositionListIdList'].map(item => {
            list.push(this.jobContent.find(code => code.value === +item).label)
          })
        }
        if (searchParams['expectWorkCityIdList'] && searchParams['expectWorkCityIdList'].length) {
          list.push('期望城市:')
          searchParams['expectWorkCityIdList'].map(item => {
            list.push(this.wantedCityGather.find(code => code.value === +item).label)
          })
        }
        this.ruleParams = list
      },
      deep: true
    }
  },
  methods: {
    improtPersonnel () { // 批量导入人才库
      this.$refs.childImport.rule((p) => {
        let param = p
        let file = {}
        param.fileList.map((item) => {
          file = item.raw
        })
        this._api.applicant_import_applicants({ file: file }).then(res => {
          console.log('我是文件上传res', res)
          const { data } = res
          if (data && data.attachmentUrl) {
            userDownLoadImage(data.attachmentUrl)
            _fn.message(res.msg || '操作失败', { type: 'error' })
          } else {
            _fn.message(res.msg || '操作成功', { type: 'success' })
          }
          this.$refs['talent-pool-page'].load()
          this.pageObject.dialog.show = false
        }).catch(e => {
          console.log('我是文件上传e', e)
          this.formModel = {
            fileList: []
          }
        })
      })
    },
    async requestHandle () {
      // 来源渠道
      await this.$nextTick(function () {
        _fn.getDeliveryChannelList((data, dataSource) => {
          const { searchModel } = this.pageObject
          this.$set(this.pageObject.searchModel, 'temp', {
            ...searchModel.temp,
            channelTypes: {
              ...searchModel.temp.channelTypes,
              data
            }
          })
          this.channelList = dataSource
        })
      })
      // 订阅规则下拉
      await this._api.search_template_public_combo_list({}).then(res => {
        const { searchModel } = this.pageObject
        this.pageObject = Object.assign({}, this.pageObject, {
          searchModel: {
            ...searchModel,
            temp: {
              ...searchModel.temp,
              rule: {
                ...searchModel.temp.rule,
                data: res.data.map(item => {
                  return {
                    label: item.name,
                    value: item.id,
                    searchParams: item.searchParams
                  }
                })
              }
            }
          }
        })
      })
      await new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          this.areaOptions = this.flatAreaOptions(res.data)
          this.wantedCityGather = this.filterAreaOptions(res.data)
          resolve('areaOptions')
        }, { comboType: 7 })
      })
      // 职业信息
      await new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          this.jobContent = this.flatJobContent(res.data[0])// res.data[0];
          resolve('')
        }, { comboType: 2 })
      })
      await this.$nextTick(function () {
        const { keepAlive } = this.$store.state.keep_alive
        const { http, tableObj, searchModel } = this.pageObject
        this.pageObject = Object.assign({}, this.pageObject, {
          http: {
            ...http,
            queryUrl: 'applicant_list'
          },
          searchModel: {
            ...searchModel,
            ruleForm: keepAlive.personnel ? keepAlive.personnel.ruleForm : {
              name: '',
              channelTypes: [],
              status: 9,
              valid: '',
              rule: ''
            }
          },
          tableObj: {
            ...tableObj,
            pager: {
              ...tableObj.pager,
              ...keepAlive.pager
            }
          }
        })
        this.$nextTick(function () {
          this.$refs['talent-pool-page'].load()
        })
      })
    },
    flatAreaOptions (data) {
      let list = []
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
            list.push({
              province: {
                name: item.title,
                id: item.id
              },
              city: {
                name: city.title,
                id: city.id
              }
            })
          })
        } else {
          list.push({
            province: {
              name: item.title,
              id: item.id
            },
            city: {
              name: '',
              id: ''
            }
          })
        }
      })
      return list
    },
    // 处理城市数据
    filterAreaOptions (data) {
      let content = []
      data.map(item => {
        if (item.sub.length) {
          item.sub.map(itemChildren => {
            content.push({
              label: itemChildren.title,
              value: itemChildren.id
            })
          })
        }
      })
      return content
    },
    // 处理职业信息
    flatJobContent (data) {
      let content = []
      data.map(item => {
        content.push({
          label: item.title,
          value: item.id
        })
      })
      console.log(content, '++++++处理后的job集合++++++++')
      return content
    },
    queryCount (params) {
      this._api.applicant_public_count(params).then(res => {
        this.count = res.data.totalCnt
      })
    },
    commandClick (type, command) {
      switch (type) {
        case '0':
          if (command === '1') {
            _fn.toLocation({
              name: 'addtalent',
              params: {
                id: '0'
              }
            })
          }
          if (command === '2') {
            const { dialog } = this.pageObject
            this.formModel = {
              fileList: []
            }
            this.pageObject = Object.assign({}, this.pageObject, {
              dialog: {
                ...dialog,
                show: true
              }
            })
          }
          break
        case '1':
          if (command === '1') {
            this.allExprotSubmit()
          }
          // 批量邀约
          if (command === '2') {
            _fn.toLocation({
              name: 'messageTaskEdit',
              params: {
                id: '0'
              },
              query: {
                type: '1',
                ids: JSON.stringify(this.tableSelectedData.map((item) => {
                  return {
                    id: item.id,
                    mobile: item.phoneNumber,
                    userName: item.name
                  }
                }))
              }
            })
          }
          break
        default:
          break
      }
    },
    loadBefor (param) {
      const { searchModel } = this.pageObject
      const tagsData = searchModel.temp.rule.data.filter(item => item.value === searchModel.ruleForm.rule)
      const channelTypes = searchModel.ruleForm.channelTypes
      let queryParam = {
        channelTypes: channelTypes.map(item => {
          return item[1]
        }),
        name: searchModel.ruleForm.name,
        status: searchModel.ruleForm.status,
        valid: searchModel.ruleForm.valid
      }
      if (tagsData.length) {
        queryParam.searchParams = tagsData[0].searchParams
      }
      this.queryCount({
        ...param,
        queryParam
      })
      return {
        ...param,
        queryParam
      }
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.pageObject
      const { pager } = tableObj
      const { ruleForm } = searchModel
      // const ops = tableObj.operation;
      // //if (ruleForm.status === 0) {
      // // 未投递，--三个按钮--宽度调大
      // ops.operation_width = 200;
      // }
      this.$store.dispatch('keep_alive/setKeepAlive', {
        personnel: { ruleForm },
        pager: {
          pageNo: pager.pageNo,
          pageSize: pager.pageSize
        }
      })
      fn && fn(data.list)
    },
    resetAfter (tempSearch, callback) {
      const { searchModel, tableObj } = this.pageObject
      this.pageObject = Object.assign({}, this.pageObject, {
        searchModel: {
          ...searchModel,
          ruleForm: {
            name: '',
            channelTypes: [],
            status: 9,
            valid: '',
            rule: ''
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
    },
    updateItemEnabled (row) {
      this._api[row.enabled ? 'applicant_public_disable' : 'applicant_public_enable']({
        id: row.id
      }).then(res => {
        _fn.message(res.msg || '操作成功', { type: 'success' })
        this.$nextTick(function () {
          this.$refs['talent-pool-page'].load()
        })
      })
    },
    itemEdit (row) {
      _fn.toLocation({
        name: 'addtalent',
        params: {
          id: row.id
        }
      })
    },
    turnPoint (row) { // 转投递
      // window.btns['4']['job_applicant/add']
      if (!(window.btns['4'] && window.btns['4']['job_applicant/add'])) {
        return _fn.message('无投递管理新增候选人的权限', { type: 'error' })
      }
      _fn.toLocation({ name: 'deliveryEdit', params: { id: '0' }, query: { queryId: row.id } })
      // this.goto('deliveryEdit', { id: '0' }, row)
    },
    goto (name, param, row) {
      if (row) {
        this.$store.dispatch('keep_alive/setKeepAlive', {
          deliveryUserInfo: row 
        })
      }
      _fn.toLocation({ name: name, params: param }) // -> /user/123
    },
    delItem (item) {
      const { fileList } = this.formModel
      this.formModel = {
        fileList: fileList.filter(c => c.uid !== item.uid)
      }
    },
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    downloadTemp () { // 下载模板
      _fn.downLoad('applicant_public_export_resume_template', {}, '职微你人才库模板' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss'))
    },
    // 批量导出提交
    allExprotSubmit () {
      let obj = this.$refs.dynamicTable.getSelected()
      _fn.downLoad('applicant_export_resumes', { ids: obj.idx }, '人才库列表' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss'))
      console.info(111111)
    },
    // 下载模板
    templateClick () {
      // _fn.ajax.download('excel_downloadByName', '商保增员模板.xlsx', '商保 -- 商保增员模板')
    }
  },
  mounted: function () {

  }
}
