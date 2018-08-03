<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/region' }">区域管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region/'+id1 }">{{name1}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region/'+id1+'/'+id2 }">{{name2}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{name3}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>信号机</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text" @click="handleCreate_signal_ups(null, 'signal')">新增</el-button>
              </div>
              <el-table :data="signalData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate_signal_ups(scope.row, 'signal')">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-button type="text" @click="handleDelete_signal_ups(scope.row, 'signal')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>备用电源</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text" @click="handleCreate_signal_ups(null, 'ups')">新增</el-button>
              </div>
              <el-table :data="upsData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate_signal_ups(scope.row, 'ups')">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-button type="text" @click="handleDelete_signal_ups(scope.row, 'ups')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>相机</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text" @click="handleCreateCamera">新增</el-button>
              </div>
              <el-table :data="cameraData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column prop="type" label="type">
                  <template slot-scope="scope">
                    <div>{{ cameraType[scope.row.type] }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="username">
                </el-table-column>
                <el-table-column prop="password" label="password">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>车检服务器</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text" @click="handleCreateIpc">新增</el-button>
              </div>
              <el-table :data="ipcData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column prop="name" label="name">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row> -->
      </el-main>
    </el-container>

    <!-- <el-dialog :title="dialogCameraTitle" :visible.sync="dialogCameraVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="cameraFormData" :rules="cameraFormRules" ref="cameraForm" label-width="60px">
        <el-form-item label="相机IP" prop="ip">
          <el-input v-model="cameraFormData.ip"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="cameraFormData.type">
            <el-radio label="1">车流量相机</el-radio>
            <el-radio label="2">电子警察</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="cameraFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="cameraFormData.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="dialogCameraVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCameraSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    const validateUser = (rule, value, callback) => {
      // 0到26位（字母，数字，下划线，减号）
      let reg = /^[a-zA-Z0-9_-]{0,26}$/;
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("账号格式不正确"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      // 0到26位（字母，数字，下划线，减号）
      let reg = /^[a-zA-Z0-9_-]{0,26}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("密码格式不正确"));
        }
      }
    };
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      id3: this.$route.params.id3,
      name1: "",
      name2: "",
      name3: "",
      loading: true,
      signalData: [],
      upsData: [],
      ipcData: [],
      cameraData: [],
      cameraType: {
        "1": "电子警察",
        "2": "车流量相机"
      },
      ipReg: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      dialogCameraVisible: false,
      dialogCameraTitle: "",
      cameraFormData: {},
      cameraFormRules: {
        ip: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入ip"));
              } else {
                if (this.ipReg.test(value)) {
                  callback();
                } else {
                  callback(new Error("请输入正确的ip"));
                }
              }
            }
          }
        ],
        username: [
          {
            validator: validateUser
          }
        ],
        password: [
          {
            validator: validatePass
          }
        ]
      }
    };
  },
  methods: {
    fetchData() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.$store.dispatch("SETCROSSING", data);
        }
      });
    },
    fetchDevData() {
      this.loading = true;
      this.$http("index/d_crossing/dataView", { id: this.id3 }).then(res => {
        if (res.status) {
          let data = res.data;
          this.signalData = data.machine ? [data.machine] : [];
          this.upsData = data.ups ? [data.ups] : [];
          this.ipcData = data.ipc ? data.ipc : [];
          this.cameraData = data.camera ? data.camera : [];
        }
      });
    },
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1 && item.children) {
          this.name1 = item.name;
          item.children.forEach(item => {
            if (item.id == this.id2 && item.children) {
              this.name2 = item.name;
              item.children.forEach(item => {
                if (item.id == this.id3) {
                  this.tableData = item.children;
                  this.name3 = item.name;
                }
              });
            }
          });
        }
      });
      this.loading = false;
    },
    handleCreateSignal() {
      this.$prompt("输入信号机IP后将在路口下绑定该设备", "提示", {
        confirmButtonText: "绑定",
        cancelButtonText: "取消",
        inputPattern: this.ipReg,
        inputErrorMessage: "请填写正确ip",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "绑定中...";
            // ajax
            this.$http("index/d_machine/dataAdd", {
              ip: instance.inputValue,
              port: 4001,
              crossing_id: this.id3
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
        .then(() => {})
        .catch(() => {});
    },
    handleUpdateSignal(row) {
      this.$prompt("输入信号机IP后将绑定该设备以替换旧设备", "提示", {
        confirmButtonText: "替换",
        cancelButtonText: "取消",
        inputValue: row.ip,
        inputPattern: this.ipReg,
        inputErrorMessage: "请填写正确ip",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "替换中...";
            // ajax
            this.$http("index/d_machine/dataUpdate", {
              ip: instance.inputValue,
              port: row.port,
              crossing_id: row.crossing_id,
              id: row.id
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
        .then(() => {})
        .catch(() => {});
    },
    handleDeleteSignal(row) {
      this.$msgbox({
        title: "提示",
        message: "此操作将解绑该设备, 是否继续?",
        showCancelButton: true,
        type: "warning",
        confirmButtonText: "解绑",
        cancelButtonText: "放弃",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "解绑中...";
            // ajax
            this.$http("index/d_machine/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
    },

    handleCreateUps() {
      this.$prompt("输入信号机IP后将在路口下绑定该设备", "提示", {
        confirmButtonText: "绑定",
        cancelButtonText: "取消",
        inputPattern: this.ipReg,
        inputErrorMessage: "请填写正确ip",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "绑定中...";
            // ajax
            this.$http("index/d_ups/dataAdd", {
              ip: instance.inputValue,
              port: 5000,
              crossing_id: this.id3
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
        .then(() => {})
        .catch(() => {});
    },
    handleUpdateUps(row) {
      this.$prompt("输入信号机IP后将绑定该设备以替换旧设备", "提示", {
        confirmButtonText: "替换",
        cancelButtonText: "取消",
        inputValue: row.ip,
        inputPattern: this.ipReg,
        inputErrorMessage: "请填写正确ip",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "替换中...";
            // ajax
            this.$http("index/d_ups/dataUpdate", {
              ip: instance.inputValue,
              port: row.port,
              crossing_id: row.crossing_id,
              id: row.id
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
        .then(() => {})
        .catch(() => {});
    },
    handleDeleteUps(row) {
      this.$msgbox({
        title: "提示",
        message: "此操作将解绑该设备, 是否继续?",
        showCancelButton: true,
        type: "warning",
        confirmButtonText: "解绑",
        cancelButtonText: "放弃",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "解绑中...";
            // ajax
            this.$http("index/d_ups/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
                this.fetchDevData();
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
    },

    handleCreateCamera() {
      this.dialogCameraVisible = true;
      this.dialogCameraTitle = "相机新增";
      this.cameraFormData = {
        ip: "",
        type: "1",
        username: "",
        password: ""
      };
    },
    handleCameraSubmit() {},
    handleCreateIpc() {}
  },
  created() {
    this.fetchDevData();
    if (this.crossingData.length) {
      this.formatterData(this.crossingData);
    } else {
      this.fetchData();
    }
  },
  computed: {
    crossingData() {
      return this.$store.state.crossingData;
    }
  },
  watch: {
    crossingData(data) {
      this.formatterData(data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
