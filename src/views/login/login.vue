<style lang="less" scoped>
  @import './login.less';
</style>

<template>
  <div class="user-login">
    <div class="space-placeholder"></div>
    <div class="login-main">
      <div class="login-header">
        <img src="../../../static/image/logo-login.png" alt="">
        <!-- <i class="iconfont iconlogo"></i>
        <div class="login-title">
          <p>职微你</p>
          <p>欢迎使用职微你</p>
        </div> -->
      </div>
      <div class="login-form">
        <p class="form-title">账户密码登录</p>
        <el-form :model="form" ref="user-login-form" class="user-login-form">
          <el-form-item prop="username" :rules="usernameCheck">
            <zp-input @keyup.enter.native="userLogin('user-login-form')" placeholder="请输入手机号" v-model="form.username" :autofocus="true" />
          </el-form-item>
          <el-form-item prop="password" :rules="passwordCheck">
            <zp-input @keyup.enter.native="userLogin('user-login-form')" type="password" placeholder="请输入8~15位密码，密码由字母、数字及符号组成"
              v-model.trim="form.password" />
          </el-form-item>
          <transition name="fade">
            <el-form-item v-if="codeVisible">
              <div class="code-contianer">
                <div class="input-code">
                  <el-form-item prop="code" :rules="codeCheck">
                    <zp-input placeholder="请输入验证码" v-model.trim="form.code" />
                  </el-form-item>
                </div>
                <div class="getcode-btn" ref="getcode-btn" @click="drawCodehandle">
                  <canvas></canvas>
                  <!-- 验证码图片放置区域 -->
                </div>
              </div>
            </el-form-item>
          </transition>
          <el-form-item class="login-auto-container">
            <el-col span="20">
              <el-form-item :error="errorMsg">
                <el-checkbox v-model="form.remember" class="login-auto">记住密码</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col span="4" class="forget-pwd">
              <Router-link :to="{name: 'resetPwd'}">忘记密码</Router-link>
            </el-col>
          </el-form-item>
          <el-form-item class="last-form-item">
            <zp-button class="zp-btn-primary" @click="userLogin('user-login-form')">登录</zp-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <p class="footer">copyright&nbsp;©&nbsp;可微（上海）企业管理有限公司</p>
  </div>
</template>
<script>
import login from './login'
export default login
</script>
