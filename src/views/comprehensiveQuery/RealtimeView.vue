<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/comprehensiveQuery/'+id }">实时监控</el-breadcrumb-item>
            <el-breadcrumb-item>{{crossing.name || '路口'}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-tabs v-model="activeName">
            <el-tab-pane label="信号机" name="1">
              <div class="not-content" v-if="!machine.ip">暂无数据</div>
              <div class="machine" v-loading.lock="machine_loading" v-else>
                <div class="machine-view">
                  <canvas width="800" height="600" ref="machine"></canvas>
                </div>
                <div class="machine-info">
                  <el-radio-group v-model="activeName2" size="small" :style="{margin: '0 0 10px 27px'}">
                    <el-radio label="1" border>信息</el-radio>
                    <el-radio label="2" border>特勤</el-radio>
                    <el-radio label="3" border>控制</el-radio>
                  </el-radio-group>
                  <el-form :model="machineData" label-width="100px" v-if="activeName2==1">
                    <el-form-item label="信号机IP">
                      <el-input v-model="machineData.ip" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="信号机时间">
                      <el-input v-model="machineData.time" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="方案名称">
                      <el-input v-model="machineData.data_plan" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="当前方案">
                      <el-input v-model="machineData.current_plan" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="方案周期">
                      <el-input v-model="machineData.period" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="控制状态">
                      <el-input v-model="machineData.control_func" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="当前阶段">
                      <el-input v-model="machineData.current_step_num" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="频率">
                      <el-input v-model="machineData.frequency" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="温度">
                      <el-input v-model="machineData.temperature" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="电压">
                      <el-input v-model="machineData.voltage" readonly></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form :model="machineData2" label-width="100px" v-if="activeName2==2">
                    <el-form-item label="目标位置">
                      <el-select v-model="machineData2.wait_place" placeholder="请选择">
                        <el-option value="2" label="东"></el-option>
                        <el-option value="1" label="南"></el-option>
                        <el-option value="4" label="西"></el-option>
                        <el-option value="3" label="北"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="目标类型1">
                      <el-select v-model="machineData2.direction1" placeholder="请选择">
                        <el-option value="3" label="左转"></el-option>
                        <el-option value="2" label="右转"></el-option>
                        <el-option value="4" label="直行"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="目标类型2">
                      <el-select v-model="machineData2.direction2" placeholder="请选择">
                        <el-option value="3" label="左转"></el-option>
                        <el-option value="2" label="右转"></el-option>
                        <el-option value="4" label="直行"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <el-button-group>
                        <el-button type="primary" @click="openTeQing">开启</el-button>
                        <el-button @click="closeTeQing">关闭</el-button>
                      </el-button-group>
                    </el-form-item>
                  </el-form>
                  <div v-if="activeName2==3">
                    <div style="margin: 20px 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="bujing(1)" :disabled="btnLength<1">{{btnLength}}步进一</el-button>
                        <el-button @click="bujing(2)" :disabled="btnLength<2">步进二</el-button>
                      </el-button-group>
                      <el-button :style="{marginLeft: '20px'}" @click="red">全红</el-button>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="bujing(3)" :disabled="btnLength<3">步进三</el-button>
                        <el-button @click="bujing(4)" :disabled="btnLength<4">步进四</el-button>
                      </el-button-group>
                      <el-button :style="{marginLeft: '20px'}" @click="yellow">黄闪</el-button>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="bujing(5)" :disabled="btnLength<5">步进五</el-button>
                        <el-button @click="bujing(6)" :disabled="btnLength<6">步进六</el-button>
                      </el-button-group>
                      <el-button :style="{marginLeft: '20px'}" @click="auto">自动</el-button>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="bujing(7)" :disabled="btnLength<7">步进七</el-button>
                        <el-button @click="bujing(8)" :disabled="btnLength<8">步进八</el-button>
                      </el-button-group>
                      <el-button :style="{marginLeft: '20px'}" @click="bujing(0)">步进</el-button>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="closeLamp">关闭外灯</el-button>
                        <el-button @click="openLamp">打开外灯</el-button>
                      </el-button-group>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="correctionTime">校正时间</el-button>
                        <el-button @click="restartMachine">重启机器</el-button>
                      </el-button-group>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-popover placement="right" width="400" trigger="click">
                        <el-table :data="gridData" :highlight-current-row="true" :show-header="false" @row-click="tableClick">
                          <el-table-column prop="name" label="name"></el-table-column>
                        </el-table>
                        <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="10" layout="total, prev, pager, next" :total="total">
                        </el-pagination>
                        <el-input slot="reference" placeholder="请选择方案" v-model="plan.name" readonly></el-input>
                      </el-popover>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-checkbox v-model="checked">是否覆盖</el-checkbox>
                    </div>
                    <div style="margin: 0 20px 10px 27px">
                      <el-button-group>
                        <el-button @click="downloadPlan">下载配置</el-button>
                        <el-button @click="uploadPlan">上传方案</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="备用电源" name="2">
              <div class="not-content" v-if="!ups.ip">暂无数据</div>
              <el-form :model="upsData" label-width="100px" v-else style="width: 300px;">
                <el-form-item label="备用电源IP">
                  <el-input v-model="upsData.ip" readonly></el-input>
                </el-form-item>
                <el-form-item label="市输出电压">
                  <el-input v-model="upsData.ups1" readonly></el-input>
                </el-form-item>
                <el-form-item label="故障市电压">
                  <el-input v-model="upsData.ups2" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出电压">
                  <el-input v-model="upsData.ups3" readonly></el-input>
                </el-form-item>
                <el-form-item label="负载百分比">
                  <el-input v-model="upsData.ups4" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出频率">
                  <el-input v-model="upsData.ups5" readonly></el-input>
                </el-form-item>
                <el-form-item label="直流电压">
                  <el-input v-model="upsData.ups6" readonly></el-input>
                </el-form-item>
                <el-form-item label="机内温度">
                  <el-input v-model="upsData.ups7" readonly></el-input>
                </el-form-item>
                <el-form-item label="市电状态">
                  <el-input v-model="upsData.ups80" readonly></el-input>
                </el-form-item>
                <el-form-item label="直流电压">
                  <el-input v-model="upsData.ups81" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出">
                  <el-input v-model="upsData.ups82" readonly></el-input>
                </el-form-item>
                <el-form-item label="内部状态">
                  <el-input v-model="upsData.ups83" readonly></el-input>
                </el-form-item>
                <el-form-item label="工作方式">
                  <el-input v-model="upsData.ups84" readonly></el-input>
                </el-form-item>
                <el-form-item label="UPS电池">
                  <el-input v-model="upsData.ups85" readonly></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-button-group>
                    <el-button type="primary" @click="openUps">开启</el-button>
                    <el-button @click="closeUps">关闭</el-button>
                  </el-button-group>
                </el-form-item>
              </el-form>
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
      activeName2: "1",
      id: this.$route.params.id,
      wsUrl: "", //websocket地址
      websocket: null,
      // 路口数据
      crossing: {},
      // 信号机数据
      machine: {},
      // 备用电源数据
      ups: {},
      machine_loading: true,
      fun: null,
      // 信号机执行方案数据
      machine_plan_data: {},
      // 信号机实时数据
      machineData: {},
      machineData2: {},
      gridData: [],
      upsData: {},
      // 信号机控制状态
      machine_control_status: {
        "0": "定周期方式",
        "1": "待机黄闪",
        "2": "待机全红",
        "3": "无线缆协调",
        "4": "感应方式",
        "7": "关闭外灯",
        "8": "关闭外灯",
        "9": "时钟同步",
        "153": "锁相位特勤控制",
        "181": "锁阶段特勤控制，或手动控制和步进",
        "200": "自适应方案"
      },
      page: 1,
      total: 0,
      checked: false,
      plan: {}
    };
  },
  methods: {
    // 获取路口信息
    getCrossing() {
      this.$http("index/d_crossing/dataView", {
        id: this.id
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing = data.crossing || {};
          this.machine = data.machine || {};
          this.ups = data.ups || {};

          // 信号机存在
          if (this.machine.ip) {
            this.getLight(this.machine.id);
          }
        }
      });
    },
    // 获取灯组信息
    getLight(machine_id) {
      this.$http("index/d_machine_control/getMachinePlan", {
        machine_id: machine_id
      }).then(res => {
        if (res.status) {
          this.machine_loading = false;
          let draw = this.fun;
          draw.init(this.$refs.machine);
          this.machine_plan_data = res.data;
          let LIGHTDATA = res.data.data_phaseinfo;
          draw.LIGHTDATA = LIGHTDATA;
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
      });
    },
    // 获取方案信息
    getPlanList() {
      this.$http("index/d_plan/dataList", {
        page: this.page,
        rows: 5
      }).then(res => {
        this.gridData = res.data.list || [];
        this.total = ~~res.data.total;
      });
    },
    tableClick(row, event, column) {
      this.plan = row;
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
      // draw.PHASEDATA = "7777777777777777";
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
        this.machineData = {
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
        };
      }
      draw.draw();
    },
    // 激活/注销特勤
    openTeQing() {
      let wait_place = this.machineData2.wait_place;
      let direction =
        this.machineData2.direction1 +
        (this.machineData2.direction2 ? this.machineData2.direction2 : "");
      if (!wait_place || !direction) {
        return;
      }
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 7,
        wait_place,
        direction
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    closeTeQing() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 8,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    bujing(value) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 9,
        wait_place: value,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    red(value) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 1,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    yellow() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 2,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    auto(value) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 3,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    closeLamp() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 5,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    openLamp() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 4,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    correctionTime() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 0,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    restartMachine() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine.id,
        type: 6,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    downloadPlan() {
      this.$http("index/d_machine_control/downLoadSetting", {
        machine_id: this.machine.id,
        plan_id: this.plan.id
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    uploadPlan() {
      let is_cover = this.checked;
      let plan_id = this.plan.id;
      if (is_cover) {
        this.$http("index/d_machine_control/uploadSetting", {
          machine_id: this.machine.id,
          is_cover: 1,
          plan_id: this.plan.id
        }).then(res => {
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
          if (res.status) {
            setTimeout(() => {
              window.reload();
            });
          }
        });
      } else {
        this.$prompt("不覆盖原有方案，需输入一个方案名称", "提示", {
          confirmButtonText: "新增",
          cancelButtonText: "放弃",
          inputPlaceholder: "请输入名称",
          // inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{4,9}/,
          inputValidator: value => {
            if (!value) {
              return false;
            } else if (value.replace(/(^\s*)|(\s*$)/g, "")) {
              return true;
            } else {
              return false;
            }
          },
          inputErrorMessage: "请填写名称",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "初始化中...";
              // ajax
              this.$http("index/d_machine_control/uploadSetting", {
                machine_id: this.machine.id,
                is_cover: 0,
                plan_id: this.plan.id
              }).then(res => {
                this.$message({
                  type: res.status ? "success" : "error",
                  message: res.message
                });
                done();
                instance.confirmButtonLoading = false;
                if (res.status) {
                  setTimeout(() => {
                    window.reload();
                  });
                }
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
    openUps() {
      this.$http("index/d_ups/upsOnOff", {
        id: this.ups.id,
        do: 1
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    closeUps() {
      this.$http("index/d_ups/upsOnOff", {
        id: this.ups.id,
        do: 0
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getPlanList();
    }
  },
  created() {
    this.fun = new VIEW();
    this.getPlanList();
    this.getCrossing();
    this.connectWebSocket();
  },
  beforeDestroy() {
    // 销毁websocket
    if (this.websocket) {
      this.websocket.onclose();
    }
  },
  computed: {
    btnLength() {
      return this.machine_plan_data.data_phasestatus.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.machine {
  width: 1200px;
  margin: 0 auto;
  &-view {
    display: inline-block;
    width: 800px;
    vertical-align: top;
    canvas {
      background: rgba($color: #000000, $alpha: 0.3);
    }
  }
  &-info {
    display: inline-block;
    width: 400px;
  }
}
</style>
