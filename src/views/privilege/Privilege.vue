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
            <el-table-column label="信号机">
              <template slot-scope="scope">
                <div>{{scope.row.children.length === 0 ? "未绑定" : scope.row.children.length + " 台"}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="激活状态">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.enabled==='1' ? '注销' : '激活'" placement="top">
                  <el-switch v-model="scope.row.enabled" active-value="1" inactive-value="0" :style="{ margin: '1px' }">
                  </el-switch>
                </el-tooltip>
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

    <el-dialog title="特勤联动新增" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="预案号" prop="sch_id">
          <el-input v-model="formData.sch_id" placeholder="请输入预案号"></el-input>
        </el-form-item>
        <el-form-item label="预案名称" prop="sch_name">
          <el-input v-model="formData.sch_name" placeholder="请输入预案名称"></el-input>
        </el-form-item>
        <el-form-item label="绑定警车" prop="boundPlate">
          <el-input v-model="formData.boundPlate" placeholder="请输入车牌号"></el-input>
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
      loading: true,
      tableData: [],
      formData: {},
      rules: {
        sch_id: [
          { required: true, message: "请输入预案号" },
          {
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error("请输入预案号"));
              } else {
                if (!reg.test(value)) {
                  callback(new Error("预案号只能为数字"));
                } else {
                  this.$http("index/d_secret_service_plan/checkRepeat", {
                    name: "sch_id",
                    value: value
                  }).then(res => {
                    if (res.status === "1") {
                      callback();
                    } else {
                      callback(new Error("预案号已存在"));
                    }
                  });
                }
              }
            },
            trigger: "blur"
          }
        ],
        sch_name: [
          { required: true, message: "请输入预案名" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入预案名"));
              } else {
                this.$http("index/d_secret_service_plan/checkRepeat", {
                  name: "sch_name",
                  value: value
                }).then(res => {
                  if (res.status === "1") {
                    callback();
                  } else {
                    callback(new Error("预案名已存在"));
                  }
                });
              }
            },
            trigger: "blur"
          }
        ],
        boundPlate: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
              if (!value) {
                callback(new Error("请输入车牌号"));
              } else {
                if (reg.test(value)) {
                  callback();
                } else {
                  callback(new Error("请输入正确的车牌号"));
                }
              }
            }
          },
          { required: true, message: "请输入车牌号" }
        ]
      },
      dialogVisible: false,
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
    // 请求数据
    getDataList() {
      this.loading = true;
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
      /* this.$http("index/d_secret_service_plan/planAdd", {
        data:
          "(33,'测试专线1','苏A99998',1,null,null,null,null,null),(33,'测试专线1','苏A99998',2,null,null,null,null,null)"
      }).then(res => {
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      }); */
    },
    handleDetails(row) {
      this.$router.push({
        path: "/privilege/" + row.sch_id
      });
    },
    handleDelete(row) {
      console.log(row);
    },
    handleFormCancel() {},
    handleFormSubmit() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
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
