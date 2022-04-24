<template>
  <div class="nopage">
    <div class="img"></div><br />
    <p>Sorry,您访问的页面弄丢了~</p>
    <p @click="load">点击重新加载</p>
  </div>
</template>
<script>
export default {
  name: 'nopage',
  data () {
    return {}
  },
  mounted () {
    // let onWatch = (obj, getLog, setLog) => {
    //   let handler = {
    //     get: function (obj, propKey, receiver) {
    //       getLog(obj, propKey)
    //       return Reflect.get(obj, propKey)
    //     },
    //     set: function (obj, propKey, value, receiver) {
    //       setLog(value, propKey)
    //       return Reflect.set(obj, propKey, value)
    //     }
    //   }
    //   return new Proxy(obj, handler)
    // }
    // let proxy = { a: 1 }
    // let p = onWatch(proxy, (obj, propKey) => {
    //   console.info(`获取到属性${propKey}的值是${obj[propKey]}`)
    // }, (value, propKey) => {
    //   console.info(`监听到属性${propKey}重新赋值了${value}`)
    // })
    // p.a = 2
    // let a = p.a

    // ----------------------------------get方法----------------------------------
    // var person = {
    //   name: '123'
    // }
    // var proxy = new Proxy(person, {
    //   get: function (obj, propKey) {
    //     if (propKey in obj) {
    //       console.info(obj[propKey])
    //     } else {
    //       console.info(`${JSON.stringify(obj)}对象上没有属性${propKey}`)
    //     }
    //   }
    // })
    // let a = proxy.name
    // let b = proxy.age
    /*   get方法可以继承      */
    // let proto = new Proxy({}, {
    //   get: function (obj, propKey, receiver) {
    //     console.info('get方法可以继承')
    //     return obj[propKey]
    //   }
    // })
    // let proto2 = Object.create(proto)
    // let qw = proto2.a
    /*   使用get实现数组读取负数的索引      */
    // function createArray (...elements) {
    //   let handler = {
    //     get: function (target, propKey, receiver) {
    //       let index = Number(propKey)
    //       if (index < 0) {
    //         propKey = String(target.length + index)
    //       }
    //       return Reflect.get(target, propKey, receiver)
    //     }
    //   }
    //   return new Proxy([...elements], handler)
    // }
    // let arr = createArray('a', 'b', 'c')
    // let result = arr[-1]
    // console.info(result)
    const proxy = new Proxy({}, {
      get: function (target, prop, receiver) {
        return receiver
      }
    })
    console.info(proxy.getReceiver)
    console.info(proxy)
  },
  methods: {
    load () {
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped lang="less">
@import './../assets/style/color.less';
.nopage {
  height: 100vh;
  position: relative;
  overflow: auto;
  width: 100%;
display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: @white;
  .img{
    margin-top: -15vh;
    background: url(../assets/image/404.png) no-repeat 100%/cover;
    width:540px;
    height:308px;
  }
  p:last-child{
    color:@blue;
    cursor: pointer;
  }
}
</style>
