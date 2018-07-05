<template>
  <div>
    <el-button type="text" @click="open">点击打开 Message Box</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="open" @blur="blur" @focus="focus" :style="{marginBottom: '10px'}">
      新增
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    open() {
      this.$alert("这是一段内容", "标题名称", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    blur() {
      console.log("blur");
    },
    focus() {
      console.log("focus");
    }
  }
};
</script>