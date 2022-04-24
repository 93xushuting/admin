<template>
  <div class="treeBody" :class="isPadding ? 'treeBodyPadding': ''">
    <template v-for="(item,index) in trees.children">
      <template v-if="item.isMenu === 1">
        <el-checkbox :disabled="item.disabled" :label="item.value" :key="index" v-model="item.checkAll" :indeterminate="item.isIndeterminate"
          @change="clickNode(item)">
          {{item.label}}
        </el-checkbox>
        <authItem v-if="item.children &&  item.children.length" :trees="item" :checkData="checkData" :key="index" :isPadding="true" />
      </template>
      <template v-else>
        <!-- {{item.checkAll +' ---------- '+item.isIndeterminate}} -->
        <!-- {{trees.checkedList}} -->
        <el-checkbox :disabled="item.disabled" :label="item.value" v-model="trees.checkedList" @change="clickNode(item,'lastChild')" :key="index">
          {{item.label}}
        </el-checkbox>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  name: 'authItem',
  props: {
    isDisabled: { // 全部不点编辑、详细页面用到 true：不能编辑，false：可编辑
      type: Boolean,
      default: false
    },
    trees: {
      type: Object,
      default: function () {
        return {}
      }
    },
    checkData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isPadding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      events: null
    }
  },
  methods: {
    getEvent (e, obj) {
      let ev = e.$parent
      if (ev) {
        if (ev.clickItme) {
          this.events = ev
        } else {
          this.getEvent(ev, obj)
        }
      }
    },
    clickNode (item, name) { // 先子再父
      this.getEvent(this, item)
      this.events && this.events.handleCheckedParent(item, name)
    }
  }
}
</script>
<style lang="less" >
.treeBody{
  padding-left: 50px;
  background: #FFF;
}
.treeBodyPadding{
  padding-left: 25px;
}
  
</style>
