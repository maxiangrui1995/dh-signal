<template>
  <div class="login-wrapper" @keydown.enter="handleSubmit">
    <div class="login-con">
      <el-card>
        <div slot="header">
          <i class="fa fa-sign-in" style="margin-right: 5px;"></i>
          <span>欢迎登录</span>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleSubmit() {}
  }
};
</script>

<style scoped>
@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(50px, -60%, 0);
  }
  50% {
    opacity: 0.5;
    transform: translate3d(-50px, -60%, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, -60%, 0);
  }
}
.login-wrapper {
  width: 100%;
  height: 100%;
}
.login-con {
  position: absolute;
  right: 160px;
  top: 50%;
  width: 300px;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: fadeInRight;
}


</style>
