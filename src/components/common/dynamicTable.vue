<template>
  <zp-table :height="height" @pageChange="pageChange" @handleSelectionChange="handleSelectionChange($event)" ref="tableRef" :pager="obj.pager"
    :data="obj.data" stripe @select="selectionList" @select-all="selectionList" v-on="$listeners" v-bind="$attrs"
    :isOnresizeTable="obj.isOnresizeTable">
    <!-- 多选列 -->
    <template v-if="obj.operation && obj.operation.selection">
      <el-table-column align="center" type="selection" :width="obj.operation.selection_width" label="全选" :fixed="!obj.operation.selection_fixed">
      </el-table-column>
    </template>
    <!-- 操作列 -->
    <template v-if="obj.operation && obj.operation.operation">
      <el-table-column :width="obj.operation.operation_width" label="操作" :fixed="!obj.operation.operation_fixed">
        <template slot-scope="scope">
          <template v-if="filterBtn(obj.btnList,scope.row).length >= 3">
            <template v-for="(item, index) in obj.btnList">
              <template v-if="
                  item.isShow === true ||
                  (_fn.isFunction(item.isShow) &&
                    item.isShow(scope.row, item, scope))
                ">
                <template v-if="item.list && item.list.length">
                  <template v-if="item.icon">
                    <el-dropdown @command="
                        (value) => {
                          handleCommand(value, scope.row, item);
                        }
                      " :key="index + 'btn'" style="color: #4a84ff; cursor: pointer; margin-left: 10px">
                      <span class="el-dropdown-link">
                        <i class="iconfont icongengduogongneng"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <template v-for="(item2, i) in item.list">
                          <el-dropdown-item :command="item2.value" :key="i" v-if="
                              item2.isShow === true ||
                              (_fn.isFunction(item2.isShow) &&
                                item2.isShow(scope.row, item2, scope))
                            ">{{ item2.label }}
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <template v-if="item.isText">
                    <el-dropdown @command="
                        (value) => {
                          handleCommand(value, scope.row, item);
                        }
                      " @visible-change="
                        (value) => {
                          visibleChange(value, scope.row, item);
                        }
                      " :key="index + 'btn2'" style="margin: 0 0 0 10px; color: #4a84ff; cursor: pointer">
                      <span class="el-dropdown-link">{{ item.text }}</span>
                      <el-dropdown-menu slot="dropdown">
                        <template v-for="(item2, i) in item.list">
                          <el-dropdown-item :command="item2.value" :key="i" v-if="
                              item2.isShow === true ||
                              (_fn.isFunction(item2.isShow) &&
                                item2.isShow(scope.row, item2, i, item.list))
                            ">{{ item2.label }}
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
                <template v-else>
                  <zp-button @click="item.callback(scope.row, item)" :key="index + 'btn'" type="text" :class="item.class" v-if="!item.isPopover">
                    {{ item.text }}
                  </zp-button>
                  <el-popover :key="index + 'btn'" placement="right" width="400" trigger="click" :content="item.content" v-if="item.isPopover">
                    <zp-button slot="reference" @click="item.callback(scope.row, item, scope.$index)" type="text" :class="item.class">{{ item.text }}
                    </zp-button>
                  </el-popover>
                </template>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-for="(item, index) in obj.btnList">
              <template v-if="
                  item.isShow === true ||
                  (_fn.isFunction(item.isShow) &&
                    item.isShow(scope.row, item, scope))
                ">
                <zp-button @click="item.callback(scope.row, item)" :key="index + 'btn'" type="text" :class="item.class">
                  {{ item.text }}
                </zp-button>
              </template>
            </template>
          </template>
        </template>
      </el-table-column>
    </template>
    <!-- 序号列 -->
    <template v-if="obj.operation && obj.operation.index">
      <el-table-column type="index" :width="obj.operation.index_width || 50" label="序号" :fixed="!obj.operation.index_fixed" />
    </template>
    <!-- 字段列 -->
    <template v-for="(item, __index) in obj.fields">
      <template v-if="item.customMode">
        <!-- 自定义JS [customMode: this.customMode] -->
        <template v-if="_fn.isFunction(item.customMode)">
          <el-table-column show-overflow-tooltip :key="__index" :fixed="item.fixed" :width="item.width || obj.operation.width || ''" :prop="item.key"
            :label="item.label" :sortable="item.sortable" :formatter="item.formatter || _tcolFormat.format">
            <template slot-scope="scope">
              <div style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                " v-html="
                  item.customMode(
                    scope.row,
                    scope.column,
                    scope.row[item.key],
                    scope.$index,
                    item
                  )
                "></div>
            </template>
          </el-table-column>
        </template>
        <!--自定义html [customMode: true] -->
        <template v-else>
          <slot :name="'customMode_' + item.key" :customProps="item"></slot>
        </template>
      </template>
      <template v-else>
        <el-table-column show-overflow-tooltip :key="__index" :fixed="item.fixed" :width="item.width || obj.operation.width || ''" :prop="item.key"
          :label="item.label" :sortable="item.sortable" :formatter="item.formatter || _tcolFormat.format" />
      </template>
    </template>
  </zp-table>
</template>
<script>
export default {
  name: 'dynamicTable',
  props: {
    height: {
      type: [String, Number],
      default: 500 // Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。	
    },
    obj: {
      type: Object,
      default () {
        return {
          data: [],
          fields: [],
          operation: {},
          btnList: [],
          pager: {}
        }
      }
    }
    // obj: {
    //   data: [],
    //   fields: [
    //     { key: 'userName', label: '账号' },
    //     { key: 'realName', label: '姓名' },
    //     { key: 'sex', label: '姓别', formatter: this._tcolFormat.sex, sortable: true },
    //     { key: 'mobile', label: '手机号' },
    //     { key: 'level', label: '用户角色', formatter: this._tcolFormat.role },
    //     { key: 'parentName', label: '上级账号' },
    //     { key: 'departmentName', label: '部门' },
    //     { key: 'status', label: '用户状态', formatter: this._tcolFormat.userState },
    //     { key: 'createdTime', label: '创建时间', width: '180', formatter: this._tcolFormat.formatterDate, sortable: true }
    //   ],
    //   operation: {
    //     selection: true, // 是否显示全选列
    //     selection_width: 50, // 并设置列宽
    //     index: true, // 是否显示序号
    //     index_width: 50, // 并设置列宽
    //     operation: true, // 是否显示操作列
    //     operation_width: 100 // 并设置列宽
    //   },
    //   btnList: [
    //     {
    //       text: '编辑',
    //       callback: this.editClick,
    //     },
    //     {
    //       text: '删除',
    //       class: 'zp-btn-color-red', // 默认 zp-btn-color-blue
    //       callback: this.delClick
    //     },
    //     {
    //       text: '重置密码',
    //       callback: this.resetPass
    //     }
    //   ],
    //   pager: {
    //     pageNo: 1, // 第几页
    //     pageSize: 10, // 每页多少条
    //     pageTotal: 0, //  共多少条
    //     callback: this.loadList
    //   }
    // }
  },
  watch: {
    obj: { // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        console.info('深度监听，可监听到对象、数组的变化', val.btnList)
        this.obj = val
        this.$nextTick(() => {
          let dom = document.querySelectorAll('.el-table__fixed .el-table__fixed-body-wrapper')
          // 兼容火狐
          dom.length && (dom[0].style.overflow = 'auto')
          setTimeout(() => {
            this.$refs.tableRef.refsh()
            dom.length && (dom[0].style['overflow-x'] = 'hidden')
          }, 50)
        })
      },
      deep: true
    }
  },
  data () {
    return {
      multipleSelection: [] // 当前页选中的数据
    }
  },
  methods: {
    // 按钮权限 
    filterBtn (list = [], row) {
      let arr = list
      let newArr = arr.filter(item => !item.isShow || (_fn.isFunction(item.isShow) && item.isShow(row, item)))
      // console.info('按钮权限', list, newArr)
      this.allBtns = newArr
      return newArr
    },
    visibleChange (value, row, item) {
      value && item.visibleChange && item.visibleChange(value, row, item)
    },
    handleCommand (value, row, item) {
      console.info('更多 -- ', value)
      item.callback && item.callback(value, row, item)
    },
    // 选中的事件
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 清空选中的
    clearSelection () {
      this.multipleSelection = []
      this.$refs.tableRef.clearSelection()
    },
    // 赋值选中的
    toggleRowSelection (row) {
      this.$refs.tableRef.select(row)
    },
    // 有变更跳转页面
    jumpClick (id) {
      var fn_ = this.obj.callback
      fn_ && fn_(id)
    },
    onClickTableBtn (item, index, row) {
      if (item.callback && this._fn.isFunction(item.callback)) {
        item.callback(row, index, item) // 执行回调
      } else {
        let callback = this.$parent[item.type]
        if (callback) {
          callback(row, index, item) // 执行回调
        }
      }
    },
    selectionList (selection, row) {
      this.multipleSelection = this.toReduce(selection)
    },
    toReduce (arr) { // 数组中的对象去重
      var obj = {}
      arr = arr.reduce(function (item, next) {
        if (obj[next.id]) {
          obj[next.id] = true
        } else {
          item.push(next)
        }
        return item
      }, [])
      return arr
    },
    getIdx (arr) {
      let ret = []
      if (arr && arr.length) {
        for (let i = 0; i < arr.length; i++) {
          ret.push(arr[i].id)
        }
      }
      return ret
    },
    getSelected (type) {
      return {
        idx: this.getIdx(this.multipleSelection),
        list: this.multipleSelection
      }
    }
  }
}
</script>
