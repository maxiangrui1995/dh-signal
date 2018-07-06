<template>
    <div>
        <el-container>
            <el-header class="page-header">
                <div class="page-header-inner">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>绿波带</el-breadcrumb-item>
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
                        <el-table-column prop="name" label="子区名称">
                        </el-table-column>
                        <el-table-column prop="period" label="周期" sortable width="180">
                        </el-table-column>
                        <el-table-column prop="coordinate_direction" label="协调方向" width="180">
                            <template slot-scope="scope">
                                <span>{{ coordinate_direction[scope.row.coordinate_direction] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="绿波类型" width="180" :filters="[{text: '每天', value: '0'}, {text: '时间段', value: '1'}]" :filter-method="filterHandler" filter-placement="bottom">
                            <template slot-scope="scope">
                                <span>{{ type[scope.row.type] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time_range" label="时间范围">
                            <template slot-scope="scope">
                                <i class="el-icon-time"></i>
                                <span>{{ scope.row.mon_day_start + ' - ' + scope.row.mon_day_end }}</span>
                            </template>
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
                    <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pagePage" :page-size="pageRows" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals" v-if="pageTotals>0" :style="{'margin':'10px 0 0','text-align':'right'}">
                    </el-pagination>
                </el-card>
            </el-main>
        </el-container>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
            <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="绿波带名称" prop="name">
                    <el-input clearable v-model="formData.name" placeholder="请输入名称" :style="{width: '400px'}"></el-input>
                </el-form-item>
                <el-form-item label="公共周期" prop="period">
                    <el-input-number v-model="formData.period" :min="0" :max="255"></el-input-number>
                </el-form-item>
                <el-form-item label="协调方向" prop="coordinate_direction">
                    <el-radio-group v-model="formData.coordinate_direction">
                        <el-radio label="1">正向</el-radio>
                        <el-radio label="2" disabled>双向</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="绿波类型" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="0">每天</el-radio>
                        <el-radio label="1">时间段</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="时间范围" prop="datetimeRange" v-if="formData.type!='0'">
                    <el-date-picker v-model="formData.datetimeRange" format="yyyy/MM/dd HH:mm" value-format="yyyy/MM/dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="时间范围" prop="timeRange" v-else>
                    <el-time-picker is-range v-model="formData.timeRange" format="HH:mm" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :style="{width: '400px'}">
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
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
      loading: true,
      tableData: [],
      dialogVisible: false,
      dialogTitle: "",
      coordinate_direction: {
        "1": "正向"
      },
      type: {
        "0": "每天",
        "1": "时间段"
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 9,
            message: "名称请限制在 3 到 9 个字符",
            trigger: "blur"
          }
        ]
      },
      formData: {
        name: "",
        period: 0,
        coordinate_direction: "1",
        type: "0",
        datetimeRange: "",
        timeRange: ""
      },
      dialogLoading: false
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
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 请求数据
    fetchData() {
      this.$http("index/d_green_wave/dataList", {
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
      this.dialogVisible = true;
      this.dialogTitle = "绿波带新增";
      this.formData = {
        name: "",
        period: 0,
        coordinate_direction: "1",
        type: "0",
        datetimeRange: "",
        timeRange: ""
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    handleDetails(row) {
      this.$router.push({
        path: "/greenBelt/" + row.id
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "绿波带编辑";
      this.formData = {
        id: row.id,
        name: row.name,
        period: ~~row.period,
        coordinate_direction: row.coordinate_direction,
        type: row.type,
        datetimeRange:
          row.type === "1" ? [row.mon_day_start, row.mon_day_end] : "",
        timeRange: row.type === "0" ? [row.mon_day_start, row.mon_day_end] : "",
        TYPE: "modify"
      };
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
            this.$http("index/d_green_wave/dataDelete", {
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
    handleFormSubmit() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        this.dialogLoading = true;
        console.log(this.formData);
      });
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style>
</style>
