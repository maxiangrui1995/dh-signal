<template>
  <el-container>
    <el-header class="page-header" :style="{height: 'auto'}">
      <div class="page-header-inner">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/planList' }">特征参数</el-breadcrumb-item>
          <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-tabs v-model="tabsActive" @tab-click="handleTabsClick" class="page-header-tabs theme-tabs">
          <el-tab-pane v-for="item in tabsItem" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>
    </el-header>
    <el-main>
      <div class="content-card-wrapper">
        <Wrapper>
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </Wrapper>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      name: "方案详情",
      tabsActive: this.$route.path.split("/")[3],
      tabsItem: [
        {
          label: "基本",
          name: "base"
        },
        {
          label: "通行权",
          name: "wayleave"
        },
        {
          label: "灯组",
          name: "lightgroup"
        },
        {
          label: "相位",
          name: "phase"
        },
        {
          label: "方案",
          name: "plan"
        },
        {
          label: "日期类型",
          name: "datetype"
        },
        {
          label: "时间调度",
          name: "scheduling"
        },
        {
          label: "车检器",
          name: "vehicleInspection"
        },
        {
          label: "自适应方案",
          name: "adaptive"
        }
      ]
    };
  },
  methods: {
    handleTabsClick(tab, event) {
      this.$router.replace({
        path: tab.name
      });
    },
    fetchData() {
      this.$http("index/d_plan/dataView", {
        id: this.id
      }).then(res => {
        if (res.status) {
          this.name = res.data.name;
          this.$store.dispatch("planModule/SETBASE", res.data);
        }
      });
    }
  },
  computed: {
    baseData() {
      return this.$store.state.planModule.baseData;
    }
  },
  watch: {
    baseData(data) {
      this.name = data.name;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style>
</style>
