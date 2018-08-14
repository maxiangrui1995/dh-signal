<template>
  <el-container>
    <el-header class="page-header" :style="{height: 'auto'}">
      <div class="page-header-inner">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/region' }">区域管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/region/'+id1 }">{{name1}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/region/'+id1+'/'+id2 }">{{name2}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{name3}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="margin-bottom: 10px;">
        <el-button @click="handleCreateSignal" class="theme-default-btn">
          <i class="el-icon-circle-plus-outline"></i> 信号机</el-button>
        <el-button @click="handleCreateUps" class="theme-default-btn">
          <i class="el-icon-circle-plus-outline"></i> 备用电源</el-button>
        <el-button @click="handleCreateIpc" class="theme-default-btn">
          <i class="el-icon-circle-plus-outline"></i> 车检服务器</el-button>
        <el-button @click="handleCreateCamera" class="theme-default-btn">
          <i class="el-icon-circle-plus-outline"></i> 相机</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="content-card-wrapper">
        <Wrapper>
          <!-- 信号机 -->
          <el-table :data="signal.data">
            <el-table-column prop="ip" label="信号机IP" width="180">
            </el-table-column>
            <el-table-column prop="port" label="端口号">
            </el-table-column>
            <el-table-column label="操作" align="left" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleModifySignal(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDeleteSignal(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 备用电源 -->
          <el-table :data="ups.data" :style="{ marginTop: '20px' }">
            <el-table-column prop="ip" label="备用电源IP" width="180">
            </el-table-column>
            <el-table-column prop="port" label="端口号">
            </el-table-column>
            <el-table-column label="操作" align="left" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleModifyUps(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDeleteUps(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 车检器 -->
          <el-table :data="ipc.data" :style="{ marginTop: '20px' }">
            <el-table-column prop="ip" label="车检服务器IP" width="180">
            </el-table-column>
            <el-table-column prop="name" label="车检服务器别名">
            </el-table-column>
            <el-table-column label="操作" align="left" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleModifyIpc(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDeleteIpc(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 相机 -->
          <el-table :data="camera.data" :style="{ marginTop: '20px' }">
            <el-table-column prop="ip" label="相机IP" width="180">
            </el-table-column>
            <el-table-column prop="port" label="端口号">
            </el-table-column>
            <el-table-column prop="type" label="相机类型">
              <template slot-scope="scope">
                <div>{{ camera.type[scope.row.type] }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="password" label="密码">
            </el-table-column>
            <el-table-column label="操作" align="left" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleModifyCamera(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDeleteCamera(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </Wrapper>
      </div>
    </el-main>

    <el-dialog :title="{'create':'信号机新增', 'modify':'信号机编辑'}[signal.handleStatus]" :visible.sync="signal.visible" width="500" :close-on-click-modal="false">
      <el-form :model="signal.form" :rules="signal.rules" ref="signalform" label-width="80px">
        <el-form-item label="信号机IP" prop="ip">
          <el-input clearable v-model="signal.form.ip" placeholder="请输入IP" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="signal.form.port" readonly :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="signal.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSignalSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="{'create':'备用电源新增', 'modify':'备用电源编辑'}[signal.handleStatus]" :visible.sync="ups.visible" width="500" :close-on-click-modal="false">
      <el-form :model="ups.form" :rules="ups.rules" ref="upsform" label-width="80px">
        <el-form-item label="信号机IP" prop="ip">
          <el-input clearable v-model="ups.form.ip" placeholder="请输入IP" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="ups.form.port" readonly :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ups.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpsSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="{'create':'相机新增', 'modify':'相机编辑'}[camera.handleStatus]" :visible.sync="camera.visible" width="500" :close-on-click-modal="false">
      <el-form :model="camera.form" :rules="camera.rules" ref="cameraform" label-width="80px">
        <el-form-item label="相机IP" prop="ip">
          <el-input clearable v-model="camera.form.ip" placeholder="请输入IP" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="camera.form.port" readonly :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="相机类型" prop="type">
          <el-select v-model="camera.form.type" placeholder="请选择">
            <el-option label="车流量相机" value="1"></el-option>
            <el-option label="电子警察" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="camera.form.username" placeholder="用户名" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="camera.form.password" placeholder="密码" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="camera.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleCameraSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="{'create':'车检服务器新增', 'modify':'车检服务器编辑'}[ipc.handleStatus]" :visible.sync="ipc.visible" width="500" :close-on-click-modal="false">
      <el-form :model="ipc.form" :rules="ipc.rules" ref="ipcform" label-width="130px">
        <el-form-item label="车检服务器IP" prop="ip">
          <el-input clearable v-model="ipc.form.ip" placeholder="请输入IP" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="车检服务器别名" prop="name">
          <el-input v-model="ipc.form.name" placeholder="请输入名称" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ipc.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleIpcSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      id3: this.$route.params.id3,
      name1: "",
      name2: "",
      name3: "",
      loading: true,
      tableData: [],
      signal: {
        data: [],
        visible: false,
        rules: {},
        form: {},
        handleStatus: ""
      },
      ups: {
        data: [],
        visible: false,
        rules: {},
        form: {},
        handleStatus: ""
      },
      camera: {
        data: [],
        type: {
          "1": "电子警察",
          "2": "车流量相机"
        },
        visible: false,
        rules: {},
        form: {},
        handleStatus: ""
      },
      ipc: {
        data: [],
        visible: false,
        rules: {},
        form: {},
        handleStatus: ""
      }
    };
  },
  methods: {
    getCrossingData() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.$store.dispatch("SETCROSSING", data);
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
    getDvesData() {
      this.loading = true;
      this.$http("index/d_crossing/dataView", { id: this.id3 }).then(res => {
        if (res.status) {
          let data = res.data;
          let signalData = data.machine ? [data.machine] : [];
          let upsData = data.ups ? [data.ups] : [];
          let ipcData = data.ipc ? data.ipc : [];
          let cameraData = data.camera ? data.camera : [];
          this.signal.data = signalData;
          this.ups.data = upsData;
          this.ipc.data = ipcData;
          this.camera.data = cameraData;
        }
      });
    },
    // 新增信号机
    handleCreateSignal() {
      this.signal.visible = true;
      this.signal.handleStatus = "create";
      this.signal.form = { ip: "", port: "4001" };
    },
    handleModifySignal(row) {
      this.signal.visible = true;
      this.signal.handleStatus = "modify";
      this.signal.form = Object.assign({}, row);
    },
    handleDeleteSignal(row) {
      this.handleDelete(row.id, "index/d_machine/dataDelete");
    },
    handleSignalSubmit() {
      let { ip, port, id } = this.signal.form;
      let url = "";
      let data = {
        ip,
        port,
        crossing_id: this.id3
      };
      if (this.signal.handleStatus == "create") {
        url = "index/d_machine/dataAdd";
      } else {
        url = "index/d_machine/dataUpdate";
        data.id = id;
      }
      this.handleChange(data, url, "signal");
    },
    // 新增备用电源
    handleCreateUps() {
      this.ups.visible = true;
      this.ups.handleStatus = "create";
      this.ups.form = { ip: "", port: "5000" };
    },
    handleModifyUps(row) {
      this.ups.visible = true;
      this.ups.handleStatus = "modify";
      this.ups.form = Object.assign({}, row);
    },
    handleDeleteUps(row) {
      this.handleDelete(row.id, "index/d_ups/dataDelete");
    },
    handleUpsSubmit() {
      let { ip, port, id } = this.ups.form;
      let url = "";
      let data = {
        ip,
        port,
        crossing_id: this.id3
      };
      if (this.ups.handleStatus == "create") {
        url = "index/d_ups/dataAdd";
      } else {
        url = "index/d_ups/dataUpdate";
        data.id = id;
      }
      this.handleChange(data, url, "ups");
    },
    // 相机
    handleCreateCamera() {
      this.camera.visible = true;
      this.camera.handleStatus = "create";
      this.camera.form = {
        ip: "",
        port: "2555",
        type: "1",
        username: "",
        password: ""
      };
    },
    handleModifyCamera(row) {
      this.camera.visible = true;
      this.camera.handleStatus = "modify";
      this.camera.form = Object.assign({}, row);
    },
    handleDeleteCamera(row) {
      this.handleDelete(row.id, "flow_check/f_camera/dataDelete");
    },
    handleCameraSubmit() {
      let { ip, port, type, username, password, id } = this.camera.form;
      let url = "";
      let data = {
        ip,
        port,
        type,
        username,
        password,
        manufacturer: 0,
        crossing_id: this.id3
      };
      if (this.camera.handleStatus == "create") {
        url = "flow_check/f_camera/dataAdd";
      } else {
        url = "flow_check/f_camera/dataUpdate";
        data.id = id;
      }
      this.handleChange(data, url, "camera");
    },
    // 车检器
    handleCreateIpc() {
      this.ipc.visible = true;
      this.ipc.handleStatus = "create";
      this.ipc.form = { ip: "", name: "" };
    },
    handleModifyIpc(row) {
      this.ipc.visible = true;
      this.ipc.handleStatus = "modify";
      this.ipc.form = Object.assign({}, row);
    },
    handleDeleteIpc(row) {
      this.handleDelete(row.id, "flow_check/f_ipc/dataDelete");
    },
    handleIpcSubmit() {
      let { ip, name, id } = this.ipc.form;
      let url = "";
      let data = {
        ip,
        name,
        crossing_id: this.id3
      };
      if (this.ipc.handleStatus == "create") {
        url = "flow_check/f_ipc/dataAdd";
      } else {
        url = "flow_check/f_ipc/dataUpdate";
        data.id = id;
      }
      this.handleChange(data, url, "ipc");
    },

    handleDelete(id, url) {
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
            this.$http(url, {
              id: id
            }).then(res => {
              if (res.status) {
                this.getDvesData();
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
    handleChange(data, url, dev) {
      this.$http(url, data).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
        if (res.status) {
          this.getDvesData();
          this[dev].visible = false;
        }
      });
    }
  },
  created() {
    this.getDvesData();
    if (this.crossingData.length) {
      this.formatterData(this.crossingData);
    } else {
      this.getCrossingData();
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

<style>
</style>
