import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getter'
// import app from './modules/app'
// import user from './modules/user'
// import base from './modules/base'
// import getters from './getters'

Vue.use(Vuex)

// const store = new Vuex.Store({
// 	state: {
// 	    catch_components: []
// 	  },
// 	  mutations:{
// 	      GET_CATCHE_COMPONENTS (state, data) {
// 	        state.catch_components = data
// 	      }
// 	  },
//   modules: {
//     // app,
//     // user,
//     // base
//   },
//   // getters
// })
// export default new Vuex.Store({
//   state: {
//     catch_components: []
//   },
// 	mutations:{
// 		GET_CATCHE_COMPONENTS (state, data) {
// 		  state.catch_components = data
// 		}
// 	},
// 	getters: {
// 	    catch_components: state => state.catch_components
// 	  }
// })
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // strict: debug
  // plugins: debug ? [createLogger()] : []
})
