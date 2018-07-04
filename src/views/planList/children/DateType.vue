<template>
    <div>
        <el-table :data="tableData" v-loading="tableLoading" @cell-click="tableCellClick" style="width: 100%" class="datetype-table">
            <el-table-column prop="num" label="日期类型" align="center">
                <template slot-scope="scope">
                    <span>类型{{ ~~scope.row.num + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sunday" label="周日" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.sunday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.sunday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="monday" label="周一" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.monday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.monday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="tuesday" label="周二" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.tuesday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.tuesday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="wednesday" label="周三" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.wednesday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.wednesday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="thursday" label="周四" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.thursday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.thursday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="friday" label="周五" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.friday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.friday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="saturday" label="周六" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.saturday==='1'">
                        <i class="el-icon-check"></i>
                    </el-button>
                    <el-button type="text" v-else-if="scope.row.saturday==='0'">
                        <i class="el-icon-close"></i>
                    </el-button>
                    <el-button type="text" v-else>
                        <i class="el-icon-loading"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      tableData: [],
      tableLoading: true
    };
  },
  methods: {
    // 请求数据
    getDataList() {
      this.tableLoading = true;
      this.$http("index/d_week/dataList", {
        page: 1,
        rows: 9,
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.tableData = res.data.list;
        }
        this.tableLoading = false;
      });
    },
    tableCellClick(row, column, cell, event) {
      let d = row[column.property];
      if (row[column.property] !== "loading") {
        row[column.property] = "loading";
        let copy = Object.assign({}, row);
        copy[column.property] = d === "1" ? "0" : "1";
        this.$http("index/d_week/dataUpdate", copy).then(res => {
          if (res.status === "1") {
            row[column.property] = copy[column.property];
          } else {
            this.getDataList();
          }
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
        });
      }
    }
  },
  created() {
    this.getDataList();
  }
};
</script>

<style lang="scss" scoped>
.datetype-table .el-button--text {
  font-size: 16px;
  .el-icon-close {
    color: #ddd;
  }
}
</style>
