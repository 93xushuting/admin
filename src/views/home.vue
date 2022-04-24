<template>
  <el-container class="home">
    <el-aside class="body-left">
      <div class="logo">
        <img src="../../static/image/logo-menu.png" width=100% height=100%>
      </div>
      <el-menu class="el-menu-vertical-demo" :defaultActive="$route.path" unique-opened router background-color="#161F47" text-color="#fff"
        active-text-color="#06152A">
        <template v-for="item in $store.state.menu.obj">
          <template v-if="item.resourceList && item.resourceList.length > 0 && (item.resourceList[0] && item.resourceList[0].type === 'MENU')">
            <el-submenu :index="item.path" :title="item.name" :attr="item.path" :key="item.path">
              <template slot="title">
                <i :class="item.icon"></i><span slot="title">{{ (item.meta && item.meta.name) || item.name }}</span>
              </template>
              <template v-for="subItem in item.resourceList">
                <el-menu-item v-if="!subItem.hidden" :key="item.path + subItem.path" :index="item.path + subItem.path" :title="subItem.name"
                  :attr="item.path + subItem.path"
                  :class="{'is-active' : $route.path.indexOf(item.path + subItem.path) > -1 && $route.path.split('/').length > 3}">
                  <template slot="title">{{ (subItem.meta && subItem.meta.name) || subItem.name }}</template>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item v-ripple :index="item.path" :title="item.name" :attr="item.path" :key="item.path"
              :class="{'is-active' : $route.path.indexOf(item.path) > -1 && $route.path.split('/').length > 3}">
              <i :class="item.icon"></i><span slot="title">{{ (item.meta && item.meta.name) || item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="headerNav">
        <div class="right">
          <div class="header">
            <template v-if="$store.state.user.obj">
              <img v-if="$store.state.user.obj.avatar" width="100%" height="100%" :src="$store.state.user.obj.avatar" style="border-radius: 50%;" />
              <img v-else src="../assets/image/header.png" width="100%" height="100%" style="border-radius: 50%;" />
            </template>
          </div>
          <el-dropdown @command="handleInfo" trigger="click">
            <span class="el-dropdown-link">
              {{ $store.state.user.obj.realName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu :appendToBody="false" slot="dropdown" class="header-account">
              <el-dropdown-item command="info"><i class="iconfont">&#xe7ee;</i><span>修改账户信息</span></el-dropdown-item>
              <el-dropdown-item command="pass"><i class="iconfont">&#xe7ed;</i><span>修改密码</span></el-dropdown-item>
              <el-dropdown-item command="out" divided><i class="iconfont">&#xe7eb;</i><span>退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="bodyNav">
        <keep-alive>
          <transition name="slide">
            <router-view />
          </transition>
        </keep-alive>
      </el-main>
    </el-container>
    <!-- 修改密码 -->
    <customUserPsw ref="custom_userPsw" />
    <!-- 创建/编辑 用户基本信息-->
    <customUserInfo ref="custom_userInfo2" />
    <!-- 查看 -->
    <customMailTips ref="custom_mailTips" />
  </el-container>
</template>

<script>
import { formatDate, compileTime } from '../util/utils'
// import menus from '@/router/menu'
import customUserPsw from '@c/custom/userPsw'
import customUserInfo from '@c/custom/userInfo'
import customMailTips from '@c/custom/mailTips'
export default {
  name: 'home',
  components: { customUserPsw, customUserInfo, customMailTips },
  data () {
    return {
      topActive: 'home', // 顶部导航高亮
      menuList: [],
      // 密码重置
      dialogPass: {
        delId: '',
        ruleForm: {
          oldPass: '',
          newPass: '',
          againPass: ''
        },
        rules: {
          // oldPass: [{ message: '原密码不能为空', required: true, trigger: 'blur' }],
          // newPass: [{ validator: this._fn.check.checkPassword, required: true, trigger: 'blur' }],
          // againPass: [{ validator: validatePass2, required: true, trigger: 'blur' }]
        },
        title: '修改密码(为了您的账户安全，请尽快修改个人密码)',
        show: false, // 显示弹框
        isCancel: true, // 是否显示取消按钮
        isConfirm: true, // 是否显示确定按钮
        // cancelCallback: () => { },
        confirmCallback: this.changePassCommit
      },
      visible: false,
      messageList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getUserById()
      this.getMessageList()
    })
  },
  filters: {
    infoTypeFilter (val) {
      return _var.infoType__global(val) || '--'
    }
  },
  methods: {
    getUserById () {
      let id = localStorage.getItem('zp_userId') || ''
      if (id) {
        let param = { id: id }
        this._api.user_public_info(param).then((res) => {
          _store.dispatch('user/setObj', res.data) // 设置用户
        })
      }
    },
    getMessageList () {
      let param = {
        pageReq: {
          page: 1,
          size: 6
        },
        queryParam: {
          type: ''
        }
      }
      this._api.stationMessage_getMessageList(param).then((res) => {
        this.messageList = res.data.list
      })
    },
    checkout (item) {
      let mailTips = this.$refs.custom_mailTips
      mailTips.show(item)
    },
    handleInfo (command) {
      switch (command) {
        case 'info':
          let item = this.$store.state.user.obj
          if (item.id) {
            let temp = {
              mobile: { disabled: true },
              password: { disabled: true },
              roleId: { isShow: false },
              roleName: { isShow: true },
              deptId: { isShow: false },
              deptName: { isShow: true },
              enabled: { disabled: true }
            }
            item.roleName = item.role.name
            item.deptName = item.dept.name
            item.workAreaCode = item.workAreaCode || '+86'
            item.workPhoneNumber = item.workPhoneNumber || ''
            let user = this.$refs.custom_userInfo2
            user.show({ title: '修改账户信息', temp: temp, ruleForm: item, updateUrl: 'user_public_update_simple_info' })
          }
          break
        case 'pass':
          let userPsw = this.$refs.custom_userPsw
          userPsw.show({ title: '修改密码' })
          break
        case 'out':
          this.loginOut()
          break
      }
    },
    // 退出登录
    loginOut () {
      this._api.logout({}).then((res) => {
        document.timer__ = null
        clearInterval(document.timer__)
        this.$store.dispatch('menu/setObj', {}) // 设置菜单
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../assets/style/color.less';
.home{
  height: 100vh;
  min-width: 1400px;
  .body-left {
    transition: width .3s ease-in-out;
    background: @menu_bg;
    width:176px!important;
    position: relative;
    overflow: hidden;
    text-align: left;
    .logo{
      width:116px;
      height:40px;
      margin: 25px 30px 22px 30px;
    }
    /deep/ .el-menu{
      width:176px !important;
      transition: width .3s ease-in-out;
      border-right: solid 0px #e6e6e6;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 90px);
      .el-submenu{
        .el-submenu__title{
          padding-left: 24px!important;
          .el-submenu__icon-arrow{
            font-size: 12px;
            right: 13px;
            margin-top: -5px;
          }
        }
        .el-menu-item{
          min-width: 176px;
          padding: 0;
          margin-top: 20px;
          padding-left: 60px!important;
          &.is-active{
            background-color: #4a84ff66 !important;
            padding-left: 56px!important;
            color: @white!important;
            i,span {
              color: @white!important;
            } 
          }
        }
      }
      .el-menu-item,.el-submenu__title {
        overflow: hidden;
        height: 40px;
        margin-top: 20px;
        line-height: 40px;
        padding-left: 24px!important;
        i{
          font-size:22px;
          margin-right: 12px;
        }
        &.is-active{
          background-color: #4a84ff66 !important;
          border-left: 4px solid @blue;
          padding-left: 20px!important;
          i,span {
            color: @white;
          } 
        }
        &:focus{
          background-color: @white;
        }
        &:hover{
          background-color: #4a84ff66;
          color: @blue;
          i,span {
            color: @white;
          }
        }
      }
    }
  }
  .headerNav{
    width: 100%;
    clear: both;
    height: 50px !important;
    background: @white;
    padding: 0px;
    border-bottom:1px solid @line;
    .right{
      width: 600px;
      margin: 0 24px 0 0;
      float: right;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end; 
      height: 50px;
      .email,.message{
        font-size: 24px;
        font-weight: 400;
        padding: 9px;
        margin-right: 24px;
        border: 1px solid #2e384d1a;
        border-radius:4px;
        cursor: pointer;
      }
      .line{
        width: 1px;   
        height: 40px;
        border-left: 1px solid #2e384d1a;
        margin-right: 17px;
      }
      .header{
        width: 32px; 
        height: 32px;
        background: @black2;
        color: #FFFFFF;
        border-radius: 50%;
        margin-right: 10px;
        line-height: 40px;
      }
      .names{
        font-family: 'PingFangSC-Medium';
        font-size: 14px;
        color: #26334F;
        letter-spacing: 0;
        text-align: center;
      }
      .el-dropdown-menu {
        min-width: 145px;
        .el-dropdown-menu__item--divided{
          text-align: left;
        }
      }
      /deep/ .el-dropdown-link:hover{
        cursor: pointer;
      }
      .meBox {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        overflow: hidden;
        text-align: center;
        line-height: 32px;
        margin: 2px 10px 0px;
        .iconfont {
          font-size: 24px;
          position: relative;
        }
      }
    }
  }
  .bodyNav{
    overflow-y: hidden;
    padding: 12px;
    position: relative;
    height: 100%;
    .body-right {
      position: relative;
      overflow: hidden;
      display: flex;
      >div{
        width: 100%;
        background: @white;
      }
    }
  }
}
.slide-enter-active {transition:all .2s}
.slide-leave-active {transition:all .1s}
.slide-enter        {opacity: 0;transform: translate(50px, 0);}
.slide-leave-active {opacity: 0;transform: translate(-50px, 0);}
.meContent {
  padding: 10px 0px;
  .list {
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F7F7F7;
    padding: 0px 10px;
    .name {
      font-size: 14px;
      color: #26334F;
      line-height: 16px;
      font-weight: 500;
      margin: 0px 0px 6px;
    }
    .time {
      font-size: 12px;
      color: #69707F;
      line-height: 12px;
      display: block;
    }
  }
  .list:hover {
    background-color: #FAFAFA;
  }
  .meFooter {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    .el-button {
      width: 137px !important;
    }
    .zp-btn-primary-plain {
      border-color: #4A84FF;
      color: #4A84FF;
    }
  }
}
</style>
