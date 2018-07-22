<template>
  <el-container class="layout" id="main-layout" :style="{height: '100%'}">
    <el-header class="layout-header">
      <h3 class="layout-header-logo">道路交通信号机控制平台</h3>
      <div class="layout-header-tools">
        <full-screen @isCollapse="isCollapse"></full-screen>
        <theme-switch></theme-switch>
        <el-tooltip class="layout-header-tools-btn-con" :content="hasNewMsg?'有最新消息':'暂无消息'">
          <el-badge is-dot class="item" :hidden="!hasNewMsg">
            <el-popover placement="bottom-end" width="336">
              <el-tabs v-model="activeName">
                <el-tab-pane label="信号机" name="1">信号机</el-tab-pane>
                <el-tab-pane label="备用电源" name="2">备用电源</el-tab-pane>
              </el-tabs>
              <i class="fa fa-bell" slot="reference"></i>
            </el-popover>
          </el-badge>
        </el-tooltip>
        <el-tooltip class="layout-header-tools-btn-con" content="用户设置">
          <i class="fa fa-cog" @click="handleSetting"></i>
        </el-tooltip>
        <el-tooltip class="layout-header-tools-btn-con" content="退出系统">
          <i class="fa fa-sign-out" @click="handleLogout"></i>
        </el-tooltip>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto" class="layout-aside">
        <el-menu :default-active="menuDefaultActive" :collapse="collapde" :unique-opened="true" class="layout-aside-menu" @select="menuItemSelect" :style="{height: '100%'}">
          <el-scrollbar class="layout-aside-scrollbar" :style="{height: '100%'}">
            <div v-for="item in menuList" :key="item.name">
              <el-submenu v-if="item.children" :key="item.name" :index="'/'+item.name">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.title}}</span>
                </template>
                <div v-for="item2 in item.children" :key="item2.name">
                  <el-menu-item v-if="!item2.children" :key="item2.name" :index="'/'+item2.name">
                    <span>{{item2.title}}</span>
                  </el-menu-item>
                  <div v-else>
                    <el-submenu :index="'/'+item2.name">
                      <span slot="title">{{item2.title}}</span>
                      <el-menu-item v-for="item3 in item2.children" :key="item3.name" :index="'/'+item3.name">{{item3.title}}</el-menu-item>
                    </el-submenu>
                  </div>
                </div>
              </el-submenu>
              <el-menu-item v-else :key="item.name" :index="'/'+item.name">
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </div>
          </el-scrollbar>
        </el-menu>
      </el-aside>
      <el-main :style="{padding: '0'}" class="layout-content">
        <el-scrollbar :style="{height: '100%', overflowY: 'hidden'}">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import fullScreen from "./home-components/full-screen";
import themeSwitch from "./home-components/theme-switch";
export default {
  components: {
    fullScreen,
    themeSwitch
  },
  data() {
    return {
      hasNewMsg: false,
      userName: "admin",
      collapde: sessionStorage.getItem("collapse") === "true" ? true : false,
      menuList: [
        {
          name: "comprehensiveQuery",
          title: "综合查询",
          icon: "fa fa-search"
        },
        {
          name: "regions",
          title: "区域管理",
          icon: "fa fa-sitemap",
          children: [
            {
              name: "region",
              title: "区域管理"
            },
            {
              name: "devs",
              title: "设备管理",
              children: [
                {
                  name: "signal",
                  title: "信号机"
                },
                {
                  name: "ups",
                  title: "备用电源"
                },
                {
                  name: "camera",
                  title: "相机"
                },
                {
                  name: "ipc",
                  title: "工控机"
                }
              ]
            }
          ]
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
        /* {
          name: "privilege",
          title: "特勤联动",
          icon: "fa-filter"
        } */
        {
          name: "userManage",
          title: "用户管理",
          icon: "fa fa-group"
        }
      ],
      menuDefaultActive: `/${this.$route.path.split("/")[1]}`,
      activeName: "1"
    };
  },
  methods: {
    menuItemSelect(index, indexPath) {
      this.$router.push({ path: index });
    },
    handleLogout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "注销中...";
            // ajax
            this.$http("index/d_user/logout").then(res => {
              if (res.status) {
                setTimeout(() => {
                  this.$router.push({
                    name: "login"
                  });
                }, 600);
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
              done();
              instance.confirmButtonLoading = false;
            });
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
        }
      })
        .then(() => {})
        .catch(() => {});
    },
    handleSetting() {
      this.$router.push({
        path: "/userSetting"
      });
    },
    isCollapse(value) {
      this.collapde = value;
      // 写入本地储存
      sessionStorage.setItem("collapse", value);
    }
  },
  watch: {
    $route(to, from) {
      this.menuDefaultActive = `/${this.$route.path.split("/")[1]}`;
    }
  }
};
</script>

<style lang="scss">
@import "./main.scss";
</style>
<style lang="scss" scoped>
/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>


