<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>相机</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="float:right;">
            <el-button type="primary" icon="el-icon-plus" :style="{marginRight: '10px'}" @click="handleCreate">
              新增
            </el-button>
            <el-input suffix-icon="el-icon-search" placeholder="请输入名称进行检索" style="width: 200px" readonly></el-input>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-table :data="tableData" v-loading="loading" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="ip" label="相机IP">
            </el-table-column>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <div>{{typeObj[scope.row.type]}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="crossing_id" label="所属路口">
              <template slot-scope="scope">
                <div>{{formatterCrossing(scope.row.crossing_id) || '暂无数据'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="password" label="密码">
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pagePage" :page-size="pageRows" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals" v-if="pageTotals>0" :style="{'margin':'10px 0 0','text-align':'right'}">
          </el-pagination>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="相机IP" prop="ip">
          <el-input clearable v-model="formData.ip" placeholder="请输入IP" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="formData.port" readonly :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="车流量相机" value="1"></el-radio>
            <el-radio label="电子警察" value="2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属路口" prop="crossing_id">
          <el-cascader :options="crossingData" v-model="formData.crossing_id_array" filterable clearable :style="{width: '100%'}">
          </el-cascader>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.ip" placeholder="用户名" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.port" placeholder="密码" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false, dialogLoading = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit" :loading="dialogLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      typeObj: {
        "2": "电子警察",
        "1": "车流量相机"
      },
      dialogVisible: false,
      dialogTitle: "",
      dialogLoading: false,
      formData: {
        ip: "",
        port: "2555",
        type: "1",
        username: "",
        password: "",
        crossing_id_array: []
      },
      rules: {}
    };
  },
  methods: {
    pageSizeChange(rows) {
      if (this.pageRows !== rows) {
        this.pageRows = rows;
        this.getDataList();
      }
    },
    pageCurrentChange(page) {
      this.pagePage = page;
      this.getDataList();
    },
    getDataList() {
      this.loading = true;
      this.$http("flow_check/f_camera/dataList", {
        page: this.pagePage,
        rows: this.pageRows
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.tableData = data.list || [];
          this.pageTotals = ~~data.total;
        }
        this.loading = false;
      });
    },
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.$store.dispatch("SETCROSSING", data);
        }
      });
    },
    formatterCrossing(row) {
      let name = "";
      this.crossingData.forEach(item => {
        if (item.children) {
          item.children.forEach(item => {
            if (item.children) {
              item.children.forEach(item => {
                if (item.id == row) {
                  name = item.name;
                }
              });
            }
          });
        }
      });
      return name;
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "相机新增";
    },
    handleUpdate(row) {},
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
            this.$http("flow_check/f_camera/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
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
    handleFormSubmit() {
      this.dialogLoading = true;
      let { ip, port, crossing_id_array } = this.formData;
      this.$http("index/d_machine/dataAdd", {
        ip: ip,
        port: port,
        crossing_id: crossing_id_array["2"]
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
        this.dialogLoading = false;
        if (res.status) {
          this.getDataList();
          this.dialogVisible = false;
        }
      });
    }
  },
  created() {
    this.getDataList();
    if (!this.crossingData.length) {
      this.getCrossing();
    }
  },
  computed: {
    crossingData() {
      return this.$store.state.crossingData;
    }
  }
};
</script>

<style>
</style>
