<style lang="less">
  @import './updateCandidate.less';
</style>
<template>
  <div class="candidate-wrapper">
    <el-form :ref="candidateForm.name" :inline="candidateForm.formInline" :rules="candidateForm.rules" :label-width="candidateForm.labelWidth"
      :model="candidateForm.ruleForm">
      <div>
        <zp-dynamicFormItem :obj="candidateForm" :formItem="candidateForm.temp.companyId" name="companyId" @change="companyIdChange" />
        <zp-dynamicFormItem :obj="candidateForm" :formItem="candidateForm.temp.jobId" name="jobId" />
        <zp-dynamicFormItem :obj="candidateForm" :formItem="candidateForm.temp.addressIds" name="addressIds">
          <template v-slot:custom_addressIds="{ customProps }">
            <zp-select @change="addressIdsChangeHandle" v-model="candidateForm.ruleForm.addressIds" v-bind="customProps" />
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem :obj="candidateForm" :formItem="candidateForm.temp.partJobTime" name="partJobTime">
          <template v-slot:custom_partJobTime="{ customProps }">
            <zp-select @change="partJobTimeChangeHandle" v-model="candidateForm.ruleForm.partJobTime" v-bind="customProps" />
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem :obj="candidateForm" :formItem="candidateForm.temp.deliveryChannelType" name="deliveryChannelType">
          <template v-slot:custom_deliveryChannelType="{ customProps }">
            <el-cascader v-model="candidateForm.ruleForm.deliveryChannelType" :placeholder="customProps.placeholder" :options="customProps.data"
              :filterable="customProps.filterable" :disabled="customProps.disabled" />
          </template>
        </zp-dynamicFormItem>
        <zp-dynamicFormItem :rules="setRecommenderRule()" :obj="candidateForm" :formItem="candidateForm.temp.recommender" name="recommender" />
        <zp-dynamicFormItem :rules="setRecommenderPhoneNumberRule()" :obj="candidateForm" :formItem="candidateForm.temp.recommenderPhoneNumber"
          name="recommenderPhoneNumber">
          <template v-slot:custom_recommenderPhoneNumber>
            <el-input :disabled="candidateForm.temp.recommenderPhoneNumber.disabled" v-model="candidateForm.ruleForm.recommenderPhoneNumber" placeholder="请输入...">
              <el-select :disabled="candidateForm.temp.recommenderPhoneNumber.disabled" v-model="candidateForm.ruleForm.prefix_recommenderPhoneNumber" slot="prepend" placeholder="请选择">
                <el-option v-for="item in phoneAreaCode" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-input>
          </template>
        </zp-dynamicFormItem>
      </div>
      <!-- 基本信息 -->
      <div v-show="setTemplateShow('baseInfoTemplate')">
        <div class="form-group_title">基本信息</div>
        <template v-for="(item, key) in candidateForm.temp.baseInfoTemplate">
          <zp-dynamicFormItem :rules="setFormItemRule('baseInfoTemplate', item, candidateForm.ruleForm.baseInfoTemplate)"
            :class="setFormItemClass('baseInfoTemplate', item)" :obj="candidateForm" :formItem="item" :name="'baseInfoTemplate.' + key" :key="key">
            <template :slot="'custom_' + key">
              <template v-if="!(!!key.match(/(avatar|phoneNumber|registerLocation|currentLocation|identityNumber|startingTime)/g))">
                <zp-radio v-if="key === 'gender'" v-model="candidateForm.ruleForm.baseInfoTemplate[key]" v-bind="item" />
                <zp-datePick @change="datePickChangeHandle('baseInfoTemplate', key, $event)"
                  v-else-if="item.props && item.props.formType === 'datePick'" v-model="candidateForm.ruleForm.baseInfoTemplate[key]" v-bind="item" />
                <zp-select v-else-if="item.props && item.props.formType === 'select'" v-model="candidateForm.ruleForm.baseInfoTemplate[key]"
                  v-bind="item" />
                <zp-input v-else v-model="candidateForm.ruleForm.baseInfoTemplate[key]" v-bind="item" />
              </template>

              <template v-if="key === 'startingTime'">
                <zp-datePick @change="datePickChangeHandle('baseInfoTemplate', key, $event)" v-model="candidateForm.ruleForm.baseInfoTemplate[key]"
                  v-bind="item" />
              </template>
              <template v-if="key === 'avatar'">
                <div class="avatar-wrappper">
                  <div class="avatar-contanier">
                    <el-input v-model="candidateForm.ruleForm.baseInfoTemplate[key]" style="display: none" />
                    <img v-if="candidateForm.ruleForm.baseInfoTemplate[key]" :src="candidateForm.ruleForm.baseInfoTemplate[key]" alt="">
                    <img v-else src="../../../assets/image/header.png" alt="">
                    <div class="upload-container">
                      <zp-upload :uploadType="'avatar'" :callback="avatarUploadSuccess" :limit="1">
                        <template v-slot:avatar>
                          <zp-button icon="el-icon-upload2">更换头像</zp-button>
                          <div class="message">请选择大小不超过2M 的照片</div>
                        </template>
                      </zp-upload>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="key === 'identityNumber'">
                <div class="user-identity">
                  <el-input :disabled= item.disabled v-model.trim="candidateForm.ruleForm.baseInfoTemplate[key]" placeholder="请输入">
                    <el-select :disabled= item.disabled v-model="candidateForm.ruleForm.baseInfoTemplate.identityType" slot="prepend" placeholder="请选择">
                      <el-option v-for="item in candidateForm.temp.baseInfoTemplate.identityType.data" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-input>
                </div>
              </template>
              <template v-if="key === 'phoneNumber'">
                <el-input :disabled = item.disabled v-model="candidateForm.ruleForm.baseInfoTemplate[key]" :placeholder="item.placeholder">
                  <el-select :disabled = item.disabled v-model="candidateForm.ruleForm.baseInfoTemplate['prefix_' + key]" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in phoneAreaCode" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-input>
              </template>
              <template v-if="key.match(/(registerLocation|currentLocation)/g)">
                <el-cascader :props="{
                    value: 'id',
                    label: 'title',
                    children: 'sub'
                  }" v-model="candidateForm.ruleForm.baseInfoTemplate[key]" :disabled = item.disabled :options="areaOptions" :placeholder="item.placeholder" />
                <div class="address-detail-wrapper">
                  <zp-input :disabled = item.disabled v-model="candidateForm.ruleForm.baseInfoTemplate[key.replace('Location', 'Address')]" />
                </div>
              </template>
            </template>
          </zp-dynamicFormItem>
        </template>
      </div>
      <!-- 工作经历 -->
      <div v-if="setTemplateShow('experienceTemplate')">
        <div class="form-group_title">
          工作经历
          <zp-button v-show="candidateForm.ruleForm.experienceTemplate.length < 10" class="zp-btn-primary" @click="addItem('experienceTemplate')">
            <i class="iconfont iconzhankai2"></i>
            新增工作经历
          </zp-button>
        </div>
        <transition-group tag="ul" class="work-experience-wrapper" name="fade" mode="out-in">
          <li class="work-experienc-item" v-for="(item, index) in candidateForm.ruleForm.experienceTemplate" :key="'name' + index">
            <div class="work-experienc-item_title">工作经历 {{candidateForm.ruleForm.experienceTemplate.length - index}}
              <zp-button @click="delItem('experienceTemplate', index)" type="text"><i class="iconfont iconshanchu"></i> 删除</zp-button>
            </div>
            <template v-for="(fieldObj, key) in candidateForm.temp.experienceTemplate">
              <zp-dynamicFormItem :rules="setFormItemRule('experienceTemplate', fieldObj, item)"
                :class="setFormItemClass('experienceTemplate', fieldObj)" :obj="candidateForm" :formItem="fieldObj"
                :name="'experienceTemplate.' + index + '.' + key" :key="key">
                <template :slot="'custom_' + key">
                  <template v-if="!(!!key.match(/(endTime|referencePhone)/g))">
                    <zp-datePick v-if="fieldObj.props && fieldObj.props.formType === 'datePick'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-input v-else-if="fieldObj.props && fieldObj.props.formType === 'textarea'" v-model="item[key]" v-bind="fieldObj"
                      :type='fieldObj.props.formType' />
                    <zp-select v-else-if="fieldObj.props && fieldObj.props.formType === 'select'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-input v-else v-model="item[key]" v-bind="fieldObj" />
                  </template>
                  <template v-if="key === 'endTime'">
                    <zp-datePick :disabled="item.rightNow" v-model="item[key]" v-bind="fieldObj" />
                    <el-checkbox v-model="item.rightNow">至今</el-checkbox>
                  </template>
                  <template v-if="key === 'referencePhone'">
                    <el-input v-model="item[key]" :placeholder="fieldObj.placeholder">
                      <el-select v-model="item['prefix_' + key]" slot="prepend" placeholder="请选择">
                        <el-option v-for="code in phoneAreaCode" :key="code.value" :label="code.label" :value="code.value" />
                      </el-select>
                    </el-input>
                  </template>
                </template>
              </zp-dynamicFormItem>
            </template>
          </li>
        </transition-group>
      </div>
      <!-- 教育经历 -->
      <div v-if="setTemplateShow('educationTemplate')">
        <div class="form-group_title">
          教育经历
          <zp-button v-show="candidateForm.ruleForm.educationTemplate.length < 10" class="zp-btn-primary" @click="addItem('educationTemplate')">
            <i class="iconfont iconzhankai2"></i>
            新增教育经历
          </zp-button>
        </div>
        <transition-group tag="ul" class="work-experience-wrapper" name="fade" mode="out-in">
          <li class="work-experienc-item" v-for="(item, index) in candidateForm.ruleForm.educationTemplate" :key="'name' + index">
            <div class="work-experienc-item_title">教育经历 {{candidateForm.ruleForm.educationTemplate.length - index}}
              <zp-button @click="delItem('educationTemplate', index)" type="text"><i class="iconfont iconshanchu"></i> 删除</zp-button>
            </div>
            <template v-for="(fieldObj, key) in candidateForm.temp.educationTemplate">
              <zp-dynamicFormItem :rules="setFormItemRule('educationTemplate',fieldObj, item)"
                :class="setFormItemClass('educationTemplate', fieldObj)" :obj="candidateForm" :formItem="fieldObj"
                :name="'educationTemplate.' + index + '.' + key" :key="key">
                <template :slot="'custom_' + key">
                  <template v-if="!(!!key.match(/(endTime|referencePhone)/g))">
                    <zp-datePick v-if="fieldObj.props && fieldObj.props.formType === 'datePick'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-input v-else-if="fieldObj.props && fieldObj.props.formType === 'textarea'" v-model="item[key]" v-bind="fieldObj"
                      :type='fieldObj.props.formType' />
                    <zp-select v-else-if="fieldObj.props && fieldObj.props.formType === 'select'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-input v-else v-model="item[key]" v-bind="fieldObj" />
                  </template>
                  <template v-if="key === 'endTime'">
                    <zp-datePick :disabled="item.rightNow" v-model="item[key]" v-bind="fieldObj" />
                    <el-checkbox v-model="item.rightNow">至今</el-checkbox>
                  </template>
                  <template v-if="key === 'referencePhone'">
                    <el-input v-model="item[key]" :placeholder="fieldObj.placeholder">
                      <el-select v-model="item['prefix_' + key]" slot="prepend" placeholder="请选择">
                        <el-option v-for="code in phoneAreaCode" :key="code.value" :label="code.label" :value="code.value" />
                      </el-select>
                    </el-input>
                  </template>
                </template>
              </zp-dynamicFormItem>
            </template>
          </li>
        </transition-group>
      </div>
      <!-- 证件信息 -->
      <div v-if="setTemplateShow('identityTemplate')">
        <div class="form-group_title">
          证件信息
          <zp-button v-show="candidateForm.ruleForm.identityTemplate.length < 10" class="zp-btn-primary" @click="addItem('identityTemplate')">
            <i class="iconfont iconzhankai2"></i>
            新增证件信息
          </zp-button>
        </div>
        <transition-group tag="ul" class="work-experience-wrapper" name="fade" mode="out-in">
          <li class="work-experienc-item" v-for="(item, index) in candidateForm.ruleForm.identityTemplate" :key="'name' + index">
            <div class="work-experienc-item_title">证件信息 {{candidateForm.ruleForm.identityTemplate.length - index}}
              <zp-button @click="delItem('identityTemplate', index)" type="text"><i class="iconfont iconshanchu"></i> 删除</zp-button>
            </div>
            <template v-for="(fieldObj, key) in candidateForm.temp.identityTemplate">
              <zp-dynamicFormItem :rules="setFormItemRule('identityTemplate', fieldObj, item)" :class="setFormItemClass('identityTemplate', item)"
                :obj="candidateForm" :formItem="fieldObj" :name="'identityTemplate.' + index + '.' + key" :key="key">
                <template :slot="'custom_' + key">
                  <template v-if="key === 'identityPic'">
                    <el-input v-model="item[key]" style="display: none" />
                    <zp-upload :limit="1" uploadType="image" :formModel.sync="item[key]" />
                  </template>
                  <template v-else>
                    <zp-datePick v-if="fieldObj.props && fieldObj.props.formType === 'datePick'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-select v-else-if="fieldObj.props && fieldObj.props.formType === 'select'" v-model="item[key]" v-bind="fieldObj" />
                    <zp-input v-else v-model="item[key]" v-bind="fieldObj" />
                  </template>
                </template>
              </zp-dynamicFormItem>
            </template>
          </li>
        </transition-group>
      </div>
      <!-- 其他信息 -->
      <div v-if="setTemplateShow('othersTemplate')">
        <div class="form-group_title">其他信息</div>
        <template v-for="(item, key) in candidateForm.temp.othersTemplate">
          <zp-dynamicFormItem :rules="setFormItemRule('othersTemplate', item)" :class="setFormItemClass('othersTemplate', item)" :obj="candidateForm"
            :formItem="item" :name="'othersTemplate.' + key" :key="key">
            <template :slot="'custom_' + key">
              <template v-if="key === 'tags'">
                <el-input v-model="candidateForm.ruleForm.othersTemplate[key]" style="display: none" />
                <div class="hobby-container">
                  <span class="txt">爱好标签不超过10个</span>
                  <div class="hobby-tag-list">
                    <div class="hobby-tag-list-item" v-for="(tag, index) in candidateForm.ruleForm.othersTemplate[key]" :key="index">
                      <span>{{tag.value}}</span>
                      <zp-button @click="otherInfo_delTag('othersTemplate', key, index)" type="text" size="mini">
                        <i class="iconfont iconguanbidanchuang"></i>
                      </zp-button>
                    </div>
                    <div v-show="otherInfo_tagBtnShow(candidateForm.ruleForm.othersTemplate[key])" @click="otherInfo_hobbyTagFlag = true"
                      class="hobby-tag-list-item hobby-tag-list-btn">
                      <zp-button type="text" size="mini">
                        <i class="el-icon-plus"></i>
                      </zp-button>
                      <span>新标签</span>
                    </div>
                    <div class="hobby-tag-list-input" v-show="otherInfo_hobbyTagFlag">
                      <el-input :maxlength="10" v-model="otherInfo_tagValue" @keyup.enter.native="otherInfo_addTag('othersTemplate',key, $event)"
                        @blur="otherInfo_addTag('othersTemplate', key, $event)" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="key === 'pics'">
                <el-input v-model="candidateForm.ruleForm.othersTemplate[key]" style="display: none" />
                <div class="photosLife-group">
                  <div class="photosLife-title">图片数量不超过3张</div>
                  <zp-upload :limit="3" uploadType="image" :formModel.sync="candidateForm.ruleForm.othersTemplate[key]" />
                </div>
              </template>
              <template v-else>
                <el-input v-if="!!(key.match(/(height|weight)/g))" v-model="candidateForm.ruleForm.othersTemplate[key]"
                  :placeholder="item.placeholder">
                  <template slot="append">{{key === "height" ? "CM" : "KG"}}</template>
                </el-input>
                <zp-input v-else v-model="candidateForm.ruleForm.othersTemplate[key]" v-bind="item" :type="item.props && item.props.formType" />
              </template>
            </template>
          </zp-dynamicFormItem>
        </template>
      </div>
    </el-form>
    <!-- 面试邀约 -->
    <el-form :model="interviewForm.ruleForm" :rules="interviewForm.rules" :ref="interviewForm.name" :label-width="interviewForm.labelWidth"
      :inline="interviewForm.formInline" v-if="isShowInterviewForm && updateId === '0' && _fn.checkBtn('job_applicant/operate')">
      <div>
        <div class="form-group_title">
          面试邀约
          <zp-button class="zp-btn-primary" v-if="!isShowInterview" @click="isShowInterview = true">
            <i class="iconfont iconzhankai2"></i>
            添加面试邀约
          </zp-button>
        </div>
        <template v-if="isShowInterview">
          <transition-group tag="ul" class="work-experience-wrapper interview-wrapper" name="fade" mode="out-in">
            <li class="work-experienc-item" :key="interviewForm.name">
              <div class="work-experienc-item_title">面试信息
                <zp-button type="text" @click="isShowInterview = false"><i class="iconfont iconshanchu"></i> 删除</zp-button>
              </div>
              <div class="interview-form-item">
                <el-form-item :label="'面试时间'" required>
                  <el-col :span="17" style="margin-right: -1px">
                    <el-form-item prop="time" style="margin-right: 0px;">
                      <el-date-picker type="date" placeholder="请选择" v-model="interviewForm.ruleForm.time" value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd" style="width: 335px">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="hour">
                      <el-time-picker type="fixed-time" placeholder="请选择" v-model="interviewForm.ruleForm.hour" format="HH:mm" value-format="HH:mm"
                        style="width: 116px"></el-time-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <zp-dynamicFormItem :formItem="interviewForm.temp && interviewForm.temp.addressId" name="addressId" :obj="interviewForm" />
                <zp-dynamicFormItem :formItem="interviewForm.temp && interviewForm.temp.contact" name="contact" :obj="interviewForm"
                  @change="contactChange" />
                <zp-dynamicFormItem :formItem="interviewForm.temp && interviewForm.temp.mobile" name="mobile" :obj="interviewForm" />
                <zp-dynamicFormItem :formItem="interviewForm.temp && interviewForm.temp.notes" name="notes" :obj="interviewForm" />
                <div class="work-experienc-item_title">邀约方式
                </div>
                <zp-dynamicFormItem :obj="interviewForm" :formItem="interviewForm.temp && interviewForm.temp.invitationMethod">
                  <template v-slot:custom_invitationMethod="{ customProps }">
                    <el-checkbox-group v-model="interviewForm.ruleForm.invitationMethod">
                      <el-checkbox v-for="item in customProps.data" :key="item.value" :label="item.value" :disabled="item.disabled">{{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </template>
                </zp-dynamicFormItem>
                <el-form-item v-show="smsMsgFlag" label="短信模板" style="width: 568px">
                  <el-card class="sms-template" shadow="never">
                    <div class="container">
                      <p>
                        <span class="cue-color">【企业名称】</span>诚邀您参加面试！
                      </p>
                      <p>面试岗位：<span class="cue-color">职位名称</span></p>
                      <p>面试时间：<span class="cue-color">面试时间</span></p>
                      <p>面试地址：<span class="cue-color">面试地址</span></p>
                      <p>
                        联系方式：<span class="cue-color">联系人、联系电话</span>
                      </p>
                      <p>注意事项：<span class="cue-color">注意事项内容</span></p>
                    </div>
                  </el-card>
                </el-form-item>
              </div>
            </li>
          </transition-group>
        </template>
      </div>
    </el-form>
    <div class="candidate-wrapper-footer">
      <zp-button class="zp-btn-primary" @click="formSubmit">保存</zp-button>
      <zp-button @click="formReset">取消</zp-button>
    </div>
  </div>
</template>
<script>
import candidate from './updateCandidate'
export default candidate
</script>
