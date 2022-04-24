<template>
  <!-- 栏目管理 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagIndex" :data="obj.tabs" @click="handleClick" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="tagIndex === 1">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.contentTitle" name="contentTitle" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <template v-for="(item,index) in obj.searchModel.temp">
          <zp-dynamicFormItem v-show="index !== 'contentTitle'" :formItem="item" :name="index" :obj="obj.searchModel" :key="index" />
        </template>
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button v-if="tagIndex === 1 && _fn.checkBtn('content/add')" class="zp-btn-primary" @click="this.toAddContent">创建内容</zp-button>
          <zp-button v-if="tagIndex === 2 && _fn.checkBtn('selectEdition/add')" class="zp-btn-primary" :disabled="obj.searchModel.temp.columnId.data.length >= 8" @click="this.toAdd">新增栏目</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_contentTitle" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="_fn.checkBtn('content/details')" class="table_location" @click="table_location(scope.row)">{{ scope.row.contentTitle }}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_createBy" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{scope.row.createBy && scope.row.createBy.realName}}
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 调整内容所在栏目/内容管理弹窗 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogContent" ref="dialogForm">
      <template slot="form">
        <div class="flex"><span class="widths">内容题目:</span><span>{{ dialogContent.ruleForm.contentTitle }}</span></div>
        <div class="flex"><span class="widths">当前所在栏目:</span><span>{{ dialogContent.ruleForm.editionName }}</span></div>
        <p class="contentTips" v-if="dialogContent.ruleForm.tips"><zp-icons />{{ dialogContent.ruleForm.tips }}</p>
        <zp-dynamicFormItem v-else :formItem="dialogContent.temp.columnId" name="columnId" :obj="dialogContent" />
      </template>
    </zp-dynamicDialog>
    <!-- 调整栏目顺序 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogSort" ref="dialogForm">
      <div slot="dialogTips" class="tips"><zp-icons />调整顺序后，该栏目后的其它栏目顺序以此后移1位</div>
      <template slot="form">
        <div class="flex"><span class="widths">栏目名称:</span><span>{{ dialogSort.ruleForm.editionName }}</span></div>
        <div class="flex"><span class="widths">当前顺序:</span><span>{{ dialogSort.ruleForm.sortN }}, 总共{{obj.searchModel.temp.columnId.data.length}}个栏目</span></div>
        <zp-dynamicFormItem :formItem="dialogSort.temp.sort" name="sort" :obj="dialogSort" />
      </template>
    </zp-dynamicDialog>
    <!-- 创建/编辑 层级 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.dialog.temp.editionName" name="editionName" :obj="obj.dialog" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.sort" name="sort" :obj="obj.dialog" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.enabled" name="enabled" :obj="obj.dialog" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.remark" name="remark" :obj="obj.dialog" />
      </template>
    </zp-dynamicDialog>    
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
import index from '../personnel/index.vue'
export default {
  name: 'choice',
  data () {
    return {
      tagIndex: 1, // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          tabs: [
            { value: 1, label: '内容管理' },
            { value: 2, label: '栏目管理' }
          ],
          http: {},
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {},
            ruleForm: {}
          },
          tableObj: {
            operation: {
              // 全选
              selection: false,
              operation_width: 180
            },
            btnList: [],
            fields: []
          },
          dialog: {
            show: true,
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '1000px',
            isShowLabel: true, // 是否显示label
            labelWidth: '120px', // label宽度
            temp: {
              editionName: {
                label: '栏目名称',
                isShow: true,
                limit: true,
                placeholder: '不超过5个字',
                maxlength: 5
              },
              sort: {
                formType: 'select',
                label: '栏目顺序',
                isShow: true,
                data: []
              },
              enabled: {
                formType: 'select',
                label: '启用状态',
                isShow: true,
                clearable: false,
                data: [
                  { label: '启用', value: 1 },
                  { label: '暂停', value: 0 }
                ]
              },
              remark: {
                type: 'textarea',
                label: '栏目备注',
                isShow: true,
                placeholder: '不超过20个字',
                maxlength: 20,
                limit: true,
                rows: 4
              }
            },
            ruleForm: {
              editionName: '', // 栏目名称 
              sort: '', // 栏目顺序
              enabled: 1, // 启用状态
              remark: '' // 栏目备注
            },
            rules: {
              editionName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
              sort: [{ required: true, message: '请选择栏目顺序', trigger: 'change' }]
            },
            callback: this.selectEditionAdd
          }
        }
      }),
      // 调整内容所在栏目
      dialogContent: {
        show: false,
        title: '调整内容所在栏目',
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '660px',
        isShowLabel: true, // 是否显示label
        labelWidth: '120px', // label宽度
        temp: {
          columnId: {
            formType: 'select',
            label: '调整到:',
            data: [],
            isShow: true
          }
        },
        ruleForm: {
          contentTitle: '',
          columnId: ''
        },
        rules: {
          columnId: [{ required: true, message: '请选择栏目', trigger: 'change' }]
        },
        callback: this.commitContent
      },
      // 调整栏目顺序
      dialogSort: {
        slot: 'Tips',
        show: false,
        title: '调整栏目顺序',
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '660px',
        isShowLabel: true, // 是否显示label
        labelWidth: '120px', // label宽度
        temp: {
          sort: {
            formType: 'select',
            label: '调整顺序到:',
            data: _var.columnSort,
            isShow: true
          }
        },
        ruleForm: {
          editionName: '',
          sortN: '',
          sort: '' // 栏目顺序
        },
        rules: {
          sort: [{ required: true, message: '请选择顺序', trigger: 'change' }]
        },
        callback: this.commitSort
      }
    }
  },
  beforeRouteLeave (to, form, next) {
    if (!to.name.match(/(choiceEdit|choiceDetail)/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        choice: null
      })
    }
    next()
  },
  watch: {
    tagIndex: {
      handler: function (val) {
        this.obj.http = this.mapHttp(val)
        this.obj.searchModel = this.mapSearchModel(val)
        this.obj.tableObj.btnList = this.mapBtnKey(val)
        this.obj.tableObj.fields = this.mapColumnFields(val)
        const requestHandle = async () => {
          await this.getColumnList() // 栏目列表
        }
        if (this.tagIndex === 1) {
          requestHandle()
        }
      },
      immediate: true
    }
  },
  created () {
    const { keepAlive } = this.$store.state.keep_alive
    const { http, searchModel, tableObj } = this.obj
    const keepAliveRuleForm = keepAlive.choice ? keepAlive.choice.ruleForm : searchModel.ruleForm
    const keepAlivePager = keepAlive.choice ? keepAlive.pager : {
      pageNo: 1
    }
    this.obj = Object.assign({}, this.obj, {
      http: {
        ...http
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
  // mounted () {
  // },
  methods: {
    // http
    mapHttp (key) {
      const mapkey = {
        1: {
          queryUrl: 'content_list',
          updateUrl: '',
          addUrl: '',
          delUrl: ''
        },
        2: {
          queryUrl: 'selectEdition_getSelectEditionList',
          updateUrl: '',
          addUrl: '',
          delUrl: ''
        }
      }
      return mapkey[key]
    },
    // 筛选条件
    mapSearchModel (key) {
      const { searchModel } = this.obj
      const mapKey = {
        1: {
          temp: {
            contentTitle: {
              formType: 'input',
              label: '文章标题',
              placeholder: '请输入文章标题',
              maxlength: 30,
              isShow: true,
              isShowLabel: true, // 不显示label
              'prefix-icon': 'el-icon-search'
            },
            columnId: {
              formType: 'select',
              label: '所在栏目',
              data: [],
              isShow: true
            },
            contentStatus: {
              formType: 'select',
              label: '上线状态',
              data: _var.onlineStatus,
              isShow: true,
              clearable: false
            },
            stickyTop: {
              formType: 'select',
              label: '是否置顶',
              data: _var.stickTop,
              isShow: true,
              clearable: false
            }
          },
          ruleForm: {
            contentTitle: '',
            columnId: '',
            contentStatus: 2,
            stickyTop: 2
          }
        },
        2: {
          temp: {
            columnId: {
              formType: 'select',
              label: '栏目名称',
              placeholder: '请选择栏目名称',
              isShow: true,
              data: []
            },
            enabled: {
              formType: 'select',
              label: '启用状态',
              data: _var.enabledAll,
              isShow: true,
              clearable: false
            }
          },
          ruleForm: {
            columnId: '',
            enabled: ''
          }
        }
      }
      return Object.assign(searchModel, mapKey[key])
    },
    // 表格操作按钮
    mapBtnKey (key) {
      const mapKey = {
        1: [
          {
            text: '编辑',
            isShow: (item, obj) => {
              return _fn.checkBtn('content/update')
            },
            callback: this.toAddContent
          },
          {
            text: '删除',
            isShow: (item, obj) => {
              return _fn.checkBtn('content/delete')
            },
            callback: data => this.contentDialog(data, 'delete')
          },
          {
            text: '上线',
            isShow: (item, obj) => {
              return item.contentStatus === false && _fn.checkBtn('content/enable')
            },
            callback: data => this.contentDialog(data, 'online')
          },
          {
            text: '下线',
            isShow: (item, obj) => {
              return item.contentStatus === true && _fn.checkBtn('content/disable')
            },
            callback: data => this.contentDialog(data, 'Offline')
          },
          {
            icon: true, // 更多操作
            isShow: (item, obj) => {
              return true
            },
            callback: this.table_moreOperation,
            list: [
              {
                value: 1,
                label: '置顶',
                isShow: (item, obj) => {
                  return item.stickyTop === false && _fn.checkBtn('content/stick_top')
                }
              },
              {
                value: 2,
                label: '取消置顶',
                isShow: (item, obj) => {
                  return item.stickyTop === true && _fn.checkBtn('content/sticy_down')
                }
              },
              {
                value: 3,
                label: '调整栏目',
                isShow: (item, obj) => {
                  return _fn.checkBtn('content/updateColumn')
                }
              }
            ]
          }
        ],
        2: [
          {
            text: '编辑',
            isShow: (item, obj) => {
              return _fn.checkBtn('selectEdition/update')
            },
            callback: this.toEdit
          },
          {
            text: '调序',
            isShow: (item, obj) => {
              return _fn.checkBtn('selectEdition/changeSequence')
            },
            callback: this.sort
          },
          {
            text: '暂停',
            isShow: (item, obj) => {
              return item.enabled && _fn.checkBtn('selectEdition/changeStatus')
            },
            callback: this.stop
          },
          {
            text: '启用',
            isShow: (item, obj) => {
              return !item.enabled && _fn.checkBtn('selectEdition/changeStatus')
            },
            callback: this.start
          }
        ]
      }
      return mapKey[key]
    },
    // 表格列
    mapColumnFields (key) {
      const defaultFields = []
      const lastFields = []
      const mapKey = {
        1: [
          { key: 'contentTitle', label: '内容标题', width: '150px', customMode: true },
          { key: 'columnId', label: '所属栏目', customMode: row => { return row.columnId ? row.columnId.editionName || '--' : '--' } },
          { key: 'tagId', label: '内容属性', customMode: row => { return row.tagId ? row.tagId.name || '--' : '--' } },
          { key: 'contentStatus', label: '上线状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i, 'onlineStatus') },
          { key: 'stickyTop', label: '是否置顶', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i, 'stickTop') },
          { key: 'createTime', label: '创建时间', formatter: this._tcolFormat.formatterMinute },
          { key: 'createBy', label: '创建人', customMode: true },
          { key: 'updateTime', label: '修改时间', formatter: this._tcolFormat.formatterMinute }
        ],
        2: [
          { key: 'editionName', label: '栏目名称' },
          { key: 'sort', label: '栏目顺序' },
          { key: 'contentSum', label: '栏目内容数目' },
          { key: 'remark', label: '栏目备注' },
          { key: 'enabled', label: '启用状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i, 'enabledAll') },
          { key: 'createTime', label: '创建时间' },
          { key: 'updateTime', label: '更新时间' },
          { key: 'createUsername', label: '创建人' }
        ]
      }
      return defaultFields.concat(mapKey[key], lastFields)
    },
    handleClick (tab) {
      this.$nextTick(() => {
        this.$refs.page.load()
        // this.$refs.page.reset()
      })
    },
    getColumnList () {
      let pageReq = { page: 1, size: 20 }
      let queryParam = { columnId: '', enabled: '' }
      _fn.getColumnList((data) => {
        this.obj.searchModel.temp.columnId.data = data
        this.dialogContent.temp.columnId.data = data.map(item => {
          return {
            ...item,
            disabled: item.obj.enabled !== 1
          }
        })
      }, { pageReq, queryParam }, true)
    },
    toDdialog (item) {
      this.obj.dialog.title = `${item && item.id ? '编辑' : '新增'}栏目`
      this.obj.dialog.temp.sort.data = this.setDisabled(this.obj.tableObj.data, _var.columnSort)
      this.obj.dialog.show = true
      this.obj.dialog.flag = item && item.id ? 'edit' : 'add'
      if (item && item.id) {
        this.obj.dialog.temp.enabled.isShow = false
        this.obj.dialog.temp.sort.isShow = false
      } else {
        this.obj.dialog.temp.enabled.isShow = true
        this.obj.dialog.temp.sort.isShow = true
      }
      this.obj.dialog.ruleForm = item && item.id ? ({
        editionName: item.editionName,
        remark: item.remark,
        id: item.id
      }) : ({
        editionName: '', // 栏目名称 
        sort: '', // 栏目顺序
        enabled: 1, // 启用状态
        remark: '' // 栏目备注
      })
    },
    setDisabled (val, allVal) {
      let arr = val.map(item => {
        return item.sort
      })
      let getArr = allVal.map(item => {
        return { label: item.label, value: item.value, disabled: arr.includes(item.label) }
      })
      return getArr
    },
    toAdd (item) {
      this.toDdialog(item)
    },
    toEdit (item) {
      this.toDdialog(item)
    },
    start (data) { // 启用
      let self = this
      let dia = {
        id: data.id,
        title: '启用栏目',
        tbody: `确定开始使用 <span style="color:#4a84ff;">${data.editionName}</span>？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id, enabled: 1 }
          this._api.selectEdition_changeStatus(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    },
    stop (data) { // 暂停
      let self = this
      let dia = {
        id: data.id,
        title: '暂停栏目',
        tbody: `确定暂停使用 <span style="color:#4a84ff;">${data.editionName}</span>？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id, enabled: 0 }
          this._api.selectEdition_changeStatus(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    },
    sort (item) { // 栏目顺序
      console.log('sortsortsortsortsort', item)
      this.dialogSort.show = true
      this.dialogSort.ruleForm = item && item.id ? ({
        editionName: item.editionName,
        sortN: item.sort,
        sort: '',
        id: item.id
      }) : ({
        sort: '' // 投递渠道分类 
      })
    },
    toAddContent (item) { // 新增、编辑
      _fn.toLocation({ name: 'choiceEdit', params: { id: encodeURI(JSON.stringify({ id: (item && item.id) || '0' })) } }) // -> /user/123
    },
    table_moreOperation (val, row, item) { // 更多操作
      if (val === 1) { // 置顶
        this.contentDialog(row, 'top')
      } else if (val === 2) { // 取消置顶
        this.contentDialog(row, 'cancelTop')
      } else if (val === 3) { // 调整栏目
        this.contentDialog(row, 'adjustColumn')
      }
    },
    contentDialog (item, val) {
      this.dialogContent.show = true
      let tipsValue
      if (val === 'adjustColumn') {
        this.dialogContent.title = '调整内容所在栏目'
        tipsValue = ''
      }
      if (val === 'delete') {
        this.dialogContent.title = '删除内容'
        tipsValue = '确定将该内容删除？'
      }
      if (val === 'top') {
        this.dialogContent.title = '置顶内容'
        tipsValue = '确定将该内容放在栏目最前面？'
      }
      if (val === 'cancelTop') {
        this.dialogContent.title = '取消置顶'
        tipsValue = '确定取消置顶该文章？'
      }
      if (val === 'online') {
        this.dialogContent.title = '上线内容'
        tipsValue = '确定将该内容上线？上线后将在小程序中展示'
      }
      if (val === 'Offline') {
        this.dialogContent.title = '下线内容'
        tipsValue = '确定将该文章下线？下线后在小程序中将不会再展示'
      }
      this.dialogContent.val = val
      console.log('rowrowrowrowrowrowrowrow', item)
      this.dialogContent.ruleForm = {
        contentTitle: item.contentTitle,
        editionName: item.columnId.editionName,
        id: item.id,
        tips: tipsValue
      }
    },
    // commitSort () { // 排序
    //   let id = this.dialogAuth.id
    //   let sort = this.dialogAuth.ruleForm.move
    //   this._api.banner_updateSort({ id, sort }).then((res) => {
    //     this.notify(res.msg || '操作成功', 'success')
    //     this.dialogAuth.show = false
    //     this.$refs.page.load()
    //   })
    // },
    commitContent () {
      let val = this.dialogContent.val
      let apiUrl = ''
      let param = {
        id: this.dialogContent.ruleForm.id
      }
      console.log('commitContentcommitContentcommitContent', val)
      switch (val) {
        case 'adjustColumn':
          apiUrl = 'content_updateColumn'
          param.columnId = this.dialogContent.ruleForm.columnId
          break
        case 'delete':
          apiUrl = 'content_delete'
          break
        case 'top':
          apiUrl = 'content_stick_top'
          break
        case 'cancelTop':
          apiUrl = 'content_sticy_down'
          break
        case 'online':
          apiUrl = 'content_enable'
          break
        case 'Offline':
          apiUrl = 'content_disable'
          break
        default:
          break
      }
      this._api[apiUrl](param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialogContent.show = false
        this.$refs.page.load()
      })
    },
    selectEditionAdd () {
      let param = this.obj.dialog.ruleForm
      // console.log('paramparamparamparam',param)
      this._api[param.id ? 'selectEdition_update' : 'selectEdition_add'](param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.obj.dialog.show = false
        this.$refs.page.load()
        // this.getColumnList() // 栏目列表
      })
    },
    commitSort () {
      let param = {
        id: this.dialogSort.ruleForm.id,
        sort: this.dialogSort.ruleForm.sort
      }
      this._api.selectEdition_changeSequence(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialogSort.show = false
        this.$refs.page.load()
      })
    },
    // tipDialogContent (data) {
    //   // console.log('opopop', item)
    //   this.dialogTip.show = false
    //   let self = this
    //   let dia = {
    //     id: data.id,
    //     title: '删除内容',
    //     tbody: `<div style="display: flex; margin: 6px 0px;"><span style="width: 120px; padding: 0 12px 0 0; text-align: right; box-sizing: border-box;">内容题目:</span><span style="flex: 1;">${data.name}</span></div>
    //     <div style="display: flex; margin: 6px 0px;"><span style="width: 120px; padding: 0 12px 0 0; text-align: right; box-sizing: border-box;">当前所在栏目:</span><span style="flex: 1;">${data.name}</span></div><p style="text-align: center; font-weight: 600;">确定将该内容删除？</p>`,
    //     titleSve: true,
    //     show: true,
    //     confirmText: '',
    //     isCancel: true, // 是否显示取消按钮
    //     confirmCallback: function () {
    //       let param = { id: dia.id }
    //       this._api.delivery_template_enable(param).then((res) => {
    //         self.notify(res.msg || '操作成功', 'success')
    //         self.dialogTip.show = false
    //         self.$refs.page.load()
    //       })
    //     }
    //   }
    //   this.dialogTip = dia
    // },
    table_location (item) { // 查询详细
      _fn.toLocation({ name: 'choiceDetail', params: { id: item.id } }) // -> /user/123
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        choice: { ruleForm },
        pager: {
          pageNo: pager.pageNo,
          pageSize: pager.pageSize
        }
      })
      if (this.tagIndex === 2) {
        let result = data.list.map(item => ({
          label: item.editionName,
          value: item.id,
          obj: item
        }))
        this.obj.searchModel.temp.columnId.data = result
        this.dialogContent.temp.columnId.data = result.map(item => {
          return {
            ...item,
            disabled: item.obj.enabled !== 1
          }
        })
      }
      fn && fn(data.list)
    },
    resetAfter (tempSearch, callback) {
      const { searchModel, tableObj } = this.obj
      const mapKey = {
        1: {
          contentTitle: '',
          columnId: '',
          contentStatus: 2,
          stickyTop: 2
        },
        2: {
          columnId: '',
          enabled: ''
        }
      }
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: mapKey[this.tagIndex]
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
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  margin: 6px 0px;
  span:last-child {
    flex: 1;
    color:#69707F;
  }
  .widths {
    width: 120px;
    padding: 0 12px 0 0;
    text-align: right;
    color: #26334F;
    box-sizing: border-box;
  }
}
.tips {
  width: 100%;
  height: 36px;
  line-height: 36px;
  background: rgba(74,132,255,0.04);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: -12px;
  svg {
    margin: 0px 10px;
  }
}
.contentTips {
  font-size: 16px;
  color: #26334F;
  min-width: 500px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  svg {
    margin: 0px 10px;
  }
}
</style>
