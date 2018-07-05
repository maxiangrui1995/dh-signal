<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="handleCreate" :style="{marginBottom: '10px'}">
      新增
    </el-button>
    <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="datetype" label="日期类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.datetype === "15" ? "自定义" : '类型'+(~~scope.row.datetype + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="func_num" label="功能" width="100">
        <template slot-scope="scope">
          <span>{{ control_func[scope.row.func_num] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time_range" label="日期范围">
        <template slot-scope="scope">
          <span>{{ formatterTimeRange(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="begin_time" label="开始时间" width="100">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ formatterTime(scope.row.start_hour) + " : " + formatterTime(scope.row.start_min) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="patternid" label="方案" width="100">
        <template slot-scope="scope">
          <span>方案{{ ~~scope.row.patternid + 1 }}</span>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="480px" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="日期类型" prop="datetype">
          <el-select placeholder="请选择" v-model="formData.datetype" @change="datetypeChange" :style="{width: '100%'}">
            <el-option v-for="item in 9" :key="item" :value="''+(item-1)" :label="'类型'+item"></el-option>
            <el-option value="15" label="自定义"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能" prop="func_num">
          <el-select placeholder="请选择" v-model="formData.func_num" :style="{width: '100%'}">
            <el-option v-for="(value,key) in control_func" :key="key" :value="key" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围" prop="time_range" v-if="formData.datetype=='15'">
          <el-date-picker v-model="formData.time_range" type="daterange" format="MM/dd" value-format="MM/dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerTimeTange" :style="{width: '100%'}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日期范围" v-else>
          <el-select v-model="formData.time_range_15" multiple placeholder="请选择" disabled :style="{width: '100%'}">
            <el-option v-for="(value,key) in weekFormatter" :key="key" :label="value" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="begin_time">
          <el-time-picker v-model="formData.begin_time" format="HH:mm" value-format="HH:mm" placeholder="请选择" :style="{width: '100%'}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="方案" prop="datetype">
          <el-select placeholder="请选择" v-model="formData.patternid" :style="{width: '100%'}">
            <el-option v-for="(item,index) in planData" :key="index" :value="''+index" :label="'方案'+(index+1)"></el-option>
          </el-select>
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
      id: this.$route.params.id,
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      tableData: [],
      control_func: {
        "0": "定周期方式",
        "1": "待机黄闪",
        "2": "待机全红",
        "3": "无线缆协调",
        "4": "感应方式",
        "7": "关闭外灯",
        "8": "关闭外灯",
        "9": "时钟同步",
        "153": "锁相位特勤控制",
        "181": "锁阶段特勤控制，或手动控制和步进",
        "200": "自适应方案"
      },
      weekFormatter: {
        sunday: "周日",
        monday: "周一",
        tuesday: "周二",
        wednesday: "周三",
        thursday: "周四",
        friday: "周五",
        saturday: "周六"
      },
      weekData: {},
      planData: [],
      tableLoading: true,
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: "",
      formData: {},
      rules: {},
      pickerTimeTange: {
        shortcuts: [
          {
            text: "往后一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "往后一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "往后三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
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
      this.$http("index/d_timemanage/dataList", {
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
    // 请求日期类型数据
    getWeekDataList() {
      this.$http("index/d_week/dataList", {
        page: 1,
        rows: 9,
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          let weekData = {};
          res.data.list.forEach(item => {
            let array = (weekData[item.num] = []);
            for (let i in this.weekFormatter) {
              if (item[i] === "1") {
                array.push(this.weekFormatter[i]);
              }
            }
          });
          this.weekData = weekData;
        }
      });
    },
    // 请求方案信息
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
    formatterTime(value) {
      if (value < 10) {
        return "0" + value;
      } else {
        return value;
      }
    },
    formatterTimeRange(row) {
      let type = row.datetype;
      if (type === "15") {
        return (
          this.formatterTime(row.start_mon) +
          " / " +
          this.formatterTime(row.start_day) +
          " - " +
          this.formatterTime(row.stop_mon) +
          " / " +
          this.formatterTime(row.stop_day)
        );
      } else {
        return (this.weekData[type] || []).join(" , ");
      }
    },
    datetypeChange(value) {
      if (value != "15") {
        this.formData.time_range_15 = this.weekData[value] || [];
      }
    },
    handleCreate() {
      this.dialogTitle = "时间调度新增";
      this.dialogVisible = true;
      let today = new Date();
      this.formData = {
        datetype: "0",
        func_num: "0",
        time_range: [
          today.getMonth() + 1 + "/" + today.getDate(),
          today.getMonth() + 1 + "/" + today.getDate()
        ],
        begin_time: "00:00",
        time_range_15: this.weekData[0] || [],
        patternid: "0"
      };
    },
    handleUpdate(row) {
      this.dialogTitle = "时间调度编辑";
      this.dialogVisible = true;
      this.formData = {
        datetype: row.datetype,
        func_num: row.func_num,
        id: row.id,
        patternid: row.patternid,
        serialid: row.patternid,
        time_range: [
          row.start_mon + "/" + row.start_day,
          row.stop_mon + "/" + row.stop_day
        ],
        begin_time: row.start_hour + ":" + row.start_min,
        time_range_15: this.weekData[row.datetype] || [],
        patternid: row.patternid,
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
            this.$http("index/d_timemanage/dataDelete", {
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
      let f = this.formData;
      let data = {
        datetype: f.datetype,
        func_num: f.func_num,
        patternid: f.patternid,
        plan_id: this.id
      };
      data.start_hour = f.begin_time.split(":")[0];
      data.start_min = f.begin_time.split(":")[1];
      if (f.datetype === "15") {
        let t = f.time_range;
        data.start_mon = t[0].split("/")[0];
        data.start_day = t[0].split("/")[1];
        data.stop_mon = t[1].split("/")[0];
        data.stop_day = t[1].split("/")[1];
      } else {
        data.start_mon = 0;
        data.start_day = 0;
        data.stop_mon = 0;
        data.stop_day = 0;
      }
      let url = "";
      if (f.TYPE === "modify") {
        //编辑
        url = "index/d_timemanage/dataUpdate";
        data.id = f.id;
        data.serialid = f.serialid;
      } else {
        url = "index/d_timemanage/dataAdd";
        data.serialid = this.pageTotals + 1;
      }
      this.$http(url, data).then(res => {
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
  computed: {},
  created() {
    this.getPlanDataList();
    this.getWeekDataList();
    this.getDataList();
  }
};
</script>

<style>
</style>
