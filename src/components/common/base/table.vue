<template>
  <div>
    <div id="table" class="table" :style="isIe ? 'position:relative;':''">
      <el-table ref="TableRef" :style="isIe ? 'position:absolute;width: 100%;':''" v-bind="$attrs" v-on="$listeners" v-loading="loading" :data="data"
        :stripe="stripe" :height="reversedMessage || height" :border="border" :size="size" :fit="fit" :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :row-class-name="rowClassName" :row-style="rowStyle"
        :cell-class-name="cellClassName" :cell-style="cellStyle" :header-row-class-name="headerRowClassName" :row-key="rowKey"
        :header-row-style="headerRowStyle" :header-cell-class-name="headerCellClassName" :header-cell-style="headerCellStyle" :empty-text="emptyText"
        :default-expand-all="defaultExpandAll" :expand-row-keys="expandRowKeys" :default-sort="defaultSort" :show-summary="showSummary"
        :sum-text="sumText" :summary-method="summaryMethod" :span-method="spanMethod" :select-on-indeterminate="selectOnindeterminate"
        @selection-change="handleSelectionChange">
        <slot></slot>
      </el-table>
      <div class="pagination-wrap" v-if="pager.isShow" :style="isIe ? `position:absolute;width: 100%;top:${reversedMessage || height}px` : ''">
        <zp-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pager.pageNo" :page-size="pager.pageSize"
          :total="pager.pageTotal">
        </zp-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table',
  props: {
    loading: Boolean,
    pager: {
      type: Object,
      default: function () {
        return {
          pageNo: 1, // 第几页
          pageSize: 20, // 每页多少条
          pageTotal: 0 //  共多少条
        }
      }
    },
    data: {
      type: Array,
      default: function () {
        return [] // 显示的数据
      }
    },
    border: { // 是否带有纵向边框	boolean	—	false
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number],
      default: 500 // Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。	
    },
    maxHeight: {
      type: [String, Number],
      default: 250 // Table 的最大高度	string/number	—	—
    },
    stripe: {
      type: Boolean,
      default: false // 是否为斑马纹 table	boolean	—	false
    },
    size: {
      type: String,
      default: 'mini' // Table 的尺寸 medium / small / mini	—
    },
    fit: {
      type: Boolean,
      default: true // 列的宽度是否自撑开	boolean	—	true
    },
    showHeader: {
      type: Boolean,
      default: true // 	是否显示表头	boolean	—	true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false // 是否要高亮当前行	boolean	—	false
    },
    currentRowKey: {
      type: [String, Number],
      default: '' // 当前行的 key，只写属性	String,Number	—	—
    },
    rowClassName: {
      type: [Function, String],
      default: '' // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
    },
    rowStyle: {
      type: [Function, Object],
      default: function () {
        return {}
      } // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
    },
    cellClassName: {
      type: [Function, String],
      default: '' // 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—
    },
    cellStyle: {
      type: [Function, String],
      default: '' // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。	Function({row, column, rowIndex, columnIndex})/Object	—	—
    },
    headerRrowClassName: {
      type: [Function, String],
      default: '' // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
    },
    headerRowStyle: {
      type: [Function, Object],
      default: function () {
        return {}
      } // 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
    },
    headerCellClassName: {
      type: [Function, String],
      default: '' // 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—  
    },
    headerCellStyle: {
      type: [Function, Object],
      default: function () {
        return {}
      } // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。	Function({row, column, rowIndex, columnIndex})/Object	—	—
    },
    rowKey: {
      type: [String, Function],
      default: function (row) {
        return (row && row['id']) || 'id'
      }
    }, // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。	Function(row)/String	—	—
    emptyText: { // 空数据时显示的文本内容，也可以通过 slot="empty" 设置	String	—	暂无数据
      type: String,
      default: function () {
        return '暂无数据~'
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: false // 是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效	Boolean	—	false
    },
    expandRowKeys: {
      type: Array,
      default: function () {
        return []
      } // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。	Array	—	
    },
    defaultSort: {
      type: Object,
      default: function () {
        return {}
      } // 默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序	Object	order: ascending, descending	如果只指定了prop, 没有指定order, 则默认顺序是ascending
    },
    showSummary: {
      type: Boolean,
      default: false // 是否在表尾显示合计行	Boolean	—	false
    },
    sumText: {
      type: String,
      default: '' // 合计行第一列的文本	String	—	合计
    },
    summaryMethod: Function, // 自定义的合计计算方法	Function({ columns, data })	—	—
    spanMethod: Function, // 合并行或列的计算方法	Function({ row, column, rowIndex, columnIndex })	—	—
    selectOnIndeterminate: {
      type: Boolean,
      default: false // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行	Boolean	—	true
    },
    isOnresizeTable: {
      type: Boolean,
      default: true // 是否加载onresizeTable
    }
  },
  data () {
    return {
      reversedMessage: 0,
      isLoadPager: false
    }
  },
  computed: {
    isIe () {
      console.info('ActiveXObject isIe')
      return !!window.ActiveXObject || 'ActiveXObject' in window
    },
    // eslint-disable-next-line vue/no-dupe-keys
    reversedMessage: function () {
      console.info('reversedMessage', this.height)
      return this.height
    }
  },
  watch: {
    data: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          this.onresizeTable() // 高度自适应
          if (val && (!val.length)) {
            this.pager.pageNo = 1
            let elem = this.$el.querySelector('.el-table__empty-block')
            while (elem.firstChild && elem.firstChild.tagName === 'DIV') {
              elem.removeChild(elem.firstChild)
            }
            let div = document.createElement('div')
            elem.prepend(div)
          }
        })
      },
      deep: true
    }
  },
  created () { },
  mounted () { },
  methods: {
    onresizeTable () { // 监听窗口大小变化
      let self = this
      let tt = document.querySelectorAll('.deliveryOperationTable')
      if (tt && tt.length) {
        return
      }
      let offset = (self.$refs.TableRef && self.$refs.TableRef.$el) || {}
      let tab = 0
      if (!this.isOnresizeTable) {
        tab = 60
      }
      // 浏览器高度 - （表格的相对高度 + 菜单高度48 + 4 + 分页高度49 + 上下边距12*2
      let h = window.innerHeight - (offset.offsetTop + 52 + 49 + 24) + 14 - tab
      this.reversedMessage = getMinHeight(h)
      console.info('浏览器高度', self.reversedMessage)
      window.onresize = function () {
        _fn.throttle(200, () => {
          let h2 = window.innerHeight - (offset.offsetTop + 52 + 49 + 24) + 14 - tab
          self.reversedMessage = getMinHeight(h2)
          // console.info('监听窗口大小变化', self.reversedMessage)
        })
      }
      function getMinHeight (v) {
        return v > 300 ? v : 300
      }
    },
    refsh () {
      // 处理表格fixed错位问题
      console.info('处理表格fixed错位问题')
      this.$refs.TableRef.bodyWrapper.scrollTop = 0 // 设置滚动至顶部
      this.$refs.TableRef.doLayout()
    },
    // 触发checkbox
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    clearSelection () {
      this.$refs.TableRef.clearSelection()
    },
    // 选中
    select (data) {
      this.$refs.TableRef.toggleRowSelection(data, true)
    },
    // 分页
    sizeChange (val) { // pageSize 改变时会触发
      this.pager.pageSize = val
      // if (val > this.pager.pageTotal) {
      //   return
      // }
      // this.isLoadPager = true
      this.pagerCallback(true)
      console.info('pageSize 改变时会触发:' + val)
    },
    // currentChange (val) { // currentPage 改变时会触发
    //   if (this.isLoadPager) {
    //     this.pager.pageNo = 1
    //     this.isLoadPager = false
    //   } else {
    //     this.pager.pageNo = val
    //   }
    //   this.pagerCallback()
    //   console.info('currentPage 改变时会触发:' + val)
    // },
    currentChange (val) { // currentPage 改变时会触发
      this.pager.pageNo = val
      this.pagerCallback()
      console.info('currentPage 改变时会触发:' + val)
    },
    pagerCallback (flag) {
      if (flag) {
        this.pager.pageNo = 1
      }
      if (this.pager.callback) {
        this.pager.callback('pager')
      }
    }
  }
}
</script>
<style scoped lang="less">
.table {
  /deep/ .el-table__fixed {
    height:auto !important;
    bottom: 8px;
  }
  .el-table {
    border-left: 20px solid transparent!important;
    border-right: 20px solid transparent!important;
    .operation-cell {
      &:not(.is-leaf) {
        .cell {
          text-align: left;
        }
      }
    }
  }
  /deep/ .el-table {
    border: none;
    &::before,
    &::after{
      background-color: transparent;
    }
    td {
      border: none;
    }
    .cell {
      font-size: 14px;
      color: #26334F;
      letter-spacing: 0;
    }
    // 头部
    .el-table__header{
      th:nth-last-child(2) {
        border-right: none;
      }
      .cell{
        word-break: keep-all;
      }
      th,tr {
        height: 40px;
        padding: 0;
        text-align: left;
        background: #f4f4f4;
        border-right: none;
        border-bottom:none;
        box-sizing: content-box
      }
      th::before{
        content: "";
        position: absolute;
        right: 10px;
        bottom: 8px;
        width: 1px;
        height: 24px;
        background-color: #2e384d1a;
        z-index: 1;
      }
      th.el-table-column--selection::before{
        width: 0;
        height: 0;
      }
      th:nth-last-child(2)::before{
        width: 0;
        height: 0;
      }
      th.gutter {
        width:15px !important;
        display: table-cell !important;
      } 
    }
    // 内容
    .el-table__body td{
      text-align: left;
      height: 40px;
      padding: 0;
    }
    .el-table__empty-block {
      display: block;
      div {
        width: 100%;
        margin-top: 156px;
        background: url('../../../assets/image/noData.png') no-repeat center;
        background-size: 92px 100px;
        height: 100px;
      }
      .el-table__empty-text {
        font-size: 15px;
        color: #bbbbbb;
      }
    }
  }
  /deep/ .pagination-wrap {
    /*margin-top:5px;
    box-shadow: 0px -12px 10px -15px #ccc;*/
    height: 48px;
    border-top:1px solid #2e384d1a;
    &::before{
      clear:both;
    }
    .el-pagination {
      padding:7px 15px;
      float: right;
      span,button,.el-pager li{
        line-height: 34px;
        height: 34px;
      }
      .el-pager li:hover {
        color: #606266;
      }
      .number{
        font-weight: normal;
      }
    }
    .el-icon-arrow-left {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-right-color: #333;
      padding-left: 6px;
    }
    .el-icon-arrow-left:before, .el-icon-arrow-right:before {
      content: "";
    }
    .el-icon-arrow-right {
      font-weight: 800;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-left-color: #333;
      margin-left: 12px;
    }
  }
}
/deep/ .el-table .cell.el-tooltip {
  max-width: 200px;
}
/deep/.statesDiv{
  display: flex;
  line-height: 40px;
  margin-left: -7px;
}
// 二级表头样式
.levelTable {
  /deep/ .el-table {
    .el-table__header{
      th{
        height: 0px;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
      }
      th:nth-last-child(2) {
        border-right: 1px solid #e9e9e9;
      }
    } 
  }
}
</style>
