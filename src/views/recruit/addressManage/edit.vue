<style lang="less">
  @import './edit.less';
</style>
<template>
  <!-- 地址管理 编辑、新增 -->
  <div class="element__body_info address-update-page">
    <div class="breadcrumb">
      <i class="iconfont iconfanhuishangji" @click="toPage" />
      {{title}}
    </div>
    <el-form :model="form.ruleForm" :rules="form.rules" :ref="form.name" :label-width="form.labelWidth" :inline="form.formInline" class="infoForm "
      style="margin:0 0 52px 0;padding-top:40px">
      <zp-dynamicFormItem :formItem="form.temp.companyId" name="companyId" :obj="form" :key="index" /><br />
      <zp-dynamicFormItem :formItem="form.temp.name" name="name" :obj="form" :key="index" /><br />
      <zp-dynamicFormItem :formItem="form.temp.address" name="address" :obj="form" :key="index"><br />
        <template v-slot:custom_address="{ customProps }">
          <el-cascader :filterable="customProps.filterable" clearable @change="userSearchPiont($event)" :props="{
              value: 'id',
              label: 'title',
              children: 'sub'
            }" :options="cascaderOptions" v-model="form.ruleForm.address" separator=" " />
        </template>
      </zp-dynamicFormItem><br />
      <zp-dynamicFormItem @keyup.enter.native="userSearchPiont(form.ruleForm.details)" @blur="userSearchPiont(form.ruleForm.details)"
        :formItem="form.temp.details" name="details" :obj="form" :key="index" ref="base-input"/>
      <br />
      <zp-dynamicFormItem :formItem="form.temp.mapPiont" name="mapPiont" :obj="form" :key="index">
        <template slot="custom_mapPiont">
          <div class="search-piont">
            <el-input ref="base-input" v-model="searchPiontValue" placeholder="" @keyup.enter.native="getAddressByRightClick1(searchPiontValue)">
              <zp-button slot="append" @click="getAddressByRightClick1(searchPiontValue)">
                <i class="iconfont iconsousuo"></i>
              </zp-button>
            </el-input>
            <span class="text">在地图上点击右键获取地址</span>
          </div>
          <div class="allmap-contanier">
            <div id="allmap" v-loading="mapLoading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-text="正在加载中..."></div>
            <div class="selected-address-info">
              <P class="location-name">{{mapDetailInfo.address}}</P>
              <div class="location-info">
                <p>{{mapDetailInfo.title}}</p>
                <div>
                  <p>经度：{{mapDetailInfo.point.lng}}</p>
                  <p class="latitude-info">纬度：{{mapDetailInfo.point.lat}}</p>
                  <zp-button class="zp-btn-primary" @click="selectedMapPoint">确定</zp-button>
                </div>
              </div>
              <p class="prompt-info">此为估计位置，可能不够准确，仅供参考</p>
            </div>
          </div>
        </template>
      </zp-dynamicFormItem>
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" class="zp-btn-primary">保 存</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
  </div>
</template>
<script>
import edit from './edit'
export default edit
</script>
