/**
 * POST请求下载文件，并修改文件名
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
// import Vue from 'vue'
window.$downloadBlob = Vue.prototype.$downloadBlob = (data, filename) => {
  let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
  filename = decodeURI(filename)
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename + '.xlsx'
    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}
