<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>车检器</el-breadcrumb-item>
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
            <el-table-column prop="ip" label="车检器IP">
            </el-table-column>
            <el-table-column prop="name" label="车检器别名">
            </el-table-column>
            <el-table-column prop="crossing_id" label="所属路口">
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
      pageTotals: 0
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
      this.$http("flow_check/f_ipc/dataList", {
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
    handleCreate() {},
    handleUpdate(row) {},
    handleDelete(row) {}
  },
  created() {
    this.getDataList();
  }
};
</script>

<style>
</style>
