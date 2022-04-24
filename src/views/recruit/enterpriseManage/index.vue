<template>
  <!-- 标签管理 -->
  <zp-page :obj="obj" ref="hroPage">
    <!-- <zp-breadcrumb slot="breadcrumb" :obj="obj" /> -->
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[
      {label: '代理招聘', value: 'proxy'},
      //{label: '自主招聘', value: 'autonomous'}
    ]" @click='tabsChangeHanle' />
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="tagName === 'autonomous'">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem v-show="tagName === 'proxy'" :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.industryId" name="industryId" :obj="obj.searchModel" />
        <zp-dynamicFormItem v-show="tagName === 'autonomous'" :formItem="obj.searchModel.temp.sourceChannel" name="sourceChannel"
          :obj="obj.searchModel" />
        <zp-dynamicFormItem v-show="tagName === 'autonomous'" :formItem="obj.searchModel.temp.status" name="status" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="table_location_add">{{tagName === "proxy"? "新增企业" : "注册企业"}}</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_name" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="table_location" @click="table_location(scope)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="customMode_status" slot-scope="props">
        <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="status-mask ">待审核…{{scope.row.status}}</span>
            <!-- <span class="status-mask status-mask_fail">审核失败{{scope.row.status}}</span> -->
            <!-- <span class="status-mask status-mask_disabeld">审核失败{{scope.row.status}}</span> -->
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 创建/编辑 -->
    <zp-dynamicDialog slot="dialog" :obj="obj.dialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.dialog.temp.name" name="name" :obj="obj.dialog" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.version" name="version" :obj="obj.dialog" />
        <zp-dynamicFormItem :formItem="obj.dialog.temp.reason" :obj="obj.dialog" name="reason" />
        <p class="reason-msg" v-show="obj.dialog.temp.reason.isShow">
          <i class="el-icon-warning"></i>
          <span>审核失败理由系统会通知给企业客户，请知晓。</span>
        </p>
      </template>
    </zp-dynamicDialog>
  </zp-page>
</template>
<script>
import index from './index'
export default index
</script>

<style lang="less" scoped>
  .status-mask{
    padding-left: 14px;
    position: relative;
    &::before{
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -4px;
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4A84FF;
    }
  }
  .status-mask_fail{
    color: #F73E3E;
    &::before{
      background: #F73E3E;
    }
  }
  .status-mask_disabeld{
    color: #999999;
    &::before{
      background: #999999;
    }
  }
  .reason-msg{
    line-height: auto;
    margin: 0 0 0 80px;
  }
</style>
