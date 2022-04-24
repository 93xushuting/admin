// let temp = {
//   namespaced: true,
//   types : {},
//   state: {},
//   mutations: {},
//   actions: {}
// }

/**
 * @param map
 * {
    state: {
      selectPersonnel: { aa: 1 },
      selectPersonnel2: { bb: 1 }
    }
  }
 * @return obj
   {
    namespaced: true,
    state: {
      selectPersonnel: { aa: 1 },
      selectPersonnel2: { bb: 1 }
    },
    mutations: {
      SET_SELECTPERSIONNEL : function(){},
      SET_SELECTPERSIONNEL2 : function(){}
    },
    actions: {
      setSelectPersonnel : function(){},
      setSelectPersonnel2 : function(){}
    },
    getters: {
      GET_SELECTPERSIONNEL : function(){},
      GET_SELECTPERSIONNEL : function(){}
    }
  }
 * 使用1 :
 * @param test(namespaced)
 * set: this.$store.dispatch('test/setSelectPersonnel',param)
 * get: this.$store.state.test.selectPersonnel
 * * 使用2 :
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
export default function setStore (map) {
  let obj = {}
  if (map.state) {
    (item => {
      let mutations = {}
      let actions = {}
      let getters = {}
      for (let i in item) {
        let action = 'set' + i.slice(0, 1).toUpperCase() + i.slice(1)
        let set = 'SET_' + i.toUpperCase()
        let get = 'GET_' + i.toUpperCase()
        mutations[set] = (state, param) => {
          state[i] = param
          // console.info('mutations :' + JSON.stringify(state[i]))
        }
        actions[action] = ({ commit }, param) => {
          // console.info('actions' + set)
          commit(set, param || {})
        }
        getters[get] = (state) => {
          // console.info('getters :' + JSON.stringify(state[i]))
          return state[i]
        }
      }
      obj.mutations = mutations
      obj.actions = actions
      obj.getters = getters
    })(map.state)
    obj.state = map.state
  }
  obj.namespaced = true
  return obj
}
