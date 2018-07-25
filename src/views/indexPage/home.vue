<template>
  <el-container class="layout" :style="{height: '100%'}">
    <el-header class="layout-header">
      <h3 class="layout-header-logo">道路交通信号机控制平台</h3>
      <div class="layout-header-tools">
        <full-screen @isCollapse="isCollapse"></full-screen>
        <message></message>
        <user-actions></user-actions>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto" class="layout-aside">
        <el-scrollbar class="layout-aside-scrollbar" :style="{height: '100%'}">
          <el-menu :default-active="menuDefaultActive" :collapse="collapde" :unique-opened="true" @select="menuItemSelect">
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
        </el-scrollbar>
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
import fullScreen from "./components/full-screen";
import userActions from "./components/user-actions";
import message from "./components/message";
export default {
  components: { fullScreen, userActions, message },
  data() {
    return {
      collapde: sessionStorage.getItem("collapse") === "true" ? true : false,
      menuList: [
        {
          name: "mainQuery",
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
      menuDefaultActive: `/${this.$route.path.split("/")[1]}`
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


