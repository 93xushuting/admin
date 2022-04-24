<style lang="less" scoped>
  @import './addTalent.less';
</style>

<template>
  <div class="element__body_info add-talent-page">
    <div class="breadcrumb">
      <i class="iconfont iconfanhuishangji" @click="toPage" />
      {{id ? '编辑人才' : '新增人才'}}
    </div>
    <div class="add-talent-main">
      <updateCandidate v-if="updateCandidateVisibile" :otherInfovisible="false" :editFormInfo="detailInfo" :updateId="id" />
    </div>
  </div>
</template>

<script>
import addTalent from './addTalent'
export default addTalent
</script>
