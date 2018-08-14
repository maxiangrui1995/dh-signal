import Vue from 'vue'
import Vuex from 'vuex'
import planModule from './modules/planList';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false, //是否登录
    userName: "", //当前登录用户
    permission: "", //当前登录用户的权限
    latLng: { //经纬度
      lng: "119.77495282888412",
      lat: "36.37174657521467"
    },
    crossingData: [], //区域数据
    gmap: null, //地图
    crossingImageUrl: //路口图片地址
      process.env.NODE_ENV === "production"
        ? "../web/public/uploads/"
        : "http://192.168.1.14/SignalControl/web/public/uploads/"
    
  },
  mutations: {
    // 是否登录
    SETLOGIN(state, data) {
      state.isLogin = data;
    },
    // 登录用户
    SETUSER(state, data) {
      state.userName = data;
    },
    // 登录用户的权限
    SETPERMISSION(state, data) {
      state.permission = data;
    },
    // 区域数据
    SETCROSSING(state, data) {
      state.crossingData = data;
    },
    // 地图
    SETGMAP(state, data) {
      state.gmap = data;
    },
  },
  actions: {
    SETCROSSING(context, data) {
      context.commit("SETCROSSING", data);
    },
    SETGMAP(context, data) {
      context.commit("SETGMAP", data);
    }
  },
  modules: {
    planModule
  }
})