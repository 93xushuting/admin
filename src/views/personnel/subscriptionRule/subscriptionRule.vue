<style lang="less" scoped>
@import "./subscriptionRule.less";
</style>

<template>
  <div class="element__body_info subscription-rule-wrapper">
    <div class="breadcrumb">
      <i class="iconfont iconfanhuishangji" @click="toPage" />
      {{ id ? "编辑订阅规则" : "设置订阅规则" }}
    </div>
    <div class="subscription-rule-body">
      <div class="subscription-rule-main">
        <el-form
          :ref="form.name"
          :model="form.ruleForm"
          :rules="form.rules"
          :inline="form.inline"
          :label-width="form.labelWidth"
        >
          <zp-dynamicFormItem
            :obj="form"
            :formItem="form.temp.name"
            name="name"
          />
          <div class="condition">
            <div class="condition-title">条件筛选</div>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.gender"
              name="gender"
            />
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.age"
              name="age"
            >
              <template v-slot:custom_age>
                <div class="form-item-group">
                  <zp-dynamicFormItem
                    :rules="minMaxAgeRequirementRule"
                    :obj="form"
                    :formItem="form.temp.minAge"
                    name="minAge"
                  >
                    <template v-slot:custom_minAge>
                      <el-input
                        v-model.number="form.ruleForm.minAge"
                        placeholder="请输入"
                      >
                        <template slot="append">岁</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                  <span class="placeholder">-</span>
                  <zp-dynamicFormItem
                    :rules="minMaxAgeRequirementRule"
                    :obj="form"
                    :formItem="form.temp.maxAge"
                    name="maxAge"
                  >
                    <template v-slot:custom_maxAge>
                      <el-input
                        v-model.number="form.ruleForm.maxAge"
                        placeholder="请输入"
                      >
                        <template slot="append">岁</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                </div>
              </template>
            </zp-dynamicFormItem>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.registerLocation"
              name="registerLocation"
            >
              <template v-slot:custom_registerLocation>
                <el-cascader
                  :props="{
                    value: 'id',
                    label: 'title',
                    children: 'sub',
                  }"
                  v-model="form.ruleForm.registerLocation"
                  :options="areaOptions"
                  :clearable="true"
                />
              </template>
            </zp-dynamicFormItem>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.currentLocation"
              name="currentLocation"
            >
              <template v-slot:custom_currentLocation>
                <el-cascader
                  :props="{
                    value: 'id',
                    label: 'title',
                    children: 'sub',
                  }"
                  v-model="form.ruleForm.currentLocation"
                  :options="areaOptions"
                  :clearable="true"
                />
              </template>
            </zp-dynamicFormItem>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.education"
              name="education"
            />
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.experience"
              name="experience"
            >
              <template v-slot:custom_experience>
                <div class="form-item-group">
                  <zp-dynamicFormItem
                    :rules="minMaxExpRequirementRule"
                    :obj="form"
                    :formItem="form.temp.minExp"
                    name="minExp"
                  >
                    <template v-slot:custom_minExp>
                      <el-input
                        v-model.number="form.ruleForm.minExp"
                        placeholder="请输入"
                      >
                        <template slot="append">年</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                  <span class="placeholder">-</span>
                  <zp-dynamicFormItem
                    :rules="minMaxExpRequirementRule"
                    :obj="form"
                    :formItem="form.temp.maxExp"
                    name="maxExp"
                  >
                    <template v-slot:custom_maxExp>
                      <el-input
                        v-model.number="form.ruleForm.maxExp"
                        placeholder="请输入"
                      >
                        <template slot="append">年</template>
                      </el-input>
                    </template>
                  </zp-dynamicFormItem>
                </div>
              </template>
            </zp-dynamicFormItem>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.marriageBirth"
              name="marriageBirth"
            />
          </div>

          <div class="condition">
            <div class="condition-title">人才求职意愿</div>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.jobWanted"
              name="jobWanted"
            />
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.wantedJob"
              name="wantedJob"
            />
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.wantedCity"
              name="wantedCity"
            />

            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.wantedMoney"
              name="wantedMoney"
            />
          </div>

          <div class="condition condition-tag">
            <div class="condition-title">选择标签</div>
            <zp-dynamicFormItem
              :obj="form"
              :formItem="form.temp.tags"
              name="tags"
            >
              <template v-slot:custom_tags="{ customProps }">
                <div class="tag-container">
                  <div
                    :class="['tag-item', item.selected && 'tag-item-selected']"
                    v-for="item in customProps.data"
                    :key="item.id"
                    @click="selectTagHandle(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </template>
            </zp-dynamicFormItem>
          </div>
        </el-form>
      </div>
    </div>
    <div class="subscription-rule-footer">
      <zp-button class="zp-btn-primary" @click="formSubmit">保存</zp-button>
      <zp-button @click="toPage">取消</zp-button>
    </div>
  </div>
</template>

<script>
import subscriptionRule from './subscriptionRule'
export default subscriptionRule
</script>
