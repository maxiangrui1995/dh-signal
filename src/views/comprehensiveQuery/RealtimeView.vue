<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/comprehensiveQuery/'+id }">综合查询</el-breadcrumb-item>
            <el-breadcrumb-item>{{crossing_name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="'信号机 ('+machine_ip+')'" name="1">
              <div class="tab-pane-wrapper">
                <div class="tab-pane-inner view">
                  <canvas ref="canvasview" width="800" height="640"></canvas>
                </div>
                <div class="tab-pane-inner form">
                  <el-form :inline="true" :model="machine_form_data" :style="{marginLeft: '20px'}">
                    <el-form-item label="系统时间">
                      <el-input v-model="machine_form_data.time" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="方案名称">
                      <el-input v-model="machine_form_data.data_plan" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="当前方案">
                      <el-input v-model="machine_form_data.current_plan" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="方案周期">
                      <el-input v-model="machine_form_data.period" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="控制状态">
                      <el-input v-model="machine_form_data.control_func" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="当前阶段">
                      <el-input v-model="machine_form_data.current_step_num" :style="{width: '160px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="频率">
                      <el-input v-model="machine_form_data.frequency" :style="{width: '60px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="温度">
                      <el-input v-model="machine_form_data.temperature" :style="{width: '60px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="电压">
                      <el-input v-model="machine_form_data.voltage" :style="{width: '60px'}"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="'备用电源 ('+ups_ip+')'" name="2">
              <div ref="ups-chart-1" :style="{width: '800px', height: '600px'}"></div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import VIEW from "@/libs/view";
export default {
  data() {
    return {
      activeName: "1",
      id: this.$route.params.id,
      wsUrl: "", //websocket地址
      websocket: null,
      crossing_name: "路口",
      machine_ip: "暂无",
      ups_ip: "暂无",
      machine_form_data: {
        time: "2018/07/18 13:32:30",
        data_plan: "方案一"
      }, //信号机实时数据
      machine_data: {},
      fun: null
    };
  },
  mounted() {
    // this.drawLine();
    this.upsChart1();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表

      function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
          name: now.toString(),
          value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
            Math.round(value)
          ]
        };
      }

      var data = [];
      var now = +new Date(1997, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var value = Math.random() * 1000;
      for (var i = 0; i < 1000; i++) {
        data.push(randomData());
      }

      let option = {
        title: {
          text: "动态数据 + 时间坐标轴"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }
        ]
      };
      myChart.setOption(option);
      /* setInterval(function() {
        for (var i = 0; i < 5; i++) {
          data.shift();
          data.push(randomData());
        }

        myChart.setOption({
          series: [
            {
              data: data
            }
          ]
        });
      }, 1000); */
    },
    upsChart1() {
      let ele = this.$refs["ups-chart-1"];
      let myChart = this.$echarts.init(ele);

      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            "市输出电压",
            "市故障电压",
            "输出电压",
            "负载百分比",
            "输出频率",
            "直流电压",
            "机内温度"
          ]
        },
        xAxis: {
          type: "category",
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          show: false
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "市输出电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "市故障电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "输出电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "负载百分比",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "输出频率",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "直流电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "机内温度",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取路口信息
    getCrossing() {
      this.$http("index/d_crossing/dataView", {
        id: this.id
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing_name = data.crossing.name;
          this.machine_ip = data.machine.ip;
          this.machine_id = data.machine.id;
          this.ups_ip = data.ups.ip;

          this.getLight(data.machine.id);
        }
      });
    },
    // 获取灯组信息
    getLight(machine_id) {
      this.$http("index/d_machine_control/getMachinePlan", {
        machine_id: machine_id
      }).then(res => {
        if (res.status) {
          let draw = this.fun;
          this.machine_data = res.data;
          let LIGHTDATA = res.data.data_phaseinfo;
          draw.LIGHTDATA = LIGHTDATA;
          draw.draw();
        }
      });
    },
    // 连接websocket
    connectWebSocket() {
      // 第一步：获得地址
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
          let self = this;
          w.onopen = function() {
            self.$message.info("websocket开始连接");
            w.send(self.id);
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
      draw.PHASEDATA = machine.status;

      let machine_data = this.machine_data;
      if (Object.keys(machine_data).length > 0) {
        // 计算倒计时
        let current_plan = this.machine_data.data_pattern[machine.current_plan];
        let time_interval = ~~this.machine_data.data_passage[0].time_interval;
        if (machine.current_step_num == 160) {
          draw.COUNT = time_interval - machine.current_phase_time;
        } else if (machine.current_phase_time > 16) {
        } else {
          draw.COUNT =
            ~~current_plan["time" + machine.current_step_num] +
            time_interval -
            machine.current_phase_time;
        }
      }

      draw.draw();
    },
    // canvas绘制信号机
    drawSignalView() {
      let draw = this.fun;
      draw.init(this.$refs.canvasview);
      // 路口数据 TODO
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
      this.fun = new VIEW();
      this.drawSignalView();
      this.getCrossing();
      this.connectWebSocket();
    });
  },
  beforeDestroy() {
    // 销毁websocket
    if (this.websocket) {
      this.websocket.onclose();
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-pane {
  &-wrapper {
    width: 100%;
    overflow-y: auto;
    .view {
      width: 800px;
    }
    .form {
      width: calc(100% - 800px);
    }
  }
  &-inner {
    display: inline-block;
    vertical-align: top;
  }
}
canvas {
  vertical-align: top;
}
</style>
