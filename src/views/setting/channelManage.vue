<template>
  <!-- 招聘流程 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`投递渠道`,value: 'start'}]" />
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
          <zp-button class="zp-btn-primary" @click="this.table_location_add">新增投递渠道</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_type" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{_var.channelType__global && _var.channelType__global(scope.row.type)}}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_createor" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{scope.row.createor && scope.row.createor.realName}}
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 创建/编辑 层级-->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.dialog.temp.type" name="type" :obj="obj.dialog" :key="index" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.name" name="name" :obj="obj.dialog" :key="index" />
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
export default {
  name: 'templateIndex',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'delivery_channel_list',
            updateUrl: 'delivery_channel_update',
            addUrl: 'delivery_channel_add',
            delUrl: ''
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              key: {
                formType: 'input',
                label: '渠道名称',
                placeholder: '请输入投递渠道名称',
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
              key: '',
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
                  return item.type !== 0
                },
                callback: this.table_location_add
              },
              {
                text: '停用',
                isShow: (item, obj) => {
                  return item.enabled && item.type !== 0
                },
                callback: this.stop
              },
              {
                text: '启动',
                isShow: (item, obj) => {
                  return !item.enabled && item.type !== 0
                },
                callback: this.start
              }
            ],
            fields: [
              { key: 'name', label: '投递渠道名称' },
              { key: 'type', label: '渠道分类', customMode: true },
              { key: 'enabled', label: '状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i) },
              { key: 'createor', label: '创建人', customMode: true },
              { key: 'updateTime', label: '更新时间', formatter: this._tcolFormat.formatterMinute }
            ]
          },
          dialog: {
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '1000px',
            isShowLabel: true, // 是否显示label
            labelWidth: '120px', // label宽度
            temp: {
              type: {
                formType: 'select',
                label: '投递渠道分类',
                isShow: true,
                data: (function () {
                  let a = JSON.parse(JSON.stringify(_var.channelType))
                  return a.map(item => {
                    if (item.value === 0) {
                      item.disabled = true
                    }
                    return item
                  })
                })()
              },
              name: {
                label: '投递渠道名称',
                isShow: true,
                limit: true,
                maxlength: 10
              }
            },
            ruleForm: {
              name: '', // 投递渠道分类 
              type: '' // 投递渠道名称
            },
            rules: {
              name: [{ required: true, message: '请选择投递渠道分类', trigger: 'change' }],
              type: [{ required: true, message: '请输入投递渠道名称', trigger: 'blur' }]
            }
          }
        }
      })
    }
  },
  mounted () {

  },
  methods: {
    table_location_add (item) {
      this.obj.dialog.title = `${item && item.id ? '编辑' : '新增'}投递渠道`
      this.obj.dialog.show = true
      this.obj.dialog.flag = item && item.id ? 'edit' : 'add'
      this.obj.dialog.ruleForm = item && item.id ? ({
        name: item.name,
        type: item.type,
        id: item.id
      }) : ({
        name: '', // 投递渠道分类 
        type: '' // 投递渠道名称
      })
    },
    start (data) { // 启用
      let self = this
      let dia = {
        id: data.id,
        title: '启用渠道',
        tbody: `您是否确认启用 <span style="color:#4a84ff;">${data.name}</span> 投递渠道？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.delivery_channel_enable(param).then((res) => {
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
        title: '停用渠道',
        tbody: `您是否确认停用 <span style="color:#4a84ff;">${data.name}</span> 投递渠道？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.delivery_channel_disable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    }
  }
}
</script>
