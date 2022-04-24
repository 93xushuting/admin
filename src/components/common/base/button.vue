<template>
  <el-button v-ubt="{action: 'click', event: 'button', prop : prop}" v-ripple v-on="$listeners" :size="size" :type="type" :plain="plain"
    :round="round" :loading="loading" :disabled="disabled" :icon="icon" :autofocus="autofocus">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'button',
  props: {
    prop: Object,
    // 尺寸
    size: {
      type: String,
      default: 'medium' // medium / small / mini
    },
    // 类型
    type: {
      type: String,
      default: '' // primary / success / warning / danger / info / text
    },
    // 是否朴素按钮
    plain: {
      type: Boolean,
      default: false
    },
    // 是否圆形按钮
    round: {
      type: Boolean,
      default: false
    },
    // 是否加载中状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 图标类名
    icon: String,
    // 是否默认聚焦
    autofocus: {
      type: Boolean,
      default: false
    }
  }
}
</script>
