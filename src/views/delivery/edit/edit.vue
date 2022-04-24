<style lang="less" scoped>
  @import './edit.less';
</style>

<template>
  <div class="edit-page element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <div class="updateCandidate-wrapper">
      <UpdateCandidate v-if="!!Object.keys(editFormInfo).length" :updateId="id" :editFormInfo="editFormInfo" />
    </div>
  </div>
</template>

<script>
import edit from './edit'
export default edit
</script>
