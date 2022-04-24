const requireComponent = require.context(
  './modules', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /([A-Z]|\w+)\.(js)$/ // 匹配基础组件文件名的正则表达式
)
const buildPage = function (array) {
  let list = []
  for (let i = 0; i < array.length; i++) {
    let item = array[i]
    let childList = []
    if (item.children) {
      for (let childItem of item.children) {
        let obj = Object.assign({}, childItem)
        obj.path = item.path + obj.path
        delete obj.component
        childList.push(obj)
      }
    }
    let obj = Object.assign({}, item)
    delete obj.component
    if (childList && childList.length) {
      obj.children = childList
    }
    list.push(obj)
  }
  return list
}

let menus = []
let menuMap = {}
let all = requireComponent.keys()
all.forEach((fileName, index) => {
  const componentConfig = requireComponent(fileName)
  let obj = buildPage(componentConfig.default || componentConfig)
  menuMap[obj[0].path.replace('/', '')] = obj[0]
  if (all.length - 1 === index) {
    for (let i in menuMap) {
      menus.push(menuMap[i])
    }
  }
})
console.info('菜单列表:', menus)
export default menus
