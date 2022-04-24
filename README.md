## 简介(vue + webpack4 + elementUI)###使用
```
npm install
// p 端
1开发、npm run start或 npm run start:p
2生并、npm run build或 npm run build:p
// b 端
1开发、npm run start:b
2生并、npm run build:b
```

```
涉及的技术栈：
	- MVVM框架：   [Vue](https://github.com/vuejs/vue)
	- 路由管理：   [Vue-Router](https://github.com/vuejs/vue-router)
	- 状态管理：   [Vuex](https://github.com/vuejs/vuex)
	- 服务端通信： [Axios](https://github.com/mzabriskie/axios)
	- 组件库：     [element-ui](http://element.eleme.io/#/zh-CN)
工具支持：
	- 代码检测：   [ESLint](http://eslint.cn/docs/rules/)
	- 构建工具：   [Webpack](https://webpack.js.org/)
	- 包管理工具： [Npm](https://www.npmjs.com/)
	- Chrome 插件：[Vue-devtools](https://github.com/vuejs/vue-devtools)
```
##项目结构如下：
```
	|------dist              (打包后生成的文件夹)  
	|		    |----static 目录
	|       |----index.html
  |------public
  |	      |----static      (存放静态资源)   
  |	      |----index.html  (首页)
	|------src
	|	      |----api         (所有请求类)
	|       |----components  (公共组件文件夹)
	|       |----router      (路由文件夹)
	|       |----store       (状态管理文件夹)
	|       |----util        (公共方法、变量)
	|       |----views       (vue页面文件夹)
	|       |----App.vue
	|       |----main.js     (总入口) 
	|------eslintrc.js
	|------package.json
	|------README.md
	|------webpack.config.js
```

## 1:axios
```
1、请求添加 : 
api/model/xxx.js
/**
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  方法名1: '/xxx/xxx', // 获取权限
  方法名2: { url: '/xxx/xxx', type: global_variable.requestFormDataPost} 
}

//统一处理了state!=200和code!=0的情况
2、请求调用 : 
this._api.['方法名']('参数').then((data) => {
  // code == 0 的逻辑
})
```
## 2 新建一个页面(配置路由)如：
```
1.在src/views/xxx下新建页面 XXX.vue
2.在中配：
  1)  src/router/router.js
    export default [
      ...XXX
    ]
  2)	src/router/modules/XXX.js
    [
      {
        path: '/xxx',
        name: 'xxx',
        component: '/xxx'
      }
      ...
    }
```
## 3 状态管理(vuex)：
```

src/store/modules/xxx.js配
import setStore from '../store'
let map = {
  state: {
    selectPersonnel: {},
    selectPersonnel2: {}
  }
}
let obj = setStore(map)
// 方法重写
obj.mutations.SET_SELECTPERSONNEL = (state, param) => {
  param.test = 'test'
  state.selectPersonnel = param
  console.info('方法重写333' + JSON.stringify(state.selectPersonnel))
}
// 自定义方法
const mutations = {
  mutations_add (state) {
    state.count++
  },
  mutations_reduce (state) {
    state.count--
  }
}
// 自定义actions
const actions = {
  actions_add: ({ commit }) => {
    commit('mutations_add')
  },
  actions_reduce: ({ commit }) => {
    commit('mutations_reduce')
  }
}
Object.assign(obj.actions, actions)
Object.assign(obj.mutations, mutations)
export default obj

* 使用1 :
* @param test(namespaced)
* set: this.$store.dispatch('test/setSelectPersonnel',param)
* get: this.$store.state.test.selectPersonnel

* 使用2 :
* import { createNamespacedHelpers } from 'vuex'
* const { mapState, mapActions } = createNamespacedHelpers('test')
* computed: {
  ...mapState({
    selectPersonnel2: state => state.selectPersonnel2
  })
},
methods: {
  ...mapActions(['setSelectPersonnel2']),
  test () {
    var param = {
      companyId: 'asdadsasd',
      loginName: 'ddddd',
      password: '122222'
    }
    this.setSelectPersonnel2(param)
  },
}
*/
 
```
## 4 处理JSON跨域问题(vue.config.js):
```
访问如：http://localhost:8801/agent/gateway/getData;
var config = {
    ...
    devServer: {
        ...
        proxy: {//本地代理
            '/agent/gateway*': {
                target: 'http://localhost:8801',
                secure: false
            }
        }
    }
    ...
}
```
## 5 解决URL地址中带 "#"(nginx) 问题(http://localhost:9999/tree/#  -- > http://localhost:9999/tree)。
```
1 .router.js
  new Router({
  mode: 'history', //去掉#
  routes: [...]
  });
2 .后端nginx配:
  server {
    location / {
      root   E:\gzy\h5\h5-vue-element\dist;
      try_files $uri $uri/ /index.html;
      index  index.html index.htm;
    }
  }
```
## 6 提升web性能 -- GZIP压缩(nginx、Tomcat)
```
1.Tomcat启用GZIP压缩 : https://www.cnblogs.com/DDgougou/p/8675504.html
2.后端nginx配:
http {
  #gzip  on;
  gzip  on;
  gzip_disable "msie6";
  gzip_vary on;
  gzip_comp_level 2;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  gzip_http_version 1.1;
  gzip_types text/plain application/x-javascript text/css application/xml application/javascript;
  log_format main '$request_time $upstream_response_time $remote_addr - $upstream_addr [$time_local] '
  '"$host" "$request" $status $bytes_sent '
  '"$http_referer" "$http_user_agent" "$gzip_ratio" "$http_x_forwarded_for" - "$server_addr" ';

  server {

  }
}
```