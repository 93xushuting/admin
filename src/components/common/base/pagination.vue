<template>
  <el-pagination v-if="Number(total)" v-on="$listeners" :small="small" :background="background" :layout="layout" :total="Number(total)"
    :current-page.sync="currentPage" :page-count="pageCount" :pagerCount="pagerCount" :page-size="pageSize" :page-sizes="pageSizes"
    :popperClass="popperClass" :next-text="nextText" :prev-text="prevText" :disabled="disabled">
  </el-pagination>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    small: {
      type: Boolean,
      default: false// 是否使用小型分页样式	boolean	—	false
    },
    background: {
      type: Boolean,
      default: false // 是否为分页按钮添加背景色	boolean	—	false
    },
    layout: {
      type: String,
      default: 'total,sizes, prev, pager, next, jumper' // 组件布局，子组件名用逗号分隔	String	sizes, prev, pager, next, jumper, ->, total, slot	'prev, pager, next, jumper, ->, total'
    },
    total: {
      type: [String, Number],
      default: 0 // 总条目数	number	—	—
    },
    currentPage: {
      type: Number,
      default: 1 // 当前页数，支持 .sync 修饰符	number	—	1
    },
    pageCount: {
      type: Number,
      default: 1 // 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性	Number	—	—
    },
    pagerCount: {
      type: Number,
      default: 7 // 	页码按钮的数量，当总页数超过该值时会折叠	number	大于等于 5 且小于等于 21 的奇数	7
    },
    pageSize: {
      type: Number,
      default: 10 // 每页显示条目个数，支持 .sync 修饰符	number	—	10
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [20, 50, 100] // 每页显示个数选择器的选项设置	number
      }
    },
    popperClass: {
      type: String,
      default: '' // popper-class	每页显示个数选择器的下拉框类名	string	—	—
    },
    nextText: {
      type: String,
      default: '' // 替代图标显示的下一页文字	string	—	—
    },
    prevText: {
      type: String,
      default: '' // 替代图标显示的下一页文字	string	—	—
    },
    disabled: {
      type: Boolean,
      default: false // 是否禁用状态
    }
  }
}
</script>
