<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/region' }">区域管理</el-breadcrumb-item>
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
          <el-table :data="tableData" v-loading="loading" :show-header="false" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="name">
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id1: this.$route.params.id1,
      name: "",
      loading: true,
      tableData: []
    };
  },
  methods: {
    getDataList() {
      this.loading = true;
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.$store.dispatch("SETCROSSING", data);
        }
      });
    },
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1) {
          this.tableData = item.children || [];
          this.name = item.name;
        }
      });
      this.loading = false;
    },
    handleCreate() {
      this.$prompt("输入名称后将新增一条记录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
            this.$http("index/d_area/dataAdd", {
              name: instance.inputValue,
              pid: this.id1
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
        .then(() => {})
        .catch(() => {});
    },
    handleDetails(row) {
      this.$router.push({
        path: "/region/" + this.id1 + "/" + row.id
      });
    },
    handleUpdate(row) {
      this.$prompt("输入名称后将替换原有记录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.name,
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
            instance.confirmButtonText = "保存中...";
            // ajax
            this.$http("index/d_area/dataUpdate", {
              name: instance.inputValue,
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
        .then(() => {})
        .catch(() => {});
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
            this.$http("index/d_area/dataDelete", {
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
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
      });
    }
  },
  created() {
    if (this.crossingData.length) {
      this.formatterData(this.crossingData);
    } else {
      this.getDataList();
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
