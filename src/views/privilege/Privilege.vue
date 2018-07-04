<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>特勤联动</el-breadcrumb-item>
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
            <el-table-column prop="sch_id" label="预案号">
            </el-table-column>
            <el-table-column prop="sch_name" label="预案名">
            </el-table-column>
            <el-table-column prop="boundPlate" label="绑定警车">
            </el-table-column>
            <el-table-column prop="enabled" label="激活状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enabled">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
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
          <el-date-picker v-model="formData.datetimeRange" value-format="yyyy/MM/dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间范围" prop="timeRange" v-else>
          <el-time-picker is-range v-model="formData.timeRange" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :style="{width: '400px'}">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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
      enabled: {
        "0": "未激活",
        "1": "已激活"
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
      }
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
      this.$http("index/d_secret_service_plan/planList", {
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
        timeRange: row.type === "0" ? [row.mon_day_start, row.mon_day_end] : ""
      };
    },
    handleDelete(row) {
      console.log(row);
    },
    handleFormSubmit() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
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
