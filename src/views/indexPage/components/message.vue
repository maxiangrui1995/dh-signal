<template>
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
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      hasNewMsg: false
    };
  },
  methods: {},
  mounted() {}
};
</script>



