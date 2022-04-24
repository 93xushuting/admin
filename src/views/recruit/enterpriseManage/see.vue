<style lang="less">
  @import './see.less';
</style>

<template>
  <div :class="{
      'element__body_info': true,
      'company-detail-wrapper': editStatus
    }">
    <zp-bread :obj="breadObj" />
    <div class="company-detail">
      <div class="detail-head-main">
        <div class="detail-head">
          <div class="detail-logo">
            <img :src="detailInfo.logo" alt="">
          </div>
          <div class="detail-info">
            <div>
              <p class="company-name">{{detailInfo.name}}<span>{{detailInfo.industry.title}}</span></p>
              <p class="company-id">ID:{{detailInfo.id}}</p>
            </div>
            <p class="company-other">
              <span>创建人：{{realName}}</span>
              <span>创建时间：{{detailInfo.createTime | formatDateFilter}}</span>
            </p>
          </div>
        </div>
        <zp-button v-if="$route.query.type === 'proxy'" class="zp-btn-primary" @click="editStatus = true"><i class="iconfont">&#xe7f1;</i>编辑
        </zp-button>
      </div>
      <div v-show="!editStatus" :class="['detail-form', editStatus ? 'edit-detail-form' : '']">
        <el-form :model="form">
          <div class="form-group">
            <div class="form-group_title">基本信息</div>
            <div class="form-group_info">
              <p>企业名称：<span>{{detailInfo.name}}</span></p>
              <p>所属行业：<span>{{detailInfo.industry.title}}</span></p>
              <p>工作地址：<span>{{formatterAddresses(detailInfo.addresses)}}</span></p>
            </div>
          </div>
          <div class="form-group" v-if="detailInfo.introduce">
            <div class="form-group_title">企业介绍</div>
            <div class="form-group_info introduce">
              <div v-html="detailInfo.introduce"></div>
              <!-- <p>
                <span>{{detailInfo.introduce}}</span>
              </p> -->
            </div>
          </div>
          <div class="form-group" v-if="detailInfo.contact || detailInfo.mobile">
            <div class="form-group_title">联系信息</div>
            <div class="form-group_info contact-info">
              <p>联系人：<span>{{detailInfo.contact ? detailInfo.contact : "-"}}</span></p>
              <p>联系方式：<span>{{detailInfo.mobile ? detailInfo.mobile : "-"}}</span></p>
            </div>
          </div>
          <div class="form-group" v-if="detailInfo.companyTags.length">
            <div class="form-group_title" v-if="$route.query.type === 'proxy'">企业亮点</div>
            <div v-if="$route.query.type === 'proxy'" class="form-group_info highlights">
              <p v-for="item in detailInfo.companyTags" :key="item.id">
                <span>{{item.name}}</span>
              </p>
            </div>
          </div>
          <div class="form-group" v-if="detailInfo.companyPics.length">
            <div class="form-group_title">
              {{$route.query.type === 'proxy' ? '企业环境' : '营业执照'}}
              <span></span>
            </div>
            <div class="form-group_info environment">
              <div class="form-group_info-item" v-for="item in detailInfo.companyPics" :key="item.id">
                <div class="img-main">
                  <img :src="item.url" alt="">
                </div>
                <!-- <span class="del-btn">
                  <i class="iconfont iconwenbenshanchu"></i>
                </span> -->
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="element__body_info" v-if="editStatus">
        <UpdateCompany :toPageFlag="false" :overflow="false" :id="id" :detailForm="detailForm" />
      </div>
    </div>
  </div>
</template>

<script>
import see from './see'
export default see
</script>
