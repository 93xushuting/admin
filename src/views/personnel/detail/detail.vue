<style lang="less" scoped>
  @import './detail.less';
</style>

<template>
  <div class="element__body_info">
    <zp-bread :obj="breadObj" />
    <div class="detail-page-main">
      <TalentDetail :isSourceTalentPoolFlag="true" :queryId="id" />
    </div>
  </div>
</template>

<script>
import detail from './detail'
export default detail
</script>
