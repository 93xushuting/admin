<template>
  <el-form-item
    class="dynamicFormItem"
    :label="
      obj.isShowLabel ? (!formItem.isShowLabel ? formItem.label : '') : ''
    "
    :prop="name"
    v-if="formItem.isShow"
    :rules="rules"
    :required="required"
  >
    <template v-if="formItem.formType === 'text'">
      {{ obj.ruleForm[name] }}
    </template>
    <template v-if="!formItem.formType || formItem.formType === 'input'">
      <zp-input
        v-model.trim="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
      />
    </template>
    <template v-if="formItem.formType === 'select'">
      <zp-select
        v-model.trim="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
      >
        <template v-slot:select_slot_empty_template>
          <slot name="select_slot_empty_template"></slot>
        </template>
      </zp-select>
    </template>
    <template v-if="formItem.formType === 'radio'">
      <zp-radio
        v-model.trim="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
      />
    </template>
    <template v-if="formItem.formType === 'checkBox'">
      <zp-checkBox
        v-model.trim="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
      />
    </template>
    <template v-if="formItem.formType === 'datePick'">
      <zp-datePick
        v-model.trim="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
      />
    </template>
    <template v-if="formItem.formType === 'datetime'">
      <el-date-picker
        v-model.trim="obj.ruleForm[name]"
        type="datetime"
        placeholder="选择日期时间"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        class="infoForm-input"
        prefixIcon="el-icon-date"
      />
    </template>
    <template v-if="formItem.formType === 'custom'">
      <slot :name="'custom_' + formItem.key" :customProps="formItem"></slot>
    </template>

    <!-- <template v-if="!formItem.formType || formItem.formType === 'input'">
      <zp-input
        :type="formItem.type"
        v-model="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        class="infoForm-input"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="formItem"
        :maxlength="formItem.maxlength"
        :minlength="formItem.minlength"
        :placeholder="formItem.placeholder"
        :clearable="clearable"
        :disabled="formItem.disabled"
        :size="formItem.size"
        :prefix-icon="formItem.prefixIcon"
        :suffix-icon="formItem.suffixIcon"
        :rows="formItem.rows"
        :autosize="formItem.autosize"
        :auto-complete="formItem.autoComplete"
        :name="formItem.name"
        :readonly="formItem.readonly"
        :max="formItem.max"
        :min="formItem.min"
        :resize="formItem.resize"
        :show-word-limit="formItem.limit"
        :autofocus="formItem.autofocus"
        :form="formItem.form"
        :label="formItem.label"
        :tabindex="formItem.tabindex"
      />
    </template>
    <template v-if="formItem.formType === 'select'">
      <zp-select
        v-model="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        class="infoForm-input"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="$attrs"
        :data="formItem.data"
        :multiple="formItem.multiple"
        :disabled="formItem.disabled"
        :valueKey="formItem.valueKey"
        :size="formItem.size"
        :clearable="formItem.clearable"
        :collapse-tags="formItem.collapseTags"
        :multiple-limit="formItem.multipleLimit"
        :name="formItem.name"
        :placeholder="formItem.placeholder"
        :filterable="formItem.filterable"
        :allowCreate="formItem.allowCreate"
        :filter-method="formItem.filterMethod"
        :remote-method="formItem.remoteMethod"
        :remote="formItem.remote"
        :loading="formItem.loading"
        :loading-text="formItem.loadingText"
        :no-match-text="formItem.noMatchText"
        :no-data-text="formItem.noDataText"
        :popper-class="formItem.popperClass"
        :reserve-keyword="formItem.reserveKeyword"
        :default-first-option="formItem.defaultFirstOption"
      />
    </template>
    <template v-if="formItem.formType === 'radio'">
      <zp-radio
        v-model="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="$attrs"
        :data="formItem.data"
        :textColor="formItem.textColor"
        :fill="formItem.fill"
        :disabled="formItem.disabled"
        :size="formItem.size"
        :border="formItem.border"
      />
    </template>
    <template v-if="formItem.formType === 'checkBox'">
      <zp-checkBox
        v-model="obj.ruleForm[name]"
        :value="obj.ruleForm[name]"
        :class="formItem.class"
        :style="formItem.style"
        v-on="$listeners"
        v-bind="$attrs"
        :data="formItem.data"
        :text-color="formItem.textColor"
        :fill="formItem.fill"
        :disabled="formItem.disabledChild"
        :size="formItem.size"
        :min="formItem.min"
        :max="formItem.max"
        :border="formItem.border"
        :trueLabel="formItem.trueLabel"
        :falseLabel="formItem.falseLabel"
        :checked="formItem.checked"
        :name="formItem.name"
      />
    </template>-->
  </el-form-item>
</template>
<script>
export default {
  name: 'dynamicFormItem',
  props: {
    formItem: {
      // 基本信息
      type: Object,
      default: () => {
        return {}
      }
    },
    name: String, // key -- > userName
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rules: [Object, Array],
    required: {
      type: Boolean,
      default: false
    }
  },
  // watch: {
  //   formItem: {
  //     handler (val, oldVal) {
  //       console.info('dynamicFormItem111', val)
  //       this.formItem = val
  //     },
  //     deep: true
  //   }
  // },
  data () {
    return {}
  },
  mounted () {
    // console.info("$obj22222", this.formItem, "---------", props);
  },
  created () {
    // console.info("$obj", this.formItem);
  },
  methods: {}
}
</script>

<style lang='less' >
</style>
