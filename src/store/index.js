import Vue from 'vue'
import Vuex from 'vuex'
import planModule from './modules/planList';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false, //是否登录
    userName: '', //当前登录用户
    crossingData: []
  },
  mutations: {
    SETLOGIN(state, data) {
      state.isLogin = data;
    },
    SETUSER(state, data) {
      state.userName = data;
    },
    SETCROSSING(state, data) {
      state.crossingData = data;
    },
  },
  actions: {
    SETCROSSING(context, data) {
      context.commit("SETCROSSING", data);
    }
  },
  modules: {
    planModule
  }
})