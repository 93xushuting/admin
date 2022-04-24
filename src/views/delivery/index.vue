<template>
  <!-- 投递管理 -->
  <zp-page :obj="obj" ref="page" class="delivery">
    <div class="left">
      <!-- 查询条件 -->
      <zp-condition slot="condition" :obj="obj">
        <!-- 小于三个元素时 -->
        <template slot="form">
          <el-form-item class="dynamicFormItem" :label="obj.searchModel.temp.processId.label">
            <el-select v-model="obj.searchModel.ruleForm.processId" :placeholder="obj.searchModel.temp.processId.placeholder" :clearable="true"
              :filterable="true" :popperAppendToBody="true" @change="zplineChange">
              <el-option v-for="item in obj.searchModel.temp.processId.data" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left" v-if="item.obj && item.obj.enabled">{{item.label}}</span>
                <span style="float: left; font-size: 13px" v-else>{{item.label}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <zp-dynamicFormItem :formItem="obj.searchModel.temp.processId" name="processId" :obj="obj.searchModel" @change="zplineChange" /> -->
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.jobId" name="jobId" :obj="obj.searchModel" @change="jobsChange" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.companyId" name="companyId" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.headUid" name="headUid" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.cooperateUid" name="cooperateUid" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.recommender" name="recommender" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.createUids" name="createUids" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.channelType" name="channelType" :obj="obj.searchModel">
            <template v-slot:custom_channelType="{ customProps }">
              <el-cascader v-model="obj.searchModel.ruleForm.channelType" :placeholder="customProps.placeholder" :options="customProps.data"
                :props="customProps.props" :filterable="customProps.filterable" :clearable="customProps.clearable" />
            </template>
          </zp-dynamicFormItem>
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.statuses" name="statuses" :obj="obj.searchModel">
            <template v-slot:custom_statuses="{ customProps }">
              <el-cascader :placeholder="customProps.placeholder" v-model="obj.searchModel.ruleForm.statuses" :options="customProps.data"
                :collapse-tags="true" :props="{
                  multiple: true,
                }" @change="statusesChangeHandle" />
            </template>
          </zp-dynamicFormItem>
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.deliveryTime" name="deliveryTime" :obj="obj.searchModel" />
        </template>
      </zp-condition>
    </div>
    <div class="right">
      <zp-tabsCustom slot="tabs" :isEnabled="true" v-if="isShowTabs" v-model="tagName" @click="handleClick" :summary="summary" :data="tabs"
        class="zpTabs" ref="tabsCustom" />
      <div class="optaion">
        <el-dropdown v-if="_fn.checkBtn('job_applicant/add')" ref="dropdownRef_other" @click.stop="dropdownBtnClickOther" split-button size="medium"
          class="dropdownAdd" trigger="click" placement="bottom-start" @command="commandCandidateHandle">
          新增候选人
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">手动添加</el-dropdown-item>
            <el-dropdown-item v-if="_fn.checkBtn('job_applicant/import_candidate')" command="2">批量导入</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown ref="dropdownRef" split-button size="medium" class="dropdown" trigger="click" @command="optsClick" @click.stop="dropdownBtnClick"
          placement="bottom-end">
          批量操作
          <el-dropdown-menu slot="dropdown" class="batch-btn">
            <template v-if="isShowTabs && !statusesDropdownVisiblie">
              <el-dropdown-item command="6" v-if=" _fn.checkBtn('job_applicant/operate') && tagNameCuttent === 1">批量通过初筛</el-dropdown-item>
              <el-dropdown-item command="8" v-if="_fn.checkBtn('job_applicant/operate') && tagNameCuttent === 2">批量通过面试</el-dropdown-item>
              <el-dropdown-item command="12" v-if="_fn.checkBtn('job_applicant/operate') && tagNameCuttent === 3">批量通过证件审核</el-dropdown-item>
              <el-dropdown-item command="14" v-if="_fn.checkBtn('job_applicant/operate') && tagNameCuttent === 4">批量通过试工</el-dropdown-item>
              <el-dropdown-item command="16" v-if="_fn.checkBtn('job_applicant/operate') && tagNameCuttent === 5">批量通过背调</el-dropdown-item>
              <el-dropdown-item command="18" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['7']">批量确认入职</el-dropdown-item>
              <el-dropdown-item command="7" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['2']">批量邀请面试</el-dropdown-item>
              <el-dropdown-item command="9" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['3']">批量邀请办证</el-dropdown-item>
              <el-dropdown-item command="11" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['4']">批量邀请试工</el-dropdown-item>
              <el-dropdown-item command="15" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['5']">批量发起背调</el-dropdown-item>
              <el-dropdown-item command="17" v-if="_fn.checkBtn('job_applicant/operate') && tagNameNext['6']">批量发offer</el-dropdown-item>
              <el-dropdown-item command="5" v-if="_fn.checkBtn('job_applicant/operate') &&!(tagName === 'entry' || tagName === 'out')">批量淘汰
              </el-dropdown-item>
            </template>
            <template v-if="statusesDropdownVisiblie">
              <el-dropdown-item v-for="item in statusesDropdowMenu" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </template>
            <el-dropdown-item command="-99" v-if=" _fn.checkBtn('job_applicant/export_applicant') &&!statusesDropdownVisiblie">批量导出</el-dropdown-item>
            <el-dropdown-item command="13"
              v-if=" _fn.checkBtn('job_applicant/deleteJobApplactionOnAction') &&(tagName === 'entry' || tagName === 'out')">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <zp-dynamicTable slot=" table" :obj="obj.tableObj" stripe ref="tableObj" @handleSelectionChange="handleSelectionChange">
        <template slot="customMode_name" slot-scope="props">
          <el-table-column :label="props.customProps.label" :width="props.customProps.width" :fixed="props.customProps.fixed" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="line-height: 40px">
                <span class="table_location" v-if="_fn.checkBtn('job_applicant/details')" @click="toSee(scope.row)">{{ scope.row.name }}</span>
                <span v-else>{{ scope.row.name }}</span>
                <i v-if="scope.row.status === 11" class="iconfont icondian" style="color: #f23030; font-size: 20px"></i>
              </span>
            </template>
          </el-table-column>
        </template>
        <template slot="customMode_phone" slot-scope="props">
          <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.phoneNumber || ' -- ' }}
            </template>
          </el-table-column>
        </template>

        <template slot="customMode_position" slot-scope="props">
          <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ (scope.row.job && scope.row.job.name) || ' -- ' }}
            </template>
          </el-table-column>
        </template>
        <template slot="customMode_company" slot-scope="props">
          <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
                (scope.row.job &&
                  scope.row.job.company &&
                  scope.row.job.company.name) ||
                ' -- '
              }}
            </template>
          </el-table-column>
        </template>
        <template slot="customMode_createor" slot-scope="props">
          <el-table-column :label="props.customProps.label" :width="props.customProps.width" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
                (scope.row.job &&
                  scope.row.job.headUser &&
                  scope.row.job.headUser.realName) ||
                ' -- '
              }}
            </template>
          </el-table-column>
        </template>
      </zp-dynamicTable>
    </div>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
    <!-- 编辑入职信息v-slot:entry -->
    <template>
      <zp-dynamicDialog slot="dialog" :obj="entryDialog" ref="dialogForm">
        <template slot="form">
          <div style="margin: 20px 0; font-size: 15px" v-html="entryDialog.temp.content"></div>
          <zp-dynamicFormItem :formItem="entryDialog.temp.jobTime" name="jobTime" :obj="entryDialog" :key="index" />
          <zp-dynamicFormItem :formItem="entryDialog.temp.companyAddress" name="companyAddress" :obj="entryDialog" :key="index" />
        </template>
      </zp-dynamicDialog>
    </template>
    <!-- 批量导入候选人 v-slot:dialog-->
    <template>
      <zp-dynamicDialog :obj="dialogForm" ref="dynamicDialog">
        <template v-slot:form>
          <div class="batch-import_candidate">
            <zp-dynamicFormItem v-if="false" ref="form-item_jobId" :formItem="dialogForm.temp.jobId" name="jobId" :obj="dialogForm" />
            <zp-dynamicFormItem v-if="false" ref="form-item_companyId" :formItem="dialogForm.temp.companyId" name="companyId" :obj="dialogForm"
              @change="companyIdChange" />
            <zp-dynamicFormItem :formItem="dialogForm.temp.file" name="file" :obj="dialogForm">
              <template v-slot:custom_file>
                <zp-upload :limit="1" :autoUpload="true" :formModel.sync="dialogForm.ruleForm.file" :show-file-list="false" ref="upload-candidate"
                  style="width: 440px" />
                <zp-button type="text" @click="downloadTemp">
                  <i class="el-icon-download"></i>
                  下载模板
                </zp-button>
                <div class="upload-success-list">
                  <div class="upload-success-list-item" v-for="item in dialogForm.ruleForm.file.fileList" :key="item.uid">
                    <i class="el-icon-s-claim"></i>
                    <span class="file-name">{{
                      item.name.replace(/(.*\/)*([^.]+).*/gi, '$2')
                    }}</span>
                    <span class="file-suffix">.{{ item.name.replace(/.+\./, '') }}</span>
                    <div class="action-btn">
                      <zp-button type="text" @click="delItem(item)">
                        <i class="iconfont iconshanchu"></i>
                      </zp-button>
                    </div>
                  </div>
                </div>
              </template>
            </zp-dynamicFormItem>
          </div>
        </template>
      </zp-dynamicDialog>
    </template>
  </zp-page>
</template>
<script>
import { customDropdownAction } from '@/mixins/index'
import { formatDate, compileTime, userDownLoadImage } from '@/util/utils'

export default {
  name: 'deliveryIndex',
  mixins: [customDropdownAction],
  data () {
    return {
      idx: '', // q
      tableSelectedData: [],
      processId: '',
      channelList: [],
      isChangeProcess: false, // 是否点击 招聘流程下拉 框
      jobId: 0, // 新增时用到的职位ID
      dialogTip: {},
      isShowTabs: false, // 是否显示tabs
      summary: {}, // tabs 上的数字
      jobsMap: {},
      tabsMap: {},
      tabsIndex: {
        firstSieve: 1,
        interview: 2,
        cards: 3,
        trialOperation: 4,
        backTone: 5,
        offer: 6,
        entry: 7,
        out: 8
      },
      defaultTabs: {
        // 初选firstSieve,面试interview,办证cards,试工trialOperation,背调backTone,offer,入职entry,淘汰out
        1: { cname: 'screeningCnt', value: 'firstSieve', label: `初筛` },
        2: { cname: 'interviewCnt', value: 'interview', label: `面试` },
        3: { cname: 'certificatingCnt', value: 'cards', label: `办证` },
        4: { cname: 'probationCnt', value: 'trialOperation', label: `试工` },
        5: { cname: 'backgroundCheckCnt', value: 'backTone', label: `背调` },
        6: { cname: 'offerCnt', value: 'offer', label: `offer` },
        7: { cname: 'enrollmentCnt', value: 'entry', label: `入职` },
        8: { cname: 'eliminateCnt', value: 'out', label: `淘汰` }
      },
      tabs: [
        // 初选firstSieve,面试interview,办证cards,试工trialOperation,背调backTone,offer,入职entry,淘汰out
        // { type: 1, enabled: true, value: 'firstSieve', label: `初筛(${(this.summary && this.summary.screeningCnt) || 0})` },
        // { type: 2, enabled: true, value: 'interview', label: `面试(${(this.summary && this.summary.interviewCnt) || 0})` },
        // { type: 3, enabled: true, value: 'cards', label: `办证(${(this.summary && this.summary.certificatingCnt) || 0})` },
        // { type: 4, enabled: true, value: 'trialOperation', label: `试工(${(this.summary && this.summary.probationCnt) || 0})` },
        // { type: 5, enabled: true, value: 'backTone', label: `背调(${(this.summary && this.summary.backgroundCheckCnt) || 0})` },
        // { type: 6, enabled: true, value: 'offer', label: `offer(${(this.summary && this.summary.offerCnt) || 0})` },
        // { type: 7, enabled: true, value: 'entry', label: `入职(${(this.summary && this.summary.enrollmentCnt) || 0})` },
        // { type: 8, enabled: true, value: 'out', label: `淘汰(${(this.summary && this.summary.eliminateCnt) || 0})` }
      ],
      tagName: 'firstSieve', // tabs 默认选中的值
      tagNameCuttent: '', // 批量操作 --  默认选中当前的值
      tagNameNext: '', // 批量操作 --  默认选中下一个的值
      isShowMoreFrist: false, // btnList.length - 1 的第一项 -- 是否显示淘汰
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'job_applicant_list',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          searchModelLoad: true, // 不立即执行load方法
          searchModel: {
            isShowLabel: true, // 是否显示label
            inline: true,
            labelWidth: '82px', // label宽度
            temp: {
              processId: {
                formType: 'select',
                label: '招聘流程',
                placeholder: '请选择招聘流程',
                isShow: true,
                data: [],
                // clearable: false,
                popperAppendToBody: true,
                filterable: true,
                slot: 'custom'
              },
              name: {
                formType: 'input',
                label: '搜索',
                placeholder: '请输入候选人姓名、手机号',
                maxlength: 30,
                clearable: true,
                isShow: true
              },
              jobId: {
                formType: 'select',
                label: '职位',
                placeholder: '请选择职位',
                data: [],
                isShow: true,
                popperAppendToBody: true,
                filterable: true
              },
              companyId: {
                formType: 'select',
                label: '企业',
                placeholder: '请选择企业名称',
                data: [],
                isShow: true,
                popperAppendToBody: true,
                filterable: true
              },
              headUid: {
                formType: 'select',
                label: '负责人',
                placeholder: '请选择职位负责人',
                data: [],
                isShow: true,
                popperAppendToBody: true,
                filterable: true
              },
              cooperateUid: {
                formType: 'select',
                label: '协作人',
                placeholder: '请选择协作人',
                data: [],
                isShow: true,
                popperAppendToBody: true,
                filterable: true
              },
              recommender: { formType: 'input', label: '推荐人', placeholder: '请输入推荐人姓名、手机号', isShow: true, popperAppendToBody: true },
              createUids: { formType: 'select', label: '创建人', placeholder: '请选择创建人', isShow: true, popperAppendToBody: true, filterable: true, data: [], multiple: true, 'collapse-tags': true },
              channelType: {
                isShow: true,
                formType: 'custom',
                key: 'channelType',
                label: '投递渠道',
                placeholder: '请选择投递渠道',
                filterable: true,
                clearable: true,
                props: {
                  emitPath: true
                },
                data: []
              },
              statuses: {
                isShow: true,
                formType: 'custom',
                key: 'statuses',
                label: '候选人状态',
                placeholder: '请选择候选人状态',
                data: []
              },
              deliveryTime: {
                isShow: true,
                formType: 'datePick',
                label: '投递时间',
                placeholder: '请选择投递时间',
                prefixIcon: 'el-icon-date',
                type: 'daterange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间',
                rangeSeparator: '~',
                pickerOptions: {
                  shortcuts: [
                    {
                      text: '昨日',
                      onClick: (picker) => {
                        this.setDeliveryTime('1', picker)
                      }
                    },
                    {
                      text: '今日',
                      onClick: (picker) => {
                        this.setDeliveryTime('2', picker)
                      }
                    },
                    {
                      text: '上周',
                      onClick: (picker) => {
                        this.setDeliveryTime('3', picker)
                      }
                    },
                    {
                      text: '本周',
                      onClick: (picker) => {
                        this.setDeliveryTime('4', picker)
                      }
                    },
                    {
                      text: '上月',
                      onClick: (picker) => {
                        this.setDeliveryTime('5', picker)
                      }
                    },
                    {
                      text: '本月',
                      onClick: (picker) => {
                        this.setDeliveryTime('6', picker)
                      }
                    }
                  ]
                }
              }
            },
            ruleForm: {
              stageType: 1,
              processId: '',
              name: '',
              jobId: '',
              companyId: '',
              headUid: '',
              cooperateUid: '',
              channelType: [],
              recommender: '',
              createUids: [],
              statuses: [],
              deliveryTime: []
            }
          },
          tableObj: {
            operation: {
              operation_width: 180,
              operation_fixed: false
            },
            btnList: [
              { index: 6, text: '通过初筛', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 7, text: '邀请面试', isShow: this.setStateBtn, callback: this.eventBtn, target: 2 },
              { index: 8, text: '通过面试', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 9, text: '邀请办证', isShow: this.setStateBtn, callback: this.eventBtn, target: 3 },
              { index: 10, text: '代上传', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 11, text: '邀请试工', isShow: this.setStateBtn, callback: this.eventBtn, target: 4 },
              { index: 12, text: '审核通过', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 13, text: '审核失败', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 14, text: '通过试工', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 15, text: '发起背调', isShow: this.setStateBtn, callback: this.eventBtn, target: 5 },
              { index: 16, text: '通过背调', isShow: this.setStateBtn, callback: this.eventBtn },
              { index: 17, text: '发offer', isShow: this.setStateBtn, callback: this.eventBtn, target: 6 },
              { index: 18, text: '确认入职', isShow: this.setStateBtn, callback: this.eventBtn, target: 7 },
              {
                index: 3,
                text: '推进到',
                isText: true, // 点击文字下拉 --
                isShow: this.setStateBtn,
                callback: this.gotoCallback,
                visibleChange: this.gotoVisibleChange,
                list: [
                  { value: 7, target: 2, label: '面试', isShow: false },
                  { value: 9, target: 3, label: '办证', isShow: false },
                  { value: 11, target: 4, label: '试工', isShow: false },
                  { value: 15, target: 5, label: '背调', isShow: false },
                  { value: 17, target: 6, label: 'offer', isShow: false },
                  { value: 18, target: 7, label: '入职', isShow: false }
                ]
              },
              {
                index: 2,
                text: '编辑',
                isShow: this.setStateBtn,
                callback: this.eventBtn
              },
              // 新增加删除选项
              {
                index: 4,
                text: '删除',
                isShow: this.setStateBtn,
                callback: this.eventBtn
              },
              {
                index: 5,
                text: '淘汰',
                isShow: this.setStateBtn,
                callback: this.eventBtn,
                target: 8
              },
              {
                index: 1,
                icon: true, // 点击图按下拉 -- 更多操作
                isShow: this.setStateBtn,
                callback: this.gotoCallbackMore,
                list: [
                  // 面试已到面
                  {
                    value: 98,
                    label: '已到面',
                    isShow: (item) => {
                      return (
                        item.status === 21 ||
                        item.status === 22 ||
                        item.status === 26
                      )
                    }
                  },
                  // 试工已到面
                  {
                    value: 99,
                    label: '已到面',
                    isShow: (item) => {
                      return (
                        item.status === 41 ||
                        item.status === 42 ||
                        item.status === 46
                      )
                    }
                  },
                  /* {
                    value: 100,
                    label: '邀请试工',
                    isShow: (item) => {
                      return item.status === 31 || item.status === 35
                    }
                  }, */
                  {
                    value: 10,
                    label: '代上传',
                    isShow: (item) => {
                      return item.status === 31 || item.status === 35
                    }
                  },
                  {
                    value: 101,
                    label: '不通过',
                    isShow: (item) => {
                      return item.status === 11 || item.status === 12
                    }
                  }, // 未通过初筛
                  {
                    value: 102,
                    label: '不通过',
                    isShow: (item) => {
                      return (
                        item.status === 21 ||
                        item.status === 22 ||
                        item.status === 26 ||
                        item.status === 27
                      )
                    }
                  }, // 未通过面试
                  {
                    value: 103,
                    label: '审核失败',
                    isShow: (item) => {
                      return item.status === 32
                    }
                  }, // 待审核证件
                  {
                    value: 104,
                    label: '不通过',
                    isShow: (item) => {
                      return (
                        item.status === 41 ||
                        item.status === 42 ||
                        item.status === 46 ||
                        item.status === 47
                      )
                    }
                  }, // 未通过试工
                  {
                    value: 105,
                    label: '不通过',
                    isShow: (item) => {
                      return item.status === 51 || item.status === 54
                    }
                  }, // 未通过背调
                  { value: 5, label: '淘汰', isShow: true, target: 8 },
                  {
                    value: 2,
                    label: '编辑',
                    isShow: (item) => {
                      return (
                        _fn.checkBtn('job_applicant/update') &&
                        !(item.status === 51 || item.status === 54)
                      )
                    }
                  }

                  // { value: 100, label: '邀请试工', isShow: (item) => { return this.tagName === 'cards' && item.status === 31 } },
                  // { value: 101, label: '不通过', isShow: (item) => { return this.tagName === 'firstSieve' && (item.status === 11 || item.status === 12) } }, // 未通过初筛
                  // { value: 102, label: '不通过', isShow: (item) => { return this.tagName === 'interview' && (item.status === 21 || item.status === 22) } }, // 未通过面试
                  // { value: 103, label: '审核失败', isShow: (item) => { return this.tagName === 'cards' && item.status === 32 } }, // 待审核证件
                  // { value: 104, label: '不通过', isShow: (item) => { return this.tagName === 'trialOperation' && (item.status === 41 || item.status === 42) } }, // 未通过试工
                  // { value: 105, label: '不通过', isShow: (item) => { return this.tagName === 'backTone' && (item.status === 51 || item.status === 54) } }, // 未通过背调
                  // { value: 5, label: '淘汰', isShow: true, target: 8 },
                  // { value: 2, label: '编辑', isShow: (item) => { return !(this.tagName === 'backTone' && (item.status === 51 || item.status === 54)) } }
                ]
              }
            ],
            fields: [
              // { key: 'name', label: '候选人姓名', customMode: true, width: 150, fixed: true },
              // { key: 'phone', label: '手机号', customMode: true, width: 180 },
              // { key: 'position', label: '应聘职位', width: 200, customMode: true },
              // {
              //   key: 'addressWanted',
              //   label: '期望工作地址',
              //   width: 200,
              //   customMode: (row, column, cellValue, i) => {
              //     if (row.adjustabled) {
              //       return '接受调剂门店'
              //     }
              //     const list = row.addressWanted
              //     if (!list || !list.length) {
              //       return '--'
              //     }
              //     const len = list.length
              //     return list.reduce((total, item, index) => {
              //       return total + item.name + (index === len - 1 ? '' : '、')
              //     }, '')
              //   }
              // },
              // { key: 'company', label: '所属企业', width: 200, customMode: true },
              // { key: 'status', label: '状态', width: 120, customMode: (row, column, cellValue, i) => this.setSatuts(row, column, cellValue, i) },
              // {
              //   key: 'deliveryChannelType',
              //   label: '投递渠道',
              //   customMode: (row, column, cellValue, i) => {
              //     const deliveryChannelTypeGroup = this.channelList.filter(item => item.id === row.deliveryChannelType)
              //     if (deliveryChannelTypeGroup.length) {
              //       return deliveryChannelTypeGroup[0].name
              //     }
              //     return _var._deliveryChannelType__global(row.sourceChannelType) || '--'
              //   },
              //   width: 150
              // },
              // { key: 'createor', label: '负责人', customMode: true, width: 120 },
              // { key: 'recommender', label: '推荐人', customMode: true, width: 120 }
            ]
          }
        }
      }),
      // 入职编辑按钮相应内容
      entryDialog: {
        name: 'form',
        show: false,
        dialogWidth: '1000px',
        title: '编辑入职信息',
        isShowLabel: true,
        dialogFormCenter: true,
        callback: this.entryWrite,
        temp: {
          content: '',
          jobTime: {
            isShow: true,
            label: '入职时间',
            formType: 'datetime',
            'value-format': 'yyyy/MM/dd HH:mm:ss',
            format: 'yyyy-MM-dd HH:mm:ss',
            data: ''
          },
          companyAddress: {
            isShow: true,
            label: '入职地址',
            formType: 'select',
            data: ''
          }
        },
        ruleForm: {
          jobTime: '',
          companyAddress: '',
          id: ''
        },
        rules: {
          jobTime: [
            {
              required: true,
              message: '请选择'
            }
          ],
          companyAddress: [
            {
              required: true,
              message: '请选择'
            }
          ]
        }
      },
      // 批量导入候选人
      dialogForm: {
        name: 'form',
        show: false,
        dialogWidth: '1000px',
        title: '批量导入候选人',
        isShowLabel: true,
        dialogFormCenter: true,
        callback: this.importSubmit,
        temp: {
          jobId: {
            isShow: true,
            label: '应聘职位',
            formType: 'select',
            data: []
          },
          companyId: {
            isShow: true,
            label: '所属企业',
            formType: 'select',
            data: []
          },
          file: {
            isShow: true,
            label: '上传文件',
            formType: 'custom',
            key: 'file'
          }
        },
        ruleForm: {
          jobId: '',
          companyId: '',
          file: {
            fileList: []
          }
        },
        rules: {
          jobId: [
            {
              required: true,
              message: '请选择应聘职位'
            }
          ],
          companyId: [
            {
              required: true,
              message: '请选择所属企业'
            }
          ],
          file: {
            type: 'object',
            required: true,
            trigger: 'change',
            fields: {
              fileList: {
                type: 'array',
                required: true,
                message: '请选择文件',
                trigger: 'change'
              }
            }
          }
        }
      },
      fields: {
        // 1、投递列表所有列表增加候选人手机号的字段显示；
        // 2、面试列表额外增加：面试地址、面试时间的显示（数据取自邀请面试中的配置内容），取消申请时间的显示；
        // 3、试工列表额外增加：试工地址、试工时间的显示（数据取自邀请试工中的配置内容），取消申请时间的显示；
        // 4、offer列表额外增加：offer城市、offer地址、offer报到时间的显示（数据取自发送offer中的配置内容）取消申请时间的显示；
        // 5、入职列表额外增加：入职城市、入职地址、入职时间的显示（数据取自发送offer中的配置内容，），取消申请时间的显示；
        // 6、淘汰列表中的申请时间替换成“淘汰时间”，取操作确认淘汰的时间戳
        1: [
          {
            key: 'createTime',
            label: '申请时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          }
        ],
        2: [
          { key: 'interviewAddress', label: '面试地址', width: 300 },
          {
            key: 'interviewTime',
            label: '面试时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          }
        ],
        4: [
          { key: 'probationAddress', label: '试工地址', width: 300 },
          {
            key: 'probationTime',
            label: '试工时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          }
        ],
        6: [
          { key: 'offerCity', label: 'offer城市', width: 120 },
          { key: 'offerAddress', label: 'offer地址', width: 320 },
          {
            key: 'offerTime',
            label: 'offer报到时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          }
        ],
        7: [
          { key: 'enrollmentCity', label: '入职城市', width: 120 },
          { key: 'enrollmentAddress', label: '入职地址', width: 300 },
          {
            key: 'enrollmentTime',
            label: '入职时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          }
        ],
        8: [
          {
            key: 'createTime',
            label: '淘汰时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 120
          }
        ],
        99: [
          {
            key: 'createTime',
            label: '申请时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          },
          { key: 'interviewAddress', label: '面试地址', width: 300 },
          {
            key: 'interviewTime',
            label: '面试时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          },
          { key: 'probationAddress', label: '试工地址', width: 300 },
          {
            key: 'probationTime',
            label: '试工时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          },
          { key: 'offerCity', label: 'offer城市', width: 120 },
          { key: 'offerAddress', label: 'offer地址', width: 300 },
          {
            key: 'offerTime',
            label: 'offer报到时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          },
          { key: 'enrollmentCity', label: '入职城市', width: 120 },
          { key: 'enrollmentAddress', label: '入职地址', width: 300 },
          {
            key: 'enrollmentTime',
            label: '入职时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 150
          },
          { key: 'createUsername', label: '创建人', width: 120 }
        ]
      },
      // 候选人状态
      statusesDropdownVisiblie: false,
      statusesDropdowMenu: [],
      prevSelection: []
    }
  },
  created () {
    // 查询候选人状态下拉列表
    _api.job_applicant_public_show_stage_statuses({}).then((res) => {
      this.obj.searchModel.temp.statuses.data = res.data.map((item) => {
        return {
          label: item.name,
          value: item.code,
          children: item.processStatusVos.map((c) => {
            return {
              label: c.name,
              value: c.code
            }
          })
        }
      })
    })
    _fn.getDeliveryChannelList(
      (data, sourceData) => {
        this.obj.searchModel.temp.channelType.data = data
        this.channelList = sourceData
      },
      {},
      true,
      false
    )
    _fn.getAllCompony(
      (data) => {
        this.obj.searchModel.temp.companyId.data = data
      },
      {},
      true
    ) // 企业
    _fn.getRealNameList(
      (data) => {
        const list = data.map((item) => ({
          label: item.realName,
          value: item.id
        }))
        this.obj.searchModel.temp.headUid.data = list
        this.obj.searchModel.temp.cooperateUid.data = list
        this.obj.searchModel.temp.createUids.data = list
      },
      {},
      false
    ) // 负责人/协作人
    _fn.getPositionList(
      (data) => {
        // 在招职位
        let map = {}
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            map[data[i].value] = data[i].obj
          }
        }
        this.jobsMap = map
        this.obj.searchModel.temp.jobId.data = data
        // 批量导入候选人
        this.allJobIdData = data
        this.dialogForm.temp.jobId.data = data.map((item) => {
          return {
            ...item,
            disabled: item.obj.state !== 1
          }
        })
        const list = data.map((item) => {
          return {
            label: item.obj.companyName || 'null',
            value: item.obj.companyId
          }
        })
        const arr = list.reduce((total, item) => {
          const flag = total.some((c) => c.value === item.value)
          if (!flag) {
            total.push(item)
          }
          return total
        }, [])
        this.dialogForm.temp.companyId.data = arr
        this.$nextTick(() => {
          // 消息列表跳转过来的
          let jobId = this.$route.query.jobId
          if (jobId) {
            this.obj.searchModel.ruleForm.jobId = jobId
            this.jobsChange(jobId)
          }
        })
      },
      {},
      true
    )
    // 获取地址列表 address_public_job_addresses
    // _fn.getAddress(res => {
    //   console.log(res, "++++++++获取地址列表+++++++")
    //   this.entryDialog.temp.companyAddress.data = res
    // }, {}, true)
    console.info(' created ----------- ')
    // 入职编辑选择时间及地址
  },
  computed: {
    batchActionBtnDisabled () {
      return !!this.tableSelectedData.length
    }
  },
  watch: {
    'dialogForm.ruleForm.jobId' (val) {
      if (!val) {
        return
      }
      this.$nextTick(function () {
        const el = this.$refs['form-item_jobId'].$el.getElementsByClassName(
          'el-input__inner'
        )[0]
        el.blur()
      })
      const { data } = this.dialogForm.temp.jobId
      const job = data.filter((item) => item.value === val)
      const companyId = job[0].obj.companyId
      this.dialogForm.ruleForm.companyId = companyId
    },
    'dialogForm.ruleForm.companyId' (val) {
      if (!val) {
        return
      }
      this.$nextTick(function () {
        const el = this.$refs['form-item_companyId'].$el.getElementsByClassName(
          'el-input__inner'
        )[0]
        el.blur()
      })
    }
  },
  mounted () {
    console.log(this.obj.tableObj, '---------this.obj.tableObj----初始化--')
    _fn.getProcessTemplate((data) => {
      // 招聘流程
      let map = {}
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          map[data[i].value] = data[i].obj.stages // tabs
        }
      }
      this.tabsMap = map
      this.obj.searchModel.temp.processId.data = data

      let keepAlive = this.getKeepAlive()
      if (keepAlive && _fn.isObject(keepAlive.obj)) {
        this.isShowTabs = true
        this.processId = keepAlive.processId
        let form = keepAlive.obj.searchModel.ruleForm
        if (form.stageType) {
          this.tagName = this.defaultTabs[form.stageType].value
        }
        // this.obj = _fn.extend(true, {}, keepAlive.obj)
        this.obj.searchModel.ruleForm = form
        this.obj.tableObj.pager.pageNo = keepAlive.pageNo
        console.info(' keepAlive ----------- ', this.obj)
      }
      this.$nextTick(() => {
        // 首页跳转过来的
        let pageStatuses = this.$route.query.statuses
        let headUid = this.$route.query.headUid
        let faceViewDateTime = this.$route.query.faceViewDateTime // 面试邀约时间
        let offerDateTime = this.$route.query.offerDateTime // offer时间
        let source = this.$route.query.source || 0 // "来源 0-默认，1-工作台"
        if (pageStatuses) {
          try {
            this.obj.searchModel.ruleForm.statuses = JSON.parse(pageStatuses)
          } catch (e) {
            this.obj.searchModel.ruleForm.statuses = []
          }
        }
        if (headUid) {
          this.obj.searchModel.ruleForm.headUid = headUid
        }
        if (faceViewDateTime) {
          this.obj.searchModel.ruleForm.faceViewDateTime = faceViewDateTime
        }
        if (offerDateTime) {
          this.obj.searchModel.ruleForm.offerDateTime = offerDateTime
        }
        this.obj.searchModel.ruleForm.source = source
        this.query()
      })
      console.info('1111111111111', this.$route.query.statuses)
    }, {}, true) // 招聘流程
  },
  methods: {
    setDynamicColumn (val) {
      let temp = [
        {
          key: 'name',
          label: '候选人姓名',
          customMode: true,
          width: 150,
          fixed: true
        },
        { key: 'phone', label: '手机号', customMode: true, width: 180 },
        { key: 'position', label: '应聘职位', width: 200, customMode: true },
        {
          key: 'addressWanted',
          label: '期望工作地址',
          width: 200,
          customMode: (row, column, cellValue, i) => {
            if (row.adjustabled) {
              return '接受调剂门店'
            }
            const list = row.addressWanted
            if (!list || !list.length) {
              return '--'
            }
            const len = list.length
            return list.reduce((total, item, index) => {
              return total + item.name + (index === len - 1 ? '' : '、')
            }, '')
          }
        },
        {
          key: 'partJobTime',
          label: '可兼职时间',
          width: 150,
          customMode: (row, column, cellValue, i) => {
            if (row.adjustTime) {
              return '接受调剂时间'
            }
            const list = row.partJobTime
            if (!list || !list.length) {
              return '--'
            }
            const len = list.length
            return list.reduce((total, item, index) => {
              return total + item + (index === len - 1 ? '' : '、')
            }, '')
          }
        },
        { key: 'createor', label: '负责人', customMode: true, width: 120 },
        {
          key: 'cooperateUsers',
          label: '协作人',
          customMode: (row) => {
            const cooperateUsers = row.job.cooperateUsers || []
            const len = cooperateUsers.length
            if (!len) {
              return '--'
            }
            return cooperateUsers.reduce((total, item, index, arr) => {
              return total + item.realName + (index < len - 1 ? '、' : '')
            }, '')
          },
          width: 120
        },
        {
          key: 'recommender',
          label: '推荐人',
          custom: (row) => row.recommender || '--',
          width: 120
        },
        {
          key: 'status',
          label: '状态',
          width: 120,
          customMode: (row, column, cellValue, i) =>
            this.setSatuts(row, column, cellValue, i)
        },
        {
          key: 'deliveryChannelType',
          label: '投递渠道',
          customMode: (row, column, cellValue, i) => {
            const deliveryChannelTypeGroup = this.channelList.filter(
              (item) => item.id === row.deliveryChannelType
            )
            if (deliveryChannelTypeGroup.length) {
              return deliveryChannelTypeGroup[0].name
            }
            return (
              _var._deliveryChannelType__global(row.deliveryChannelType) || '--'
            )
          },
          width: 150
        },
        { key: 'company', label: '所属企业', width: 200, customMode: true }
      ]
      let rows = this.fields[val]
      if (rows && rows.length) {
        temp = temp.concat(rows)
      } else {
        temp = temp.concat([
          {
            key: 'createTime',
            label: '申请时间',
            formatter: this._tcolFormat.formatterMinute,
            width: 120
          }
        ])
      }
      this.obj.tableObj.fields = _fn.extend({}, temp)
      console.info('表格选中的数据fields', this.obj.tableObj.fields)
    },
    // 表格选中的数据
    handleSelectionChange (data) {
      this.tableSelectedData = data
    },
    allExprotSubmit () {
      // 导出
      let obj = this.$refs['tableObj'].getSelected()
      _fn.downLoad(
        'job_applicant_export_applicant',
        { jobApplicantIdList: obj.idx },
        '职位投递列表' +
        formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss')
      )
      console.info('下载职位投递列表')
    },
    getKeepAlive () {
      return this.$store.state.keep_alive.keepAlive
    },
    goto (name, param, isFlag = true) {
      if (isFlag) {
        // this.$store.dispatch('keep_alive/setKeepAlive', { obj: this.obj, processId: this.processId })
        this.$store.dispatch('keep_alive/setKeepAlive', {
          obj: this.obj,
          pageNo: this.obj.tableObj.pager.pageNo,
          processId: this.processId
        })
      }
      _fn.toLocation({ name: name, params: param }) // -> /user/123
    },
    toSee (row) {
      this.goto('deliveryDetail', { id: row.id })
    },
    // 候选人状态父级菜单单选
    statusesChangeHandle (selection) {
      const { statuses } = this.obj.searchModel.ruleForm
      function setMap (list) {
        let mapkey = {}
        list.forEach((item) => {
          if (!mapkey[item[0]]) {
            mapkey[item[0]] = [item]
          } else {
            mapkey[item[0]].push(item)
          }
        })
        return mapkey
      }
      if (!this.prevSelection.length) {
        this.obj.searchModel.ruleForm.statuses = selection
      } else {
        let sourceMap = setMap(statuses)
        let prevMap = setMap(this.prevSelection)
        for (let key in sourceMap) {
          if (!prevMap[key]) {
            this.obj.searchModel.ruleForm.statuses = sourceMap[key]
          }
        }
      }
      this.prevSelection = this.obj.searchModel.ruleForm.statuses
      this.$refs.page.load()
    },
    setDeliveryTime (type, picker) {
      const end = new Date()
      const start = new Date()
      if (type === '1') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
      }
      if (type === '2') {
      }
      if (type === '3') {
        start.setTime(this.getLastWeek()[0])
        end.setTime(this.getLastWeek()[1])
      }
      if (type === '4') {
        start.setTime(this.getThisWeek()[0])
        end.setTime(this.getThisWeek()[1])
      }
      if (type === '5') {
        start.setTime(this.getLastMonth()[0])
        end.setTime(this.getLastMonth()[1])
      }
      if (type === '6') {
        start.setTime(this.getThisMonth()[0])
        end.setTime(this.getThisMonth()[1])
      }
      picker.$emit('pick', [start, end])
    },
    getThisMonth () {
      const currentDate = new Date()
      const startStop = []
      // 一天的毫秒数
      const millisecond = 1000 * 60 * 60 * 24
      // 获得当前月份0-11
      let currentMonth = currentDate.getMonth()
      // 获得当前年份4位年
      let currentYear = currentDate.getFullYear()
      // 求出本月第一天
      const firstDay = new Date(currentYear, currentMonth, 1)
      // 当为12月的时候年份需要加1
      // 月份需要更新为0 也就是下一年的第一个月
      // 否则只是月份增加,以便求的下一月的第一天
      if (currentMonth === 11) {
        currentYear++
        currentMonth = 0
      } else {
        currentMonth++
      }
      // 下月的第一天
      const nextMonthDayOne = new Date(currentYear, currentMonth, 1)
      // 求出上月的最后一天
      const lastDay = new Date(nextMonthDayOne.getTime() - millisecond)
      startStop.push(firstDay)
      startStop.push(lastDay)
      return startStop
    },
    getLastMonth () {
      const currentDate = new Date()
      const startStop = []
      // 一天的毫秒数
      const millisecond = 1000 * 60 * 60 * 24
      // 获得当前月份0-11
      let currentMonth = currentDate.getMonth()
      // 获得当前年份4位年
      let currentYear = currentDate.getFullYear()
      const currentDay = new Date(currentYear, currentMonth, 1)
      // 上个月的第一天
      // 年份为0代表,是本年的第一月,所以不能减
      if (currentMonth === 0) {
        currentMonth = 11 // 月份为上年的最后月份
        currentYear-- // 年份减1
      } else {
        currentMonth--
      }
      const firstDay = new Date(currentYear, currentMonth, 1)
      // 求出上月的最后一天
      const lastDay = new Date(currentDay.getTime() - millisecond)
      startStop.push(firstDay)
      startStop.push(lastDay)
      return startStop
    },
    getThisWeek () {
      const currentDate = new Date()
      const startStop = []
      // 一天的毫秒数
      const millisecond = 1000 * 60 * 60 * 24
      // 返回date是一周中的某一天
      const week = currentDate.getDay()
      // 减去的天数
      const minusDay = week + 1
      // 上周 周六
      const monday = new Date(currentDate.getTime() - minusDay * millisecond)
      // 本周 周五
      const sunday = new Date(monday.getTime() + 6 * millisecond)
      // 添加本周时间
      startStop.push(monday) // 本周起始时间
      // 添加本周最后一天时间
      startStop.push(sunday) // 本周终止时间
      return startStop
    },
    getLastWeek () {
      const currentDate = new Date()
      let startStop = []
      // 一天的毫秒数
      const millisecond = 1000 * 60 * 60 * 24
      // 返回date是一周中的某一天
      const week = currentDate.getDay()
      // 减去的天数
      const minusDay = week + 1
      // 获得当前周的第一天
      const currentWeekDayOne = new Date(
        currentDate.getTime() - millisecond * minusDay
      )
      // 上周最后一天即本周开始的前一天
      const priorWeekLastDay = new Date(
        currentWeekDayOne.getTime() - millisecond
      )
      // 上周的第一天
      const priorWeekFirstDay = new Date(
        priorWeekLastDay.getTime() - millisecond * 6
      )
      startStop.push(priorWeekFirstDay)
      startStop.push(priorWeekLastDay)
      return startStop
    },
    query () {
      this.$refs.page.load()
    },
    loadBefor (data, flag) {
      let t = data.queryParam || {}
      if (!this.isChangeProcess && t) {
        // 点击了流程切换
        if (!t.processId) {
          delete t.stageType
        }
      }
      const channelType = t.channelType
      const deliveryTime = t.deliveryTime
      const statuses = t.statuses
      const len = channelType.length
      const deliveryTimeLen = deliveryTime && deliveryTime.length
      const statusesLen = statuses.length
      t.channelType = len ? channelType[len - 1] : ''
      t.startTime = deliveryTimeLen ? deliveryTime[0] : ''
      t.endTime = deliveryTimeLen ? deliveryTime[1] : ''
      t.statuses = statusesLen ? statuses.map((item) => { return item[1] }) : []
      delete t.deliveryTime
      this.isChangeProcess = false
      return data
    },
    loadAfter (data, fn) {
      const { processId, name, statuses } = this.obj.searchModel.ruleForm
      const tableData = this.setGoTo(data.list)
      const len = tableData.length
      const tagName = this.tagName
      let isShow = false
      this.statusesDropdownVisiblie = false
      if (processId) {
        isShow = true
        this.tagName = tagName
        this.setDynamicColumn(this.tabsIndex[tagName])
        // 批量操作按钮
        if (len) {
          const row = tableData[0]
          this.tagNameCuttent = row.stage
          console.info('this.tagNameCuttent', this.tagNameCuttent)
          let r = row.tabs
          if (r) {
            let nextMap = {}
            let r1 = r.filter((m) => {
              return m.enabled === true
            })
            r1.map((m, i) => {
              if (m.enabled && m.type === this.tagNameCuttent) {
                let n = r1[i + 1]
                n && (nextMap[n.type] = true)
              }
            })
            this.tagNameNext = nextMap
          }
          console.info('this.tagNameNext', this.tagNameNext)
        }
      } else {
        if (name) {
          // 查询出来的数据的招聘流程是否一致
          const obj = {}
          for (let i = 0; i < len; i++) {
            const item = tableData[i]
            if (obj[item.processTemplateId]) {
              obj[item.processTemplateId].push(item)
            } else {
              obj[item.processTemplateId] = [item]
            }
          }
          const processTemplateIdGroup = Object.keys(obj)
          const processTemplateIdGroupLen = processTemplateIdGroup.length
          if (processTemplateIdGroupLen > 1) {
            isShow = false
          } else {
            isShow = true
            this.tagName = tagName
          }
        }
        if (statuses.length) {
          // 针对候选人状态筛选 -- 处理批量操作按钮
          const batchFall = { label: '批量淘汰', value: '5' }
          const batchExport = { label: '批量导出', value: '-99' }
          const batchPassedInterview = { label: '批量通过面试', value: '8' }
          const batchPassedCertificate = { label: '批量通过办证', value: '12' }
          const batchPassedWorktrial = { label: '批量通过试工', value: '14' }
          const batchPassedEntry = { label: '批量入职', value: '18' }

          // 各状态对应的批量按钮组
          const mapKey = {
            11: [{ label: '批量已查看', value: '97' }], // 未查看
            12: [{ label: '批量通过初筛', value: '6' }, batchFall, batchExport], // 已查看
            13: [batchExport], // 通过初筛
            14: [batchFall, batchExport], // 未通过初筛
            20: [{ label: '批量邀请面试', value: '7' }, batchFall, batchExport], // 待邀请面试
            21: [batchPassedInterview, batchFall, batchExport], // 已邀请面试
            22: [batchPassedInterview, batchFall, batchExport], // 待面试
            23: [batchFall, batchExport], // 拒绝面试
            24: [batchPassedInterview, batchFall, batchExport], // 已到面
            25: [batchFall, batchExport], // 未通过面试   
            26: [batchPassedInterview, batchFall, batchExport], // 已查看面试邀请
            27: [batchExport], // 通过面试
            30: [{ label: '批量邀请办证', value: '9' }, batchFall, batchExport], // 待邀请办证
            31: [batchPassedCertificate, batchFall, batchExport], // 已邀请办证
            32: [batchPassedCertificate, batchFall, batchExport], // 待审核证件
            33: [batchExport], // 通过办证
            34: [batchFall, batchExport], // 未通过办证
            35: [batchPassedCertificate, batchFall, batchExport], // 已查看办证邀请
            40: [{ label: '批量邀请试工', value: '11' }, batchFall, batchExport], // 待邀请试工
            41: [batchPassedWorktrial, batchFall, batchExport], // 已邀请试工
            42: [batchPassedWorktrial, batchFall, batchExport], // 待试工
            43: [batchFall, batchExport], // 拒绝试工
            44: [batchExport], // 通过试工
            45: [batchFall, batchExport], // 未通过试工
            46: [batchPassedWorktrial, batchFall, batchExport], // 已查看试工邀请
            47: [batchPassedWorktrial, batchFall, batchExport], // 已到面试工
            50: [{ label: '批量发起背调', value: '15' }, batchFall, batchExport], // 待发起背调
            51: [batchFall, batchExport], // 背调中
            52: [batchFall, batchExport], // 拒绝背调
            53: [batchExport], // 通过背调
            54: [{ label: '批量发起背调', value: '16' }, batchFall, batchExport], // 背调异常
            55: [batchFall, batchExport], // 未通过背调
            56: [batchFall, batchExport], // 背调发起中
            60: [{ label: '批量发offer', value: '17' }, batchFall, batchExport], // 待发offer
            61: [batchPassedEntry, batchFall, batchExport], // 已发offer
            62: [batchPassedEntry, batchExport], // 待入职
            63: [batchFall, batchExport], // 拒绝offer
            64: [batchPassedEntry, batchFall, batchExport], // 已查看offer
            71: [batchExport], // 已入职
            72: [batchExport], // 入职中
            81: [batchExport]// 已淘汰
          }
          const list = statuses.reduce((total, item) => {
            total.push(...mapKey[item[1]])
            return total
          }, [])
          console.log('list---', list)
          const obj = {}
          const objList = []
          list.forEach((item) => {
            if (obj[item.value]) {
              obj[item.value] += 1
              for (let i = 0, length = objList.length; i < len; i++) {
                if (objList[i].key === item.value) {
                  objList[i].count = obj[item.value]
                  break
                }
              }
            } else {
              obj[item.value] = 1
              objList.push({
                key: item.value,
                count: 1,
                obj: item
              })
            }
          })
          console.log('obj---', obj)
          console.log('objList---', objList)
          const max = Math.max.apply(
            null,
            objList.map((item) => item.count)
          )
          console.log('max---', max)
          const keys = objList.filter((item) => item.count === max)
          console.log('keys---', keys)
          this.statusesDropdowMenu = keys.map((item) => item.obj)
          this.statusesDropdownVisiblie = true
        }
        this.setDynamicColumn(isShow ? this.tabsIndex[tagName] : 99)
      }
      const ops = this.obj.tableObj.operation
      ops.operation_width = 180
      ops.operation = true
      console.log(this.tagName, '+++++++this.tagName++++++++')
      if (this.tagName === 'entry') {
        // 入职
        ops.operation_width = 100
        // ops.operation = false;//入职栏也要操作
      } else if (this.tagName === 'out') {
        // 淘汰
        ops.operation_width = 100
      }
      this.setTabsNumber(null, isShow)
      fn && fn(tableData)
    },
    setTabsIsShow (data) {
      // 是否显示tabs
      let map = {}
      let map2 = {}
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let t = data[i]
          map2[t.stage] = map[t.processTemplateId] = t.stage
        }
      }
      return { map, map2 }
    },
    gotoVisibleChange (value, row, item) {
      const sourceData = [
        { value: 7, target: 2, label: '面试', isShow: false },
        { value: 9, target: 3, label: '办证', isShow: false },
        { value: 11, target: 4, label: '试工', isShow: false },
        { value: 15, target: 5, label: '背调', isShow: false },
        { value: 17, target: 6, label: 'offer', isShow: false },
        { value: 18, target: 7, label: '入职', isShow: false }
      ]
      let list = []
      if (row.processStages) {
        row.processStages.forEach((item) => {
          sourceData.forEach((c) => {
            if (item.type === c.target) {
              list.push({
                label: item.name === '已入职' ? '入职' : item.name,
                target: item.type,
                value: c.value,
                isShow: item.enabled
              })
            }
          })
        })
      }
      item.list = list
    },
    setGoTo (data) {
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let t = data[i]
          let tabs = this.tabsMap[t.processTemplateId] // 流程存在
          if (tabs) {
            tabs.map((item, index) => {
              item.sort_ = index
            })
            t.tabs = tabs
          }
        }
      }
      return data
    },
    resetAfter (data, fn) {
      this.obj.searchModel.ruleForm = {
        stageType: '',
        processId: '',
        name: '',
        jobId: '',
        companyId: '',
        headUid: '',
        cooperateUid: '',
        channelType: [],
        statuses: [],
        deliveryTime: []
      }
      this.processId = ''
      this.isChangeProcess = false
      this.isShowTabs = false
      this.obj.tableObj.pager.pageNo = 1
      this.tagName = 'firstSieve'
      this.query()
    },
    setTabsNumber (fn, isShow) {
      // tabs 上的数字
      let param = JSON.parse(
        JSON.stringify({ queryParam: this.obj.searchModel.ruleForm })
      )
      delete param.queryParam.stageType
      let o = this.obj.tableObj
      const channelType = param.queryParam.channelType
      const deliveryTime = param.queryParam.deliveryTime
      const statuses = param.queryParam.statuses
      const len = channelType.length
      const deliveryTimeLen = deliveryTime && deliveryTime.length
      const statusesLen = statuses.length
      param.queryParam.channelType = len ? channelType[len - 1] : ''
      param.queryParam.statuses = statusesLen
        ? statuses.map((item) => {
          return item[1]
        })
        : []
      param.queryParam.startTime = deliveryTimeLen ? deliveryTime[0] : ''
      param.queryParam.endTime = deliveryTimeLen ? deliveryTime[1] : ''
      delete param.queryParam.deliveryTime

      param.pageReq = {
        page: o.pager.pageNo,
        size: o.pager.pageSize
      }
      _api.job_applicant_public_count(param).then((res) => {
        this.summary = res.data
        this.$nextTick(() => {
          this.getTabsCount(fn, isShow)
        })
      })
    },
    getTabsCount (fn, isShow) {
      let val = this.processId
      let show = false

      console.info('getTabsCount ++++++++++++++++', val)
      let self = this
      let array = self.tabsMap[val]
      let tabs = JSON.parse(JSON.stringify(self.defaultTabs))
      let arr = []
      if (array && array.length) {
        for (let i = 0; i < array.length; i++) {
          let o = array[i]
          let obj = tabs[o.type]
          if (obj) {
            obj.enabled = o.enabled
            obj.type = o.type
            obj.name = o.name
            obj.label =
              o.name.replace('已入职', '入职') +
              `(` +
              self.summary[obj.cname] +
              `)`
            if (obj.enabled) {
              arr.push(obj)
            }
          }
        }
        arr.push({
          type: 8,
          enabled: true,
          value: 'out',
          label: `淘汰(` + self.summary.eliminateCnt + `)`
        })
        self.tabs = arr
        show = true
      } else {
        self.tabs = []
        show = false
      }
      this.isShowTabs = isShow && show
      this.$nextTick(() => {
        this.$refs.tabsCustom && this.$refs.tabsCustom.refresh()
        window.onresize && window.onresize()
        fn && fn()
      })
    },
    handleClick (value, type) {
      // tabs 切换
      if (!value) return
      this.tagName = value
      if (type === 'noPage') {
        this.obj.searchModel.ruleForm.stageType = ''
      } else {
        this.obj.tableObj.pager.pageNo = 1
        console.log(this.obj.tableObj, '++++传给table+++++')
        this.obj.searchModel.ruleForm.stageType = this.tabsIndex[value]
      }
      this.isChangeProcess = true
      this.setDynamicColumn(this.tabsIndex[value])
      this.$nextTick(() => {
        this.query()
      })
    },
    zplineChange (val, type) {
      // process 切换
      this.processId = val
      this.tagName = 'firstSieve'
      this.obj.searchModel.ruleForm.stageType = 1
      this.query()
    },
    jobsChange (val) {
      let v = this.jobsMap[val]
      if (v) {
        this.obj.searchModel.ruleForm.processId = v.processTemplateId || 1
        this.processId = this.obj.searchModel.ruleForm.processId
        this.tagName = 'firstSieve'
        this.obj.searchModel.ruleForm.stageType = 1
        this.query()
      }
    },
    // 入职编辑
    entryWrite () {
      const { companyAddress, jobTime, id } = this.entryDialog.ruleForm
      let str = formatDate(new Date(jobTime), 'yyyy/MM/dd HH:mm:ss')
      // let str = jobTime.replace(/-/g, '/');
      // if (new Date(str) < new Date()) {
      //   _fn.message("入职时间不可小于当前时间", { type: "error" });
      //   return
      // }
      let params = {
        id: id,
        entryDate: str,
        addressId: companyAddress.toString()
      }

      this._api.job_entry_write(params).then((res) => {
        if (res.code === 0) {
          this.entryDialog.show = false
          this.query()// 修改成功--弹窗隐藏，刷新页面
        }
      })
    },
    // 入职编辑--
    entryWriteAgain () {
      let { companyAddress, jobTime, id, row, o } = this.entryDialog.ruleForm
      o.companyAddress = companyAddress
      o.jobTime = compileTime(jobTime)
      // new Date(jobTime).getTime().toString()
      // if (new Date(jobTime) < new Date()) {
      //   _fn.message("入职时间不可小于当前时间", { type: "error" });
      //   return
      // }
      this.entryDialog.show = false
      this.checkDieOut(this.idx, (ret) => {
        // this.setndDeliveryOperation(row, o);
        _fn.deliveryChange(row, o, (res) => {
          this.tips(this.idx, ret.data, () => {
            this.setTabsNumber()
            this.query()
          })
        })
        // 候选人XXX、XXXX、XXX已在人才库中，是否更新人才库信息？
      })
    },
    getNames (cellValue) {
      let fn1 = _var['firstSieve__global'](cellValue)
      let fn2 = _var['interview__global'](cellValue)
      let fn3 = _var['cards__global'](cellValue)
      let fn4 = _var['trialOperation__global'](cellValue)
      let fn5 = _var['backTone__global'](cellValue)
      let fn6 = _var['offer__global'](cellValue)
      let name = ''
      if (fn1) {
        name = 'firstSieve'
      } else if (fn2) {
        name = 'interview'
      } else if (fn3) {
        name = 'cards'
      } else if (fn4) {
        name = 'trialOperation'
      } else if (fn5) {
        name = 'backTone'
      } else if (fn6) {
        name = 'offer'
      }
      if (cellValue === 71 || cellValue === 81) {
        name = cellValue === 71 ? 'entry' : 'out'
      }
      return name
    },
    setSatuts (row, column, cellValue, i) {
      return _fn.getStateStr(
        row,
        column,
        cellValue,
        i,
        this.getNames(cellValue)
      )
    },
    // 批量添加候选人start
    commandCandidateHandle (val) {
      switch (val) {
        case '1':
          this.goto('deliveryEdit', { id: '0' }, false)
          break
        default:
          this.dialogForm.show = true
          break
      }
    },
    companyIdChange (id) {
      const arr = id
        ? this.allJobIdData
          .filter((item) => item.obj.companyId === id)
          .map((item) => {
            return {
              ...item,
              disabled: item.obj.state !== 1
            }
          })
        : this.allJobIdData.slice().map((item) => {
          return {
            ...item,
            disabled: item.obj.state !== 1
          }
        })
      this.dialogForm.ruleForm.jobId = ''
      this.dialogForm.temp.jobId.data = arr
    },
    // 下载模板
    downloadTemp () { // 暂时去掉职位和所属企业
      const arr = []
      this.$refs.dynamicDialog.$refs.form.validateField(
        ['jobId', 'companyId'],
        (errorMessage) => {
          arr.push(!errorMessage)
        }
      )
      const flag = arr.every((item) => item)
      if (!flag) {
        return
      }
      // const { jobId, companyId } = this.dialogForm.ruleForm
      // const { temp } = this.dialogForm
      // const jobIdData = temp.jobId.data
      // const companyIdData = temp.companyId.data
      // const job = jobIdData.filter((item) => item.value === jobId)
      // const company = companyIdData.filter((item) => item.value === companyId)
      _fn.downLoad(
        'job_applicant_public_export_applicant_template',
        {
          jobId: '',
          companyId: ''
        },
        // '候选人导入-' + job[0].label + '-' + company[0].label
        '候选人导入模板'
      )
    },
    delItem (item) {
      const { file } = this.dialogForm.ruleForm
      this.dialogForm.ruleForm.file.fileList = file.fileList.filter(
        (c) => c.uid !== item.uid
      )
    },
    importSubmit () { // 批量导入候选人
      const { jobId, file } = this.dialogForm.ruleForm
      let _file = {}
      file.fileList.forEach((item) => {
        _file = item.raw
      })
      _api
        .job_applicant_import_candidate({
          file: _file,
          jobId
        })
        .then((res) => {
          const { data } = res
          if (data && data.attachmentUrl) {
            userDownLoadImage(data.attachmentUrl)
            _fn.message(res.msg || '操作失败', { type: 'error' })
          } else {
            _fn.message(res.msg || '操作成功', { type: 'success' })
          }
          this.dialogForm.show = false
          this.dialogForm.ruleForm = {
            jobId: '',
            companyId: '',
            file: {
              fileList: []
            }
          }
          /* let dia = {
          icon: 'el-icon-warning',
          title: '提示',
          tbody: `
            <div>导入成功&nbsp;&nbsp;<span style="color: #67C23A">${res.data.succCnt}</span>&nbsp;&nbsp;条数据</div>
            <div>导入失败&nbsp;&nbsp;<span style="color: #F56C6C">${res.data.failCnt}</span>&nbsp;&nbsp;条数据</div>
          `,
          titleSve: true,
          show: true,
          confirmCallback: () => {
            this.dialogTip.show = false
          }
        }
        this.dialogTip = dia */
          this.resetAfter()
        })
        .catch((e) => {
          this.dialogForm.ruleForm.file = {
            fileList: []
          }
        })
    },
    // 批量添加候选人end
    optsClick (val) {
      // 批量操作2
      var v = parseInt(val)
      let selected = this.$refs.tableObj
      let ops = selected.getSelected()
      if (!(ops.idx && ops.idx.length)) {
        _fn.message('请选择批量操作数据')
        return
      }
      if (v === -99) {
        // 下载
        this.allExprotSubmit()
      } else {
        selected.clearSelection() // 表格清空选中
        let target = null
        if (v === 7 || v === 9 || v === 11 || v === 15 || v === 17 || v === 18) {
          target = v === 7 ? 2
            : v === 9 ? 3
              : v === 11 ? 4
                : v === 15 ? 5
                  : v === 17 ? 6 : 7
        }
        // 批量已查看
        if (v === 97) {
          target = 12
        }
        // 批量删除
        if (v === 13) {
          console.log(ops.list)
          // this.deleteDate(ops.list);
          let deleteContent = []
          ops.list.map(item => {
            deleteContent.push(item.id)
          })
          // _fn.toLocation({ name: "deliveryDelete", id: deleteContent });
          this.goto('deliveryDelete', {
            id: encodeURI(
              JSON.stringify({ deleteContent })
            )
          }
          )
          return
        }
        if (v === 18) {
          // 批量确认入职
          console.log(ops.list)
          let deleteContent = []
          ops.list.map(item => {
            deleteContent.push(item.id)
          })
          this.goto('deliverySure', {
            id: encodeURI(
              JSON.stringify({ deleteContent })
            )
          }
          )
          return
        }
        this.eventBtn(ops.list, {
          index: parseInt(v),
          target: target,
          idx: ops.idx,
          isOpts: true
        })
      }
      console.log('optsClick', v)
    },
    setStateBtn (row, item, column, i) {
      // 操作
      let index = item.index
      let state = row.nextStatus
      let status = row.status
      let bool = false
      // 未查看|待初筛 -- 查看、编辑、推进到、通过初筛、不通过、淘汰
      if (state === 11 || state === 12) {
        bool = index === 6 || index === 3 || index === 1
        // 通过初筛|待邀请面试  -- 查看、编辑、推进到、邀请面试、淘汰
      } else if (state === 13 || state === 20) {
        bool = index === 7 || index === 3 || index === 1
        // 未通过初筛 -- 查看、编辑、淘汰
      } else if (state === 14) {
        bool = index === 2 || index === 5
        // 已邀请面试|待面试|已查看面试邀请 -- 查看、编辑、推进到、已到面、通过面试、不通过、淘汰
      } else if (state === 21 || state === 22 || state === 26) {
        bool = index === 8 || index === 3 || index === 1
        // 拒绝面试|未通过面试 -- 查看、编辑、淘汰
      } else if (state === 23 || state === 25) {
        bool = index === 2 || index === 5 || index === 61
        // 已到面 -- 查看、编辑、推进到、通过面试、不通过、淘汰
      } else if (state === 27) {
        bool = index === 8 || index === 3 || index === 1
        // 通过面试|待邀请办证 -- 查看、编辑、推进到、邀请办证、淘汰
      } else if (state === 24 || state === 30) {
        bool = index === 9 || index === 3 || index === 1
        // 已邀请办证|已查看办证邀请 -- 查看、编辑、推进到、代上传、邀请试工、淘汰
      } else if (state === 31 || state === 35) {
        bool = index === 10 || index === 3 || index === 1
        // 待审核证件 -- 查看、编辑、推进到、审核通过、审核失败、淘汰
      } else if (state === 32) {
        bool = index === 12 || index === 3 || index === 1
        // 通过办证|待邀请试工 -- 查看、编辑、推进到、邀请试工、淘汰
      } else if (state === 33 || state === 40) {
        bool = index === 11 || index === 3 || index === 1
        // 未通过办证 -- 查看、编辑、淘汰
      } else if (state === 34) {
        bool = index === 2 || index === 5
        // 已邀请试工|已查看试工邀请|待试工 -- 查看、编辑、推进到、已到面、通过试工、不通过、淘汰
      } else if (state === 41 || state === 42 || state === 46) {
        bool = index === 14 || index === 3 || index === 1
        // 拒绝试工|未通过试工 -- 查看、编辑、淘汰
      } else if (state === 43 || state === 45) {
        bool = index === 2 || index === 5
        // 通过试工|待发起背调 -- 查看、编辑、推进到、发起背调、淘汰
      } else if (state === 44 || state === 50) {
        bool = index === 15 || index === 3 || index === 1
        // 已到面试工 -- 查看、编辑、推进到、通过试工、不通过、淘汰
      } else if (state === 47) {
        bool = index === 14 || index === 3 || index === 1
        // 背调中 -- 查看、编辑、推进到、通过背调、淘汰
      } else if (state === 51) {
        bool = index === 16 || index === 3 || index === 1
        // 拒绝背调|背调异常 -- 查看、编辑、淘汰
      } else if (state === 52 || state === 55) {
        bool = index === 2 || index === 5
        // 通过背调 -- 查看、编辑、推进到、发offer、淘汰
      } else if (state === 53) {
        bool = index === 17 || index === 3 || index === 1
        // 背调异常 -- 查看、编辑、通过背调、淘汰
      } else if (state === 54) {
        bool = index === 16 || index === 2 || index === 1
        // 背调发起中 -- 查看、编辑、推荐到、淘汰
      } else if (state === 56) {
        bool = index === 2 || index === 5 || index === 3
        // 待发offer -- 查看、编辑、发offer、淘汰
      } else if (state === 60) {
        bool = index === 17 || index === 3 || index === 1
        // 已发offer|待入职|已查看offer -- 查看、编辑、确认入职、淘汰
      } else if (state === 61 || state === 62 || state === 64) {
        bool = index === 18 || index === 3 || index === 1
        // 拒绝offer -- 查看、编辑、淘汰
      } else if (state === 63) {
        bool = index === 2 || index === 5
        // 入职
      } else if (state === 71) {
        bool = index === 18 || index === 3 || index === 1
        // 淘汰
      } else if (state === 81) {
        bool = index === 2
      }

      // 入职
      if (state === -1 && status === 71) {
        // eslint-disable-next-line no-cond-assign
        if (bool = index === 2) {
          // 编辑
          return true
          // eslint-disable-next-line no-cond-assign
        } else if (bool = index === 4) {
          // 删除
          return _fn.checkBtn('job_applicant/deleteJobApplactionOnAction') && bool
        }
      }
      // 淘汰
      if (state === -1 && status === 81) {
        // eslint-disable-next-line no-cond-assign
        if (bool = index === 2) {
          // 编辑
          return true
          // eslint-disable-next-line no-cond-assign
        } else if (bool = index === 4) {
          // 删除
          return _fn.checkBtn('job_applicant/deleteJobApplactionOnAction') && bool
        }
      }
      // console.log("index", index, "state", state, "bool", bool);
      if (index === 2) {
        return _fn.checkBtn('job_applicant/update') && bool
      } else {
        return _fn.checkBtn('job_applicant/operate') && bool
      }
    },
    archiveFn (id, fn) {
      // 同步到人才库
      let param = {
        jobApplicantIdList: _fn.isArray(id) ? id : [id]
      }
      this._api.job_applicant_public_archive_update(param).then((res) => {
        fn && fn(res)
      })
    },
    tips (idx, tisp, fn) {
      let self = this
      let dia = {
        title: '归档提醒',
        tbody: `候选人 <span style="color:#4a84ff;">${tisp.join(
          '、'
        )}</span> 已在人才库中，是否更新人才库信息？`,
        titleSve: true,
        show: true,
        confirmText: '更新',
        cancelText: '不更新',
        confirmCallback: function () {
          console.info('更新')
          self.archiveFn(idx, () => {
            self.dialogTip.show = false
            fn && fn()
          })
        },
        cancelCallback: function () {
          console.info('不更新')
          fn && fn()
        }
      }
      this.dialogTip = dia
    },
    eventBtn (row, item, fn) {
      // 表格中按钮事件
      console.log(row, item, fn)
      let currentRow = JSON.parse(JSON.stringify(row))
      let currentId = -1
      let target = -1
      if (item.isOpts) {
        // 批量操作 -- 淘汰
        currentId = currentRow[0].stage
        target = item.target
      } else {
        currentId = currentRow.stage
        const processStages = row.processStages
        target =
          row.nextStatus === row.status
            ? currentId
            : processStages && processStages.length
              ? processStages[0].type
              : row.nextStage
      }
      console.info('表格中按钮事件---', target)
      let index = item.index
      // 入职的编辑功能
      if (index === 2 && row.status === 71) {
        console.log(row, '++++++row+++')
        this.entryDialog.temp.content = `您是否确认操作候选人 <span style = "color:#4a84ff;">${row.name}</span> 入职 <span style = "color:#4a84ff;">${row.job.name}</span> 职位`
        row.enrollmentTime && (row.enrollmentTime = row.enrollmentTime.replace(/-/g, '/'))
        row.enrollmentTime && (this.entryDialog.ruleForm.jobTime = new Date(row.enrollmentTime))
        console.log(row.enrollmentTime, '}}}}}}}}row.enrollmentTime}}}}')
        let addresses = []
        row.job.addresses.map(item => {
          addresses.push({ label: item.name, value: item.id })
        })
        this.entryDialog.temp.companyAddress.data = addresses
        this.entryDialog.ruleForm.companyAddress = row.enrollmentAddressId
        this.entryDialog.ruleForm.id = row.id
        this.entryDialog.callback = this.entryWrite
        this.entryDialog.show = true
        return
      }
      // 淘汰的编辑按钮
      if (index === 2 && row.status === 81) {
        // 功能上面没写，先和原来的一样，跳转至员工的个人信息页
        this.goto('deliveryEdit', { id: row.id })
      }
      if (index === 2) {
        this.goto('deliveryEdit', { id: row.id })
      } else if (index === 13) {
        // 审核失败
        this.switchStatus(row)
      } else if (
        index === 5 ||
        index === 7 ||
        index === 9 ||
        index === 10 ||
        index === 11 ||
        index === 15 ||
        index === 17
      ) {
        let idx = row.id
        if (_fn.isArray(item.idx)) {
          idx = item.idx
        }
        this.goto('deliveryOperation', {
          id: encodeURI(
            JSON.stringify({
              id: idx,
              btnId: index,
              currentId: currentId,
              targetId: target
            })
          )
        })
      } else if (index === 4) {
        // 删除事件
        // this.switchStatus(row);
        // 待定
        // this.goto("deliveryEdit", { id: row.id });
        let dia = {
          title: '删除职位',
          tbody: `您是否确认删除候选人 <span style = "color:#4a84ff;">${row.name}</span> 投递 <span style = "color:#4a84ff;">${row.job && row.job.name}</span> 职位的记录？一旦操作无法撤回，请慎重操作。`,
          titleSve: true,
          isCancel: true, // 是否显示取消按钮
          // confirmText: '我知道了',
          confirmCallback: () => {
            this.dialogTip.show = false
            this.deleteDate([row])
          },
          show: true
        }
        this.dialogTip = dia
      } else {
        let o = {
          btnId: index, // 按钮ID
          currentId: currentId, // 当前流程ID
          targetId: target // 目标流程ID
        }
        if (index === 18) {
          // 确定入职
          console.log(row, '++++++row+++')
          this.entryDialog.temp.content = `您是否确认操作候选人 <span style = "color:#4a84ff;">${row.name}</span> 入职 <span style = "color:#4a84ff;">${row.job.name}</span> 职位`
          row.enrollmentTime && (row.enrollmentTime = row.enrollmentTime.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3'))
          row.enrollmentTime && (this.entryDialog.ruleForm.jobTime = row.enrollmentTime)
          let addresses = []
          row.job.addresses.map(item => {
            addresses.push({ label: item.name, value: item.id })
          })
          this.entryDialog.temp.companyAddress.data = addresses
          this.entryDialog.ruleForm.companyAddress = row.enrollmentAddressId
          this.entryDialog.ruleForm.id = row.id
          this.entryDialog.ruleForm.row = row
          this.entryDialog.ruleForm.o = o
          this.idx = item.isOpts ? item.idx : [row.id]
          this.entryDialog.callback = this.entryWriteAgain
          this.entryDialog.show = true
        } else {
          this.setndDeliveryOperation(row, o)
        }
      }
    },
    setndDeliveryOperation (row, o) {
      _fn.deliveryChange(row, o, (res) => {
        this.setTabsNumber()
        this.query()
      })
    },
    checkDieOut (data, fn) {
      // 淘汰确定
      let param = {
        jobApplicantIdList: data
      }
      this._api.job_applicant_public_archive_flag(param).then((res) => {
        fn && fn(res)
      })
    },
    gotoCallbackMore (value, row, item) {
      // 更多
      console.info('更多  ----- ', value)
      if (value === 5) {
        // 淘汰
        this.goto('deliveryOperation', {
          id: encodeURI(
            JSON.stringify({
              id: row.id,
              btnId: value,
              targetId: 8,
              currentId: row.stage
            })
          )
        })
      } else if (value === 2) {
        // 编辑
        this.goto('deliveryEdit', { id: row.id })
      } else if (value === 10) {
        // 代上传
        this.eventBtn(row, { index: 10 })
      } else if (value === 100) {
        // 邀请试工
        this.eventBtn(row, { index: 11, target: 4 })
      } else if (value === 98 || value === 99) {
        this.eventBtn(row, { index: value })
      } else if (
        value === 101 ||
        value === 102 ||
        value === 103 ||
        value === 104 ||
        value === 105
      ) {
        // 未通过
        this.switchStatus(row)
      }
    },
    gotoCallback (value, row, item) {
      // 推进到
      let self = this
      let target =
        value === 7
          ? 2
          : value === 9
            ? 3
            : value === 11
              ? 4
              : value === 15
                ? 5
                : value === 17
                  ? 6
                  : 7
      console.info('推进到---', target)
      let o = {
        goto: 'goto', // 按钮ID
        currentId: row.stage, // 当前流程ID
        targetId: target // 目标流程ID
      }
      if (value === 18) {
        // 入职
        o.btnId = value// 按钮ID
        console.log(row, '++++++row+++')
        this.entryDialog.temp.content = `您是否确认操作候选人 <span style = "color:#4a84ff;">${row.name}</span> 入职 <span style = "color:#4a84ff;">${row.job.name}</span> 职位`
        row.enrollmentTime && (row.enrollmentTime = row.enrollmentTime.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3'))
        row.enrollmentTime ? (this.entryDialog.ruleForm.jobTime = row.enrollmentTime) : (this.entryDialog.ruleForm.jobTime = '')
        let addresses = []
        row.job.addresses.map(item => {
          addresses.push({ label: item.name, value: item.id })
        })
        this.entryDialog.temp.companyAddress.data = addresses
        this.entryDialog.ruleForm.companyAddress = row.enrollmentAddressId
        this.entryDialog.ruleForm.id = row.id
        this.entryDialog.ruleForm.row = row
        this.entryDialog.ruleForm.o = o
        this.idx = item.isOpts ? item.idx : [row.id]
        this.entryDialog.callback = this.entryWriteAgain
        this.entryDialog.show = true
        return
      }

      let one = this.defaultTabs[row.stage] || {}
      let two = this.defaultTabs[target] || {}
      let dia = {
        id: row.id,
        title: '推进流程',
        tbody: `您是否确认 将候选人<span style = "color:#4a84ff;">${one.label}</span > 推进到 <span style = "color:#4a84ff;"> ${two.label}</span> 阶段？`,
        titleSve: true,
        show: true,
        confirmText: '',
        isCancel: true, // 是否显示取消按钮
        confirmCallback: () => {
          _fn.deliveryChange(row, o, (res) => {
            self.tagName = self.defaultTabs[o.targetId].value
            self.handleClick(self.tagName, 'noPage')
          })

          self.dialogTip.show = false
        }
      }
      this.dialogTip = dia
    },
    switchStatus (item) {
      // 通过、不通过
      let v = item.status
      let status = 0
      if (v === 11 || v === 12) {
        // 未查看、待初筛
        status = 14
      } else if (v === 21 || v === 22 || v === 27 || v === 26) {
        // 已邀请面试、待面试、已到面、已查看面试邀请
        status = 25
      } else if (v === 32) {
        // 待审核证件
        status = 34
      } else if (v === 41 || v === 42 || v === 47) {
        // 已邀请试工、待试工、已到面试工
        status = 45
      } else if (v === 51 || v === 54) {
        // 背调中、背调异常
        status = 55
      }
      let param = { id: item.id, status: status }
      this._api.job_applicant_switch_status(param).then((res) => {
        _fn.message(res.msg || '操作成功', { type: 'success' })
        this.handleClick(this.tagName, 'noPage')
      })
    },
    // 删除--批量删除--deleteRow--Array
    deleteDate (deleteRow) {
      let deleteContent = []
      deleteRow.map(item => {
        deleteContent.push(item.id)
      })
      let params = {
        jobApplactionIdList: deleteContent // 参数是数组
      }
      this._api.job_entry_delete(params).then((res) => {
        // fn && fn(res);
        if (res.code === 0) {
          // 操作成功
          deleteRow.map(item => {
            let deleteIndex = this.obj.tableObj.data.indexOf(item)
            this.obj.tableObj.data.splice(deleteIndex, 1)// 拿到这一项下标，然后删除
          })
          this.setTabsNumber()// 修改那一项的数量
          this.query()// 刷新页面
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/color.less';
.delivery {
  width: 100%;
  display: flex;
  flex-direction: row;
  .left {
    width: 280px !important;
    border-right: 1px solid #eee;
    overflow-y: auto;
    overflow-x: hidden;
    /deep/ .el-form-item__label {
      text-align: left;
      line-height: 24px;
      font-weight: 600;
    }
    /deep/ .el-form-item__content {
      width: 100%;
      .el-cascader {
        .el-input__icon {
          line-height: 36px;
        }
        .el-icon-arrow-down {
          color: @black2;
          font-weight: 600;
        }
      }
    }
    /deep/ .infoForm-input {
      width: 100%;
    }
    /deep/ .el-form--inline .el-form-item {
      margin: 20px 0 0 0;
      &:first-child {
        margin-top: 30px;
      }
      &:last-child {
        margin-top: 40px;
        width: 100%;
        text-align: center;
      }
    }
    /deep/.searchForm .el-input--small .el-input__inner {
      width: 240px !important;
    }
  }
  .right {
    width: calc(100% - 280px);
    display: flex;
    flex-direction: column;
    .optaion {
      margin: 10px 0;
      text-align: right;
      padding-right: 20px;
      .dropdownAdd {
        margin-right: 10px;
        /deep/.el-button {
          background-color: #4a84ff;
          color: #fff;
          border-color: #4a84ff;
        }
        /deep/ .el-button-group:hover {
          border: 1px solid #fff !important;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
