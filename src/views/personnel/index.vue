<style lang="less" scoped>
  @import './index.less';
</style>

<template>
  <zp-page :obj="pageObject" ref="talent-pool-page" class="talent-pool-page">
    <zp-tabsCustom slot="tabs" v-model="activeTab" :data="[
      {
        label: '全部库 (' + count + ')',
        value: '000'
      }
    ]" />
    <zp-condition slot="condition" :obj="pageObject" :isArrowDown="true">
      <template slot="formFrist">
        <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.name" name="name" />
      </template>
      <template slot="form">
        <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.channelTypes" name="channelTypes">
          <template v-slot:custom_channelTypes="{ customProps }">
            <el-cascader v-model="pageObject.searchModel.ruleForm.channelTypes" :placeholder="customProps.placeholder" :options="customProps.data"
              :filterable="customProps.filterable" :props="customProps.props" :collapse-tags="customProps.collapseTags" :appendToBody="false" />
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.valid" name="valid" />
        <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.status" name="status" />
        <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.rule" name="rule" />
        <div class="set-rule">
          <Router-link to='/personnel/setrule/0'>
            设置订阅规则
            <i class="el-icon-arrow-right"></i>
          </Router-link>
        </div>
      </template>
      <template v-slot:rule-condition>
        <div class="rule-condition" v-show="!!ruleParams.length">
          <zp-dynamicFormItem :obj="pageObject.searchModel" :formItem="pageObject.searchModel.temp.tags" name="tags">
            <template v-slot:custom_tags>
              <div class="tag-container">
                <div class="tag-item" v-for="(value, key) in ruleParams" :key="key">{{value}}</div>
                <div class="tag-container-btn">
                  <Router-link :to="{
                    name: 'setrule',
                    params: {
                      id: pageObject.searchModel.ruleForm.rule
                    },
                    query: {
                      params: JSON.stringify(updateRule)
                    }
                  }">
                    <zp-button type="text"><i class="iconfont iconbianji1"></i></zp-button>
                  </Router-link>
                </div>
              </div>
            </template>
          </zp-dynamicFormItem>
        </div>
      </template>
      <template slot="btns">
        <el-form-item v-if="_fn.checkBtn('applicant/add') || _fn.checkBtn('applicant/import_applicants')">
          <el-dropdown ref="dropdownRef_other" @click.stop="dropdownBtnClickOther" split-button size="medium" class="dropdown" trigger="click"
            @command="commandClick('0', $event)" placement="bottom-start">
            新增人才
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='1' v-if="_fn.checkBtn('applicant/add')">手动添加</el-dropdown-item>
              <el-dropdown-item command='2' v-if="_fn.checkBtn('applicant/import_applicants')">批量导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item v-if="_fn.checkBtn('applicant/export_resumes') || _fn.checkBtn('applicant/batch_invitation')">
          <el-dropdown ref="dropdownRef" split-button size="medium" class="dropdown" trigger="click" @command="commandClick('1', $event)"
            @click.stop="dropdownBtnClick" placement="bottom-start">
            批量操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='1' v-if="_fn.checkBtn('applicant/export_resumes')">批量导出</el-dropdown-item>
              <el-dropdown-item command='2' v-if="_fn.checkBtn('applicant/batch_invitation')">批量邀约</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </template>

    </zp-condition>
    <zp-dynamicTable slot="table" ref="dynamicTable" :obj="pageObject.tableObj" stripe @handleSelectionChange="handleSelectionChange">
      <template v-slot:customMode_name="{ customProps }">
        <el-table-column :label="customProps.label" :width="customProps.width" show-overflow-tooltip class-name='tr-name'>
          <template slot-scope="scope">
            <template v-if="customProps.key ==='name'">
              <Router-link v-if="_fn.checkBtn('applicant/public/resume_details')" :to="{
                name: 'talentDetail',
                params: {id: scope.row.id},
                query: {
                  deliveryStatus: scope.row.deliveryStatus,
                  enabled: scope.row.enabled
                }
              }">
                {{scope.row.name}}
              </Router-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
            <span class="tag" v-if="!scope.row.enabled">暂不可用</span>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
    <zp-dynamicDialog slot="dialog" :obj="pageObject.dialog">
      <template v-slot:dialogupload>
        <div class="batch-import-talent-modal">
          <div class="title">上传文件</div>
          <zp-upload :limit="1" :formModel.sync="formModel" :show-file-list="false" :autoUpload="true" ref="childImport" />
          <zp-button type="text" @click="downloadTemp">
            <i class="el-icon-download"></i>
            下载模板
          </zp-button>
          <!-- <div class="upload-status-container">
            <div class="icon">
              <i class="el-icon-s-claim"></i>
            </div>
            <div class="main">
              <div class="main-title">海市徐汇区漕河泾一上海市徐汇区漕河泾一上海市徐汇.xlsx</div>
              <div class="progress-bar">
                <div class="progress-bar_inner"></div>
              </div>
            </div>
            <div class="upload-cancel">
              <zp-button type="text">
                <i class="el-icon-circle-close"></i>
              </zp-button>
            </div>
          </div> -->
          <!-- <div class="upload-fail">上传失败</div> -->
          <div class="upload-success-list">
            <div class="upload-success-list-item" v-for="item in formModel.fileList" :key="item.uid">
              <i class="el-icon-s-claim"></i>
              <span class="file-name">{{item.name.replace(/(.*\/)*([^.]+).*/ig, "$2")}}</span>
              <span class="file-suffix">.{{item.name.replace(/.+\./,"")}}</span>
              <div class="action-btn">
                <zp-button type="text" @click="delItem(item)">
                  <i class="iconfont iconshanchu"></i>
                </zp-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </zp-dynamicDialog>
  </zp-page>
</template>

<script>
import index from './index'
export default index
</script>
