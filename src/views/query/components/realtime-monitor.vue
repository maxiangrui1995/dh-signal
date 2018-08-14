<template>
  <el-dialog title="实时监控" :visible.sync="visible" width="900px" :before-close="handleClose" :close-on-click-modal="false" @close="dialogCloseEvent">
    <div class="box">
      <div class="box-canvas">
        <canvas width="600" height="500" ref="machine"></canvas>
      </div>
      <div class="box-views">
        <div class="nocontent" v-if="Object.keys(machine_plan_data).length === 0">加载失败</div>
        <el-tabs v-else v-model="machine_ups">
          <el-tab-pane label="信号机" name="machine">
            <el-radio-group v-model="activeName2" size="small" :style="{marginBottom: '10px'}">
              <el-radio label="1" border>信息</el-radio>
              <el-radio label="2" border>特勤</el-radio>
              <el-radio label="3" border>控制</el-radio>
            </el-radio-group>
            <el-form :model="machineInfoData" label-width="80px" v-if="activeName2 == 1">
              <el-form-item label="信号机IP" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.ip" readonly></el-input>
              </el-form-item>
              <el-form-item label="系统时间" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.time" readonly></el-input>
              </el-form-item>
              <el-form-item label="方案名称" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.data_plan" readonly></el-input>
              </el-form-item>
              <el-form-item label="当前方案" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.current_plan" readonly></el-input>
              </el-form-item>
              <el-form-item label="方案周期" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.period" readonly></el-input>
              </el-form-item>
              <el-form-item label="控制状态" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.control_func" readonly></el-input>
              </el-form-item>
              <el-form-item label="当前阶段" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.current_step_num" readonly></el-input>
              </el-form-item>
              <el-form-item label="频率" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.frequency" readonly></el-input>
              </el-form-item>
              <el-form-item label="温度" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.temperature" readonly></el-input>
              </el-form-item>
              <el-form-item label="电压" :style="{marginBottom: '7px'}">
                <el-input v-model="machineInfoData.voltage" readonly></el-input>
              </el-form-item>
            </el-form>
            <el-form :model="machinePolice" label-width="80px" v-if="activeName2==2">
              <el-form-item label="目标位置">
                <el-select v-model="machinePolice.wait_place" placeholder="请选择">
                  <el-option value="2" label="东"></el-option>
                  <el-option value="1" label="南"></el-option>
                  <el-option value="4" label="西"></el-option>
                  <el-option value="3" label="北"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标类型1">
                <el-select v-model="machinePolice.direction1" placeholder="请选择">
                  <el-option value="3" label="左转"></el-option>
                  <el-option value="2" label="右转"></el-option>
                  <el-option value="4" label="直行"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标类型2">
                <el-select v-model="machinePolice.direction2" placeholder="请选择">
                  <el-option value="3" label="左转"></el-option>
                  <el-option value="2" label="右转"></el-option>
                  <el-option value="4" label="直行"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button-group>
                  <el-button type="primary" @click="teqing(1)">开启</el-button>
                  <el-button @click="teqing(0)">关闭</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
            <div v-if="activeName2==3">
              <div>
                <el-button-group>
                  <el-button :disabled="btnLength < 1" @click="bujing(1)">步进一</el-button>
                  <el-button :disabled="btnLength < 2" @click="bujing(2)">步进二</el-button>
                </el-button-group>
                <el-button :style="{marginLeft: '20px'}" @click="bujing2(1)">全红</el-button>
              </div>
              <div style="margin-top: 5px;">
                <el-button-group>
                  <el-button :disabled="btnLength < 3" @click="bujing(3)">步进三</el-button>
                  <el-button :disabled="btnLength < 4" @click="bujing(4)">步进四</el-button>
                </el-button-group>
                <el-button :style="{marginLeft: '20px'}" @click="bujing2(2)">黄闪</el-button>
              </div>
              <div style="margin-top: 5px;">
                <el-button-group>
                  <el-button :disabled="btnLength < 5" @click="bujing(5)">步进五</el-button>
                  <el-button :disabled="btnLength < 6" @click="bujing(6)">步进六</el-button>
                </el-button-group>
                <el-button :style="{marginLeft: '20px'}" @click="bujing2(3)">自动</el-button>
              </div>
              <div style="margin-top: 5px;">
                <el-button-group>
                  <el-button :disabled="btnLength < 7" @click="bujing(7)">步进七</el-button>
                  <el-button :disabled="btnLength < 8" @click="bujing(8)">步进八</el-button>
                </el-button-group>
                <el-button :style="{marginLeft: '20px'}" @click="bujing(0)">步进</el-button>
              </div>
              <div style="margin-top: 15px;">
                <el-button-group>
                  <el-button @click="waideng(0)">关闭外灯</el-button>
                  <el-button @click="waideng(1)">打开外灯</el-button>
                </el-button-group>
              </div>
              <div style="margin-top: 5px;">
                <el-button-group>
                  <el-button @click="jiaoshi">校正时间</el-button>
                  <el-button @click="chongqi">重启机器</el-button>
                </el-button-group>
              </div>
              <div style="margin-top: 15px;">
                <el-popover placement="right" width="400" trigger="click">
                  <el-table class="default-table" :data="gridData" :highlight-current-row="true" :show-header="false" @row-click="tableClick">
                    <el-table-column prop="name" label="name"></el-table-column>
                  </el-table>
                  <el-pagination class="default-pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="10" layout="total, prev, pager, next" :total="total">
                  </el-pagination>
                  <el-input slot="reference" placeholder="请选择方案" v-model="plan.name" readonly></el-input>
                </el-popover>
              </div>
              <div style="margin-top: 5px;">
                <el-checkbox v-model="checked">是否覆盖</el-checkbox>
              </div>
              <div style="margin-top: 5px;">
                <el-button-group>
                  <el-button @click="xiazai">下载配置</el-button>
                  <el-button @click="shangchuan">上传方案</el-button>
                </el-button-group>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="备用电源" name="ups">
            <el-scrollbar :style="{height: '440px'}">
              <el-form :model="upsData" label-width="100px">
                <el-form-item label="备用电源IP" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ip" readonly></el-input>
                </el-form-item>
                <el-form-item label="市输出电压" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups1" readonly></el-input>
                </el-form-item>
                <el-form-item label="故障市电压" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups2" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出电压" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups3" readonly></el-input>
                </el-form-item>
                <el-form-item label="负载百分比" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups4" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出频率" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups5" readonly></el-input>
                </el-form-item>
                <el-form-item label="直流电压" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups6" readonly></el-input>
                </el-form-item>
                <el-form-item label="机内温度" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups7" readonly></el-input>
                </el-form-item>
                <el-form-item label="市电状态" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups80" readonly></el-input>
                </el-form-item>
                <el-form-item label="直流电压" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups81" readonly></el-input>
                </el-form-item>
                <el-form-item label="输出" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups82" readonly></el-input>
                </el-form-item>
                <el-form-item label="内部状态" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups83" readonly></el-input>
                </el-form-item>
                <el-form-item label="工作方式" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups84" readonly></el-input>
                </el-form-item>
                <el-form-item label="UPS电池" :style="{marginBottom: '5px'}">
                  <el-input v-model="upsData.ups85" readonly></el-input>
                </el-form-item>
                <el-form-item label="" :style="{marginBottom: '5px'}">
                  <el-button-group>
                    <el-button type="primary">开启</el-button>
                    <el-button>关闭</el-button>
                  </el-button-group>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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
      visible: false, //弹窗是否展示
      machine_ups: "machine", //标签选中(信号机/备用电源)
      fun: null, //canvas的方法
      wsUrl: "", //websocket的地址
      machine_plan_data: {}, //信号机所有的配置信息
      websocket: null, // websocket
      activeName2: "1", // 标签选中(信息/特勤/控制)
      machineInfoData: {}, //信号机的基本信息
      machinePolice: {}, //信号机特勤
      upsData: {}, //备用电源信息
      checked: false,
      gridData: [], //特征参数
      page: 1,
      total: 0,
      plan: {}
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
      this.getPlanList();
      this.$nextTick(() => {
        if (!this.fun) {
          this.fun = new VIEW();
          this.fun.init(this.$refs.machine);
        }
        this.fun.drawText("初始化中...");

        let data = this.crossingView;
        // 先拿到信号机的ID
        let machine_id = data.machine.id;
        this.machine_id = machine_id;
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
          this.fun.drawText("初始化失败,灯组信息加载失败", "red");
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
      let draw = this.fun;
      let plan = this.machine_plan_data;
      if (!data.data.machine && !data.data.ups) {
        draw.draw();
        draw.drawText("信号机且备用电源连接异常", "red", true);
      } else {
        // 信号机信息
        let machine = data.data.machine;
        draw.PHASEDATA = machine.status;
        if (!draw.selector) return;
        // 当前信号机执行方案
        let current_plan = plan.data_pattern[machine.current_plan];
        // 时间间隔
        let time_interval = ~~plan.data_passage[0].time_interval;
        // 倒计时
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

        this.machineInfoData = {
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
        draw.draw();
      }
    },
    tableClick(row, event, column) {
      this.plan = row;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getPlanList();
    },
    // 步进
    bujing(step) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
        type: 9,
        wait_place: step,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    // 全红，黄闪，自动
    bujing2(status) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
        type: status,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    // 特勤
    teqing(status) {
      let wait_place = this.machinePolice.wait_place;
      let direction =
        this.machinePolice.direction1 +
        (this.machinePolice.direction2 ? this.machinePolice.direction2 : "");
      if (!wait_place || !direction) {
        return;
      }
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
        type: status ? 7 : 8,
        wait_place,
        direction
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    // 外灯
    waideng(status) {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
        type: status ? 4 : 5,
        wait_place: 1,
        direction: 10
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    // 校时
    jiaoshi() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
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
    // 重启
    chongqi() {
      this.$http("index/d_machine_control/sendToMachine", {
        machine_id: this.machine_id,
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
    // 下载
    xiazai() {
      this.$http("index/d_machine_control/downLoadSetting", {
        machine_id: this.machine_id,
        plan_id: this.plan.id
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    // 上传
    shangchuan() {
      let is_cover = this.checked;
      let plan_id = this.plan.id;
      if (is_cover) {
        this.$http("index/d_machine_control/uploadSetting", {
          machine_id: this.machine_id,
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
    }
  },
  watch: {
    dialogVisible(newValue) {
      this.visible = newValue;
      // 只有弹出打开的时候
      if (newValue) {
        this.dialogOpend();
      } else {
        this.fun.clearCanvas();
        if (this.websocket) {
          this.websocket.onclose();
        }
      }
    }
  },
  computed: {
    // 步进按钮的个数
    btnLength() {
      return this.machine_plan_data.data_phasestatus.length;
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
  &-views {
    width: 300px;
    height: 100%;
    display: table-cell;
    padding-left: 10px;
  }
  .nocontent {
    text-align: center;
    color: #909399;
  }
}
</style>
