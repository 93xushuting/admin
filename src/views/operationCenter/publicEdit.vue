<template>
  <!-- 公众号推送 编辑 -->
  <div class="element__body_info">
    <zp-bread :obj="obj" />
    <positionList ref='tables' />
  </div>
</template>
<script>
import positionList from './positionList'
export default {
  name: 'publicEdit',
  components: { positionList },
  data () {
    return {
      tableSelectedData: [],
      dialogTip: {},
      obj: {
        breadcrumb: {}
      }
    }
  },
  methods: {
    getTableData () {
      return this.$refs.tables.getTableData()
    },
    setTableData (arr) { // arr:[1,2,3]
      setTimeout(() => {
        this.$refs.tables.setSelected(arr)
      }, 3000)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
