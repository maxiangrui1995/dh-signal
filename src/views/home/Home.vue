<template>
  <el-container :style="{height: '100%'}">
    <el-header class="layout-header">
      <h3 class="layout-header-logo">道路交通信号机控制平台</h3>
      <div class="layout-header-inner">
        <span>欢迎您:&nbsp;</span>
        <span>{{userName}}</span>
      </div>
      <div class="layout-header-tools">
        <el-tooltip class="layout-header-tools-btn-con" effect="dark" :content="hasNewMsg?'有最新消息':'暂无消息'" placement="bottom">
          <el-badge is-dot class="item" :hidden="!hasNewMsg">
            <i class="fa fa-bell"></i>
          </el-badge>
        </el-tooltip>
        <el-tooltip class="layout-header-tools-btn-con" effect="dark" content="用户设置" placement="bottom">
          <i class="fa fa-cog"></i>
        </el-tooltip>
        <el-tooltip class="layout-header-tools-btn-con" effect="dark" content="退出系统" placement="bottom">
          <i class="fa fa-sign-out"></i>
        </el-tooltip>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="menuDefaultActive" :style="{height: '100%'}" @select="menuItemSelect">
          <el-menu-item v-for="item in menuList" :key="item.name" :index="'/'+item.name">
            <i :class="'fa '+item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main :style="{padding: '0'}" class="layout-content">
        <el-scrollbar :style="{height: '100%', overflowY: 'hidden'}">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      hasNewMsg: false,
      userName: "admin",
      menuList: [
        {
          name: "workplace",
          title: "工作台",
          icon: "fa-tachometer"
        },
        {
          name: "comprehensiveQuery",
          title: "综合查询",
          icon: "fa-search"
        },
        {
          name: "region",
          title: "区域管理",
          icon: "fa-sitemap"
        },
        {
          name: "planList",
          title: "特征参数",
          icon: "fa-cogs"
        },
        {
          name: "greenBelt",
          title: "绿波带",
          icon: "fa-flag"
        },
        {
          name: "privilege",
          title: "特勤联动",
          icon: "fa-filter"
        }
      ],
      menuDefaultActive: `/${this.$route.path.split("/")[1]}`
    };
  },
  methods: {
    menuItemSelect(index, indexPath) {
      this.$router.push({ path: index });
    }
  }
};
</script>

<style>
</style>
