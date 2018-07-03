import Vue from "vue"
import axios from "axios"

axios.defaults.baseURL = "/api/"
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded"


const $http = (url, params) => {
  return new Promise((reslove, reject) => {
    axios({
      method: "post",
      timeout: 3000,
      url: url,
      data: params
    }).then(res => {
      reslove(res.data);
    }).catch(error => {
      if (error.response) {
        let status = error.response.status;
        Vue.prototype.$notify.error({
          title: '系统提示',
          message: '服务器请求失败！'
        });
      } else {
        Vue.prototype.$notify.error({
          title: '系统提示',
          message: '服务器发生故障！'
        });
      }
      reject(error);
    });
  })
};

Vue.prototype.$http = $http;