<template>
  <div>
    <canvas ref="view" width="800" height="600"></canvas>
  </div>
</template>

<script>
import APP from "@/libs/canvas_signal";
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
    },
    canvas() {
      let draw = new APP();
      draw.init(this.$refs.view);
      draw.CROSSINGDATA = [
        {
          direction: "1",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "3",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "5",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "7",
          roadnum: "3",
          target: ["3", "2", "4"]
        }
      ];
      draw.draw();
    }
  },
  created() {
    this.$nextTick(() => {
      this.canvas();
    });
  }
};
</script>