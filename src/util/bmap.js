export function MP (ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(BMap)
    }
    let id = document.getElementById('baiduMap')
    if (!id) {
      var script = document.createElement('script')
      script.id = 'baiduMap'
      script.type = 'text/javascript'
      script.src = `//api.map.baidu.com/api?v=2.0&ak=${ak}&callback=init`
      script.onerror = reject
      document.body.appendChild(script)
    } else {
      resolve(BMap)
    }
  })
}
