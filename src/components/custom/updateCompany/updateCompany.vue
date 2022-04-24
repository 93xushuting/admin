<style lang="less">
@import "./updateCompany.less";
</style>
<template>
  <div :class="['updateCompany-component', overflow ? 'overflow-auto' : '']">
    <el-form
      :model="form.ruleForm"
      :rules="form.rules"
      :ref="form.name"
      :label-width="form.labelWidth"
      :inline="form.formInline"
      class="infoForm editFooterMargin"
    >
      <div class="forms_title"><span class="line"></span>基本信息</div>
      <!-- 企业名称 -->
      <zp-dynamicFormItem
        :formItem="form.temp.name"
        name="name"
        :obj="form"
        :key="index"
      />
      <!-- 所属行业 -->
      <zp-dynamicFormItem
        :formItem="form.temp.industryId"
        name="industryId"
        :obj="form"
        :key="index"
      />
      <!-- 负责人 -->
      <zp-dynamicFormItem
        class="form-item_headUid"
        :formItem="form.temp.headUid"
        name="headUid"
        :obj="form"
        :key="index"
      />
      <!-- 工作地址 -->
      <zp-dynamicFormItem
        :formItem="form.temp.addresses"
        name="addresses"
        :obj="form"
        :key="index"
      >
        <template v-slot:select_slot_empty_template>
          <div class="select-no-data-text">
            暂无地址，<Router-link
              :to="{
                name: 'addressManageEdit',
                params: {
                  id: '0',
                },
              }"
              >立即新增地址</Router-link
            >
          </div>
        </template>
      </zp-dynamicFormItem>
      <template v-if="addCompanyType === 'proxy'">
        <br />
      </template>
      <!-- 企业logo -->
      <zp-dynamicFormItem
        :formItem="form.temp.logo"
        name="logo"
        :obj="form"
        :key="index"
        class="avatar"
      >
        <template v-slot:custom_logo>
          <el-input :value="form.ruleForm.logo" style="display: none" />
          <div class="imgUpload">
            <div class="header">
              <img
                :src="
                  form.ruleForm.logo ||
                  '../../../../../static/image/company-default-logo.png'
                "
                alt=""
              />
            </div>
            <div>
              <zp-upload
                :uploadType="'avatar'"
                :callback="avatarUploadSuccess"
                :limit="1"
              >
                <template v-slot:avatar>
                  <zp-button icon="el-icon-upload2">{{
                    id !== "0" ? "点击更新" : "点击上传"
                  }}</zp-button
                  ><br />
                </template>
              </zp-upload>
              <div class="message">
                请选择大小不超过5M 的照片，支持JPG、PNG、JPEG
              </div>
            </div>
          </div>
        </template>
      </zp-dynamicFormItem>
      <template v-if="addCompanyType === 'autonomous'">
        <br />
      </template>
      <!-- 企业地址 -->
      <zp-dynamicFormItem
        :formItem="form.temp.companyAddress"
        name="companyAddress"
        :obj="form"
      >
        <template v-slot:custom_companyAddress="{ customProps }">
          <el-cascader
            :options="customProps.data"
            v-model="form.ruleForm.companyAddress"
          />
        </template>
      </zp-dynamicFormItem>
      <!-- 详细地址 -->
      <zp-dynamicFormItem
        class="form-item_detailAddress"
        :formItem="form.temp.detailAddress"
        name="detailAddress"
        :obj="form"
      >
        <template v-slot:custom_detailAddress>
          <zp-input v-model="form.ruleForm.detailAddress" />
          <zp-button type="text" @click="mapDialogConfig.visible = true"
            >地图选址</zp-button
          >
        </template>
      </zp-dynamicFormItem>
      <!-- 企业介绍 -->
      <div
        v-if="addCompanyType === 'proxy'"
        class="forms_title"
        style="margin-top: 0px"
      >
        <span class="line"></span>企业介绍
      </div>
      <zp-dynamicFormItem
        v-if="addCompanyType === 'proxy'"
        :formItem="form.temp.introduce"
        name="introduce"
        :obj="form"
        :key="index"
      >
        <template slot="custom_introduce">
          <zpWangEditor
            placeholder="请输入企业介绍"
            :value.sync="form.ruleForm.introduce"
            :isClear="true"
            :style="{ 'margin-left': '60px', width: '1094px' }"
          />
        </template>
      </zp-dynamicFormItem>
      <!-- 联系信息 -->
      <div class="forms_title">
        <span class="line"></span>联系信息
        <el-tooltip
          v-if="addCompanyType === 'autonomous'"
          class="item"
          effect="dark"
          content="将作为企业的初始管理员用户~"
          placement="right"
        >
          <i class="el-icon-info" style="color: #8798ad" />
        </el-tooltip>
      </div>
      <!-- 联系人 -->
      <zp-dynamicFormItem
        :formItem="form.temp.contact"
        name="contact"
        :obj="form"
        :key="index"
      />
      <!-- 联系方式 -->
      <zp-dynamicFormItem
        :formItem="form.temp.mobile"
        name="mobile"
        :obj="form"
        :key="index"
      >
        <template slot="custom_mobile">
          <el-input
            v-model="form.ruleForm.mobile"
            style="width: 440px"
            class="infoForm-input"
          >
            <zp-select
              class="prefixMobile"
              slot="prepend"
              :clearable="false"
              v-model="form.ruleForm.countryCode"
              :data="form.temp.mobile.data"
            />
          </el-input>
        </template>
      </zp-dynamicFormItem>
      <!-- 初始密码 -->
      <zp-dynamicFormItem
        :formItem="form.temp.initialPwd"
        name="initialPwd"
        :obj="form"
      />
      <!-- 企业亮点 -->
      <div class="forms_title" v-if="addCompanyType === 'proxy'">
        <span class="line"></span>企业亮点
        <el-tooltip
          class="item"
          effect="dark"
          content="设置企业亮点会吸引更多求职者哦~"
          placement="right"
        >
          <i class="el-icon-info" style="color: #8798ad" />
        </el-tooltip>
      </div>
      <zp-dynamicFormItem
        class="companyTags"
        :formItem="form.temp.companyTags"
        name="companyTags"
        :obj="form"
      >
        <template slot="custom_companyTags">
          <div
            @click="labelClick(item)"
            class="label"
            :class="item.labelActive ? 'labelActive' : ''"
            v-for="(item, index) in form.temp.companyTags.data"
            :key="index"
          >
            {{ item.label }}
          </div>
        </template>
      </zp-dynamicFormItem>
      <!-- 企业环境 -->
      <div class="forms_title">
        <span class="line"></span
        >{{ addCompanyType === "proxy" ? "企业环境" : "营业执照" }}
        <el-tooltip class="item" effect="dark" placement="right">
          <i class="el-icon-info" style="color: #8798ad" />
          <ul slot="content" class="business-license_msg">
            <li>1、国徽、二维码、公章需完整，不能缺失；</li>
            <li>2、营业执照无水印；</li>
            <li>3、清晰原件数码照，拒绝扫描件、悬挂件；</li>
            <li>4、复印件需加公司红章；</li>
            <li>5、营业执照四周边框需完整，不折叠，不反光，文字清晰可见；</li>
            <li>6、请提供含统一社会信用代码的新版执照。</li>
          </ul>
        </el-tooltip>
        <!-- <span style="margin-left:4px;font-size: 12px;color: #69707F;">最多添加6张图片，每张大小不超过2M</span> -->
      </div>
      <zp-dynamicFormItem
        :formItem="form.temp.companyPics"
        name="companyPics"
        :obj="form"
      >
        <div slot="custom_companyPics" style="margin-left: 60px">
          <zp-upload
            :formModel.sync="companyPicsFormModel"
            :uploadType="'image'"
            :limit="6"
            @input="companyPicsUploadSuccess"
          />
        </div>
      </zp-dynamicFormItem>
      <!-- 版本开通< -->
      <div class="forms_title" v-if="addCompanyType === 'autonomous'">
        <span class="line"></span>版本开通
      </div>
      <zp-dynamicFormItem
        :formItem="form.temp.version"
        name="version"
        :obj="form"
      />
      <!-- 企业介绍 -->
      <div
        v-if="addCompanyType === 'autonomous'"
        class="forms_title"
        style="margin-top: 0px"
      >
        <span class="line"></span>企业介绍
      </div>
      <zp-dynamicFormItem
        v-if="addCompanyType === 'autonomous'"
        :formItem="form.temp.introduce"
        name="introduce"
        :obj="form"
        :key="index"
      >
        <template slot="custom_introduce">
          <zpWangEditor
            placeholder="请输入企业介绍"
            :value.sync="form.ruleForm.introduce"
            :isClear="true"
            :style="{ 'margin-left': '60px', width: '1094px' }"
          />
        </template>
      </zp-dynamicFormItem>
    </el-form>
    <div class="editFooter">
      <zp-button @click="save" class="zp-btn-primary">保 存</zp-button>
      <zp-button @click="toPage">取 消</zp-button>
    </div>
    <!-- 地图选址弹框 -->
    <el-dialog
      title="地图选址"
      :visible.sync="mapDialogConfig.visible"
      width="45%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="map-container" id="map-container"></div>
      <span slot="footer" class="dialog-footer">
        <zp-button @click="mapDialogConfig.visible = false">取 消</zp-button>
        <zp-button type="primary" @click="mapDialogEnter">确 定</zp-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import updateCompany from "./updateCompany";
export default updateCompany;
</script>
