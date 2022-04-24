<template>
  <el-input v-model="value" v-ubt="{action: 'input', event: 'select', prop : prop}" v-on="$listeners" :type="type" :value="value"
    :maxlength="maxlength" :minlength="minlength" :placeholder="placeholder" :clearable="clearable" :disabled="disabled" :size="size"
    :prefix-icon="prefixIcon" :suffix-icon="suffixIcon" :rows="rows" :autosize="autosize" :auto-complete="autoComplete" :name="name"
    :readonly="readonly" :max="max" :min="min" :resize="resize" :show-word-limit="limit" :autofocus="autofocus" :form="form" :label="label"
    :tabindex="tabindex">
    <slot name="prepend"></slot>
    <slot name="append"></slot>
  </el-input>
</template>
<script>
export default {
  props: {
    data: Array,
    type: {
      type: String,
      default: 'text' // 类型	string	text / textarea	text
    },
    limit: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: '' // 绑定值	string / number	—	—
    },
    maxlength: Number, // 最大输入长度	number	—	—
    minlength: Number, // 最小输入长度	number	—	—
    placeholder: {
      type: String,
      default: '请输入...' // 占位符	string	—	请选择
    },
    clearable: {
      type: Boolean,
      default: false // 是否可清空	boolean	—	false
    },
    disabled: {
      type: Boolean,
      default: false // 是否禁用	boolean	—	false
    },
    size: {
      type: String,
      default: '' // 输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
    },
    prefixIcon: {
      type: Boolean,
      default: false // 输入框头部图标	string	—	—
    },
    suffixIcon: {
      type: Number,
      default: 0 // 输入框尾部图标	string	—	—
    },
    rows: {
      type: Number,
      default: 3 // 输入框行数，只对 type="textarea" 有效	number	—	2
    },
    autosize: {
      type: [Boolean, Object],
      default: false // 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
    },
    autoComplete: {
      type: String,
      default: 'on' // 原生属性，自动补全	string	on, off	off
    },
    name: String, // 原生属性	string	—	—
    readonly: Boolean, // 原生属性，是否只读	boolean	—	false
    max: Number, // 原生属性，设置最大值	—	—	—
    min: Number, // 原生属性，设置最大值	—	—	—
    step: Number, // 原生属性，设置输入字段的合法数字间隔	—	—	—
    resize: {
      type: String,
      default: 'none' // 控制是否能被用户缩放	string	none, both, horizontal, vertical	—
    },
    autofocus: {
      type: Boolean,
      default: false // 原生属性，自动获取焦点	boolean	true, false	false
    },
    form: String, // 原生属性	string	—	—
    label: {
      type: String,
      default: '' // 输入框关联的label文字	string	—	—
    },
    tabindex: {
      type: String,
      default: '' // 输入框的tabindex	string	-	-
    }
  },
  data () {
    return {
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.$emit('input', _fn.trim(val))
      }
    }
  },
  created () {

  },
  methods: {

  }
}
</script>
