<template>
  <!-- 用户角色 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom
      slot="tabs"
      :data="tabs"
      v-model="tagIndex"
      @click="handleClick"
    />
    <zp-condition slot="condition" :obj="obj">
      <template slot="form" v-if="tagIndex === 1">
        <zp-dynamicFormItem
          :formItem="obj.searchModel.temp.realName"
          name="realName"
          :obj="obj.searchModel"
        />
        <zp-dynamicFormItem
          :formItem="obj.searchModel.temp.status"
          name="status"
          :obj="obj.searchModel"
        />
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="queryTable(null, 'btn')"
            >搜索</zp-button
          >
          <zp-button class="zp-btn-primary-empty" @click="resetForm"
            >重置</zp-button
          >
        </el-form-item>
      </template>
      <template slot="btns" v-if="tagIndex === 1 && _fn.checkBtn('user/add')">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="addUser"
            >新增用户</zp-button
          >
        </el-form-item>
      </template>
      <template slot="form" v-if="tagIndex === 2">
        <el-form-item style="line-height: 36px; height: 36px"></el-form-item>
      </template>
      <template slot="btns" v-if="tagIndex === 2 && _fn.checkBtn('role/add')">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="table_location_add"
            >新增角色</zp-button
          >
        </el-form-item>
      </template>
      <template slot="form" v-if="tagIndex === 3">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="queryMenu">搜索</zp-button>
        </el-form-item>
      </template>
      <template
        slot="btns"
        v-if="tagIndex === 3 && _fn.checkBtn('resource/add')"
      >
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="addMenu"
            >新增菜单</zp-button
          >
        </el-form-item>
      </template>
    </zp-condition>
    <div class="roleUser" v-show="tagIndex === 1">
      <div class="left">
        <el-tree
          :props="defaultProps"
          draggable
          @node-drop="nodeDrop"
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
          ref="tree"
          @node-click="nodeTreeClick"
          :allow-drop="allowDrop"
        />
      </div>
      <div class="right">
        <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe />
      </div>
    </div>
    <zp-dynamicTable
      v-show="tagIndex === 2"
      slot="table"
      :obj="obj.tableObj"
      stripe
    />
    <template v-if="tagIndex === 3">
      <div class="menus-tree">
        <el-table :data="model.menus" ref="table" style="padding: 0 20px">
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="_fn.checkBtn('resource/update')"
                type="text"
                size="small"
                @click="addMenu(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="_fn.checkBtn('resource/delete')"
                class="isDelete"
                type="text"
                size="small"
                @click="delMenu(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级" width="100" />
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.type === 1">菜单</span>
              <span style="color: green" v-if="scope.row.type === 2">按钮</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="200" />
          <el-table-tree-column
            :expandAll="false"
            :indentSize="'20px'"
            :expand-all="!!1"
            :remote="remote"
            file-icon="icon icon-file"
            folder-icon="icon icon-folder"
            prop="name"
            label="名称"
          >
          </el-table-tree-column>
          <el-table-column
            prop="path"
            label="访问路径"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </div>
    </template>
    <!-- 创建/编辑 层级-->
    <zp-dynamicDialog slot="dialog" :obj="addLayerDialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem
          :formItem="addLayerDialog.temp.name"
          name="name"
          :obj="addLayerDialog"
          :key="index"
        />
        <!-- <zp-dynamicFormItem :formItem="addLayerDialog.temp.parentId" name="parentId" :obj="addLayerDialog" :key="index" /> -->
        <zp-dynamicFormItem
          :formItem="addLayerDialog.temp.parentId"
          name="parentId"
          :obj="addLayerDialog"
          :key="index"
        >
          <template slot="custom_parentId">
            <zp-selectTree
              v-model="addLayerDialog.ruleForm.parentId"
              :options="addLayerDialog.temp.parentId.data"
              :props="defaultProps2"
            />
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem
          :formItem="addLayerDialog.temp.desc"
          name="desc"
          :obj="addLayerDialog"
          :key="index"
        />
      </template>
    </zp-dynamicDialog>
    <!-- 删除角色 -->
    <zp-dynamicDialog slot="dialog" :obj="delDialog" ref="dialogForm2">
      <template slot="dialogTip">
        <div class="tips">
          <zp-icons v-if="!delDialog.tipIconShow" />
          <div class="title" v-html="delDialog.tip" />
        </div>
      </template>
      <template slot="form">
        <zp-dynamicFormItem
          :formItem="delDialog.temp && delDialog.temp.targetId"
          name="targetId"
          :obj="delDialog"
        />
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
    <!-- 创建/编辑 用户基本信息-->
    <customUserInfo ref="custom_userInfo" />
    <!-- 新增菜单 或按钮-->
    <addMenu ref="addMenu" />
  </zp-page>
</template>
<script>

import customUserInfo from '@c/custom/userInfo'
import addMenu from '@c/custom/addMenu'
export default {
  name: 'settingUserRole',
  components: { addMenu, customUserInfo },
  data () {
    return {
      model: {
        menus: []
      },
      flatTree: [],
      userInfo: {},
      filterText: '',
      treeData: [], // 树菜单
      treeSelect: [], // 上级
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      defaultProps2: {
        parent: 'parentId',
        value: 'id',
        label: 'name',
        children: 'childList'
      },
      tagIndex: 1, // tabs 默认选中的值
      dialogTip: {},
      delDialog: {},
      addLayerDialog: { // // 新增、编辑层级
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '1000px',
        isShowLabel: true, // 是否显示label
        // labelWidth: '80px', // label宽度
        temp: {
          name: {
            label: '层级名称',
            isShow: true,
            maxlength: 10,
            limit: true
          },
          // parentId: {
          //   formType: 'select',
          //   label: '上级',
          //   isShow: true,
          // },
          parentId: {
            key: 'parentId',
            formType: 'custom',
            label: '上级',
            isShow: true,
            data: []
          },
          desc: {
            type: 'textarea',
            label: '层级描述',
            placeholder: '请输入层级描述',
            isShow: true,
            maxlength: 100,
            limit: true,
            rows: 3
          }
        },
        ruleForm: {
          name: '', // 名称 
          desc: '', // 上级
          parentId: '' // 层级描述
        },
        rules: {
          name: [{ required: true, message: '请输入层级名称', trigger: 'blur' }],
          parentId: [{ required: true, message: '请选择上级层级', trigger: 'change' }]
        },
        callback: this.addLayerCommit
      },
      tabs: [
        { value: 1, label: '用户管理' },
        { value: 2, label: '角色管理' }
      ],
      obj: new _baseData().call(this, () => { // 角色
        return {
          isBtn: true, // 不显示 查询、重置按钮
          http: {},
          searchModel: {
            temp: {}
          },
          tableObj: {
            operation: {
              selection: false, // 不显示操作列
              operation_width: 100 // 操作列宽度
            },
            btnList: [],
            fields: [
              { key: 'mobile', label: '用户名' },
              { key: 'realName', label: '姓名' },
              { key: 'roleId', label: '角色' },
              { key: 'deptId', label: '部门' },
              {
                key: 'enabled',
                label: '状态',
                customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i)
              },
              { key: 'createTime', label: '创建时间' }
            ]
          }
        }
      })
    }
  },
  created () {
    // 角色下拉列表
    this.getValidRoleList()
    let roleId = +localStorage.getItem('zp_roleId')
    if (roleId === 1) { // 超级管理员
      this.tabs = [
        { value: 1, label: '用户管理' },
        { value: 2, label: '角色管理' },
        { value: 3, label: '菜单管理' }
      ]
    }
  },
  mounted () {
    let __index = this.$route.params
    if (__index && __index.type) { // 返回传的参数
      this.tagIndex = __index.type
    }
    this.getLayer()
    this.handleClick(this.tagIndex)
  },
  methods: {
    remote (row, callback) {
      callback(this.flatTree.filter((f) => {
        return f['parent_id'] === row['id']
      }))
    },
    queryMenu () {
      this.handleClick(3)
    },
    delMenu (data) {
      let self = this
      let d = data
      let dia = {
        id: d.id,
        title: '您确定要删除吗？',
        tbody: `删除的菜单或按钮将无法恢复。还要继续删除吗？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: () => {
          this._api.resource_delete({ id: d.id }).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            this.queryMenu()
            this.dialogTip.show = false
          })
        }
      }
      this.dialogTip = dia
    },
    addMenu (item) { // 新增菜单
      let tree = this.$refs.addMenu
      if (item.id) {
        tree.show({ title: '编辑', ruleForm: item, cb: this.queryMenu })
      } else {
        tree.show({ title: '新增', cb: this.queryMenu })
      }
      let d = JSON.parse(JSON.stringify(_store.state.menu.obj))
      let dd = bulidData(d)
      let treeData = [{
        id: 0,
        name: '根层级',
        resourceList: dd
      }]
      console.info('新增菜单', JSON.parse(JSON.stringify(treeData)))
      tree.setTreeData(treeData)
      function bulidData (data) {
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].resourceList && data[i].resourceList.length) {
              bulidData(data[i].resourceList)
            } else {
              data[i].resourceList = null
            }
          }
        }
        return data
      }
    },
    allowDrop (draggingNode, dropNode, type) {
      const level = dropNode.level
      if (type === 'prev' && level === 1) {
        return false
      }
      if (type === 'next' && level === 1) {
        return false
      }
      function calcCount () {
        let levelList = []
        function calcLen (node) {
          levelList.push(node.level)
          if (node.childNodes.length) {
            node.childNodes.forEach(item => {
              calcLen(item)
            })
          }
        }
        draggingNode.childNodes.forEach(item => {
          calcLen(item)
        })
        return levelList.reduce((total, item) => {
          if (total.indexOf(item) === -1) {
            total.push(item)
          }
          return total
        }, []).length
      }
      const count = calcCount()
      if (type === 'prev' && (level + count) > 5) {
        return false
      }
      if (type === 'inner' && (level + count + 1) > 5) {
        return false
      }
      if (type === 'next' && (level + count) > 5) {
        return false
      }
      return true
    },
    nodeDrop (draggingNode, dropNode, type, event) {
      let name = draggingNode.data.name
      let parentId = dropNode.data.parentId
      if (type === 'inner') {
        parentId = dropNode.data.id
      }
      let id = draggingNode.data.id
      let targetId = dropNode.data.id
      type = type === 'inner' ? 0 : type === 'before' ? -1 : 1
      let param = { id, parentId, targetId, type, name }
      this._api.dept_update(param).then(res => {
        this.getLayer()
        this.notify(res.msg || '操作成功', 'success')
        this.handleClick(1)
      }).catch(error_ => (this.getLayer()))
      console.info(type, id, targetId)
    },
    handleClick (tab) {
      this.tagIndex = Number(tab)
      let index = this.tagIndex
      _store.dispatch('menu/setTabIndex', index) // 设置菜单
      // console.log('handleClick', index)
      if (index === 1) {
        this.obj.http = {
          queryUrl: 'user_list',
          updateUrl: '',
          addUrl: '',
          delUrl: ''
        }
        this.obj.searchModel = {
          isShowLabel: true, // 是否显示label
          labelWidth: '70px', // label宽度
          inline: true,
          temp: {
            realName: {
              label: '标签名',
              placeholder: '请输入用户姓名、手机号',
              maxlength: 30,
              isShow: true,
              isShowLabel: true, // 是否显示label
              'prefix-icon': 'el-icon-search'
            },
            status: {
              label: '状态',
              formType: 'select',
              isShow: true,
              data: [
                { label: '全部', value: 2 },
                { label: '启用中', value: 1 },
                { label: '已停用', value: 0 }
              ],
              clearable: false
            }
          },
          ruleForm: {
            realName: '',
            status: 1
          }
        }
        this.obj.tableObj.operation.operation_width = 150
        this.obj.tableObj.fields = [
          { key: 'mobile', label: '用户名' },
          { key: 'realName', label: '姓名' },
          { key: 'roleId', label: '角色', customMode: this.setTableRole },
          { key: 'deptId', label: '部门', customMode: this.setTableDept },
          { key: 'workPhoneNumber', label: '工作电话' },
          { key: 'enabled', label: '状态', customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i) },
          { key: 'createTime', label: '创建时间', formatter: this._tcolFormat.formatterMinute }
        ]
        this.obj.tableObj.btnList = [
          {
            text: '停用',
            isShow: (item, obj) => {
              return item.enabled && item.id !== localStorage.getItem('zp_userId') && _fn.checkBtn('user/disable')
            },
            callback: this.stopUser
          },
          {
            text: '启用',
            isShow: (item, obj) => {
              return !item.enabled && item.id !== localStorage.getItem('zp_userId') && _fn.checkBtn('user/enable')
            },
            callback: this.startUser
          },
          {
            text: '编辑',
            isShow: (item, obj) => {
              return item.id !== localStorage.getItem('zp_userId') && _fn.checkBtn('user/update')
            },
            callback: this.editUser
          },
          {
            text: '删除',
            isShow: (item, obj) => {
              return item.id !== localStorage.getItem('zp_userId') && _fn.checkBtn('user/delete')
            },
            class: 'isDelete',
            callback: this.deleteUser
          }
        ]
        this.$refs.page.load()
        // 交接数据下拉列表
        this.getCollaboratorsList()
      } else if (index === 2) {
        this.obj.http = {
          queryUrl: 'role_list',
          updateUrl: '',
          addUrl: '',
          delUrl: ''
        }
        this.obj.tableObj.operation.operation_width = 100
        this.obj.tableObj.fields = [
          { key: 'name', label: '角色名' },
          { key: 'description', label: '备注' },
          { key: 'updateTime', label: '创建时间', formatter: this._tcolFormat.formatterMinute }
        ]
        this.obj.tableObj.btnList = [
          {
            text: '编辑',
            isShow: (item, obj) => {
              console.log(item.roleId)
              return item.id !== localStorage.getItem('zp_roleId') && _fn.checkBtn('role/update')
            },
            callback: this.table_location_add
          },
          {
            text: '删除',
            isShow: (item, obj) => {
              if (item.id === localStorage.getItem('zp_roleId')) {
                return false
              }
              return _fn.checkBtn('role/delete')
              // return this.obj.tableObj.data.length > 1 // 一条数据的时候不显示
            },
            callback: this.deleteClick,
            class: 'isDelete'
          }
        ]
        this.$refs.page.load()
      } else if (index === 3) {
        let param = { pageReq: { page: 1, size: 1000 } }
        this._api.resource_list(param).then((res) => {
          let t = (res.data) || []
          t.forEach((element) => {
            element.parent_id = element.parentId === '0' ? null : element.parentId
            element.depth = element.level
            element.child_num = element.childNum
          })
          this.flatTree = t
          let v = t.filter(f => f['parent_id'] === null)
          this.model.menus = v
          console.info(JSON.stringify(v))
        })
      }
    },
    setTableRole (row, column, cellValue, index) {
      return (row.role && row.role.name) || ' -- '
    },
    setTableDept (row, column, cellValue, index) {
      return (row.dept && row.dept.name) || ' -- '
    },
    getTreeData (data) { // 转换成树菜单
      if (data) {
        data.parentId = 0
        build(data.childList || [], data.id)
        return [data]
      }
      function build (d, parentId) {
        for (var i = 0; i < d.length; i++) {
          var o = d[i]
          o.parentId = parentId
          if (o.childList && o.childList.length) {
            build(o.childList, o.id)
          }
        }
        return d
      }
    },
    /**  用户  */
    renderContent (h, { node, data, store }) {
      const flag = node.level === 1
      return (
        <span class="custom-tree-node customIcon">
          <span class="text">{node.label}</span>
          <span class="icon">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-show={!flag}>
              <i class="iconfont iconbianji1" on-click={() => this.updateTree(data, node, store)} />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-show={!flag}>
              <i class="iconfont iconshanchu" on-click={() => this.deleteTree(data)} />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="新增" placement="top">
              <i class="iconfont iconxinzeng " on-click={() => this.addTree(data, node, store)} />
            </el-tooltip>
          </span>
        </span >
      )
    },
    resetForm () {
      this.$refs.page.reset()
    },
    resetAfter (params, fn) {
      this.obj.searchModel.ruleForm = {
        realName: '',
        status: 1
      }
      this.queryTable(undefined, 'btn')
    },
    queryTable (node, type) {
      if (type) {
        this.obj.tableObj.pager.pageNo = 1
      }
      let o = this.obj.tableObj
      let param = {
        pageReq: {
          page: o.pager.pageNo,
          size: o.pager.pageSize
        },
        queryParam: {
          realName: this.obj.searchModel.ruleForm.realName
        }
      }
      if (this.tagIndex === 1) {
        param.queryParam.status = this.obj.searchModel.ruleForm.status
      }
      if (node && node.id) {
        param.queryParam.deptId = node.id
      }
      this._api.user_list(param).then((res) => {
        this.obj.tableObj.data = (res.data && res.data.list) || []
        o.pager.pageTotal = res.data.total
      })
      // 交接数据下拉列表
      this.getCollaboratorsList()
    },
    nodeTreeClick (node) {
      console.info('nodeTreeClick', node)
      this.queryTable(node)
      this.obj.searchModel.ruleForm.deptId = node.id
    },
    addTree (data) {
      this.addLayerDialog.show = true
      this.addLayerDialog.title = '新增层级'
      this.addLayerDialog.ruleForm = {
        name: '', // 名称 
        desc: '', // 上级
        parentId: data.id // 层级描述
      }
    },
    updateTree (data) {
      console.log(data)
      this.addLayerDialog.show = true
      this.addLayerDialog.title = '修改层级'
      this.addLayerDialog.ruleForm = {
        id: data.id,
        name: data.name, // 名称 
        desc: data.desc, // 上级
        parentId: data.parentId// 层级描述
      }
    },
    getLayer () { // 查询层级
      this._api.dept_list({}).then((res) => {
        let tree = this.getTreeData(res.data)
        this.treeData = tree
        this.addLayerDialog.temp.parentId.data = tree
      })
    },
    addLayerCommit () { // 新增\修改层级提交
      let param = this.addLayerDialog.ruleForm
      let url = param.id ? 'dept_update' : 'dept_add'
      this._api[url](param).then((res) => {
        this.addLayerDialog.show = false
        this.addLayerDialog.ruleForm = {}
        this.getLayer()
        this.notify(res.msg || '操作成功', 'success')
        this.handleClick(1)
      })
    },
    deleteTree (data) {
      let self = this
      let d = data
      let dia = {
        id: d.id,
        title: '您确定要删除该层级吗？',
        tbody: `删除的分组将无法恢复。还要继续删除该分组吗？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: d.id, parentId: d.parentId }
          this._api.dept_delete(param).then((res) => {
            self.getLayer()
            self.notify(res.msg || '删除成功', 'success')
            self.handleClick(1)
            self.dialogTip.show = false
          })
        }
      }
      this.dialogTip = dia
      this.delDialog.obj = data
    },
    addUser () { // 新增用户
      console.info('新增用户')
      let tree = this.$refs.custom_userInfo
      tree.show({ title: '新增用户' })
      tree.setTreeData(this.addLayerDialog.temp.parentId.data)
    },
    editUser (data) { // 修改用户
      let tree = this.$refs.custom_userInfo
      data.enabled = data.enabled ? 1 : 0
      tree.show({
        title: '修改用户',
        ruleForm: Object.assign(data, {
          workAreaCode: data.workAreaCode || '+86',
          workPhoneNumber: data.workPhoneNumber || ''
        }),
        updateUrl: 'user_update'
      })
      tree.setTreeData(this.addLayerDialog.temp.parentId.data, data)
    },
    // 删除用户-start
    deleteUser (data) {
      let dia = {
        obj: data,
        title: '删除用户',
        slot: 'Tip',
        tipIconShow: true, // 相反
        tip: `该用户尚有负责资源，删除前请先交接资源给其他用户。`,
        dialogWidth: '660px', // dialog 宽度
        // titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: this.userCommitDelete,
        dialogFormCenter: true, // 所有内空居中显示
        isShowLabel: true,
        temp: {
          targetId: {
            formType: 'select',
            label: '交接数据给',
            data: this.linkUsers.filter(item => item.value !== data.id),
            isShow: true,
            filterable: true,
            style: { width: '320px' }
          }
        },
        ruleForm: {
          targetId: ''
        },
        rules: {
          targetId: [{ required: true, message: '请选择交接数据', trigger: 'change' }]
        }
      }
      this.delDialog = dia
    },
    userCommitDelete () {
      this.$refs.dialogForm2.commitDialog(() => {
        this.delDialog.show = false
        let param = {
          targetId: this.delDialog.ruleForm.targetId,
          id: this.delDialog.obj.id
        }
        let dia = {
          title: '删除用户',
          tbody: `确定删除用户【${this.delDialog.obj.realName}】吗？`,
          titleSve: true,
          show: true,
          confirmText: '',
          isCancel: true, // 是否显示取消按钮
          confirmCallback: () => this.delUserConfirm(param)
        }
        this.dialogTip = dia
      })
    },
    delUserConfirm (params) {
      _api.user_delete(params).then(res => {
        this.notify(res.msg || '删除成功', 'success')
        this.dialogTip.show = false
        this.handleClick(1)
      })
    },
    // 删除用户-end
    addEditCommit (param, fn) {
      let url = 'user_add'
      if (param.id) {
        url = 'user_update'
      }
      this._api[url](param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.queryTable()
        fn && fn()
      })
    },
    startUser (data) { // 启用用户
      let self = this
      let dia = {
        id: data.id,
        title: '启用用户',
        tbody: `您是否确认启用 <span style="color:#4a84ff;">${data.realName}</span> 用户？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.user_enable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.queryTable()
          })
        }
      }
      this.dialogTip = dia
    },
    stopUser (data) { // 停用用户
      let self = this
      let dia = {
        id: data.id,
        title: '停用用户',
        tbody: `您是否确认停用 <span style="color:#4a84ff;">${data.realName}</span> 用户？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: function () {
          let param = { id: dia.id }
          this._api.user_disable(param).then((res) => {
            self.notify(res.msg || '操作成功', 'success')
            self.dialogTip.show = false
            self.queryTable()
          })
        }
      }
      this.dialogTip = dia
    },
    /**  角色  */
    getValidRoleList () {
      _api.role_public_valid_role_list({
        id: localStorage.getItem('zp_roleId'),
        userId: localStorage.getItem('zp_userId')
      }).then(res => {
        this.valid_role_list = res.data.map(item => ({
          label: item.name,
          value: item.id
        }))
      })
    },
    // 交接数据下拉列表
    getCollaboratorsList () {
      _fn.getCollaboratorsList(res => {
        this.linkUsers = res.filter(item => item.enabled).map(item => ({
          label: item.realName,
          value: item.id
        }))
      }, {}, false)
    },
    table_location_add (item) { // 新增、编辑 角色
      _fn.toLocation({ name: 'userRoleEdit', params: { id: (item && item.id) || '0' } }) // -> /user/123
    },
    deleteClick (data, item) { // 删除角色
      let dia = {
        id: data.id,
        title: '您确定要删除该角色吗？',
        tbody: `删除的角色将无法恢复。还要继续删除该角色吗？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: this.dialogDel
      }
      this.dialogTip = dia
      this.delDialog.obj = data
    },
    dialogDel (data) {
      this.dialogTip.show = false
      let dia = {
        obj: this.delDialog.obj,
        title: '删除角色',
        slot: 'Tip',
        tip: `如您确认删除 ${this.delDialog.obj.name} 角色，请将其关联的用户配置到新的角色上`,
        dialogWidth: '660px', // dialog 宽度
        // titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: this.commitDelete,
        dialogFormCenter: true, // 所有内空居中显示
        isShowLabel: true,
        temp: {
          targetId: {
            formType: 'select',
            label: '转移用户至',
            data: this.valid_role_list.filter(item => this.delDialog.obj.id !== item.value),
            isShow: true,
            filterable: true,
            style: { width: '320px' }
          }
        },
        ruleForm: {
          targetId: ''
        },
        rules: {
          targetId: [{ required: true, message: '请选择用户' }]
        }
      }
      this.delDialog = dia
    },
    commitDelete () {
      this.$refs.dialogForm2.commitDialog(() => {
        let param = {
          newRoleId: this.delDialog.ruleForm.targetId,
          roleId: this.delDialog.obj.id
        }
        this._api.role_delete(param).then((res) => {
          this.notify(res.msg || '删除成功', 'success')
          this.getValidRoleList()
          this.delDialog.show = false
          this.handleClick(2)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 14px;
}
.roleUser {
  display: flex;
  height: calc(100% - 120px);
  .left {
    padding: 0 20px;
    width: 400px !important;
    overflow: auto;
    border-right: 1px solid #eaeaea;
  }
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    width: calc(100% - 400px);
    flex-direction: column;
  }
}
.tips {
  display: flex;
  border: 1px solid red;
  background: rgba(74, 132, 255, 0.04);
  border: 1px solid rgba(74, 132, 255, 0.1);
  border-radius: 4px;
  margin: -20px 0 60px 0;
  padding: 8px;
  .title {
    line-height: 24px;
    padding-left: 10px;
  }
}
/deep/ .el-tree-node__content {
  height: 32px;
  .customIcon {
    position: relative;
    display: inline-block;
    width: 100%;
    .text {
      font-size: 14px;
      color: #26334f;
    }
    .icon {
      position: absolute;
      right: 4px;
      top: 0;
      i {
        font-size: 14px;
        margin-right: 12px;
      }
    }
  }
  &:hover {
  }
}
</style>
