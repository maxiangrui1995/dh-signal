import YWrapper from './Wrapper.vue';

const Wrapper = {
  install: function (vue) {
    vue.component('Wrapper', YWrapper);
  }
}

export default Wrapper