<style lang="less" scoped>
  .base-select_wrapper{
    /deep/ .el-select__tags {
      .el-tag:first-child {
        max-width: 75%;
        .el-select__tags-text {
          max-width: 94%;
          display: inline-block;
          vertical-align: bottom;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-tag__close.el-icon-close{
          right: -3px;
        }
      }
    }
  }
</style>

<template>
  <el-select class="base-select_wrapper" :multiple="multiple" v-model="value" v-ubt="{action: 'select', event: 'select', prop : prop}"
    v-on="$listeners" v-bind="$attrs" :clearable="clearable" :filterable="filterable" :popper-append-to-body="popperAppendToBody"
    :multiple-limit="multipleLimit" :collapse-tags="collapseTags">
    <el-option v-for="item in data" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
      <template v-if="item.subLabel">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.subLabel }}</span>
      </template>
      <!-- <solt name="custom"></solt> -->
    </el-option>
    <div slot="empty" v-if="slotEmpty">
      <slot name="select_slot_empty_template"></slot>
    </div>
  </el-select>
</template>
<script>
export default {
  props: {
    data: Array,
    value: {
      type: String,
      default: ''
    }, // 默认选中的值
    clearable: {
      type: Boolean,
      default: true // 单选时是否可以清空选项	boolean	—	false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    slotEmpty: {
      type: Boolean,
      default: false
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true // 是否可搜索 boolean	—	false
    }
  },
  data () {
    return {

    }
  },
  watch: {

  },
  created () {

  },
  methods: {

  }
}
</script>
