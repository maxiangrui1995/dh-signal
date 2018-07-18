<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
            <el-table-column prop="username" label="用户名称">
            </el-table-column>
            <el-table-column prop="password" label="密码">
            </el-table-column>
            <el-table-column prop="permission" label="用户类型">
              <template slot-scope="scope">
                <div>{{scope.row.permission=='666'?'超级管理员':'普通用户角色'}}</div>
              </template>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input clearable v-model="formData.username" placeholder="请输入名称" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input clearable v-model="formData.password" placeholder="请输入密码" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="permission">
          <el-radio-group v-model="formData.permission">
            <el-radio label="0">普通用户角色</el-radio>
            <el-radio label="666">超级管理员</el-radio>
          </el-radio-group>
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
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      tableLoading: true,
      tableData: [],
      dialogTitle: "",
      dialogVisible: false,
      formData: {},
      rules: {},
      dialogLoading: false
    };
  },
  methods: {
    // page
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
    // 请求数据
    getDataList() {
      this.tableLoading = true;
      this.$http("index/d_user_manager/dataList", {
        page: this.pagePage,
        rows: this.pageRows
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.tableData = data.list;
          this.pageTotals = ~~data.total;
        }
        this.tableLoading = false;
      });
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "用户新增";
      this.formData = { permission: "0" };
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "用户编辑";
      row.password = "";
      this.formData = Object.assign({}, row);
    },
    // 删除
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
            this.$http("index/d_user_manager/dataDelete", {
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
      this.dialogLoading = false;
      this.formData = {};
    },
    handleFormSubmit() {
      this.dialogLoading = true;
      let url = "";
      if (this.dialogTitle === "用户编辑") {
        url = "index/d_user_manager/dataUpdate";
      } else {
        url = "index/d_user_manager/dataAdd";
      }
      this.$http(url, this.formData).then(res => {
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
    }
  },
  created() {
    this.getDataList();
  }
};
</script>

<style>
</style>
