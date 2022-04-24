import setStore from '../store'
let map = {
  state: {
    obj: {}
    // obj: {
    //   authorities: ["index", "/user/**", "/employee/**", "/**", "/organization/**", "/**", "/**", "/**", "/**", "/**",…]
    //   createdate: 1572266867206
    //   deviceid: "ops_web"
    //   expiredate: 1574866067206
    //   level: 1
    //   menus: [,…]
    //   token: "9854c19f39e54f53a8378ccb8c0b682e"
    //   uid: 12
    //   userVo : {} // 用户对象
    //   utype: 1
    // }
  }
}
let obj = setStore(map)
export default obj
