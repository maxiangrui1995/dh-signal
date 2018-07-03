import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './api/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './styles/common.scss'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'small'
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
