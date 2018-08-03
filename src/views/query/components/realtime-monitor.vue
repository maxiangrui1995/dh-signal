<template>
  <el-dialog title="实时监控" :visible.sync="visible" width="900px" :before-close="handleClose" :close-on-click-modal="false" @close="dialogCloseEvent">
    <el-tabs v-model="activeName" v-loading.lock="loading" v-if="!loading">
      <el-tab-pane label="信号机" name="first">
        <div class="">
          <canvas width="600" height="500" ref="machine"></canvas>
        </div>
      </el-tab-pane>
      <el-tab-pane label="备用电源" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import VIEW from "@/libs/view";
export default {
  props: {
    dialogVisible: Boolean,
    crossingView: Object
  },
  data() {
    return {
      visible: false,
      activeName: "first",
      loading: false,
      fun: null,
      wsUrl: "",
      machine_plan_data: {},
      websocket: null
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    dialogCloseEvent() {
      this.$emit("dialogClose");
    },
    dialogOpend() {
      this.$nextTick(() => {
        if (!this.fun) {
          this.fun = new VIEW();
          this.fun.init(this.$refs.machine);
        }

        let data = this.crossingView;
        // 先拿到信号机的ID
        let machine_id = data.machine.id;
        // 通过信号机ID获取信号机方案
        this.getMachinePlan(machine_id);
      });
    },
    getMachinePlan(machine_id) {
      this.$http("index/d_machine_control/getMachinePlan", {
        machine_id: machine_id
      }).then(res => {
        if (res.status) {
          this.machine_plan_data = res.data;
          // 路口信息写死
          this.fun.CROSSINGDATA = [
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
          this.fun.LIGHTDATA = res.data.data_phaseinfo;
          this.fun.draw();
          // 获取实时信号机消息
          this.connectWebSocket();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    connectWebSocket() {
      this.$http("index/d_machine_control/getVar")
        .then(res => {
          if (res.status) {
            let data = res.data;
            let { web_socket_host, web_socket_port } = data;
            this.wsUrl = `ws://${web_socket_host}:${web_socket_port}`;
          } else {
            this.$message.error("信号机实时数据地址请求失败!");
          }
        })
        .then(() => {
          let wsUrl = this.wsUrl;
          if (!wsUrl) return;
          let w = (this.websocket = new WebSocket(wsUrl));
          let crossing_id = this.crossingView.crossing.id;
          let self = this;
          w.onopen = function() {
            self.$message.info("websocket开始连接");
            w.send(crossing_id);
          };
          w.onmessage = function(evt) {
            let data = JSON.parse(evt.data);
            if (data.status) {
              self.getWebSockeMessage(data);
            }
          };
          w.onerror = function() {
            self.$message.info("websocket连接失败");
            throw "websocket连接失败";
          };
          w.onclose = function() {
            self.$message.info("websocket连接断开");
            w.close();
          };
        });
    },
    // 实时接收websocket消息
    getWebSockeMessage(data) {
      let machine = data.data.machine;
      let ups = data.data.ups;
      let draw = this.fun;
      // draw.PHASEDATA = "7777777777777777";
      draw.PHASEDATA = machine.status;
      if (!draw.selector) return;
      let plan = this.machine_plan_data;
      if (Object.keys(data).length > 0) {
        /* 计算倒计时 */
        // 当前信号机执行方案
        let current_plan = plan.data_pattern[machine.current_plan];
        // 时间间隔
        let time_interval = ~~plan.data_passage[0].time_interval;
        if (machine.current_step_num == 160) {
          draw.COUNT = time_interval - machine.current_phase_time;
        } else {
          if (machine.current_phase_time != 255) {
            draw.COUNT =
              ~~current_plan["time" + machine.current_step_num] +
              time_interval -
              machine.current_phase_time;
          }
        }
        /*  this.machineData = {
          ip: this.machine.ip,
          time: machine.time,
          data_plan: plan.data_plan.name,
          current_plan: "方案" + (~~machine.current_plan + 1),
          period: plan.data_pattern[0].period,
          control_func: this.machine_control_status[machine.control_func],
          current_step_num:
            machine.current_step_num === 160
              ? "倒计时阶段"
              : machine.current_step_num,
          frequency: machine.frequency,
          temperature: machine.temperature,
          voltage: machine.voltage
        };
        this.upsData = {
          ip: this.ups.ip,
          ups1: ups[0],
          ups2: ups[1],
          ups3: ups[2],
          ups4: ups[3],
          ups5: ups[4],
          ups6: ups[5],
          ups7: ups[6]
        }; */
      }
      draw.draw();
    }
  },
  watch: {
    dialogVisible(newValue) {
      this.visible = newValue;
      // 只有弹出打开的时候
      if (newValue) {
        this.dialogOpend();
      } else {
        this.websocket.onclose();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: table;
  &-canvas {
    display: table-cell;
    vertical-align: top;
    canvas {
      display: block;
    }
  }
  &-view {
    display: table-cell;
  }
}
</style>
