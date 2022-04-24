<template>
  <!-- 招聘流程 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom
      slot="tabs"
      v-model="tagName"
      :data="[{ label: `短信模板`, value: 'start' }]"
    />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj">
      <!-- 小于三个元素时 -->
      <template slot="form">
        <template v-for="(item, index) in obj.searchModel.temp">
          <zp-dynamicFormItem
            :formItem="item"
            :name="index"
            :obj="obj.searchModel"
            :key="index"
          />
        </template>
      </template>
      <template slot="btns">
        <el-form-item v-if="_fn.checkBtn('smsAssistant/addSmsTemplate')">
          <zp-button class="zp-btn-primary" @click="this.toAdd"
            >新增模板</zp-button
          >
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe />
    <zp-tipDialog :obj="dialogTip" width="504px" />
  </zp-page>
</template>
<script>
export default {
  name: 'messageTask',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'smsAssistant_listSmsTemplateDetail'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '模板名称',
                placeholder: '请输入请输入模板名称',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              }
            },
            ruleForm: {
              name: ''
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
                text: '预览',
                isShow: () => _fn.checkBtn('smsAssistant/getSmsTemplateDetail'),
                callback: this.toSee,
                isPopover: true,
                content: ''
              },
              {
                text: '编辑',
                isShow: () => _fn.checkBtn('smsAssistant/updateSmsTemplate'),
                callback: this.toEdit
              },
              {
                text: '删除',
                isShow: () => _fn.checkBtn('smsAssistant/deleteSmsTemplateDetail'),
                callback: this.toDel,
                class: 'isDelete'
              }
            ],
            fields: [
              { key: 'name', label: '模板名称' },
              { key: 'smsSupplierTemplateNo', label: '模板ID' },
              { key: 'noticeType', label: '模板类型', customMode: (row) => { return _var.noticeType__global(row.noticeType) || '--' } },
              { key: 'remark', label: '备注' },
              { key: 'createUsername', label: '创建人' },
              { key: 'createDate', label: '更新时间' }
            ]
          }
        }
      })
    }
  },
  mounted () {

  },
  methods: {
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = params
      this.obj.tableObj.pager.pageNo = 1
      fn()
    },
    toSee (item, obj, index) {
      this._api.smsAssistant_getSmsTemplateDetail({ smsSupplierTemplateNo: item.smsSupplierTemplateNo }).then((res) => {
        this.obj.tableObj.btnList[0].content = res.msg
      }, (e) => {
        this.obj.tableObj.btnList[0].content = ''
      })
    },
    toAdd () {
      _fn.toLocation({ name: 'messageTempEdit', params: { id: 0 } }) // -> /user/123
    },
    toEdit (item) {
      _fn.toLocation({ name: 'messageTempEdit', params: { id: item.id } }) // -> /user/123
    },
    toDel (item) {
      this.isAddShow('删除', `删除的模板将无法恢复。还要继续删除该模板吗？`, '', () => {
        this.dialogTip.show = false
        this._api.smsAssistant_deleteSmsTemplateDetail({ id: item.id }).then((res) => {
          this.notify(res.msg || '删除成功', 'success')
          this.$refs.page.load()
        })
      })
    },
    isAddShow (title = '', message = '', confirmText = '', fn) {
      let self = this
      let dia = {
        title: title,
        tbody: message,
        titleSve: true,
        show: true,
        confirmText: confirmText,
        isConfirm: _fn.isFunction(fn), // 是否显示取消按钮
        isCancel: confirmText !== '我知道了', // 是否显示取消按钮
        confirmCallback: fn
      }
      this.dialogTip = dia
    }
  }
}
</script>
