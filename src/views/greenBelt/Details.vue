<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/greenBelt' }">绿波带</el-breadcrumb-item>
            <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="float:right;">
            <el-button type="primary" icon="el-icon-plus" :style="{marginRight: '10px'}" @click="handleCreate">
              新增
            </el-button>
            <el-input suffix-icon="el-icon-search" placeholder="请输入名称进行检索" style="width: 200px"></el-input>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="路口名称">
            </el-table-column>
            <el-table-column prop="road_distance" label="路段距离(m)" align="center">
            </el-table-column>
            <el-table-column prop="forward_speed" label="限制速度(km/h)" align="center">
            </el-table-column>
            <el-table-column prop="phase_difference" label="路口相位差" align="center">
            </el-table-column>
            <el-table-column prop="positive_phase" label="协调相位" align="center">
              <template slot-scope="scope">
                <span>{{phase[scope.row.positive_phase]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDownload(scope.row)">下载</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" :disabled="(pagePage-1)*pageRows+scope.$index+1!==pageTotals" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="路口名称" prop="crossing_id">
          <el-cascader :options="crossingData" v-model="formData.crossing_id" :style="{ width: '100%' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="路段距离" prop="road_distance">
          <el-input-number v-model="formData.road_distance" controls-position="right" :min="0" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="限制速度" prop="forward_speed">
          <el-input-number v-model="formData.forward_speed" controls-position="right" :min="0" :max="255" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="路口相位差" prop="phase_difference">
          <el-input-number v-model="formData.phase_difference" controls-position="right" :min="0" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="协调相位" prop="positive_phase">
          <el-select v-model="formData.positive_phase" placeholder="请选择" :style="{ width: '100%' }">
            <el-option v-for="(item,key) in phase" :key="key" :value="key" :label="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="autoCommit" :style="{marginLeft: '100px'}">自动计算</el-button>
      <span slot="footer">
        <el-button @click="handleFormCancel">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit" :loading="dialogLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      name: this.$route.params.name,
      period: this.$route.params.period,
      pagePage: 1,
      pageRows: 999,
      pageTotals: 0,
      tableLoading: true,
      tableData: [],
      phase: {
        "0": "由东向西左转",
        "1": "由东向西直行",
        "2": "由东向西右转",
        "3": "由东向西行人",
        "4": "由南向北左转",
        "5": "由南向北直行",
        "6": "由南向北右转",
        "7": "由南向北行人",
        "8": "由西向东左转",
        "9": "由西向东直行",
        "10": "由西向东右转",
        "11": "由西向东行人",
        "12": "由北向南左转",
        "13": "由北向南直行",
        "14": "由北向南右转",
        "15": "由北向南行人"
      },
      dialogTitle: "",
      dialogVisible: false,
      dialogLoading: false,
      formData: {},
      rules: {},
      crossingData: []
    };
  },
  methods: {
    pageSizeChange(rows) {
      if (this.pageRows !== rows) {
        this.pageRows = rows;
        this.fetchData();
      }
    },
    pageCurrentChange(page) {
      this.pagePage = page;
      this.fetchData();
    },
    getDataList() {
      this.tableLoading = true;
      this.$http("index/d_green_wave_sub/dataList", {
        pid: this.id,
        page: this.pagePage,
        rows: this.pageRows
      }).then(res => {
        if (res.status === "1") {
          this.tableData = res.data.list;
          this.pageTotals = ~~res.data.total;
          this.tableLoading = false;
        }
      });
    },
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossingData = data;
        }
      });
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "绿波带方案新增";
      this.formData = {
        crossing_id: [],
        road_distance: "0",
        forward_speed: "60",
        phase_difference: "0",
        positive_phase: ""
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "绿波带方案编辑";
      let crossing_id = [];
      this.crossingData.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            if (item2.children) {
              item2.children.forEach(item3 => {
                if (item3.id == row.crossing_id) {
                  crossing_id = [item1.id, item2.id, item3.id];
                }
              });
            }
          });
        }
      });
      this.formData = Object.assign({}, row, {
        crossing_id: crossing_id,
        TYPE: "modify"
      });
    },
    handleDelete(row) {
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
            this.$http("index/d_green_wave_sub/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
                if (
                  (this.pagePage - 1) * this.pageRows ==
                  this.pageTotals - 1
                ) {
                  this.pagePage--;
                }
                this.getDataList();
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
    handleDownload(row) {
      this.$http("index/d_green_wave_sub/downLoadSetting", {
        id: row.id
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    handleDetails(row) {
      this.$http("index/d_plan/dataView", {
        id: row.plan_id
      }).then(res => {
        if (res.status) {
          this.$router.push({
            path: "/planList/" + res.data.id
          });
        } else {
          this.$message.error("无详情");
        }
      });
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
    handleFormSubmit() {
      if (this.formData.crossing_id.length != 3) {
        return this.$message.error("未选择路口");
      }
      this.dialogLoading = true;
      let crossing_id = this.formData.crossing_id[2];
      let data = {
        crossing_id: this.formData.crossing_id[2],
        forward_speed: this.formData.forward_speed,
        phase_difference: this.formData.phase_difference,
        positive_phase: this.formData.positive_phase,
        road_distance: this.formData.road_distance
      };
      let url = "";
      if (this.dialogTitle == "绿波带方案新增") {
        url = "index/d_green_wave_sub/dataAdd";
        data.pid = this.id;
      } else {
        url = "index/d_green_wave_sub/dataUpdate";
        data.id = this.formData.id;
      }
      this.$http(url, data).then(res => {
        if (res.status) {
          this.getDataList();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
        this.dialogLoading = false;
        this.dialogVisible = false;
      });
    },
    // 自动计算
    autoCommit() {
      if (this.formData.crossing_id.length !== 3) {
        return this.$message.error("未选择路口");
      }
      // 获取第一个路口
      let first = {};
      if (this.tableData.length == 0) {
        first = this.formData.crossing_id[2];
      } else {
        first = this.tableData[0].crossing_id;
      }
      // 当前路口
      let now = this.formData.crossing_id[2];
      const fn = row => {
        let d = null;
        this.crossingData.forEach(item => {
          if (item.children) {
            item.children.forEach(item => {
              if (item.children) {
                item.children.forEach(item => {
                  if (item.id == row) {
                    d = item;
                  }
                });
              }
            });
          }
        });
        return d;
      };

      let point1 = fn(first);
      let point2 = fn(now);
      // 计算距离
      let distance = this.getDistance(
        new google.maps.LatLng(point1.lat, point1.lng),
        new google.maps.LatLng(point2.lat, point2.lng)
      );
      this.formData = Object.assign(this.formData, {
        road_distance: distance,
        phase_difference: (
          (distance / (this.formData.forward_speed * 1000 / 3600)) %
          this.period
        ).toFixed(0)
      });
    },
    getDistance(point1, point2) {
      let R = 6378.14; // earth's mean radius in km
      let lon1 = point1.lng() * Math.PI / 180;
      let lat1 = point1.lat() * Math.PI / 180;
      let lon2 = point2.lng() * Math.PI / 180;
      let lat2 = point2.lat() * Math.PI / 180;

      let deltaLat = lat1 - lat2;
      let deltaLon = lon1 - lon2;

      let step1 =
        Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(lat2) * Math.cos(lat1) * Math.pow(Math.sin(deltaLon / 2), 2);
      let step2 = 2 * Math.atan2(Math.sqrt(step1), Math.sqrt(1 - step1));
      return step2 * R;
    }
  },
  created() {
    this.getCrossing();
    this.getDataList();
  }
};
</script>

<style>
</style>
