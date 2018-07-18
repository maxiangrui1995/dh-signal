<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="handleCreate" :style="{marginBottom: '10px'}">
      <span>新增</span>
    </el-button>
    <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
      <el-table-column prop="patternid" label="方案名称">
        <template slot-scope="scope">
          <span>方案{{ ~~scope.row.patternid + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="step" label="总步数">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right-start" title="方案详细信息" :style="{display: 'inline-block'}">
            <p v-for="index in ~~scope.row.step" :key="index">
              <span>步号: {{ index }}</span>&nbsp;&nbsp;
              <span>阶段: {{ ~~scope.row['phase' + index] + 1 }}</span>&nbsp;&nbsp;
              <span>时长: {{ scope.row['time' + index] }}</span>
            </p>
            <div slot="reference" class="name-wrapper">
              <el-tag :style="{cursor: 'pointer'}">{{ scope.row.step }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="time_interval" label="间隔">
      </el-table-column>
      <el-table-column prop="period" label="周期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
          <div class="el-divider"></div>
          <el-button type="text" @click="handleDelete(scope.row)" :disabled="(pagePage-1)*pageRows+scope.$index+1!==pageTotals">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pagePage" :page-size="pageRows" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals" v-if="pageTotals>0" :style="{'margin':'10px 0 0','text-align':'right'}">
    </el-pagination>

    <el-dialog title="方案编辑" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false" :show-close="false">
      <el-form :model="formData" :inline="true" :rules="rules" ref="form">
        <div v-for="index in ~~formData.step" :key="index">
          <el-form-item label="步号" :style="{marginRight: '20px'}">
            <el-input :value="index" disabled :style="{width: '40px'}"></el-input>
          </el-form-item>
          <el-form-item label="阶段" :style="{marginRight: '20px'}">
            <el-select placeholder="请选择" v-model="formData['phase'+index]" :style="{width: '100px'}">
              <el-option v-for="item in phaseData" :key="item.id" :label="'阶段'+(~~item.serialid+1)" :value="item.serialid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时长" :style="{marginRight: '20px'}">
            <el-input-number v-model.number="formData['time'+index]" :min="0" :max="255"></el-input-number>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-button @click="handleItemDelete(index)">删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button plain size="medium" @click="handleItemCreate()" :style="{width: '100%'}">新 增</el-button>
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
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      tableData: [],
      phaseData: [],
      tableLoading: true,
      dialogVisible: false,
      dialogLoading: false,
      formData: {},
      rules: {}
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
      this.$http("index/d_pattern/dataList", {
        page: this.pagePage,
        rows: this.pageRows,
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.tableData = res.data.list;
          this.pageTotals = ~~res.data.total;
        }
        this.tableLoading = false;
      });
    },
    // 请求阶段信息
    getPhaseDataList() {
      this.$http("index/d_phasestatus/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 8
      }).then(res => {
        if (res.status) {
          this.phaseData = res.data.list;
        }
      });
    },
    handleCreate() {
      this.$msgbox({
        title: "提示",
        message: "即将自动生成一条默认方案,是否继续?",
        showCancelButton: true,
        type: "warning",
        confirmButtonText: "继续",
        cancelButtonText: "放弃",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "生成中...";
            // ajax
            this.$http("index/d_pattern/dataAdd", {
              plan_id: this.id
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
    handleUpdate(row) {
      this.dialogVisible = true;
      this.formData = Object.assign({}, row);
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
            this.$http("index/d_pattern/dataDelete", {
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
    handleFormSubmit() {
      this.dialogLoading = true;
      let period = 0;
      for (let i = 0; i < ~~this.formData.step; i++) {
        period +=
          ~~this.formData["time" + (i + 1)] + ~~this.formData["time_interval"];
      }
      this.formData.period = period;
      delete this.formData.patternid;
      delete this.formData.plan_id;
      delete this.formData.time_interval;
      this.$http("index/d_pattern/dataUpdate", this.formData).then(res => {
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
    // 删除行
    handleItemDelete(index) {
      if (this.formData.step <= "2") {
        return this.$message({
          message: "至少保留两条步号!",
          type: "warning"
        });
      }
      let copy = Object.assign({}, this.formData);
      for (let i = 1; i < this.formData.step; i++) {
        if (i >= index) {
          this.formData["phase" + i] = copy["phase" + (i + 1)];
          this.formData["time" + i] = copy["time" + (i + 1)];
        }
      }
      this.formData["phase" + this.formData.step] = "255";
      this.formData["time" + this.formData.step] = "0";
      this.formData.step--;
    },
    // 新增行
    handleItemCreate() {
      this.formData.step++;
      this.formData["phase" + this.formData.step] = "0";
      this.formData["time" + this.formData.step] = 25;
    }
  },
  created() {
    this.getPhaseDataList();
    this.getDataList();
  }
};
</script>

<style>
</style>
