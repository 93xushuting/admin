<template>
  <!-- 招聘流程 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`招聘流程`,value: 'start'}]" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj">
      <!-- 小于三个元素时 -->
      <template slot="form">
        <template v-for="(item,index) in obj.searchModel.temp">
          <zp-dynamicFormItem :formItem="item" :name="index" :obj="obj.searchModel" :key="index" />
        </template>
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="this.toAdd">新增流程</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_name" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            <span class="table_location" @click="toSee(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_createor" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{scope.row.createBy && scope.row.createBy.realName}}
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
export default {
  name: 'zpFlow',
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'zpFlowEdit') {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        processTemplate: null
      })
    }
    next()
  },
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'process_template_list',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '流程名称',
                placeholder: '请输入流程名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              status: {
                formType: 'select',
                label: '状态',
                data: _var.tagManageState,
                isShow: true,
                clearable: false
              }
            },
            ruleForm: {
              name: '',
              status: 2
            }
          },
          tableObj: {
            operation: {
              // 全选
              selection: false,
              operation_width: 180
            },
            btnList: [
              {
                text: '编辑',
                isShow: (item, obj) => {
                  return item.id !== '1'
                },
                callback: this.toEdit
              },
              {
                text: '停用',
                isShow: (item, obj) => {
                  return item.enabled && item.id !== '1'
                },
                callback: this.stop
              },
              {
                text: '启用',
                isShow: (item, obj) => {
                  return !item.enabled && item.id !== '1'
                },
                callback: this.start
              },
              {
                text: '复制',
                isShow: true,
                callback: this.toCopy
              }
            ],
            fields: [
              { key: 'name', label: '流程名称', customMode: true },
              { key: 'enabled', label: '状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i) },
              { key: 'createor', label: '创建人', customMode: true },
              { key: 'updateTime', label: '更新时间', formatter: this._tcolFormat.formatterMinute }
            ]
          }
        }
      })
    }
  },
  created: function () {
    const { keepAlive } = this.$store.state.keep_alive
    if (keepAlive.processTemplate) {
      const { searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: { ...keepAlive.processTemplate.ruleForm }
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
  mounted () {

  },
  methods: {
    toPage (item, index, obj, type) {
      let param = ''
      if (type === 'see') {
        param = { id: (item && item.id) || '0', type: type, name: item.name }
      } else if (type === 'copy') {
        param = { id: (item && item.id) || '0', type: type }
      } else if (type === 'add') {
        param = { id: '0', type: type }
      } else if (type === 'edit') {
        param = { id: (item && item.id), type: type }
      }
      // _fn.toLocation({ name: 'zpFlowEdit', params: { id: encodeURI(JSON.stringify(param)) } }) // -> /user/123
      _fn.toLocation({ name: 'zpFlowEdit', params: { id: encodeURI(JSON.stringify(param)) } }) // -> /user/123
    },
    toSee (item) {
      this.toPage(item, '', '', 'see')
    },
    toAdd (item, index, obj) {
      this.toPage(item, index, obj, 'add')
    },
    toEdit (item, index, obj) {
      let self = this
      this.isEidt(item, (flag) => {
        if (flag) {
          this.toPage(item, index, obj, 'edit')
        } else {
          let dia = {
            title: '提醒',
            icon: 'el-icon-warning',
            tbody: `有候选人证在使用该招聘流程，暂无法编辑修改。`,
            titleSve: true,
            show: true,
            confirmText: '我知道了',
            isCancel: false, // 是否显示取消按钮
            confirmCallback: function () {
              self.dialogTip.icon = ''
              self.dialogTip.show = false
            }
          }
          this.dialogTip = dia
        }
      })
    },
    toCopy (item, index, obj) {
      this.toPage(item, index, obj, 'copy')
    },
    isEidt (item, fn) {
      this._api.process_template_public_valid({ id: item.id }).then((res) => {
        if (res) {
          fn && fn(res.data)
        }
      })
    },
    start (data) { // 启用
      let self = this
      let dia = {
        id: data.id,
        title: '启用流程',
        tbody: `您是否确认启用 <span style="color:#4a84ff;">${data.name}</span> 招聘流程？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.process_template_enable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    },
    stop (data) { // 停用
      let self = this
      let dia = {
        id: data.id,
        title: '停用流程',
        tbody: `您是否确认停用 <span style="color:#4a84ff;">${data.name}</span> 招聘流程？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          self.isEidt(param, (flag) => {
            if (flag) {
              self._api.process_template_disable(param).then((res) => {
                self.notify(res.msg || '操作成功', 'success')
                self.dialogTip.show = false
                self.$refs.page.load()
              })
            } else {
              self.dialogTip.show = false
              self.stopAlgin()
            }
          })
        }
      }
      this.dialogTip = dia
    },
    stopAlgin (data) { // 停用
      let self = this
      let dia = {
        title: '停用流程',
        icon: 'el-icon-error',
        tbody: `有候选人正在使用招聘流程，暂无法停用。`,
        titleSve: true,
        show: true,
        confirmText: '我知道了',
        isCancel: false,
        confirmCallback: function () {
          self.dialogTip.icon = ''
          self.dialogTip.show = false
        }
      }
      this.dialogTip = dia
    },
    loadBefor (obj) {
      let param = (obj && obj.queryParam) || {}
      if (!param.status && param.status !== 0) {
        param.status = 2 // 全部
      }
      return obj
    },
    loadAfter (data, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        processTemplate: { ruleForm },
        pager: {
          pageNo: pager.pageNo,
          pageSize: pager.pageSize
        }
      })
      fn && fn(data.list)
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
