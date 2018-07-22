<template>
  <el-tooltip class="layout-header-tools-btn-con" :content="value ? '退出全屏' : '全屏'">
    <i class="fa" :class="value ? 'fa-compress' : 'fa-expand'" @click="handleChange"></i>
  </el-tooltip>
</template>

<script>
export default {
  data() {
    return {
      value: sessionStorage.getItem("collapse") === "true" ? true : false
    };
  },
  methods: {
    handleFullscreen() {
      this.value = !this.value;
      this.$emit("isCollapse", this.value);
    },
    handleChange() {
      this.handleFullscreen();
    }
  }
};
</script>

<style>
</style>
