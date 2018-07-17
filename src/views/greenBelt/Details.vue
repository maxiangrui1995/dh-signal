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
                <el-button type="text" @click="handleDetails(scope.row)">下载</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" :disabled="(pagePage-1)*pageRows+scope.$index+1!==pageTotals" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pagePage" :page-size="pageRows" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals" v-if="pageTotals>0" :style="{'margin':'10px 0 0','text-align':'right'}">
          </el-pagination>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="路口名称" prop="crossing_id">
          <el-cascader :options="crossingData" v-model="formData.crossing_id" :disabled="formData.TYPE==='modify'" :style="{ width: '100%' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="路段距离" prop="road_distance">
          <el-input-number v-model="formData.road_distance" :min="0" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="限制速度" prop="forward_speed">
          <el-input-number v-model="formData.forward_speed" :min="0" :max="255" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="路口相位差" prop="phase_difference">
          <el-input-number v-model="formData.phase_difference" :min="0" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="协调相位" prop="positive_phase">
          <el-select v-model="formData.positive_phase" placeholder="请选择" :style="{ width: '100%' }">
            <el-option-group v-for="group in phase_group" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
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
      name: "绿波带详情",
      pagePage: 1,
      pageRows: 20,
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
      phase_group: [
        {
          label: "由东向西",
          options: [
            {
              value: "0",
              label: "左转"
            },
            {
              value: "1",
              label: "右转"
            },
            {
              value: "2",
              label: "直行"
            },
            {
              value: "3",
              label: "行人"
            }
          ]
        },
        {
          label: "由南向北",
          options: [
            {
              value: "4",
              label: "左转"
            },
            {
              value: "5",
              label: "右转"
            },
            {
              value: "6",
              label: "直行"
            },
            {
              value: "7",
              label: "行人"
            }
          ]
        },
        {
          label: "由西向东",
          options: [
            {
              value: "8",
              label: "左转"
            },
            {
              value: "9",
              label: "右转"
            },
            {
              value: "10",
              label: "直行"
            },
            {
              value: "11",
              label: "行人"
            }
          ]
        },
        {
          label: "由北向南",
          options: [
            {
              value: "12",
              label: "左转"
            },
            {
              value: "13",
              label: "右转"
            },
            {
              value: "14",
              label: "直行"
            },
            {
              value: "15",
              label: "行人"
            }
          ]
        }
      ],
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
        road_distance: "",
        forward_speed: "",
        phase_difference: "",
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
    handleFormCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
    handleFormSubmit() {}
  },
  created() {
    this.getCrossing();
    this.getDataList();
  }
};
</script>

<style>
</style>
