import { customDropdownAction } from '@/mixins/index'

export default {
  name: 'enterpriseManage',
  mixins: [customDropdownAction],
  data () {
    return {
      dialogTip: {},
      mapLoading: true,
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'recruitGetAddressList',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          breadcrumb: {
            title: this.$route.meta.name || '地址管理'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            inline: true,
            labelWidth: '80px',
            temp: {
              name: {
                label: '名称',
                placeholder: '请输入门店名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true,
                'prefix-icon': 'el-icon-search'
              },
              companyId: {
                formType: 'select',
                label: '所属企业',
                placeholder: '请选择所属企业',
                isShow: true,
                isShowLabel: false,
                clearable: false,
                data: []
              },
              status: {
                formType: 'select',
                label: '状态',
                placeholder: '请选择状态',
                clearable: false,
                data: [],
                isShow: true
              }
            },
            ruleForm: {
              name: '',
              companyId: '',
              status: '2'
            }
          },
          tableObj: {
            operation: {
              operation_width: 180
            },
            btnList: [
              {
                text: '停用',
                isShow: (item, obj) => {
                  return item.enabled
                },
                callback: this.changeStats
              },
              {
                text: '启用',
                isShow: (item, obj) => {
                  return !item.enabled
                },
                callback: this.changeStats
              },
              {
                text: '编辑',
                type: 'del',
                isShow: true,
                callback: this.table_location_add
              },
              {
                text: '复制',
                type: 'del',
                isShow: true,
                callback: this.copyClick
              }
            ],
            fields: [
              {
                key: 'address',
                label: '门店名称',
                width: 'auto',
                formatter: (row, column, cellValue, index) => {
                  return cellValue.name
                }
              },
              {
                key: 'company',
                label: '所属企业',
                width: 'auto',
                formatter: (row, column, cellValue, index) => {
                  if (!cellValue) {
                    return '--'
                  }
                  const { name } = cellValue
                  if (!name) {
                    return '--'
                  }
                  return name
                }
              },
              {
                key: 'address',
                label: '地址',
                width: 'auto',
                formatter: (row, column, cellValue, index) => {
                  return cellValue.details
                }
              },
              {
                key: 'enabled',
                label: '状态',
                width: '120',
                customMode: (row, column, cellValue, i) => {
                  const flag = cellValue || false
                  return _fn.getStateStr(row, column, flag, i)
                }
              },
              {
                key: 'address',
                label: '更新时间',
                width: '200',
                formatter: (row, column, cellValue, index) => {
                  const { updateTime } = row
                  return this._tcolFormat.formatterMinute(row, column, updateTime, index)
                }
              }
            ]
          }
        }
      }),
      tableSelectedData: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'addressManageEdit') {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        address: null
      })
    }
    next()
  },
  created: function () {
    const requestHandle = async () => {
      await this.getEnterprise()
      await this.getPublicCombobox()
    }
    requestHandle()
    const { keepAlive } = this.$store.state.keep_alive
    if (keepAlive.address) {
      const { searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: { ...keepAlive.address.ruleForm }
        },
        tableObj: {
          ...tableObj,
          pager: {
            ...tableObj.pager,
            ...keepAlive.pager
          }
        }
      })
    }
  },
  computed: {
    batchActionBtnDisabled () {
      return !!this.tableSelectedData.length
    }
  },
  methods: {
    getEnterprise () {
      return _fn.getAllCompony(res => {
        res.unshift({
          label: '全部',
          value: ''
        })
        this.obj.searchModel.temp.companyId.data = res
      }, {}, true)
    },
    getPublicCombobox () {
      return _fn.getPublicCombobox(res => {
        this.obj.searchModel.temp.status.data = res
      }, { comboType: 3 }, true)
    },
    // 批量操作
    commandClick (command) {
      switch (command) {
        case '1':
          this.requestBatchDisabled()
          break
        default:
          break
      }
    },

    table_location_add (item) { // 新增、编辑
      _fn.toLocation({
        name: 'addressManageEdit',
        params: { id: (item && item.address.id) || '0' },
        query: {
          id: item && item.id,
          companyId: item && (item.company ? item.company.id : '')
        }
      }) // -> /user/123
    },
    changeStats (data, item) {
      const { enabled, address } = data
      if (enabled) { // 停用
        let dia = {
          id: data.id,
          type: 'disable',
          title: '停用地址',
          tbody: `您是否确认停用 <span style="color:#4a84ff;">${address.name}</span> 地址？`,
          titleSve: true,
          show: true,
          confirmText: '',
          isCancel: true, // 是否显示取消按钮
          confirmCallback: this.dialogDel
        }
        this.dialogTip = dia
      } else { // 启用
        let dia = {
          id: data.id,
          type: 'enabled',
          title: '启用地址',
          tbody: `您是否确认启用 <span style="color:#4a84ff;">${address.name}</span> 地址？`,
          titleSve: true,
          show: true,
          confirmText: '',
          isCancel: true, // 是否显示取消按钮
          confirmCallback: this.dialogDel
        }
        this.dialogTip = dia
      }
    },
    dialogDel () {
      const { type, id } = this.dialogTip
      this._api[type === 'disable' ? 'recruitAddresDisable' : 'recruitAddresEnable']({ id }).then(res => {
        this.dialogTip.show = false
        _fn.message(res.msg || '操作成功', { type: 'success' })
        this.$refs.hroPage.load()
      })
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        address: { ruleForm },
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
            companyId: '',
            status: '2'
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
    copyClick (data) {
      _fn.toLocation({
        name: 'addressManageEdit',
        params: {
          id: '0'
        },
        query: {
          json: JSON.stringify({
            address: data.address,
            company: data.company
          })
        }
      })
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    // 批量停用
    requestBatchDisabled () {
      const ids = this.tableSelectedData.filter(item => item.enabled).map(item => item.id)
      if (!ids.length) {
        _fn.message('暂无可操作的地址', { type: 'warning' })
        return
      }
      this._api.recruitAddressBatchDisable({ ids }).then(res => {
        _fn.message(res.msg || '操作成功', { type: 'success' })
        this.$refs.hroPage.load()
      })
    }
  }
}
