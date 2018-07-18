<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>用户设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" :style="{width:'400px'}">
            <el-form-item label="初始密码" prop="password_origin">
              <el-input type="password" v-model="ruleForm.password_origin" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_re">
              <el-input type="password" v-model="ruleForm.password_re" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button type="text" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.password_re !== "") {
          // 对第二个密码框单独验证
          this.$refs.ruleForm.validateField("password_re");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新的密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {},
      rules: {
        password_origin: [
          {
            required: true,
            message: "请输入原始密码"
          }
        ],
        password: [{ validator: validatePass, required: true }],
        password_re: [{ validator: validatePassCheck, required: true }]
      }
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$http("index/d_user/updatePassword", this.ruleForm).then(res => {
            if (res.status) {
              this.$message.success({
                message: "修改成功,2s后跳转至登录界面！"
              });
              setTimeout(() => {
                this.$router.push({
                  path: "/login"
                });
              }, 2000);
            }
          });
        }
      });
    },
    resetForm() {}
  },
  created() {}
};
</script>

<style>
</style>
