<template>
  <el-radio-group v-ubt="{action: 'click', event: 'radio', prop : prop}" v-model="value" v-on="$listeners" :textColor="textColor" :fill="fill"
    :disabled="disabled" :size="size">
    <template v-if="button">
      <el-radio-button :label="item.value" v-for="(item, index) in data" :key="index" :border="border">{{item.label}}</el-radio-button>
    </template>
    <template v-else>
      <el-radio :label="item.value" v-for="(item, index) in data" :key="index" :border="border">{{item.label}}</el-radio>
    </template>
  </el-radio-group>
</template>

<script>
export default {
  name: 'radioGroup',
  props: {
    prop: Object,
    data: Array,
    value: String, // 默认选中的值
    // 是否禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 按钮形式的 按钮形式的 Radio 激活时的文本颜色
    textColor: {
      type: String,
      default: '#ffffff'
    },
    // 按钮形式的 Radio 激活时的填充色和边框色
    fill: {
      type: String,
      default: '#409EFF'
    },
    // 单选框组尺寸
    size: {
      type: String,
      default: '' // 仅对按钮形式的 Radio 或带有边框的 Radio 有效 medium / small / mini
    },
    border: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
    }
  }
  // watch: {
  //   radio (val) {
  //     this.$emit(this.$listeners.change, val)
  //   }
  // },
  // data () {
  //   return {
  //     radio: ''
  //   }
  // },
  // created () {
  //   this.radio = this.value
  //   console.info(this.radio)
  // },
  // methods: {
  //   init () {
  //     this.radio = this.value
  //   }
  // }
}
</script>
