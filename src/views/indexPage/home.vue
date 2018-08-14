<template>
  <div style="height: 100%;">
    <el-container class="layout" :style="{height: '100%'}">
      <el-header class="layout-header">
        <h3 class="layout-header-logo">道路交通信号机控制平台</h3>
        <div class="layout-header-tools">
          <!-- <full-screen @isCollapse="isCollapse"></full-screen>
        <message></message> -->
          <user-actions @updatePassWord="updatePassWord"></user-actions>
        </div>
      </el-header>
      <el-container>
        <el-aside width="auto" class="layout-aside">
          <el-menu :default-active="menuDefaultActive" :collapse="collapde" :unique-opened="true" @select="menuItemSelect" :style="{ height: '100%' }">
            <el-submenu v-for="item in menuList" :key="item.name" v-if="item.children" :index="'/'+item.name">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item v-for="item2 in item.children" v-if="!item2.children" :key="item2.name" :index="'/'+item2.name">
                <span>{{item2.title}}</span>
              </el-menu-item>
              <el-submenu v-else :index="'/'+item2.name">
                <span slot="title">{{item2.title}}</span>
                <el-menu-item v-for="item3 in item2.children" :key="item3.name" :index="'/'+item3.name">{{item3.title}}</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item v-else :key="item.name" :index="'/'+item.name">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main :style="{padding: '0', position: 'relative'}" class="layout-content">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="用户密码修改" :visible.sync="dialogVisible" width="500px">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userActions from "./components/user-actions";
export default {
  components: { userActions },
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
      collapde: sessionStorage.getItem("collapse") === "true" ? true : false,
      menuList: [
        {
          name: "mainQuery",
          title: "综合查询",
          icon: "fa fa-search"
        },
        {
          name: "region",
          title: "区域管理",
          icon: "fa fa-sitemap"
        },
        {
          name: "planList",
          title: "特征参数",
          icon: "fa fa-cogs"
        },
        {
          name: "greenBelt",
          title: "绿波带",
          icon: "fa fa-flag"
        },
        {
          name: "userManage",
          title: "用户管理",
          icon: "fa fa-group"
        }
      ],
      menuDefaultActive: `/${this.$route.path.split("/")[1]}`,
      dialogVisible: false,
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
    menuItemSelect(index, indexPath) {
      this.$router.replace({ path: index });
    },
    isCollapse(value) {
      this.collapde = value;
      // 写入本地储存
      sessionStorage.setItem("collapse", value);
    },
    updatePassWord() {
      this.dialogVisible = true;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$http("index/d_user/updatePassword", this.ruleForm).then(res => {
            if (res.status) {
              this.$message.success({
                message: "修改成功,2s后跳转至登录界面！"
              });
              setTimeout(() => {
                this.$router.replace({
                  path: "/login"
                });
              }, 2000);
            } else {
              this.$message.error({
                message: res.message
              });
            }
          });
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.menuDefaultActive = `/${this.$route.path.split("/")[1]}`;
    },
    dialogVisible(newvalue) {
      if (!newvalue) {
        this.$refs["ruleForm"].resetFields();
      }
    }
  }
};
</script>

<style lang="scss">
@import "./main.scss";
</style>


