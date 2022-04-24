<style lang="less" scoped>
@import "./talentDetail.less";
</style>

<template>
  <div class="talent-detail">
    <div class="detail-page-main">
      <div class="detail-page-main-left">
        <div class="top">
          <div class="top-left">
            <div class="avatar">
              <img
                v-if="resumeDetailForm.baseInfo.avatar"
                :src="resumeDetailForm.baseInfo.avatar"
                alt=""
              />
              <img v-else src="../../../assets/image/header.png" alt="" />
            </div>
            <div class="top-left_info">
              <div class="top-left_info-name-contanier">
                <span class="name">{{ resumeDetailForm.baseInfo.name }}</span>
                <span
                  v-if="typeof resumeDetailForm.baseInfo.gender !== 'object'"
                  class="sex-icon"
                >
                  <svg class="icon" aria-hidden="true">
                    <use
                      :xlink:href="
                        resumeDetailForm.baseInfo.gender === 2
                          ? '#iconnv'
                          : '#iconnan'
                      "
                    ></use>
                  </svg>
                </span>
                <span
                  v-show="
                    isSourceTalentPoolFlag &&
                    !!resumeDetailForm.baseInfo.wantedStatus
                  "
                  class="tag"
                  >{{
                    resumeDetailForm.baseInfo.wantedStatus | wantedStatusFilter
                  }}</span
                >
              </div>
              <div class="top-left_info-tag">
                {{ infoTagFilter() }}
              </div>
              <div class="top-left_info-phone">
                <i class="iconfont iconshoujihaoma"></i>
                {{ resumeDetailForm.baseInfo.phoneNumber }}
              </div>
            </div>
          </div>
          <div
            class="top-right"
            v-if="
              (BtnId === 4 && _fn.checkBtn('job_applicant/update')) ||
              BtnId !== 4
            "
          >
            <zp-button
              v-if="isSourceTalentPoolFlag && !($route.query.deliveryStatus + '').match(/[3]{1}/g) && $route.query.enabled && _fn.checkBtn('deliveryStatus')"
              class="zp-btn-primary"
              @click="turnPoint"
              >转投递
            </zp-button>
            <Router-link
              :to="
                isSourceTalentPoolFlag
                  ? '/personnel/addtalent/' + queryId
                  : '/delivery/edit/' + queryId
              "
            >
              <template v-if="isSourceTalentPoolFlag">
                <zp-button
                  v-if="!($route.query.deliveryStatus + '').match(/[23]{1}/g)"
                  class="zp-btn-primary"
                  >编辑
                </zp-button>
              </template>
              <template v-else>
                <zp-button
                  v-if="resumeDetailForm.status !== 71"
                  class="zp-btn-primary"
                  >编辑
                </zp-button>
              </template>
            </Router-link>
            <!-- <zp-button v-if="!isSourceTalentPoolFlag">导出</zp-button>
            <zp-button v-if="!isSourceTalentPoolFlag">锁定</zp-button> -->
          </div>
        </div>
        <div class="tabs-wrapper">
          <zp-tabsCustom v-model="activeTabName" :data="tabsData" />
          <transition-group
            tag="div"
            name="fade"
            mode="out-in"
            class="tabs-item-container"
          >
            <!-- 简历 -->
            <div class="resume" key="resume" v-show="activeTabName === '0'">
              <el-form
                v-if="fieldToggle.baseInfoTemplate"
                label-width="100px"
                :model="resumeDetailForm"
                :inline="true"
              >
                <div class="form-group_title">基本信息</div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名：">
                      {{ resumeDetailForm.baseInfo.name || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别：">
                      {{ resumeDetailForm.baseInfo.gender | genderFilter }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="年龄：">
                      {{ resumeDetailForm.baseInfo.age || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="婚育情况：">
                      {{
                        resumeDetailForm.baseInfo.marriageBirth
                          | marriageBirthFilter
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="resumeDetailForm.baseInfo.identityNumber | identityTypeFilter1 ">
                      {{ resumeDetailForm.baseInfo.identityNumber | identityNumberFilter }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="最高学历：">
                      {{
                        resumeDetailForm.baseInfo.education | educationFilter
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="户口所在地：">
                      {{ hukouLocation("0") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="现居住地：">
                      {{ hukouLocation("1") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手机号：">
                      {{ resumeDetailForm.baseInfo.phoneNumber || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="微信：">
                      {{ resumeDetailForm.baseInfo.wechat || "--" }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div
                v-if="
                  fieldToggle.experienceTemplate &&
                  resumeDetailForm.experience.length
                "
              >
                <div class="form-group_title">工作经历</div>
                <ul class="experience">
                  <li
                    class="experience-item"
                    v-for="item in resumeDetailForm.experience"
                    :key="item.id"
                  >
                    <div class="experience-item_title">
                      <span>{{ item.position }}</span>
                      <span class="tag">{{
                        item.timeRequired | timeRequiredFilter
                      }}</span>
                    </div>
                    <div class="experience-item_name">
                      {{ item.companyName }}
                    </div>
                    <div class="experience-item_time">
                      {{ item.startTime | dateTimeFilter }} 至
                      {{
                        item.endTime
                          | dateTimeFilter(false, "yyyy-MM", "endTime")
                      }}
                    </div>
                    <div class="experience-item_desc">
                      {{ item.description }}
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-if="
                  fieldToggle.educationTemplate &&
                  resumeDetailForm.education.length
                "
              >
                <div class="form-group_title">教育经历</div>
                <ul class="experience">
                  <li
                    class="experience-item"
                    v-for="item in resumeDetailForm.education"
                    :key="item.id"
                  >
                    <div class="experience-item_title">
                      <span>{{ item.school }}</span>
                      <span class="tag">{{
                        item.education | educationFilter
                      }}</span>
                    </div>
                    <div class="experience-item_name">
                      {{ item.major }}
                    </div>
                    <div class="experience-item_time">
                      {{ item.startTime | dateTimeFilter }} 至
                      {{
                        item.endTime
                          | dateTimeFilter(false, "yyyy-MM", "endTime")
                      }}
                    </div>
                    <div class="experience-item_desc">
                      {{ item.description }}
                    </div>
                  </li>
                </ul>
              </div>
              <el-form
                v-if="othersTemplateVisiblie"
                label-width="100px"
                :model="resumeDetailForm"
                :inline="true"
              >
                <div class="form-group_title">其他信息</div>
                <el-row v-for="item in resumeDetailForm.others" :key="item.id">
                  <el-col :span="12">
                    <el-form-item label="身高：">
                      {{ item.height || "--" }} 厘米
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="体重：">
                      {{ item.weight || "--" }} 公斤
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="爱好：" class="hobby-wrapper">
                      <div class="hobby-tag-list">
                        <span v-if="!item.tags">--</span>
                        <div
                          v-else
                          v-for="(tag, index) in item.tags.split(',')"
                          :key="index"
                          class="hobby-tag-list-item"
                        >
                          {{ tag }}
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="自我评价："
                      class="selfEvaluation-wrapper"
                    >
                      <div class="txt">{{ item.selfDesc || "--" }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="生活照：" class="photosLife-wrapper">
                      <span v-if="!item.pics">--</span>
                      <div v-else class="photosLife-list">
                        <img
                          v-for="(pic, index) in item.pics.split(',')"
                          :key="index"
                          :src="pic"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 证件 -->
            <div
              class="certificate"
              key="certificate"
              :disabled="
                (BtnId === 4 &&
                  _fn.checkBtn('job_applicant/public/add_identity')) ||
                BtnId !== 4
              "
              v-show="activeTabName === '1'"
            >
              <div class="upload-certificate">
                <div class="upload-certificate_tip">
                  <img src="../../../assets/image/upload.png" alt="" /><br />
                  <zp-button icon="el-icon-upload2" @click="updateModal('0')">
                    添加证件
                  </zp-button>
                </div>
              </div>
              <div
                class="certificate-list-item"
                v-for="(item, index) in resumeDetailForm.identity"
                :key="index"
              >
                <div class="certificate-list-item_title">
                  <span v-if="item.identityName">{{ item.identityName }}</span>
                  <span v-else>{{
                    item.identityType | identityTypeFilter
                  }}</span>
                  <div class="action">
                    <i
                      class="iconfont iconbianji1"
                      @click="updateIdentityHandle(item)"
                    ></i>
                    <i
                      class="el-icon-download"
                      @click="userDownLoadFile(item)"
                    ></i>
                  </div>
                </div>
                <div
                  :class="{
                    'time-info': true,
                    expired: expiryDateFilter(item.expiryDate),
                  }"
                >
                  有效期至：{{
                    item.expiryDate | dateTimeFilter(false, "yyyy-MM-dd")
                  }}
                  {{ expiryDateFilter(item.expiryDate) ? "（已过期）" : "" }}
                </div>
                <div class="img">
                  <img :src="item.identityPic" alt="" />
                </div>
              </div>
            </div>
            <!-- offer -->
            <div
              class="offer"
              key="offer"
              v-show="
                activeTabName === '2' &&
                ((BtnId === 4 && _fn.checkBtn('job_applicant/update')) ||
                  BtnId !== 4)
              "
            >
              <zp-page :obj="tablePageObj">
                <zp-dynamicTable
                  slot="table"
                  :obj="tablePageObj.tableObj"
                  stripe
                />
              </zp-page>
            </div>
            <!-- 背调 -->
            <div
              class="back-tone"
              key="back-tone"
              v-show="
                activeTabName === '3' &&
                ((BtnId === 4 && _fn.checkBtn('job_applicant/update')) ||
                  BtnId !== 4)
              "
            >
              <div v-if="!resumeDetailForm.turningData" class="empty-data">
                <div></div>
                <p>暂无数据~</p>
              </div>
              <template v-else>
                <!-- <div class="turningData-iframe" style="overflow: hidden;">
                  <embed id="turningDataIframe" width="100%" height="999px" style="transform: translate(0, -41px);"
                    src="https://manwei00.oss-cn-shanghai.aliyuncs.com/zp/dev/report/202009140000753211_1600177110140.pdf" type="application/pdf">
                </div> -->
                <!-- <iframe :src="resumeDetailForm.turningData + '?#toolbar=0'" frameborder="0" class="turningData-iframe"></iframe> -->
                <!-- <iframe id="IFeditValue" :src="resumeDetailForm.turningData + '?#toolbar=0'" frameborder="0" class="turningData-iframe"></iframe> -->
                <canvas
                  v-for="item in totalPdfPages"
                  :key="item"
                  :id="'the-canvas-' + item"
                ></canvas>
              </template>
            </div>
            <!-- 面试 -->
            <div class="interview" key="interview" v-show="activeTabName === '4'">
              <el-form label-width="120px" :model="resumeDetailForm" :inline="true">
                <div class="form-group_title">面试邀约</div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="面试时间：">
                      {{ resumeDetailForm.interviewInvitation.businessTimeStr || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面试地址：">
                      {{ resumeDetailForm.interviewInvitation.probationAddress || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人：">
                      {{ resumeDetailForm.interviewInvitation.contactName || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人电话：">
                      {{ resumeDetailForm.interviewInvitation.contactPhone || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面试创建人：">
                      {{ resumeDetailForm.interviewInvitation.createUser || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面试创建时间：">
                      {{ resumeDetailForm.interviewInvitation.createTime || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="注意事项：">
                      {{ resumeDetailForm.interviewInvitation.remark || "--" }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- offer -->
            <div class="offer" key="offer" v-show="activeTabName === '5'">
              <el-form label-width="120px" :model="resumeDetailForm" :inline="true">
                <div class="form-group_title">offer</div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="入职时间：">
                      {{ resumeDetailForm.offerInvitation.businessTime || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入职地址：">
                      {{ resumeDetailForm.offerInvitation.probationAddress || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人：">
                      {{ resumeDetailForm.offerInvitation.contactName || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人电话：">
                      {{ resumeDetailForm.offerInvitation.contactPhone || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="offer创建人：">
                      {{ resumeDetailForm.offerInvitation.createUser || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="创建时间：">
                      {{ resumeDetailForm.offerInvitation.createTime || "--" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="注意事项：">
                      {{ resumeDetailForm.offerInvitation.remark || "--" }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition-group>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="detail-page-main-right">
        <!-- 求职意愿 -->
        <div class="right-item" v-if="isSourceTalentPoolFlag">
          <div class="right-item_title">
            <span>求职意愿</span>
            <i class="iconfont iconbianji1" @click="updateModal('1')"></i>
          </div>
          <div class="apply-job-container">
            <div>
              求职状态：<span>{{
                resumeDetailForm.wantedSetting.status | wantedStatusFilter
              }}</span>
            </div>
            <div>
              期望职位：
              <template
                v-if="!!resumeDetailForm.wantedSetting.positions.length"
              >
                <span
                  v-for="(item, index) in resumeDetailForm.wantedSetting
                    .positions"
                  :key="item.id"
                  >{{
                    item.title +
                    (index ===
                    resumeDetailForm.wantedSetting.positions.length - 1
                      ? ""
                      : "、")
                  }}</span
                >
              </template>
              <span v-else>--</span>
            </div>
            <div>
              期望城市：
              <template v-if="!!resumeDetailForm.wantedSetting.citys.length">
                <span
                  v-for="(item, index) in resumeDetailForm.wantedSetting.citys"
                  :key="item.id"
                  >{{
                    item.cityName +
                    (index === resumeDetailForm.wantedSetting.citys.length - 1
                      ? ""
                      : "、")
                  }}</span
                >
              </template>
              <span v-else>--</span>
            </div>
            <div>
              期望薪资：
              <!-- <span>8-10K/月</span> -->
              <span>{{ resumeDetailForm.wantedSetting | salaryFilter }}</span>
            </div>
          </div>
        </div>
        <!-- 应聘职位 -->
        <div class="right-item" v-else>
          <div class="right-item_title">
            <span>应聘职位</span>
          </div>
          <div class="right-item-list">
            <div class="list-item">
              <div class="list-item_header">
                <!-- <span>{{resumeDetailForm.jobVo.id | jobIdFilter(jobIdOptions)}}</span> -->
                <span>{{ resumeDetailForm.jobVo.name }}</span>
                <span
                  :class="resumeDetailForm.status == 81 ? 'tag-gray' : 'tag'"
                  >{{ resumeDetailForm.status | statusFilter }}</span
                >
              </div>
              <div class="list-item_time">
                所属企业：{{ resumeDetailForm | companyNameFilter }}
              </div>
              <div class="list-item_time">
                期望工作地址：{{ resumeDetailForm | addressWantedFilter }}
              </div>
              <div class="list-item_time" v-if="setJobTime(resumeDetailForm)">
                可兼职时间：{{ resumeDetailForm | partJobTimeFilter }}
              </div>
              <div class="list-item_time">
                渠道来源：{{
                  resumeDetailForm.deliveryChannelType
                    | deliveryChannelTypeFilter(channelList)
                }}
              </div>
              <div class="list-item_time" v-if="!!resumeDetailForm.recommender">
                推荐人：{{ resumeDetailForm.recommender }}
              </div>
              <div
                class="list-item_time"
                v-if="!!resumeDetailForm.recommenderPhoneNumber"
              >
                推荐人电话：{{ resumeDetailForm.recommenderPhoneNumber }}
              </div>
              <div class="list-item_time">
                投递时间：{{
                  resumeDetailForm.createTime | dateTimeFilter(true)
                }}
              </div>
              <div
                class="list-item_action"
                v-if="
                  (BtnId === 4 && _fn.checkBtn('job_applicant/operate')) ||
                  BtnId !== 4
                "
              >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(6)"
                  v-if="setStateBtn(resumeDetailForm, 6)"
                  >通过初筛</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(7)"
                  v-if="setStateBtn(resumeDetailForm, 7)"
                  >邀请面试</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(8)"
                  v-if="setStateBtn(resumeDetailForm, 8)"
                  >通过面试</zp-button
                >
                <!-- 面试已到面 -->
                <zp-button
                  size="mini"
                  @click="processChangeHandle(98)"
                  v-if="setStateBtn(resumeDetailForm, 98)"
                  >已到面</zp-button
                >
                <!-- 试工已到面 -->
                <zp-button
                  size="mini"
                  @click="processChangeHandle(99)"
                  v-if="setStateBtn(resumeDetailForm, 99)"
                  >已到面</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(9)"
                  v-if="setStateBtn(resumeDetailForm, 9)"
                  >邀请办证</zp-button
                >
                <zp-button
                  size="mini"
                  @click="uploadIdentity"
                  v-if="
                    setStateBtn(resumeDetailForm, 10) ||
                    resumeDetailForm.status === 31
                  "
                  >代上传
                </zp-button>
                <zp-button
                  size="mini"
                  @click="processChangeHandle(11)"
                  v-if="setStateBtn(resumeDetailForm, 11)"
                  >邀请试工
                </zp-button>
                <zp-button
                  size="mini"
                  @click="processChangeHandle(12)"
                  v-if="setStateBtn(resumeDetailForm, 12)"
                  >审核通过</zp-button
                >
                <zp-button
                  size="mini"
                  @click="failBtnHandle"
                  v-if="setStateBtn(resumeDetailForm, 12)"
                  >审核失败</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(14)"
                  v-if="setStateBtn(resumeDetailForm, 14)"
                  >通过试工</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(15)"
                  v-if="setStateBtn(resumeDetailForm, 15)"
                  >发起背调</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(16)"
                  v-if="setStateBtn(resumeDetailForm, 16)"
                  >通过背调</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(17)"
                  v-if="setStateBtn(resumeDetailForm, 17)"
                  >发offer</zp-button
                >
                <zp-button
                  size="mini"
                  @click="processChangeHandle(18)"
                  v-if="setStateBtn(resumeDetailForm, 18)"
                  >确认入职</zp-button
                >
                <el-dropdown
                  v-if="setStateBtn(resumeDetailForm, 3)"
                  :split-button="true"
                  size="mini"
                  trigger="click"
                  @command="commandChangeHandle"
                >
                  推进到
                  <el-dropdown-menu slot="dropdown" :appendToBody="false">
                    <!-- <el-dropdown-item v-for="item in dropdownMenuOptions" :key="item.type" :command="item.type" :disabled="item.show">
                      <span class="dropdown-item-content">
                        <i v-if="item.type === resumeDetailForm.stage" class="iconfont icondian"></i>
                        {{item.name}}
                      </span>
                    </el-dropdown-item> -->
                    <el-dropdown-item
                      v-for="item in dropdownMenuOptions"
                      :key="item.type"
                      :command="item.type"
                    >
                      <span class="dropdown-item-content">{{ item.name }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <zp-button size="mini" v-if="failBtn" @click="failBtnHandle"
                  >不通过</zp-button
                >
                <zp-button
                  size="mini"
                  v-if="eliminated"
                  @click="processChangeHandle(5)"
                  >淘汰</zp-button
                >
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!!tagList.length"
          :class="[
            'right-item',
            'right-item-toggle',
            tagToggleFlag ? 'right-item-toggle_zhankai' : '',
          ]"
        >
          <div class="right-item_title">
            <span>标签</span>
            <i
              :class="[
                'iconfont',
                tagToggleFlag ? 'iconzhankai' : 'iconshouqi',
              ]"
              @click="tagToggleFlag = !tagToggleFlag"
            ></i>
          </div>
          <div class="tag-list">
            <span
              :class="{
                'active-label': item.checked,
              }"
              v-for="item in tagList"
              :key="item.id"
              @click="tagItemChecked(item)"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <!-- 维护轨迹 -->
        <div class="right-item" v-if="isSourceTalentPoolFlag && !!activities.length">
          <div class="right-item_title">
            <span>维护轨迹</span>
          </div>
          <div class="trajectory-list">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :color="index===0? '#DEE9FF': ''"
                :size="index===0? 'large': 'normal'"
                :timestamp="activity.createTime">
                {{activity.createUsername}}{{activity.type | activitiesFilter}}
                <p class="content" v-for="(item, idx) in activity.resumeRecordInfoVos" :key="idx">
                  <span v-if="activity.type === 1 && (item.columnName === 'resumeExperience' || item.columnName === 'resumeEducation' || item.columnName === 'resumeIdentity')">【变更了{{item.comments}}】</span>
                  <template v-else>
                    <span v-if="activity.type === 2 && (item.columnName === 'title' || item.columnName === 'cityName')">
                      <span v-if="item.newValue && item.oldValue">【{{item.comments}}新增了{{item.newValue}}-删除了{{item.oldValue}}】</span>
                      <span v-else-if="item.newValue && !item.oldValue">【{{item.comments}}新增了{{item.newValue}}】</span>
                      <span v-else-if="!item.newValue && item.oldValue">【{{item.comments}}删除了{{item.oldValue}}】</span>
                    </span>
                    <span v-else-if="(activity.type === 1 || activity.type === 2) && item.newValue && item.columnName !== 'title' && item.columnName !== 'cityName'">【{{item.comments}}变更为{{item.newValue}}】</span>
                    <span v-else-if="activity.type === 1 && !item.newValue">【删除了{{item.comments}}】</span>
                    <span v-else-if="activity.type === 3 || activity.type === 4">【{{item.newValue}}】</span>
                  </template>
                </p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="right-item">
          <div class="right-item_title">
            <span>备注（{{ commentListData.length }}）</span>
          </div>
          <div class="remark-list">
            <div
              class="remark-list-item"
              v-for="item in commentListData"
              :key="item.id"
            >
              <img
                :src="
                  item.createAvtar ||
                  require('../../../assets/image/header.png')
                "
                alt=""
              />
              <div class="remark-list-item_contnet">
                <div class="username">{{ item.createName }}</div>
                <div class="text">{{ item.content }}</div>
                <div class="time">
                  {{ item.createTime | dateTimeFilter(true) }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="commentListData.length <= 20" class="remark-form">
            <zp-input
              :maxlength="200"
              type="textarea"
              :limit="true"
              placeholder="请输入备注"
              v-model.trim="commentNewValue"
            />
            <zp-button
              class="zp-btn-primary"
              size="small"
              @click="commentNewHandle"
              >发布</zp-button
            >
          </div>
        </div>
      </div>
    </div>
    <zp-dynamicDialog :obj="dialogObj">
      <template slot="form">
        <template v-if="dialogObj.temp">
          <template v-for="key in Object.keys(dialogObj.temp)">
            <zp-dynamicFormItem
              v-if="!key.match(/(minSalary|maxSalary)/g)"
              :obj="dialogObj"
              :formItem="dialogObj.temp[key]"
              :name="key === 'dreamMoney' ? '' : key"
              :key="key"
              :required="key === 'dreamMoney'"
            >
              <template v-slot:custom_identityPic>
                <el-input
                  v-model="dialogObj.ruleForm[key]"
                  style="display: none"
                />
                <zp-upload
                  :limit="1"
                  uploadType="image"
                  :formModel.sync="formModel"
                />
              </template>
              <template v-slot:custom_positions>
                <el-cascader
                  :collapse-tags="true"
                  :props="{
                    multiple: true,
                  }"
                  v-model="dialogObj.ruleForm[key]"
                  :show-all-levels="false"
                  placeholder="请选择"
                  :options="positionIdData"
                  filterable
                />
              </template>
              <template v-slot:custom_dreamMoney>
                <div class="dreamMoney-container">
                  <zp-dynamicFormItem
                    :obj="dialogObj"
                    :formItem="dialogObj.temp['minSalary']"
                    name="minSalary"
                  >
                    <template v-slot:custom_minSalary>
                      <el-input
                        v-model.number="dialogObj.ruleForm['minSalary']"
                        placeholder="请输入"
                      >
                        <template slot="append">元/月</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                  <span class="placeholder">-</span>
                  <zp-dynamicFormItem
                    :obj="dialogObj"
                    :formItem="dialogObj.temp['maxSalary']"
                    name="maxSalary"
                  >
                    <template v-slot:custom_maxSalary>
                      <el-input
                        v-model.number="dialogObj.ruleForm.maxSalary"
                        placeholder="请输入"
                      >
                        <template slot="append">元/月</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                </div>
              </template>
            </zp-dynamicFormItem>
          </template>
        </template>
      </template>
    </zp-dynamicDialog>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
    <!-- 编辑入职信息v-slot:entry -->
    <template>
      <zp-dynamicDialog slot="dialog" :obj="entryDialog" ref="dialogForm">
        <template slot="form">
          <div
            style="margin: 20px 0; font-size: 15px"
            v-html="entryDialog.temp.content"
          ></div>
          <zp-dynamicFormItem
            :formItem="entryDialog.temp.jobTime"
            name="jobTime"
            :obj="entryDialog"
            :key="index"
          />
          <zp-dynamicFormItem
            :formItem="entryDialog.temp.companyAddress"
            name="companyAddress"
            :obj="entryDialog"
            :key="index"
          />
        </template>
      </zp-dynamicDialog>
    </template>
  </div>
</template>

<script>
import talentDetail from './talentDetail'
export default talentDetail
</script>
