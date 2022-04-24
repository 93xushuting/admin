export default {
  name: 'enterpriseManage',
  data () {
    return {
      tagName: 'proxy',
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: '',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          breadcrumb: {
            title: this.$route.meta.name || '企业管理'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            inline: true,
            labelWidth: '68px',
            temp: {
              name: {
                label: '名称',
                placeholder: '请输入企业名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true,
                'prefix-icon': 'el-icon-search'
              },
              industryId: {
                formType: 'select',
                label: '行业',
                placeholder: '请选择行业',
                data: [],
                isShow: true,
                clearable: true
              },
              sourceChannel: {
                formType: 'select',
                label: '来源渠道',
                placeholder: '请选择来源渠道',
                data: [],
                isShow: true
              },
              status: {
                formType: 'select',
                label: '状态',
                placeholder: '请选择状态',
                data: [],
                isShow: true
              }
            },
            ruleForm: {
              name: '',
              industryId: '',
              sourceChannel: '',
              status: ''
            }
          },
          tableObj: {
            operation: {
              selection: false, // 不显示操作列
              operation_width: 155
            },
            btnList: [],
            fields: []
          },
          dialog: {
            show: false,
            title: '版本开通',
            isShowLabel: true,
            dialogWidth: '570px',
            labelWidth: '80px',
            formInline: true,
            dialogFormCenter: true,
            callback: null,
            temp: {
              name: {
                label: '客户名称',
                isShow: true,
                disabled: true
              },
              version: {
                label: '使用版本',
                isShow: false,
                formType: 'select',
                data: [
                  {
                    label: '标准版',
                    value: '1'
                  }
                ]
              },
              reason: {
                label: '失败理由',
                isShow: false,
                type: 'textarea',
                key: 'reason'
              }
            },
            ruleForm: {
              name: '',
              version: '1',
              reason: ''
            },
            rules: {
              version: [
                {
                  required: true,
                  message: '请选择使用版本'
                }
              ],
              reason: [
                {
                  required: true,
                  message: '请输入失败理由'
                }
              ]
            }
          }
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!to.name.match(/(enterpriseManageSee|enterpriseManageEdit)/)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        enterprise: null
      })
    }
    next()
  },
  watch: {
    tagName: {
      handler: function (val) {
        this.obj.tableObj.btnList = this.mapBtnKey(val)
        this.obj.tableObj.fields = this.mapColumnFields(val)
      },
      immediate: true
    }
  },
  created: function () {
    // 获取行业列表
    _fn.getPublicCombobox(res => {
      this.obj.searchModel.temp.industryId.data = res
    }, { comboType: 1 }, true)
    const { keepAlive } = this.$store.state.keep_alive
    const { http, searchModel, tableObj } = this.obj
    const keepAliveRuleForm = keepAlive.enterprise ? keepAlive.enterprise.ruleForm : searchModel.ruleForm
    const keepAlivePager = keepAlive.enterprise ? keepAlive.pager : {
      pageNo: 1
    }
    this.obj = Object.assign({}, this.obj, {
      http: {
        ...http,
        queryUrl: 'user_getCompanyListPage'
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
  methods: {
    // 表格操作按钮
    mapBtnKey (key) {
      const mapKey = {
        proxy: [
          // {
          //   text: '停服',
          //   isShow: true,
          //   callback: this.stopServing
          // },
          {
            text: '编辑',
            isShow: true,
            callback: this.editClick
          }
        ],
        autonomous: [
          {
            text: '审核通过',
            isShow: true,
            callback: data => this.check('1', data)
          },
          {
            text: '不通过',
            isShow: true,
            callback: data => this.check('2', data)
          },
          {
            text: '升级版本',
            isShow: false,
            callback: () => { }
          },
          {
            text: '停服',
            isShow: false,
            callback: this.stopServing
          }
        ]
      }
      return mapKey[key]
    },
    // 表格列
    mapColumnFields (key) {
      const defaultFields = [
        {
          key: 'name',
          label: '企业名称',
          width: '350',
          customMode: true
        },
        {
          key: 'industry',
          label: '所属行业',
          formatter: (row, column, cellValue, index) => {
            const list = this.obj.searchModel.temp.industryId.data
            console.info(cellValue.id)
            return this._tcolFormat.getValueByCode(Number(cellValue.id), list)
          }
        },
        {
          key: 'jobsCount',
          label: '在招职位数'
        }
      ]
      const lastFields = [
        {
          key: 'createdBy',
          label: '创建人',
          formatter: (row, column, cellValue, index) => {
            return this._tcolFormat.setShowValue(cellValue.realName)
          }
        },
        {
          key: 'updateTime',
          label: '更新时间',
          width: '180',
          formatter: (row, column, cellValue, index) => {
            return this._tcolFormat.formatterMinute(row, column, cellValue, index)
          }
        }
      ]
      const mapKey = {
        proxy: [],
        autonomous: [
          {
            key: 'status',
            label: '状态',
            customMode: true
          },
          {
            key: 'sourceChannel',
            label: '来源渠道'
          },
          {
            key: 'version',
            label: '使用版本'
          }
        ]
      }
      return defaultFields.concat(mapKey[key], lastFields)
    },
    table_location (item) { // 查询详细
      _fn.toLocation({
        name: 'enterpriseManageSee',
        params: {
          name: 'see',
          id: item.row.id
        },
        query: {
          realName: item.row.createdBy.realName,
          type: this.tagName
        }
      }) // -> /user/123
    },
    table_location_add (item) { // 新增、编辑
      _fn.toLocation({
        name: 'enterpriseManageEdit',
        params: {
          id: (item && item.id) || '0'
        },
        query: {
          type: this.tagName
        }
      }) // -> /user/123
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        enterprise: { ruleForm },
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
            name: '',
            industryId: ''
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
    // 停服
    stopServing (data) {

    },
    // 审核通过/不通过
    check (type, data) {
      this.obj.dialog.title = type === '1' ? '版本开通' : '审核不通过'
      this.obj.dialog.show = true
      this.obj.dialog.temp.version.isShow = type === '1'
      this.obj.dialog.temp.reason.isShow = type !== '1'
      this.obj.dialog.callback = this.checkSubmit
    },
    checkSubmit (params, callback) {
      console.log(params)
      callback()
    },
    // 编辑
    editClick (data) {
      this.table_location_add(data)
    }
  }
}
