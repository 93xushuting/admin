<template>
  <el-date-picker :prefix-icon="prefixIcon" v-model="value" v-ubt="{action: 'click', event: 'datePick', prop : prop}" v-on="$listeners"
    :readonly="readonly" :disabled="disabled" :editable="editable" :clearable="clearable" :size="size" :placeholder="placeholder"
    :startPlaceholder="startPlaceholder" :endPlaceholder="endPlaceholder" :type="type" :format="format" :align="align" :popperClass="popperClass"
    :picker-options="pickerOptions" :rangeSeparator="rangeSeparator" :defaultValue="defaultValue" :valueFormat="valueFormat" :name="name"
    :unlinkPanels="unlinkPanels">
  </el-date-picker>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    prefixIcon: {
      type: String,
      default: 'el-icon-caret-bottom'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    startPlaceholder: {
      type: String,
      default: ''
    },
    endPlaceholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    align: {
      type: String,
      default: 'left'
    },
    popperClass: {
      type: String,
      default: ''
    },
    pickerOptions: {
      type: Object
    },
    rangeSeparator: {
      type: String
    },
    defaultvalue: {
      type: String,
      default: ''
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    name: {
      type: String
    },
    unlinkPanels: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>

</style>
