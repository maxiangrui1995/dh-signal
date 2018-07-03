import Vue from 'vue'
import Router from 'vue-router'
import routers from './public'
import store from '@/store/index'

Vue.use(Router)

const router = new Router({
  routes: routers
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) { document.title = to.meta.title }
  if (to.name === 'login') {
    next();
  } else {
    if (!store.state.isLogin) {
      Vue.prototype.$http('index/d_user/isLogin').then(res => {
        if (res.status) {
          store.commit("SETLOGIN", true);
          store.commit("SETUSER", res.data.username);
          next();
        } else {
          next({
            name: 'login'
          });
        }
      })
    } else {
      next();
    }
  }
})

router.afterEach((to) => {
  window.scrollTo(0, 0);
});

export default router