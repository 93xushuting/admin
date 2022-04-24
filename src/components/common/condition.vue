<template>
  <!-- 搜索条件 -->
  <el-form :label-width="obj.searchModel.labelWidth || labelWidth" size="small" ref="searchForm" class="searchForm" :inline="obj.searchModel.inline"
    @submit.native.prevent>
    <div class="param">
      <!-- 带展开搜索 -->
      <template v-if="isArrowDown">
        <slot name="formFrist" :form="obj.searchModel.temp"></slot>
        <el-form-item>
          <zp-button class="zp-btn-primary" @click="fn('load', 1)" v-if="!toggleShow">搜索</zp-button>
          <zp-button type="text" @click="toggleClick">
            <span class="btn-color-black">{{toggleShow ? "收起" : "展开"}}</span>
            <i :class="!toggleShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" class="el-icon--deg" />
          </zp-button>
        </el-form-item>
        <div v-if="toggleShow" class="dasheds">
          <slot v-if="!obj.formSort" name="form" :form="obj.searchModel.temp"></slot>
          <slot v-else name="formSort" :form="obj.searchModel.temp"></slot>
          <br />
          <el-form-item v-if="!obj.isBtn" class="searchForm-buttonPanel">
            <zp-button class="zp-btn-primary" @click="fn('load', 1)" v-if="toggleShow">搜索</zp-button>
            <zp-button class="zp-btn-primary-empty" @click="fn('reset', 1)">重置</zp-button>
          </el-form-item>
          <!-- 人才库规则条件 -->
          <slot name="rule-condition"></slot>
        </div>
      </template>
      <template v-else>
        <template v-if="isArrowDown2">
          <div class="dasheds">
            <slot name="form" :form="obj.searchModel.temp"></slot><br />
            <el-form-item class="searchForm-buttonPanel">
              <zp-button class="zp-btn-primary" @click="fn('load', 1)">搜索</zp-button>
              <zp-button class="zp-btn-primary-empty" @click="fn('reset', 1)">重置</zp-button>
            </el-form-item>
            <!-- 人才库规则条件 -->
            <slot name="rule-condition"></slot>
          </div>
        </template>
        <template v-else>
          <slot name="form" :form="obj.searchModel.temp"></slot>
          <el-form-item v-if="!obj.isBtn" class="searchForm-buttonPanel">
            <zp-button class="zp-btn-primary" @click="fn('load', 1)">搜索</zp-button>
            <zp-button class="zp-btn-primary-empty" @click="fn('reset', 1)">重置</zp-button>
          </el-form-item>
        </template>
      </template>
    </div>
    <div class="btns">
      <slot name="btns"></slot>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'condition',
  props: {
    isArrowDown: {
      type: Boolean,
      default: false
    },
    isArrowDown2: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    obj: {
      handler (val, oldVal) {
        // console.info('搜索条件', val)
        this.obj = val
      },
      deep: true
    }
  },
  data () {
    return {
      toggleShow: false
    }
  },
  methods: {
    toggleClick () {
      this.toggleShow = !this.toggleShow
      setTimeout(() => {
        console.info('window.onresize', window.onresize)
        window.onresize && window.onresize()
      }, 300)
      this.$emit('onchangeToggle', this.toggleShow)
    },
    fn (str, type) {
      // type:1 时代表直接点击的新增按钮
      let callback = this.$parent[str]
      console.log(str, type)
      callback && callback(str, type)
    }
  }
}
</script>
<style scoped lang="less">
</style>
