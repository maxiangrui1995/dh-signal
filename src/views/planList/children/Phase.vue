<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
      <el-tab-pane :key="item.name" v-for="(item) in phaseData" :value="item.serialid" :name="item.serialid" :label="'阶段'+(~~item.serialid+1)">
      </el-tab-pane>
      <canvas ref="canvasview" width="800" height="640" class="lightgroup-canvas"></canvas>
      <el-button type="primary" @click="save">保存</el-button>
    </el-tabs>
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
      fun: null,
      phaseData: [],
      editableTabsValue: "0",
      phase: ""
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
          this.phaseData = res.data.list;
          this.phase = res.data.list[0].light_list;
          this.fun.PHASEDATA = this.phase;
          this.fun.onClick = this.machineClick;
          this.fun.draw();
        }
      });
    },
    handleTabsEdit(targetName, action) {
      if (action === "remove") {
        if (targetName < this.phaseData.length - 1) {
          this.$message.warning("请从最后一个阶段开始删除!");
        } else {
          this.$msgbox({
            title: "提示",
            message: "此操作将永久删除该文件, 是否继续?",
            showCancelButton: true,
            type: "warning",
            confirmButtonText: "删除",
            cancelButtonText: "放弃",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "删除中...";
                // ajax
                this.$http("index/d_phasestatus/dataDelete", {
                  id: this.phaseData[targetName].id
                }).then(res => {
                  if (res.status) {
                    this.fetchPhase();
                  }
                  this.$message({
                    type: res.status ? "success" : "error",
                    message: res.message
                  });
                  done();
                  instance.confirmButtonLoading = false;
                });
              } else {
                instance.confirmButtonLoading = false;
                done();
              }
            }
          })
            .then(action => {})
            .catch(action => {});
        }
      }
      if (action === "add") {
        if (this.phaseData.length >= 8) {
          return this.$message.warning("最多8个");
        }
        this.$msgbox({
          title: "提示",
          message: "即将自动生成一条默认阶段,是否继续?",
          showCancelButton: true,
          type: "warning",
          confirmButtonText: "继续",
          cancelButtonText: "放弃",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "生成中...";
              // ajax
              this.$http("index/d_phasestatus/dataAdd", {
                plan_id: this.id
              }).then(res => {
                if (res.status) {
                  this.fetchPhase();
                }
                this.$message({
                  type: res.status ? "success" : "error",
                  message: res.message
                });
                done();
                instance.confirmButtonLoading = false;
              });
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        })
          .then(action => {})
          .catch(action => {});
      }
    },
    machineClick(row) {
      let str = "ABCDEFGHIJKLMNOPQ";
      let index = str.indexOf(row.title);
      let p = this.phase.split("");
      let d = p[index];
      p[index] = d == "1" ? "3" : "1";
      this.phase = p.join("");
      this.fun.PHASEDATA = this.phase;
      this.fun.draw();
    },
    tabClick(index) {
      this.phase = this.phaseData[index].light_list;
      this.fun.PHASEDATA = this.phase;
      this.fun.draw();
    },
    save() {
      let data = this.phaseData[this.editableTabsValue];

      this.$http(
        "index/d_phasestatus/dataUpdate",
        Object.assign(data, {
          light_list: this.phase
        })
      ).then(res => {
        if (!res.status) {
          this.fetchPhase();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.drawView();
      this.fetchData();
      this.fetchPhase();
    });
  },
  watch: {
    editableTabsValue(newvalue) {
      this.tabClick(newvalue);
    }
  }
};
</script>

<style lang="scss" scoped>
.lightgroup-canvas {
  vertical-align: top;
  margin-right: 20px;
}
</style>
