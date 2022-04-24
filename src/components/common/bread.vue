<template>
  <div class="breadcrumb">
    <!-- <div class=" breadcrumbTitle">{{breadLast && (breadLast.meta.name || breadLast.name) }}</div> -->
    <el-breadcrumb separator="/">
      <template v-for='(item,index) in breadcrumbList'>
        <template v-if="item.path === '/setting' || item.path === '/recruit' || item.path === '/operationCenter'">
          <el-breadcrumb-item :key='index'>{{ (item.meta && item.meta.name) || item.name}} </el-breadcrumb-item>
        </template>
        <template v-else>
          <el-breadcrumb-item :key='index' :arrt="item.path" :to="{ path: item.path }">
            {{ (item.meta && item.meta.name) || item.name}}
          </el-breadcrumb-item>
        </template>
      </template>
    </el-breadcrumb>
    <template v-if="obj.breadcrumb.isShowBack">
      <div class="back">
        <zp-button @click="back">返回</zp-button>
      </div>
    </template>
  </div>
</template>
<script>
import menus from '@/router/menu'
export default {
  name: 'bread',
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      breadcrumbList: [],
      breadLast: '',
      menus: window.menusList
    }
  },
  methods: {
    back () {
      let fn = this.obj.breadcrumb.callback
      if (_fn.isFunction(fn)) {
        fn && fn()
      } else {
        this.$router.go(-1)
      }
    },
    getPath (path) {
      console.info(menus, path)
    },
    setBreadcrumbList () {
      let matched = this.$route.matched
      console.info('setBreadcrumbList', matched)
      if (matched && matched[1]) {
        var path = matched[1].path
        let active = path.split('/') // system/role/:id/abcd --> ['','system','role',':id','abcd'] --> 管理中心 / 角色管理 / 新增 / abcd
        active.shift()
        if (active && active.length > 1) {
          let array = []
          let level1 = '/' + active.shift()
          let __list = JSON.parse(JSON.stringify(_store.state.menu.obj))
          array = this.handleSelect(__list, level1, 'level') // menus 由于这个里面没有 system/role/:id 这样的
          console.info('aaaabbbbb  ', window.allPath_)
          let level = level1
          active.forEach((ele) => {
            level += '/' + ele
            let p = window.allPath_[level]
            if (p) {
              array = array.concat(p)
              console.info(array, '由于这个里面没有一级', level)
            }
          })
          this.breadcrumbList = array
          this.breadLast = array[array.length - 1]
        }
      }
    },
    handleSelect (menus, key, level) { // (点击加载)
      let arr = []
      if (menus && menus.length) {
        for (let i = 0; i < menus.length; i++) {
          let m = menus[i]
          if (m.path === key) {
            arr.push(m)
            break
          }
        }
      }
      return arr
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setBreadcrumbList()
    })
    console.info('matched', this.$route.matched)
  },
  created () {

  }
}
</script>

<style lang='less' scoped>
.breadcrumb{
  /* height: 48px;
  line-height: 48px; */
  font-size: 16px;
  border-bottom: 1px solid #EAEAEA;
  margin-bottom: 20px;
  padding-left: 20px;
  >div{
    display: inline-block;
    /* height: 60px;
    line-height: 60px; */
    vertical-align: middle;
  }
  .breadcrumbTitle{
    font-size: 20px;
    color:#333!important;
    margin-right: 20px;
  }
  .back{
    float: right;
  }
  /deep/.el-breadcrumb__inner {
    font-weight: 400;
    font-size: 16px;
    color: #69707F;
    letter-spacing: 0.52px;
    line-height: 25px;
  }
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    cursor: text;
    font-family: PingFangSC-Medium;
    color: #4A84FF;
    letter-spacing: 0.52px;
    line-height: 25px;
  }
}
</style>
