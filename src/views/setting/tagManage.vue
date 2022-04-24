<template>
  <!-- 标签管理 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" :data="obj.tabs" v-model="tagIndex" @click="handleClick" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.key" name="key" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.rejectType" name="rejectType" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.status" name="status" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="tagIndex === 3">新增人才库标签</zp-button>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="tagIndex === 4">新增淘汰原因</zp-button>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="tagIndex === 2">新增职位福利</zp-button>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="tagIndex === 1">新增企业亮点</zp-button>
          <zp-button class="zp-btn-primary" @click="table_location_add" v-if="tagIndex === 5">创建内容标签</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe />
    <!-- 创建/编辑 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <template v-for="(item,index) in obj.dialog.temp">
          <zp-dynamicFormItem :formItem="item" :name="index" :obj="obj.dialog" :key="index" />
        </template>
      </template>
    </zp-dynamicDialog>

    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
export default {
  name: 'settingTagManage',
  data () {
    return {
      tagIndex: 3, // tabs 默认选中的值
      dialogTip: {}, // 人才库标签、职位福利、企业亮点
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'tag_list',
            updateUrl: 'tag_update',
            addUrl: 'tag_add',
            delUrl: ''
          },
          breadcrumb: {
            title: this.$route.meta.name || '标签管理'
          },
          tabs: [
            { value: 3, label: '人才库标签' },
            { value: 4, label: '淘汰原因' },
            { value: 2, label: '职位福利' },
            { value: 1, label: '企业亮点' },
            { value: 5, label: '内容标签' }
          ],
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              key: {
                label: '标签名',
                placeholder: '请输入标签名',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 是否显示label
                'prefix-icon': 'el-icon-search'
              },
              status: {
                formType: 'select',
                label: '状态',
                data: _var.tagManageState,
                isShow: true,
                clearable: false
              },
              rejectType: {
                formType: 'select',
                label: '类型',
                data: _var.dieOutType,
                isShow: false,
                clearable: false
              }
            },
            ruleForm: {
              key: '',
              status: 2,
              rejectType: 2
            }
          },
          tableObj: {
            operation: {
              selection: false, // 不显示操作列
              operation_width: 100 // 操作列宽度
            },
            btnList: [
              {
                text: '停用',
                isShow: (item, obj) => {
                  return item.enabled
                },
                callback: this.statsClick
              },
              {
                text: '启用',
                isShow: (item, obj) => {
                  return !item.enabled
                },
                callback: this.statsClick
              },
              {
                text: '编辑',
                isShow: true,
                callback: this.table_location_add
              }
            ],
            fields: [
              { key: 'name', label: '标签名' },
              {
                key: 'description',
                label: '标签说明',
                formatter: (row, column, cellValue, index) => {
                  return this._tcolFormat.setShowValue(cellValue)
                }
              },
              {
                key: 'enabled',
                label: '状态',
                customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i)
              }
            ]
          },
          dialog: {
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '1000px',
            isShowLabel: true, // 是否显示label
            // labelWidth: '80px', // label宽度
            temp: {
              type: {
                formType: 'select',
                label: '淘汰类型',
                placeholder: '请选择',
                data: _var.dieOutType2,
                isShow: false
              },
              name: {
                label: '标签名称',
                placeholder: '请输入标签名称',
                isShow: true,
                maxlength: 10,
                limit: true
              },
              description: {
                type: 'textarea',
                label: '标签说明',
                placeholder: '请输入标签说明',
                isShow: true,
                maxlength: 50,
                limit: true,
                rows: 4
              }
            },
            ruleForm: {
              name: '', // 名称 
              description: '' //
            },
            rules: {
              name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
              type: [{ required: true, message: '请选择淘汰类型', trigger: 'change' }]
            }
          }
        }
      })
    }
  },
  mounted () { },
  methods: {
    handleClick (tab) {
      this.tagIndex = Number(tab)
      const index = this.tagIndex
      const { http, searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        http: {
          queryUrl: index === 4 ? 'reject_list' : 'tag_list',
          updateUrl: index === 4 ? 'reject_update' : 'tag_update',
          addUrl: index === 4 ? 'reject_add' : 'tag_add',
          delUrl: ''
        },
        searchModel: {
          ...searchModel,
          temp: {
            ...searchModel.temp,
            key: {
              ...searchModel.temp.key,
              label: index === 4 ? '淘汰理由' : '标签名',
              placeholder: index === 4 ? '请输入淘汰理由' : '请输入标签名'
            },
            rejectType: {
              ...searchModel.temp.rejectType,
              isShow: index === 4
            }
          }
        },
        tableObj: {
          ...tableObj,
          fields: index === 4 ? [{
            key: 'name',
            label: '淘汰理由'
          },
          {
            key: 'type',
            label: '淘汰类型',
            formatter: (row, column, cellValue, i) => {
              return this._tcolFormat.getValueByCode(cellValue, _var.dieOutType)
            }
          },
          {
            key: 'enabled',
            label: '状态',
            customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i)
          }] : [{
            key: 'name',
            label: '标签名'
          },
          {
            key: 'description',
            label: '标签说明',
            formatter: (row, column, cellValue, index) => {
              return this._tcolFormat.setShowValue(cellValue)
            }
          },
          {
            key: 'enabled',
            label: '状态',
            customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i)
          }]
        }
      })
      this.$nextTick(() => {
        this.$refs.page.reset()
      })
    },
    loadBefor (obj) {
      let param = (obj && obj.queryParam) || {}
      if (!param.status && param.status !== 0) {
        param.status = 2 // 全部
      }
      if (this.tagIndex !== 4) {
        param.tagType = this.tagIndex
      }
      return obj
    },
    loadAfter (data) {
      this.obj.tableObj.data = data.list
      console.info('loadAfter')
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    table_location_add (obj) {
      const item = JSON.parse(JSON.stringify(obj))
      const index = this.tagIndex
      const { dialog } = this.obj
      const isAdd = item.id ? '修改' : '新增'
      let title = ''
      let ruleForm = null
      switch (index) {
        case 2:
          title = `${isAdd}职位福利标签`
          break
        case 3:
          title = `${isAdd}人才库标签`
          break
        case 4:
          title = `${isAdd}淘汰原因`
          break
        case 5:
          title = `${isAdd}内容标签`
          break
        default:
          title = `${isAdd}企业亮点标签`
          break
      }
      ruleForm = index === 4 ? {
        id: isAdd === '修改' ? item.id : '',
        type: isAdd === '修改' ? item.type : '',
        name: isAdd === '修改' ? item.name : '',
        enabled: isAdd === '修改' ? item.enabled : true
      } : { id: isAdd === '修改' ? item.id : '', name: isAdd === '修改' ? item.name : '', description: isAdd === '修改' ? item.description : '', type: index, enabled: true }
      this.obj = Object.assign({}, this.obj, {
        dialog: {
          ...dialog,
          show: true,
          title,
          flag: item.id ? 'edit' : 'add',
          temp: {
            ...dialog.temp,
            name: index === 4 ? {
              label: '淘汰理由',
              placeholder: '请输入淘汰理由',
              isShow: true,
              maxlength: 10,
              limit: true
            } : { label: '标签名称', placeholder: '请输入标签名称', isShow: true, maxlength: 10, limit: true },
            type: {
              ...dialog.temp.type,
              isShow: index === 4
            },
            description: {
              ...dialog.temp.description,
              isShow: index !== 4
            }
          },
          ruleForm,
          rules: {
            ...dialog.rules,
            name: index === 4 ? [{
              required: true,
              message: '请输入淘汰理由',
              trigger: 'blur'
            }] : [{
              required: true,
              message: '请输入标签名称',
              trigger: 'blur'
            }]
          }
        }
      })
    },
    statsClick (data, item) { // 删除
      if (data.enabled) { // 停用
        let dia = {
          id: data.id,
          title: '停用标签',
          tbody: `您是否确认停用 <span style="color:#4a84ff;">${data.name}</span> 标签？`,
          titleSve: true,
          show: true,
          confirmText: '',
          isCancel: true, // 是否显示取消按钮
          confirmCallback: this.dialogDel(data)
        }
        this.dialogTip = dia
      } else if (!data.enabled) { // 启用
        let dia = {
          id: data.id,
          title: '启用标签',
          tbody: `您是否确认启用 <span style="color:#4a84ff;">${data.name}</span> 标签？`,
          titleSve: true,
          show: true,
          confirmText: '',
          isCancel: true, // 是否显示取消按钮
          confirmCallback: this.dialogDel(data)
        }
        this.dialogTip = dia
      }
    },
    dialogDel (data) {
      let self = this
      return function () {
        self.dialogTip.show = false
        let param = null
        let url = ''
        switch (self.tagIndex) {
          case 4:
            url = data.enabled ? 'reject_disable' : 'reject_enable'
            param = {
              id: data.id,
              enabled: data.enabled
            }
            break
          default:
            url = data.enabled ? 'tag_disable' : 'tag_enable'
            param = {
              id: data.id,
              enabled: data.enabled,
              type: self.tagIndex
            }
            break
        }
        _api[url](param).then((res) => {
          self.notify(res.msg || '操作成功', 'success')
          self.handleClick(param.type || 4)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .searchForm {
  .el-form-item {
    margin-bottom: 16px !important;
  }
  .param {
    padding-bottom: 0px;
  }
}
</style>
