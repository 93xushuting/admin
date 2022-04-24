/**
 * 改进写法
 */
import setStore from '../store'
let map = {
  state: {
    selectPersonnel: { aa: 1 },
    selectPersonnel2: { bb: 1 },
    count: 0
  }
}
let obj = setStore(map)
// 重写默认方法
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

/**
 * 默认写法
 */
// let types = {
//   SET_SELECTPERSONNEL : 'SET_SELECTPERSONNEL',
// }
// let temp = {
//   namespaced: true,
//   state: {
//     selectPersonnel: {},
//   },
//   mutations: {
//     [types.SET_SELECTPERSONNEL](state, param) {
//       console.info(22)
//       state.selectPersonnel = param
//     }
//   },
//   actions: {
//     setSelectPersonnel({commit}, param) {
//       console.info(11)
//       commit(types.SET_SELECTPERSONNEL, param || {a:1,b2})
//     }
//   }
// }
// export default temp
