<style lang="less">
  @import './resetPwd.less';
</style>
<template>
  <div class="user-resetpwd-page">
    <div class="resetpwd-header">
      <img src="../../../static/image/logo-login.png" alt="">
    </div>
    <div class="resetpwd-step-main">
      <div class="resetpwd-step-contianer">
        <div class="steps-contianer">
          <el-steps :active="stepsActvie" align-center finish-status="success">
            <el-step title="安全验证"></el-step>
            <el-step title="重置密码"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div class="el-form-container">
          <!-- <transition-group name="fade" tag="div"> -->
          <!-- 安全验证 -->
          <el-form v-show="stepsActvie === 0" :model="step1form" label-width="82px" ref="step1form" key='step1form'>
            <el-form-item prop="phoneNumber" label="手机号码" :rules="phoneCheck">
              <zp-input placeholder="请输入手机号" v-model.trim="step1form.phoneNumber" clearable />
            </el-form-item>
            <el-form-item label="校验码">
              <div class="code-contianer">
                <div class="input-code">
                  <el-form-item prop="code" :rules="codeCheck">
                    <zp-input placeholder="请输入校验码" v-model.trim="step1form.code" clearable />
                  </el-form-item>
                </div>
                <div class="getcode-btn" ref="getcode-btn" @click="drawCodehandle">
                  <canvas></canvas>
                  <!-- 验证码图片放置区域 -->
                </div>
              </div>
            </el-form-item>
            <el-form-item label="短信验证码">
              <div class="code-contianer">
                <div class="input-code">
                  <el-form-item prop="smsCode" :rules="smsCode">
                    <zp-input placeholder="请输入短信验证码" v-model.trim="step1form.smsCode" clearable />
                  </el-form-item>
                </div>
                <div class="getsmscode-btn">
                  <zp-button :disabled="getsmscodeBtnDisabled" @click="getsmscode">{{getsmscodeBtnText}}</zp-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item class="last-form-item">
              <zp-button class="zp-btn-primary" @click="userSubmit('step1form')">下一步</zp-button>
            </el-form-item>
          </el-form>
          <!-- 重置密码 -->
          <el-form v-show="stepsActvie === 1" :model="step2form" label-width="82px" ref="step2form" key="step2form">
            <el-form-item prop="newPwd" label="输入新密码" :rules="pwdCheck">
              <zp-input type="password" placeholder="请输入8~15位密码，密码由字母、数字及符号组成" v-model.trim="step2form.newPwd" clearable />
            </el-form-item>
            <el-form-item prop="repeatPwd" label="确认新密码" :rules="repeatPwdCheck">
              <zp-input type="password" placeholder="请再次输入密码" v-model.trim="step2form.repeatPwd" clearable />
            </el-form-item>
            <el-form-item class="last-form-item">
              <zp-button class="zp-btn-primary" @click="userSubmit('step2form')">下一步</zp-button>
            </el-form-item>
          </el-form>
          <!-- 完成 -->
          <div class="resetpwd-success" v-show="stepsActvie === 2" key="resetpwd-success">
            <p>重置密码成功</p>
            <p>{{backTimeText}}</p>
            <Router-link to='/login'>
              <zp-button class="zp-btn-primary">立即登录</zp-button>
            </Router-link>
          </div>
          <!-- </transition-group> -->

          <p class="back-route" v-show="stepsActvie !== 2">
            返回<Router-link to='/login'>直接登录</Router-link>
          </p>
        </div>
      </div>
    </div>
    <p class="footer">copyright&nbsp;©&nbsp;上海漫微信息技术有限公司 2020</p>
  </div>
</template>
<script>
import resetPwd from './resetPwd'
export default resetPwd
</script>
