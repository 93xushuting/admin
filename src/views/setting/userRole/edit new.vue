<template>
  <!-- 地址管理 编辑、新增 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm "
      style="margin:0 0 52px 0;padding-top:40px">
      <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" :key="index" /><br />
      <zp-dynamicFormItem :formItem="form.temp.auths" name="auths" :obj="form" :key="index">
        <template slot="custom_auths">
          <auth :treesData="treesData" :checkData="form.ruleForm" ref="authTable" style="width:1010px" />
        </template>
      </zp-dynamicFormItem>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.desc" name="desc" :obj="form" :key="index" /><br />
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" type="primary">保 存</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
import auth from '@c/custom/auth'
export default {
  name: 'userRoleEdit',
  components: { auth },
  data () {
    return {
      trees: [],
      treeMap: {},
      title: '',
      mapLoading: false,
      treesData: [],
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          // 基本
          name: { label: '角色名称', isShow: true, formType: 'input', maxlength: 40, style: { width: '1010px' } },
          auths: { label: '功能权限', isShow: true, formType: 'custom', key: 'auths' },
          desc: {
            label: '角色描述',
            isShow: true,
            type: 'textarea',
            maxlength: 100,
            limit: true,
            rows: 3,
            isShowLabel: false,
            style: { width: '1010px' }
          }
        },
        ruleForm: {
          name: '',
          auths: [],
          desc: ''
        },
        rules: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          auths: [{ required: true, message: '请选择功能权限', trigger: 'change' }]
        }
      }
    }
  },
  mounted () {
    this.idx = this.$route.params.id
    this.$route.meta.name = this.idx > 0 ? '编辑角色' : '新增角色'
    this.title = this.$route.meta.name
    this.$nextTick(() => {
      this.requestHandle()
    })
  },
  methods: {
    requestHandle: async function () {
      let tree = await _fn.commonBox('public_menu_list', {}, true) // 菜单
      console.info('菜单', tree)
      if (tree) {
        let t = this.buildTree(tree)
        this.treesData = (this.$refs.authTable && this.$refs.authTable.buildAuthTable(t, [])) || []
        console.info('this.treesData 菜单', this.treesData)
      }
      this.$nextTick(() => {
        if (this.idx > 0) {
          this.getInfoById() // 根据ID查询
        }
      })
    },
    buildTree (array) {
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        item.children = item.resourceList
        item.parentId = item.parent
        delete item.parent
        delete item.resourceList
        if (item.children && item.children.length) {
          this.buildTree(item.children)
        }
      }
      return array
    },
    toPage () {
      // _fn.toLocation({ path: '/setting/userRole', params: { type: 2 } }) // -> /user/123
      this.$router.push({ name: 'userRole', params: { type: 2 } })
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = _fn.copy(this.form.ruleForm)
          param.auths = this.$refs.authTable.setCheckData() // 重新获取IDX，
          // console.info(param)
          let url = this.idx > 0 ? 'role_update' : 'role_add'
          if (this.idx === 0) {
            param.id = this.idx
          }
          console.info('param.auths', param.auths)
          this._api[url](param).then((res) => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            this.toPage()
          })
        }
      })
    },
    getInfoById () { // 获取权限列表
      this._api.role_public_auths({ id: this.idx }).then((res) => {
        let d = (res && res.data) || {}
        let p = {
          id: d.id,
          name: d.name,
          auths: d.auths,
          desc: d.desc
        }
        this.$refs.authTable.setData(p.auths)

        this.form.ruleForm = p
      })
    }
  }
}
</script>
