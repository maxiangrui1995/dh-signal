<template>
  <el-dropdown placement="bottom" @command="handleClick">
    <span class="layout-header-tools-btn-con">
      <i class="fa fa-adjust"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="default">象牙白</el-dropdown-item>
      <el-dropdown-item command="blue">科技蓝</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
export default {
  data() {
    return {
      activeClassName: ""
    };
  },
  methods: {
    handleClick(item) {
      let elem = document.getElementById("main-layout");
      if (item === "default") {
        elem.classList.remove(this.activeClassName);
      } else {
        this.activeClassName = "theme__" + item;
        elem.classList.add(this.activeClassName);
      }
    }
  }
};
</script>

<style>
</style>
