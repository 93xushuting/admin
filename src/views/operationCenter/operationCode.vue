<template>
  <!-- 招聘流程 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`运营渠道码`,value: 'start'}]" />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj">
      <!-- 小于三个元素时 -->
      <template slot="form">
        <template v-for="(item,index) in obj.searchModel.temp">
          <zp-dynamicFormItem :formItem="item" :name="index" :obj="obj.searchModel" :key="index" />
        </template>
      </template>
      <template slot="btns">
        <el-form-item v-if="_fn.checkBtn('operation_channel/add')">
          <zp-button class="zp-btn-primary" @click="this.table_location_add">新增运营渠道码</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_name" slot-scope="props">
        <el-table-column :label="props.customProps.label" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="_fn.checkBtn('operation_channel/details')" class="table_location" @click="toSee(scope.row)">{{scope.row.name}}</span>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_type" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{_var.operationCodeType__global && _var.operationCodeType__global(scope.row.type)}}
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_createor" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            {{scope.row.createor ? scope.row.createor.realName : '--'}}
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 创建/编辑 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <el-form-item label="引流至系统渠道">
          {{_var.operationCodeType__global(obj.dialog.ruleForm.type)}}
        </el-form-item>
        <zp-dynamicFormItem :formItem="obj.dialog.temp.name" name="name" :obj="obj.dialog" :key="index" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.headMan" name="headMan" :obj="obj.dialog" :key="index" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.headPhone" name="headPhone" :obj="obj.dialog" :key="index" />
      </template>
    </zp-dynamicDialog>
    <!-- 查看 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog2" ref="dialogForm">
      <template slot="form">
        <el-form-item label="引流至系统渠道">
          <span style="color:#69707F;">{{_var.operationCodeType__global(obj.dialog2.ruleForm.type)}}</span>
        </el-form-item>
        <el-form-item label="渠道码名称"><span style="color:#69707F;">{{obj.dialog2.ruleForm.name}}</span></el-form-item>
        <el-form-item label="渠道负责人"><span style="color:#69707F;">{{obj.dialog2.ruleForm.headMan}} {{obj.dialog2.ruleForm.headPhone}}</span>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="obj.dialog2.ruleForm.channelUrl" style="width:440px;" />
          <el-button type="text" v-clipboard:copy="obj.dialog2.ruleForm.channelUrl" v-clipboard:success="copyUrl">复制链接</el-button>
        </el-form-item>
        <el-form-item label=" 渠道码">
          <img :src="obj.dialog2.ruleForm.channelCode" width="153px" hieght="145px"><br />
          <i class="el-icon-download" style="color:#4a84ff"></i>
          <el-button type="text" @click="table_location_down(obj.dialog2.ruleForm)">立即下载</el-button>
        </el-form-item>
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" width="504px" />
  </zp-page>
</template>
<script>
import { formatDate, userDownLoadImage } from '@/util/utils'
export default {
  name: 'templateIndex',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'operation_channel_list',
            addUrl: 'operation_channel_add'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              keyWord: {
                formType: 'input',
                label: '渠道名称',
                placeholder: '请输入运营渠道名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              type: {
                formType: 'select',
                label: '渠道分类',
                data: _var.operationCodeType,
                isShow: true,
                clearable: false
              }
            },
            ruleForm: {
              keyWord: '',
              type: ''
            }
          },
          tableObj: {
            operation: {
              // 全选
              selection: false,
              operation_width: 120
            },
            btnList: [
              {
                text: '下载码',
                isShow: true,
                callback: this.table_location_down
              },
              {
                text: '停用',
                isShow: (item, obj) => {
                  return item.enabled && !item.sysFlag && _fn.checkBtn('operation_channel/disable')
                },
                callback: this.stop
              },
              {
                text: '启动',
                isShow: (item, obj) => {
                  return !item.enabled && !item.sysFlag && _fn.checkBtn('operation_channel/enable')
                },
                callback: this.start
              }
            ],
            fields: [
              { key: 'name', label: '运营渠道名称', customMode: true },
              { key: 'type', label: '渠道分类', customMode: true },
              { key: 'headMan', label: '渠道负责人' },
              { key: 'enabled', label: '状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i) },
              { key: 'visitCount', label: '总访问量' },
              { key: 'createor', label: '创建人', customMode: true },
              { key: 'updateTime', label: '更新时间', formatter: this._tcolFormat.formatterMinute }
            ]
          },
          dialog: {
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '1000px',
            isShowLabel: true, // 是否显示label
            labelWidth: '140px', // label宽度
            temp: {
              type: {
                formType: 'input',
                label: '引流至系统渠道',
                isShow: true
              },
              name: {
                label: '渠道码名称',
                isShow: true,
                limit: true,
                maxlength: 20
              },
              headMan: {
                label: ' 渠道负责人姓名',
                isShow: true,
                limit: true,
                maxlength: 20
              },
              headPhone: {
                label: ' 渠道负责人电话',
                isShow: true
              }
            },
            ruleForm: {
              type: 0, // 0:职微你微信小程序,1:职微你字节小程序
              name: '', // 渠道码名称 
              headMan: '',
              headPhone: ''
            },
            rules: {
              name: [{ required: true, message: '请选择渠道码名称', trigger: 'change' }]
            }
          },
          dialog2: {
            dialogFormCenter: true, // 所有内空居中显示
            dialogWidth: '1000px',
            isShowLabel: true, // 是否显示label
            labelWidth: '140px', // label宽度
            temp: {
              type: {
                formType: 'input',
                label: '引流至系统渠道',
                isShow: true
              },
              name: {
                label: '渠道码名称',
                isShow: true,
                limit: true,
                maxlength: 20
              },
              headMan: {
                label: ' 渠道负责人姓名',
                isShow: true,
                limit: true,
                maxlength: 20
              },
              headPhone: {
                label: ' 渠道负责人电话',
                isShow: true
              }
            },
            ruleForm: {
              type: 0, // 0:职微你微信小程序,1:职微你字节小程序
              name: '', // 渠道码名称 
              headMan: '',
              headPhone: ''
            },
            rules: {
              name: [{ required: true, message: '请选择渠道码名称', trigger: 'change' }]
            }
          }
        }
      })
    }
  },
  mounted () {
    this._ossService.ossReady()
  },
  methods: {
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    copyUrl () {
      this.$message({ message: '复制成功', type: 'success' })
    },
    table_location_down (item) {
      const fileName = item.name || '运营渠道名称.jpg'
      const url = this._ossService.downLoad(item.channelCode, fileName)
      userDownLoadImage(url, fileName)
    },
    toSee (item) {
      this.obj.dialog2.title = `查看运营渠道码`
      this.obj.dialog2.show = true
      this.obj.dialog2.flag = 'see'
      this.obj.dialog2.callback = (params, fn) => {
        fn()
      }
      this.$nextTick(() => {
        this._api.operation_channel_details({ id: item.id }).then((res) => {
          this.obj.dialog2.ruleForm = JSON.parse(JSON.stringify(item))
        })
      })
    },
    table_location_add (item) {
      this.obj.dialog.title = `${item && item.id ? '编辑' : '新增'}运营渠道码`
      this.obj.dialog.show = true
      this.obj.dialog.flag = item && item.id ? 'edit' : 'add'
      this.obj.dialog.ruleForm = item && item.id ? JSON.parse(JSON.stringify(item)) : {
        type: 0, // 0:职微你微信小程序,1:职微你字节小程序
        name: '', // 渠道码名称 
        headMan: '',
        headPhone: ''
      }
    },
    start (data) { // 启用
      let self = this
      let dia = {
        id: data.id,
        title: '启用运营渠道',
        tbody: `您是否确认启用 <span style="color:#4a84ff;">${data.name}</span> 投递渠道？启用后用户通过该渠道访问小程序并注册，注册渠道会计入该渠道。`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.operation_channel_enable(param).then((res) => {
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
        title: '停用运营渠道',
        tbody: `您是否确认停用 <span style="color:#4a84ff;">${data.name}</span> 运营渠道？停用后用户可正常访问，但注册将不计入原有对应的运营渠道，将统一计入默认职微你渠道。`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.operation_channel_disable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.$refs.page.load()
          })
        }
      }
      this.dialogTip = dia
    }
  }
}
</script>
