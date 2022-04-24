<template>
  <!-- 地址管理 编辑、新增 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm "
      style="margin:0 0 52px 0;padding-top:40px">
      <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" :key="index" /><br />
      <zp-dynamicFormItem :formItem="form.temp.auths" name="auths" :obj="form" :key="index">
        <template slot="custom_auths">
          <el-row v-for="(item,index) in trees" :key="index" class="tables" :class="!item.isShow ?'treebodery':''">
            <el-col class="treeTitle">
              <el-checkbox :disabled="item.disabled" :indeterminate="item.isIndeterminate" v-model="item.checkAll"
                @change="handleCheckAllChange(item,index)">
                {{item.label}}</el-checkbox>
              <i v-if="item.children && item.children.length" :class="!item.isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                @click="toggerTitle(item,index)" />
            </el-col>
            <el-col v-if="!item.isShow" class="treeBody">
              <el-checkbox v-for="(item1, index1) in item.children" :label="item1.value" :key="index1" v-model="item.checkedList"
                @change="handleCheckedCitiesChange(item.checkedList, index, item.checkAll)">{{item1.label}}</el-checkbox>
            </el-col>
          </el-row>
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
import { MP } from '@/util/bmap.js'
export default {
  name: 'addressManageEdit',
  data () {
    return {
      trees: [],
      treeMap: {},
      title: '',
      mapLoading: false,
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
      },
      saveData: ''
    }
  },
  mounted () {
    this.idx = this.$route.params.id
    this.$route.meta.name = this.idx !== '0' ? '编辑角色' : '新增角色'
    this.title = this.$route.meta.name
    this.$nextTick(() => {
      if (this.idx !== '0') {
        this.getMenu(() => { // 获取菜单
          this.getAuthList() // 设置数据
        })
      } else {
        this.getMenu() // 获取菜单
      }
    })
  },
  methods: {
    toPage () {
      // _fn.toLocation({ path: '/setting/userRole', params: { type: 2 } }) // -> /user/123
      this.$router.push({ name: 'userRole', params: { type: 2 } })
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          let param = this.form.ruleForm
          let url = ''
          if (this.idx === '0') { // 新增
            url = 'role_add'
          } else { // 修改
            url = 'role_update'
            param.id = this.idx
          }
          param.auths = this.saveData
          console.info('param.auths', param.auths)
          this._api[url](param).then((res) => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            this.toPage()
          })
        }
      })
    },
    labelClick (item) {
      item.labelActive = !item.labelActive
    },
    getMenu (fn) { // 获取菜单
      this._api.public_menu_list({}).then((res) => {
        this.trees = this.getLevel1(res.data || [])
        console.info('获取菜单', this.trees)
        fn && fn()
      })
      // let res = JSON.parse('{"code":0,"msg":"","data":{"menu":[{"id":1,"name":"首页","url":"index","icon":null,"type":"MENU","resourceList":[]},{"id":2,"name":"招聘需求","url":"company","icon":null,"type":"MENU","resourceList":[{"id":7,"name":"企业管理","url":"company","icon":null,"type":"MENU","resourceList":[{"id":8,"name":"查看","url":"company/list","icon":null,"type":"BUTTON","resourceList":[]},{"id":9,"name":"更新","url":"company/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":10,"name":"新增","url":"company/add","icon":null,"type":"BUTTON","resourceList":[]}]},{"id":11,"name":"地址管理","url":"address","icon":null,"type":"MENU","resourceList":[{"id":12,"name":"查看","url":"address/list","icon":null,"type":"BUTTON","resourceList":[]},{"id":14,"name":"新增","url":"address/add","icon":null,"type":"BUTTON","resourceList":[]},{"id":15,"name":"编辑","url":"address/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":16,"name":"停用","url":"address/disable","icon":null,"type":"BUTTON","resourceList":[]},{"id":17,"name":"批量停用","url":"address/batch_disable","icon":null,"type":"BUTTON","resourceList":[]},{"id":18,"name":"复制","url":"address/copy","icon":null,"type":"BUTTON","resourceList":[]},{"id":19,"name":"启用","url":"address/enable","icon":null,"type":"BUTTON","resourceList":[]}]}]},{"id":3,"name":"职位管理","url":"job","icon":null,"type":"MENU","resourceList":[{"id":20,"name":"新增","url":"job/add","icon":null,"type":"BUTTON","resourceList":[]},{"id":21,"name":"查看","url":"job/public/list","icon":null,"type":"BUTTON","resourceList":[]},{"id":22,"name":"导出","url":"job/export","icon":null,"type":"BUTTON","resourceList":[]},{"id":23,"name":"置顶","url":"job/stick_top","icon":null,"type":"BUTTON","resourceList":[]},{"id":24,"name":"更新","url":"job/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":25,"name":"禁用","url":"job/disable","icon":null,"type":"BUTTON","resourceList":[]},{"id":26,"name":"职位设置","url":"job/setting","icon":null,"type":"BUTTON","resourceList":[]},{"id":27,"name":"导入","url":"job/import","icon":null,"type":"BUTTON","resourceList":[]},{"id":28,"name":"新增候选人","url":"job/add_applicant","icon":null,"type":"BUTTON","resourceList":[]}]},{"id":4,"name":"投递管理","url":"process","icon":null,"type":"MENU","resourceList":[]},{"id":5,"name":"人才库","url":"applicant","icon":null,"type":"MENU","resourceList":[]},{"id":6,"name":"招聘设置","url":"setting","icon":null,"type":"MENU","resourceList":[{"id":30,"name":"用户角色","url":"role","icon":null,"type":"MENU","resourceList":[{"id":31,"name":"角色管理","url":"role","icon":null,"type":"MENU","resourceList":[{"id":34,"name":"新增","url":"role/add","icon":null,"type":"BUTTON","resourceList":[]},{"id":35,"name":"编辑","url":"role/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":36,"name":"删除","url":"role/delete","icon":null,"type":"BUTTON","resourceList":[]},{"id":42,"name":"查看","url":"role/list","icon":null,"type":"BUTTON","resourceList":[]}]},{"id":32,"name":"层级管理","url":"dept","icon":null,"type":"MENU","resourceList":[{"id":37,"name":"新增","url":"dept/add","icon":null,"type":"BUTTON","resourceList":[]},{"id":38,"name":"编辑","url":"dept/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":39,"name":"删除","url":"dept/delete","icon":null,"type":"BUTTON","resourceList":[]},{"id":43,"name":"查看","url":"dept/list","icon":null,"type":"BUTTON","resourceList":[]}]},{"id":33,"name":"用户管理","url":"user","icon":null,"type":"MENU","resourceList":[{"id":40,"name":"新增","url":"user/add","icon":null,"type":"BUTTON","resourceList":[]},{"id":41,"name":"更新","url":"user/update","icon":null,"type":"BUTTON","resourceList":[]},{"id":44,"name":"查看","url":"user/list","icon":null,"type":"BUTTON","resourceList":[]}]}]}]}],"user":{"id":2,"mobile":null,"realName":"1","password":null,"avatar":"1","auths":1,"deptId":1,"enabled":true,"token":"eyJhbGdvcml0aG0iOiJNQUMiLCJ0eXBlIjoiSldUIn0=.eyJ1c2VyTm8iOiIyIiwidXNlck5hbWUiOiIxIiwidHlwZSI6ImFkbWluIiwib3BlbklkIjpudWxsLCJleHBpcmVUaW1lIjoxNTk1ODQyNzQ2fQ==.bc65beaada578f3da005e554def414815a33586ca8cd4cf63d23576a516eaedf","role":{"id":1,"name":"administrator","description":"超级管理员","deptId":0,"createUid":0,"removable":false,"createTime":"2020-07-19T08:00:32.000+0000","updateTime":"2020-07-19T08:00:48.000+0000"},"dept":{"id":1,"parentId":0,"name":"根层级","description":"top","level":1,"createUid":1,"createTime":"2020-07-19T07:35:24.000+0000","updateTime":"2020-07-19T07:35:51.000+0000"},"createTime":"2020-07-21T03:43:14.000+0000"}}}')
      // this.trees = this.getLevel1(res.data.menu || [])
      // fn && fn()
    },
    getLevel1 (array) {
      let map = {}
      let ret = []
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        let obj = map[item.id] = {
          isShow: false, // 不展开
          label: item.name,
          // label: item.name + '(' + item.id + ')',
          value: item.id,
          isIndeterminate: false,
          checkAll: false,
          checkedList: [],
          nodeIdx: [], // 反选时用到
          children: []
        }
        if (obj.label === '首页') {
          obj.checkAll = true
          obj.disabled = true
          // obj.isIndeterminate = true
        }
        ret.push(obj)
        if (item.resourceList && item.resourceList.length) {
          this.getLevel2(item.resourceList, obj)
        }
      }
      this.treeMap = map
      return ret
    },
    getLevel2 (array, obj) {
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        obj.children.push({ label: item.name, value: item.id, isMenu: item.type === 'MENU' })
        // obj.children.push({ label: item.name + '(' + item.id + ')', value: item.id })
        obj.nodeIdx.push(item.id)
      }
    },
    handleCheckAllChange (obj, index) {
      let item = this.trees[index]
      if (item) {
        if (obj.checkAll) {
          item.isIndeterminate = false
          let arr = []
          item.children.forEach(o => {
            arr.push(o.value)
          })
          item.checkedList = arr
        } else {
          item.checkedList = []
        }
      }
      this.form.ruleForm.auths = this.getParam()
    },
    handleCheckedCitiesChange (obj, index, checkAll) {
      let checkedCount = obj.length
      let item = this.trees[index]
      if (item) {
        item.checkAll = checkedCount === item.children.length
        item.isIndeterminate = checkedCount > 0 && checkedCount < item.children.length
      }
      this.form.ruleForm.auths = this.getParam()
    },
    getParam () {
      return ((item) => {
        let ret = []
        item.forEach((ele) => {
          if (ele.checkedList && ele.checkedList.length) {
            if (ele.children && ele.children.length && ele.children[0].isMenu) { // 菜单
              ele.checkedList.map((i) => {
                let t = window.btnsIds[i]
                if (t) {
                  ret = ret.concat(t)
                  ret.push(i) // 添加父节点
                } else { // 菜单 下面没有按钮
                  ret.push(i) // 添加父节点
                }
              })
            } else { // 按钮
              ret = ret.concat(ele.checkedList) // 添加子节点
            }
            ret.push(ele.value) // 添加父节点
          } else {
            if (ele.children && ele.children.length === 0 && ele.checkAll) {
              ret.push(ele.value) // 添加父节点
            }
          }
        })
        this.saveData = ret
        console.info('子节点', ret)
        return ret
      })(this.trees)
    },
    toggerTitle (item) {
      item.isShow = !item.isShow
    },
    clearData () { // 清空数据
      this.form.ruleForm = { name: '', auths: [], remark: '' }
      this.trees.forEach(ele => {
        ele.checkedList = []
        ele.isIndeterminate = false
        ele.checkAll = false
      })
    },
    getAuthList () { // 获取权限列表
      this._api.role_public_auths({ id: this.idx }).then((res) => {
        let o = res.data || {}
        this.form.ruleForm = o
        this.$nextTick(() => {
          this.buildData(this.trees, o.auths)
        })
      })
    },
    buildData (list, idx) {
      // // 全选中
      // this.trees[1].checkedList = [1009, 1011, 1012, 1010]
      // this.trees[1].checkAll = true
      // this.trees[1].isIndeterminate = false
      // // 半选中
      // this.trees[2].checkedList = [1013, 1014, 1016]
      // this.trees[2].checkAll = true
      // this.trees[2].isIndeterminate = true
      let array = []
      for (let i = 0; i < list.length; i++) {
        let o = list[i]
        let childs = o.nodeIdx
        if (childs && childs.length) {
          console.info('childs', childs)
          let arr = []
          childs.forEach((ele) => {
            let bool = idx.indexOf(ele) >= 0
            if (bool) {
              arr.push(ele) // 添加子类
            }
          })
          if (arr.length === o.children.length) { // 全选中
            o.checkedList = arr
            o.checkAll = true
            o.isIndeterminate = false
          } else { // 半选中
            o.checkedList = arr
            if (arr.length) {
              o.checkAll = false
              o.isIndeterminate = true
            }
          }
        } else {
          o.checkAll = idx.indexOf(o.value) >= 0
        }
      }
      let res = this.getParam()
      res.sort((a, b) => { return a - b })
      this.saveData = res
    }
  }
}
</script>
<style lang="less" scoped>
.tables{
  width:1010px;
  margin-bottom: 10px;
  .treeBody{
    padding-left: 40px;
    background: #FFF;
  }
  .treeTitle{
    background: #F4F4F4;
    padding-left: 20px;
    color: #26334F;
    position: relative;
    i{
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      padding: 12px;
      cursor: pointer;
    }
  }
}
.treebodery{
  border: 1px solid rgba(38,51,79,0.10);
}
</style>
