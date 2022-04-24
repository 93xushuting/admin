<template>
  <div class="element__body">
    <!-- 名称、上传、下载 -->
    <slot name="breadcrumb"></slot>
    <slot name="tabs"></slot>
    <!-- 查询条件 -->
    <slot name="condition"></slot>
    <!-- 加载表格数据 -->
    <slot name="tableCount"></slot>
    <slot name="table"></slot>
    <!-- 创建/编辑 -->
    <slot name="dialog"></slot>
    <!-- 删除 -->
    <zp-dialog :obj="dialogDelete" :sideDialog='false' width="500px">
      <div slot="body" align="center">{{dialogDelete.context || '是否确定删除该条数据？'}}</div>
    </zp-dialog>
    <!-- 自定义 -->
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'page',
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogDelete: {
        title: '提示',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: true, // 是否显示确定按钮
        context: '', // 提示语
        confirmCallback: this.commitDel
      },
      tempSearch: {} // 停时保存查询条件
    }
  },
  watch: {
    // '$store.state.menu.obj.roles': {
    //   handler (val, oldVal) {
    //     this.$store.state.menu.obj.roles = val
    //     this.load()
    //   },
    //   deep: true
    // },
    obj: {
      handler (val, oldVal) {
        // console.info('page页面：', val)
        this.obj = val
      },
      deep: true
    }
  },
  mounted () {
    // console.info('page页面mounted：')
    if (this.obj.searchModel) {
      this._fn.extend(true, this.tempSearch, this.obj.searchModel.ruleForm || {})
    }
    if (!this.obj.searchModelLoad) { // searchModelLoad true 不执行
      this.load()
    }
    this.$nextTick(() => {
      if (this.obj.tableObj && this.obj.tableObj.pager && this.obj.tableObj.pager.callback === 'load') {
        this.obj.tableObj.pager.callback = this.load
      }
    })
  },
  methods: {
    setFields (fields) {
      this.obj.fields = fields
      this.load()
    },
    load (type, flag) { // 加载列表
      if (type === 'pager') {
        this.query(flag)
      } else if (flag === 1) {
        this.obj.tableObj.pager.pageNo = 1
        this.query(flag)
      } else {
        this.query(flag)
      }
    },
    query (flag) {
      // console.info('page query')
      let o = this.obj.tableObj
      let url = (this.obj.http && this.obj.http.queryUrl) || ''
      if (url) {
        let param = {
          pageReq: {
            page: o.pager.pageNo,
            size: o.pager.pageSize
          },
          queryParam: {}
        }
        Object.assign(param.queryParam, this.obj.searchModel.ruleForm || {})
        console.info('this.obj.tableObj', this.obj.tableObj)
        let loadBefor = this.$parent['loadBefor']
        if (loadBefor) {
          param = this.$parent['loadBefor'](param, flag) // 查询之前回调
        }
        this._api[url](param).then((res) => {
          let data = res.data || res
          o.pager.pageTotal = data.total
          let loadAfter = this.$parent['loadAfter']
          if (loadAfter) {
            loadAfter(data, (d) => {
              o.data = d
            })
          } else {
            if (data) {
              o.data = data.list || []
            }
          }
        })
      }
    },
    reset () { // 重置
      let cb = this.$parent['resetAfter'] || this.$parent.$parent['resetAfter']
      if (cb) {
        const params = _fn.extend(true, {}, this.tempSearch)
        cb(params, () => { this.load() })
      } else {
        this.obj.searchModel.ruleForm = JSON.parse(JSON.stringify(this.tempSearch))
        this.load()
      }
    },
    add () { // 弹出框 -- 新增
      if (_fn.isFunction(this.obj.addFunction)) { // 页面跳转
        this.obj.addFunction()
      } else { // 弹框
        this.obj.dialog.show = true
        this.obj.dialog.flag = 'add'
        this.obj.dialog.title = '创建'
        this.$nextTick(() => {
          let cb = this.$parent['addAfter']
          if (cb) {
            cb()
          }
        })
      }
    },
    // 查看
    see (data) {
      this.obj.dialog.show = true
      this.obj.dialog.flag = 'see'
      this.obj.dialog.title = '查看'
      this.$nextTick(() => {
        let fn = this.$parent['seeAfter']
        if (fn) {
          let d = JSON.parse(JSON.stringify(data))
          fn(d, (item) => {
            this.obj.dialog.ruleForm = item
            return this.obj.dialog.ruleForm
          })
        } else {
          this.obj.dialog.ruleForm = JSON.parse(JSON.stringify(data))
        }
      })
    },
    edit (data) {
      this.obj.dialog.show = true
      this.obj.dialog.flag = 'edit'
      this.obj.dialog.title = '修改'
      this.$nextTick(() => {
        let fn = this.$parent['editAfter']
        if (fn) {
          let d = JSON.parse(JSON.stringify(data))
          fn(d, (item) => {
            this.obj.dialog.ruleForm = item
            return this.obj.dialog.ruleForm
          })
        } else {
          this.obj.dialog.ruleForm = JSON.parse(JSON.stringify(data))
        }
      })
    },
    commit (res, clearCallback) {
      if (this.obj.dialog.flag === 'edit' || this.obj.dialog.flag === 'add') {
        let url = this.obj.dialog.flag === 'edit' ? this.obj.http.updateUrl : this.obj.http.addUrl
        let param = JSON.parse(JSON.stringify(this.obj.dialog.ruleForm))
        let fn = this.$parent['commitAfter']
        if (fn) {
          param = fn(param)
        }
        this._api[url](param).then((res) => {
          clearCallback && clearCallback() // 清空弹出框信息
          this.obj.dialog.show = false
          this.notify(res.msg || '保存成功', 'success')
          this.load()
        })
      } else { // 
        var fn_ = this.obj.dialog.btnList && this.obj.dialog.btnList[this.obj.dialog.types]
        fn_ && fn_()
      }
    },
    del (data) {
      console.log(1)
      this.dialogDelete.show = true
      this.$nextTick(() => {
        let cb = this.$parent['delAfter']
        if (cb) {
          this.dialogDelete.id = data.id
          cb(this.dialogDelete, (res) => {
            Object.assign(this.dialogDelete, res)
          })
        }
      })
    },
    commitDel () {
      if (this.dialogDelete.id) {
        if (this.obj.http.delUrl) {
          this._api[this.obj.http.delUrl]({ id: this.dialogDelete.id }).then((res) => {
            this.dialogDelete.show = false
            this.notify(res.msg || '删除成功', 'success')
            this.load()
          })
        }
      }
    }
  }
}
</script>
