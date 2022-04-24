<template>
  <!-- 企业管理 编辑、新增 -->
  <div class="element__body_info">
    <div class="breadcrumb"><i class="iconfont iconfanhuishangji" @click="toPage" />{{title}}</div>
    <UpdateCompany ref="updateCompany" v-if="visibile" :id="id" :detailForm="detailForm" :addCompanyType="$route.query.type" />
  </div>
</template>
<script>
import edit from './edit'
export default edit
</script>
