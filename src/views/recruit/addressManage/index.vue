<template>
  <!-- 地址管理 -->
  <zp-page :obj="obj" ref="hroPage">
    <zp-breadcrumb slot="breadcrumb" :obj="obj" />
    <zp-condition slot="condition" :obj="obj" :isArrowDown="true">
      <template slot="formFrist">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.companyId" name="companyId" :obj="obj.searchModel" />
        <zp-dynamicFormItem :formItem="obj.searchModel.temp.status" name="status" :obj="obj.searchModel" />
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="table_location_add(null)">新增地址</zp-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown ref="dropdownRef" split-button size="medium" class="dropdown" trigger="click" @command="commandClick"
            @click.stop="dropdownBtnClick" placement="bottom-start">
            批量操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='1'>批量停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </template>
    </zp-condition>
    <!-- 加载表格数据 -->
    <zp-dynamicTable @handleSelectionChange="handleSelectionChange" slot="table" :obj="obj.tableObj" stripe>
      <template slot="customMode_level" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            <span class="table_location" @click="table_location(scope)">{{scope.row.level}}</span>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
import index from './index'
export default index
</script>
