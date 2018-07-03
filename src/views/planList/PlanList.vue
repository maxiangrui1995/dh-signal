<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>特征参数</el-breadcrumb-item>
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
          <el-table :data="tableData" v-loading="loading" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="方案名称">
            </el-table-column>
            <el-table-column prop="light_count" label="阶段数">
            </el-table-column>
            <el-table-column prop="phase_count" label="相位数">
            </el-table-column>
            <el-table-column prop="phase_difference" label="相位差">
            </el-table-column>
            <el-table-column prop="mc_countdown" label="脉冲倒计时">
            </el-table-column>
            <el-table-column prop="mc_width" label="脉宽">
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
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
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      loading: true,
      tableData: []
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
    // 请求数据
    fetchData() {
      this.loading = true;
      this.$http("index/d_plan/dataList", {
        page: this.pagePage,
        rows: this.pageRows
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.tableData = data.list;
          this.pageTotals = ~~data.total;
        }
        this.loading = false;
      });
    },
    handleCreate() {
      this.$prompt("输入名称后将自动生成一条记录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入名称",
        inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{4,9}/,
        inputErrorMessage: "名称长度限制4-9个字符,不允许出现特殊字符(除 _)"
      }).then(({ value }) => {
        this.$http("index/d_plan/dataInit", {
          name: value
        }).then(res => {
          if (res.status) {
            this.fetchData();
          }
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
        });
      });
    },
    handleDetails(row) {
      this.$router.push({
        path: "/planList/" + row.id
      });
    },
    handleDelete(row) {
      this.$http("index/d_plan/dataDelete", {
        id: row.id
      }).then(res => {
        if (res.status) {
          if ((this.pagePage - 1) * this.pageRows <= this.pageTotals) {
            this.pagePage--;
          }
          this.fetchData();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style>
</style>
