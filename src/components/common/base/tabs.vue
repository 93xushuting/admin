<template>
  <el-tabs v-model="tabs" :type="type" :closable="closable" :addable="addable" :editable="editable" :tab-position="tabPosition" v-on="$listeners">
    <el-tab-pane :key="item" v-for="(item) in data" :label="item.label || item" :name="item.key || item" />
    <!-- <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane> -->
  </el-tabs>
</template>

<script>
export default {
  name: 'tabs',
  props: {
    prop: Object,
    data: Array,
    value: String, // 绑定值，选中选项卡的name	,第一个选项卡的 name
    // 风格类型
    type: {
      type: String,
      default: '' // card/border-card
    },
    // 标签是否可关闭
    closable: {
      type: Boolean,
      default: false
    },
    // 标签是否可增加
    addable: {
      type: Boolean,
      default: false
    },
    // 标签是否同时可增加和关闭
    editable: {
      type: Boolean,
      default: false
    },
    tabPosition: {
      type: String,
      default: 'top' // top/right/bottom/left	top  
    }
  },
  data () {
    return {
      tabs: ''
    }
  },
  created () {
    this.tabs = this.value ? this.value : this.data[0]
  },
  methods: {

  }
}
</script>
