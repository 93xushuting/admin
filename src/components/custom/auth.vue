<template>
  <!-- 权限菜单 -->
  <div ref="authMenu">
    <template v-for="(item,index) in treesData">
      <el-row class="tables" :key="index" :class="!item.isShow ?'treebodery':''">
        <el-col class="treeTitle" v-on:click.native="item.children && item.children.length ? rowTogger(item):''">
          <el-checkbox :disabled="item.disabled" :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)">
            {{item.label}}</el-checkbox>
          <i v-if="item.children && item.children.length" :class="!item.isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
        </el-col>
        <el-col v-if="!item.isShow">
          <authItem v-if="item.children &&  item.children.length" :trees="item" :checkData="checkData" :key="index" v-on:clickItme="clickItme"
            :isDisabled="isDisabled" />
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<script>
import authItem from '@c/custom/authItem'
window.linkageData = {} // 保存联动数据
export default {
  name: 'auth',
  components: { authItem },
  props: {
    isDisabled: { // 全部不点编辑、详细页面用到 true：不能编辑，false：可编辑
      type: Boolean,
      default: false
    },
    treesData: {
      type: Array,
      default: function () {
        return []
      }
    },
    checkData: { // 选中的IDS
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    rowTogger (item) {
      console.info('rowTogger', item.isShow, item.children, item.children.length)
      item.isShow = !item.isShow
    },
    setCheckData () {
      let param = this.getParam()
      this.checkData.auths = param
      console.info('setCheckData', param)
      return param
    },
    getData (data, ret) { // 获取选中树的数据
      data.map((ele) => {
        let all = (ele.checkAll && !ele.isIndeterminate) // 全选
        let isNotAll = (!ele.checkAll && ele.isIndeterminate) // 半选
        if (all || isNotAll) {
          ret.push(ele.value)
        }
        if (ele.children && ele.children.length) {
          return this.getData(ele.children, ret)
        }
      })
      return ret
    },
    getParam () {
      let d = this.getData(this.treesData, [])
      console.info(d)
      return d
    },
    setData (idx) { // 设置数据 反选
      if (idx && idx.length) {
        this.buildTree(this.treesData, idx)
        console.info(this.treesData)
      }
    },
    buildTree (data, array) { // 设置选中树
      data.map((ele) => {
        if (ele.children && ele.children.length) {
          this.buildTree(ele.children, array)
        } else {
          if (array.indexOf(ele.value) > -1) { // 子 - 父 选中 
            // 全选
            ele.checkAll = true
            ele.isIndeterminate = false
            // debugger
            if (ele.parent && ele.parent.checkedList) { // 父级
              ele.parent.checkedList.push(ele.value)
              this.setParent(ele.parent)
            }
          }
        }
      })
    },
    buildAuthTable (array, arr, map) { // 生成树
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        let obj = {
          parent: map || item, // 父节点
          isShow: true, // 不展开 false
          label: item.name,
          checkAll: false,
          // label: item.name + '(' + item.id + ')',
          // checkAll: true,
          value: item.id,
          isMenu: item.type === 'MENU' ? 1 : 0,
          isIndeterminate: false,
          checkedList: [],
          nodeIdx: [], // 反选时用到
          children: [] // 子节点
        }
        if (this.isDisabled) { // 全部不点编辑、详细页面用到
          obj.disabled = true
        }
        if (item.linkage) { // 联动
          obj.linkage = item.linkage
        }
        // if (obj.value === 57) {
        //   obj.linkage = [71, 79]
        // }
        // if (obj.value === 67) {
        //   obj.linkage = [71, 79]
        // }
        if (map && map.nodeIdx) {
          map.children.push(obj)
          map.nodeIdx.push(item.id)
          // map.checkedList = map.nodeIdx // obj.checkAll = true 全选 时 注释放开,
          if (item.children && item.children.length) {
            this.buildAuthTable(item.children, map.children, obj)
          }
        } else {
          if (obj.label === '首页' || obj.label === '工作台') {
            obj.checkAll = true
            obj.disabled = true
          }
          arr.push(obj)
          if (item.children && item.children.length) {
            this.buildAuthTable(item.children, arr, obj)
          }
        }
      }
      return arr
    },
    getLinkageData (arr, array) { // 获得关联数据
      array = (array && array.length) ? array : this.treesData
      for (let i = 0; i < array.length; i++) {
        var item = array[i]
        if (item.isMenu === 0) { // 只加载按钮
          linkageData[item.value] = item
        }
        if (item.children && item.children.length) {
          this.getLinkageData(arr, item.children)
        }
      }
    },
    setParent (obj) { // 递归父
      let map = {
        all: [], // 全选1
        isNotAll: [], // 半选2
        not: [] // 全不选3
      }
      obj.children.map((i) => {
        let all = (i.checkAll && !i.isIndeterminate) // 全选
        let isNotAll = (!i.checkAll && i.isIndeterminate) // 半选
        let not = (!i.checkAll && !i.isIndeterminate) // 全不选
        if (all) {
          map.all.push(1)
        } else if (isNotAll) {
          map.isNotAll.push(2)
        } else if (not) {
          map.not.push(3)
        }
      })
      let arr = [...map.all, ...map.isNotAll, ...map.not] // 合并
      arr = Array.from(new Set(arr)) // 去重
      arr = arr.sort() // 排序
      if (arr.length === 1) { // 1,2,3
        let t = arr[0]
        if (t === 3) { // 全不选
          obj.checkAll = false
          obj.isIndeterminate = false
          obj.checkedList = []
        } else if (t === 2) { // 半选
          obj.checkAll = false
          obj.isIndeterminate = true
        } else if (t === 1) { // 全选
          obj.checkAll = true
          obj.isIndeterminate = false
        }
      } else if (arr.length === 3 || arr.length === 2) { // 123 // 12,13,23
        obj.checkAll = false
        obj.isIndeterminate = true
      }
      if (obj.parent) { // 父级
        this.setParent(obj.parent)
      }
    },
    setChildren (array, checkAll) { // 递归子
      array.map((item) => {
        if (checkAll) {
          item.isIndeterminate = false
          item.checkedList = item.children && item.children.map((i) => {
            return i.value
          })
        } else {
          item.checkedList = []
        }
        if (item.linkage && item.linkage.length && item.isMenu === 0) {
          item.checkAll = !checkAll
          this.handleCheckedParent(item, 'lastChild')
        } else {
          item.checkAll = checkAll
          if (item.children && item.children.length) {
            this.setChildren(item.children, checkAll)
          }
        }
      })
    },
    clickItme (obj) {
      this.handleCheckAllChange(obj)
    },
    handleCheckAllChange (obj) { // 父查子
      if (obj.checkAll) {
        obj.isIndeterminate = false
        obj.checkedList = obj.children && obj.children.map((item) => {
          return item.value
        })
      } else {
        obj.checkedList = []
      }
      if (obj.children && obj.children.length) {
        this.setChildren(obj.children, obj.checkAll)
      }
      this.setCheckData()
    },
    handleCheckedParent (item, name, linkage, oldObj) { // 先子再父
      if (name === 'lastChild') {
        if (linkage === 'linkage') { // 联动标识
          item.checkAll = oldObj.checkAll
          if (item.checkAll) {
            item.isIndeterminate = false
          }
          if (item.checkAll) {
            item.parent.checkedList.push(item.value)
            item.parent.checkedList = [...new Set(item.parent.checkedList)]
          } else {
            // let index_ = item.parent.checkedList.indexOf(item.value)
            // item.parent.checkedList.splice(index_, 1)
          }
        } else {
          item.checkAll = !item.checkAll
          if (item.checkAll) {
            item.isIndeterminate = false
            if (item.linkage && item.linkage.length) {
              this.getLinkageData([]) // 获得关联数据,保存在 window.linkageData中
              item.linkage.map((v) => {
                linkageData[v] && this.handleCheckedParent(linkageData[v], name, 'linkage', item)
              })
            }
          }
          // item.checkAll = !item.checkAll
          // if (item.checkAll) {
          //   item.isIndeterminate = false
          // }
          // if (item.linkage && item.linkage.length) {
          //   this.getLinkageData([]) // 获得关联数据,保存在 window.linkageData中
          //   if (item.linkage.length === 1) { // 找到对应关联数 [79]-> [57] -> [71,79]
          //     console.info('22222222222222', item)
          //     let t = linkageData[item.linkage[0]]
          //     console.info('找到对应关联数', t.linkage)
          //     if (!item.checkAll && t && t.linkage && t.linkage.length > 1) {
          //       let count = 0
          //       t.linkage.map((v) => {
          //         let d = linkageData[v]
          //         if (item.checkAll === d.checkAll) {
          //           count = count + 1
          //         }
          //       })
          //       if (count === t.linkage.length) {
          //         item.linkage.map((v) => {
          //           linkageData[v] && this.handleCheckedParent(linkageData[v], name, 'linkage', item)
          //         })
          //       }
          //     } else {
          //       this.handleCheckedParent(t, name, 'linkage', item)
          //     }
          //   } else { // [57] -> [71,79]
          //     console.info('11111111111111', item)
          //     item.linkage.map((v) => {
          //       linkageData[v] && this.handleCheckedParent(linkageData[v], name, 'linkage', item)
          //     })
          //   }
          // }
        }
        // console.info('handleCheckedParent', item)
        // console.info('handleCheckedParent', item.parent.checkedList)
      }
      this.$nextTick(() => {
        if (item && item.children && item.children.length) { // 子
          this.handleCheckAllChange(item)
        }
        if (item && item.parent && item.parent.parent) { // 父级
          this.setParent(item.parent)
        }
        // 保存数据
        if (name === 'lastChild') { // 最后一级节点
          this.setCheckData()
          console.info('保存数据 ---- ', item)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tables{
  margin-bottom: 10px;
  .treeTitle{
    background: #F4F4F4;
    padding-left: 20px;
    color: #26334F;
    position: relative;
    cursor: pointer;
    i{
      position: absolute;
      right: 0;
      top: 0px;
      font-size: 14px;
      padding: 9px;
      cursor: pointer;
    }
  }
  .el-col{
    >div.treeBody{
      padding:10px 0 10px 50px 
    }
  }
}
.treebodery{
  border: 1px solid rgba(38,51,79,0.10);
}
</style>
