<template>
  <div class="login-wrapper" @keydown.enter="handleSubmit">
    <div class="login-con">
      <el-card>
        <div slot="header">
          <i class="fa fa-sign-in" style="margin-right: 5px;"></i>
          <span>欢迎登录</span>
        </div>
        <el-form ref="form" :model="formData">
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名">
              <i slot="prefix" class="el-input__icon fa fa-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formData.password" placeholder="请输入密码">
              <i slot="prefix" class="el-input__icon fa fa-unlock-alt"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.is_remember">保持登录</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSubmit" type="primary" :loading="btnLoading" :disabled="btnDisabled" :style="{width: '100%'}">{{ btnInnerHtml }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
        is_remember: true
      },
      btnLoading: false,
      btnDisabled: false,
      btnInnerHtml: "登 录"
    };
  },
  methods: {
    handleSubmit() {
      this.btnLoading = true;
      this.btnInnerHtml = "登录中...";
      this.$http("index/d_member/login", {
        username: this.formData.username,
        password: this.formData.password,
        is_remember: this.formData.is_remember ? "1" : "0"
      }).then(res => {
        if (res.status) {
          this.$store.commit("SETLOGIN", true);
          setTimeout(() => {
            this.$router.push({
              name: "home"
            });
          }, 600);
        } else {
          this.$Message.error(res.message);
          this.btnLoading = false;
          this.btnInnerHtml = "登录";
        }
      });
    }
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
