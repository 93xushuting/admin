<template>
  <div class="tabs-state-group" :class="tabsClass">
    <div class="tabs-state-button-group">
      <template v-for="(item,index) in data">
        <template v-if="!item.disabled">
          <template v-if="isEnabled">
            <el-button v-if="item.enabled" type="text" :key="index" @click="selectClick($event,item.value, index)"
              :class="{'actived':item.value === value}">
              {{item.label}}
              <i :class="item.icon" v-if="item.icon"></i>
            </el-button>
          </template>
          <template v-else>
            <el-button type="text" :key="index" @click="selectClick($event,item.value, index)" :class="{'actived':item.value === value}">
              {{item.label}}
              <i :class="item.icon" v-if="item.icon"></i>
            </el-button>
          </template>
          <span :key="index"></span>
        </template>
      </template>
      <div class="tabs-state-group__active-bar"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabsClass: Number,
    badge: Boolean, // 是否显示badge
    data: {
      type: Array
    },
    summary: {
      type: Object
    },
    value: {
      type: [String, Number]
    },
    isEnabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    summary: {
      handler (val, oldVal) {
        console.info('summary watch')
        this.refresh()
      },
      deep: true
    },

    value (val) {
      this.refresh()
    }
  },
  created () {
    console.info('tabs created')
    this.refresh()
  },
  methods: {
    refresh () {
      this.$nextTick(() => {
        this.get()
      })
    },
    getIdx () {
      setTimeout(() => {
        this.get()
      }, 200)
    },
    get () {
      let index = this.data.findIndex((ele) => {
        return ele.value === this.value
      })
      this.calcPosition(index)
    },
    calcPosition (index) {
      let btns = this.$el.querySelectorAll('button')
      if (btns[index]) {
        let left = btns[index].offsetLeft + (btns[index].offsetWidth - 20) / 2
        this.$el.querySelector('.tabs-state-group__active-bar').style.transform = `translateX(${left}px)`
      }
    },
    selectClick ($event, val, index) {
      if ($event.target.nodeName === 'SPAN' || $event.target.nodeName === 'BUTTON') {
        this.$emit('input', val)
        this.$emit('click', val)
      }
    }
  }
}
</script>
