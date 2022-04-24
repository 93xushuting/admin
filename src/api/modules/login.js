import globalVariable from '@/util/global_variable'
/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  user_public_check_phone: '/user/public/check_phone',
  user_public_forget_password: '/user/public/forget_password', // 忘记密码
  user_public_check_code: '/user/public/check_code', // 
  user_public_send_code: '/user/public/send_code', // 发送验证码
  login: '/portal/login', // 登录
  logout: '/portal/logout' // 登出
}
