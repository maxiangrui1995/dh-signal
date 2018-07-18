<template>
  <div>
    <el-table :data="tableData1" v-loading="tableLoading1" style="width: 100%">
      <el-table-column prop="statistic_minutes" label="统计时间间隔" width="100" align="center">
      </el-table-column>
      <el-table-column prop="do_minutes" label="触发时间间隔" width="100" align="center">
      </el-table-column>
      <el-table-column prop="flow_total" label="触发流量总数" width="100" align="center">
      </el-table-column>
      <el-table-column prop="lane_east_west" label="东西向车道号">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.lane_east_west.split(',')" :key="item" :style="{margin: '2px 4px 2px 0'}">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lane_south_north" label="南北向车道号">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.lane_south_north.split(',')" :key="item" :style="{margin: '2px 4px 2px 0'}">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate1(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-plus" @click="handleCreate" :style="{margin: '20px 0 10px'}">
      <span>新增</span>
    </el-button>
    <el-table :data="tableData2" v-loading="tableLoading2" style="width: 100%">
      <el-table-column prop="proportion" label="东西与南北车流量比例" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.proportion_east_west}} : {{scope.row.proportion_south_north}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="pattern_id" label="需要触发的方案编号" align="center">
        <template slot-scope="scope">
          <span>方案{{~~scope.row.pattern_id + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate2(scope.row)">编辑</el-button>
          <div class="el-divider"></div>
          <el-button type="text" @click="handleDelete2(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="pageSizeChange2" @current-change="pageCurrentChange2" :current-page="pagePage2" :page-size="pageRows2" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals2" v-if="pageTotals2>0" :style="{'margin':'10px 0 0','text-align':'right'}">
    </el-pagination>

    <el-dialog title="自适应方案编辑" :visible.sync="dialogVisible1" width="560px" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData1" ref="form1" label-width="100px">
        <el-form-item label="统计时间间隔">
          <el-input-number v-model.number="formData1.statistic_minutes" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="触发时间间隔">
          <el-input-number v-model.number="formData1.do_minutes" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="触发流量总数">
          <el-input-number v-model.number="formData1.flow_total" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="东西向车道号">
          <el-select placeholder="请选择" v-model="formData1.lane_east_west" multiple :style="{width: '100%'}">
            <el-option v-for="item in 16" :key="item" :value="''+item" :label="'车道'+item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="南北向车道号">
          <el-select placeholder="请选择" v-model="formData1.lane_south_north" multiple :style="{width: '100%'}">
            <el-option v-for="item in 16" :key="item" :value="''+item" :label="'车道'+item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleFormCancel1">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit1" :loading="dialogLoading1">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogTitle2" :visible.sync="dialogVisible2" width="560px" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData2" ref="form2" label-width="100px">
        <el-form-item label="东西车流量">
          <el-input-number v-model.number="formData2.proportion_east_west" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="南北车流量">
          <el-input-number v-model.number="formData2.proportion_south_north" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="南北车流量">
          <el-select placeholder="请选择" v-model="formData2.pattern_id">
            <el-option v-for="(item,index) in planData" :key="index" :value="''+index" :label="'方案'+(index+1)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleFormCancel2">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit2" :loading="dialogLoading2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      tableData1: [],
      tableLoading1: true,
      tableData2: [],
      tableLoading2: true,
      pagePage2: 1,
      pageRows2: 20,
      pageTotals2: 0,
      pid: "",
      dialogVisible1: false,
      dialogLoading1: false,
      formData1: {},
      dialogTitle2: "",
      dialogVisible2: false,
      dialogLoading2: false,
      formData2: {},
      planData: []
    };
  },
  methods: {
    getDataList1() {
      this.tableLoading1 = true;
      this.$http("index/d_pattern_adaptive/dataView", {
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.tableData1 = [res.data];
          this.pid = res.data.id;
          this.getDataList2();
        }
        this.tableLoading1 = false;
      });
    },
    getDataList2() {
      this.tableLoading2 = true;
      this.$http("index/d_pattern_adaptive_sub/dataList", {
        page: this.pagePage2,
        rows: this.pageRows2,
        pid: this.pid
      }).then(res => {
        if (res.status === "1") {
          this.tableData2 = res.data.list;
          this.pageTotals2 = ~~res.data.total;
        }
        this.tableLoading2 = false;
      });
    },
    getPlanDataList() {
      this.$http("index/d_pattern/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 32
      }).then(res => {
        if (res.status) {
          this.planData = res.data.list;
        }
      });
    },
    pageSizeChange2(rows) {
      if (this.pageRows2 !== rows) {
        this.pageRows2 = rows;
        this.getDataList2();
      }
    },
    pageCurrentChange2(page) {
      this.pagePage2 = page;
      this.getDataList2();
    },
    handleCreate() {
      this.dialogVisible2 = true;
      this.dialogTitle2 = "自适应方案子方案新增";
      this.formData2 = {
        proportion_east_west: 1,
        proportion_south_north: 1,
        pattern_id: "0",
        TYPE: "create"
      };
    },
    handleUpdate2(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = "自适应方案子方案编辑";
      this.formData2 = Object.assign({}, row);
    },
    handleDelete2(row) {
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
            this.$http("index/d_pattern_adaptive_sub/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
                if (
                  (this.pagePage - 1) * this.pageRows ==
                  this.pageTotals - 1
                ) {
                  this.pagePage--;
                }
                this.getDataList2();
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
    handleFormCancel2() {
      this.dialogVisible2 = false;
      this.$refs["form2"].resetFields();
    },
    handleFormSubmit2() {
      this.dialogLoading2 = true;
      let url = "";
      let data = {};
      if (this.formData2.TYPE === "create") {
        url = "index/d_pattern_adaptive_sub/dataAdd";
        data = Object.assign(this.formData2, { pid: this.pid });
        delete data.TYPE;
      } else {
        url = "index/d_pattern_adaptive_sub/dataUpdate";
        data = Object.assign({}, this.formData2);
      }
      this.$http(url, data).then(res => {
        if (res.status) {
          this.getDataList2();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
        this.dialogLoading2 = false;
        this.dialogVisible2 = false;
      });
    },
    handleUpdate1(row) {
      this.dialogVisible1 = true;
      this.formData1 = {
        do_minutes: row.do_minutes,
        flow_total: row.flow_total,
        id: row.id,
        lane_east_west: row.lane_east_west.split(",") || [],
        lane_south_north: row.lane_south_north.split(",") || [],
        plan_id: row.plan_id,
        statistic_minutes: row.statistic_minutes
      };
    },
    handleFormCancel1() {
      this.dialogVisible1 = false;
      this.$refs["form1"].resetFields();
    },
    handleFormSubmit1() {
      this.$http("index/d_pattern_adaptive/dataUpdate", this.formData1).then(
        res => {
          if (res.status) {
            this.getDataList1();
          }
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
          this.dialogLoading1 = false;
          this.dialogVisible1 = false;
        }
      );
    }
  },
  created() {
    this.getPlanDataList();
    this.getDataList1();
  }
};
</script>

<style>
</style>
