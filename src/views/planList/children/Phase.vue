<template>
  <div>
    <canvas ref="canvasview" width="800" height="640"></canvas>
  </div>
</template>

<script>
import VIEW from "@/libs/view";
export default {
  data() {
    return {
      id: this.$route.params.id,
      lightData: [],
      crossingData: [
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
      ],
      fun: null
    };
  },
  methods: {
    drawView() {
      let draw = (this.fun = new VIEW());
      draw.init(this.$refs.canvasview);
      // 路口数据 TODO
      draw.CROSSINGDATA = this.crossingData;
      draw.draw();
    },
    // 请求灯组信息
    fetchData() {
      this.$http("index/d_phaseinfo/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 16
      }).then(res => {
        if (res.status) {
          this.lightData = res.data.list;
          this.fun.LIGHTDATA = res.data.list;
          this.fun.draw();
        }
      });
    },
    // 请求阶段信息
    fetchPhase() {
      this.$http("index/d_phasestatus/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 8
      }).then(res => {
        if (res.status) {
        }
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.drawView();
      this.fetchData();
      this.fetchPhase();
    });
  }
};
</script>

<style lang="scss" scoped>
.lightgroup-canvas {
  width: 100%;
  height: 100%;
  background: #000;
}
</style>
