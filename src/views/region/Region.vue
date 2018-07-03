<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>区域管理</el-breadcrumb-item>
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
          <el-table :data="tableData" v-loading="loading" :show-header="false" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="name">
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
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form">
        <el-form-item label="" prop="name">
          <el-input clearable v-model="formData.name" placeholder="请输入名称"></el-input>
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
      loading: true,
      tableData: [],
      dialogVisible: false,
      dialogTitle: "",
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "名称请限制在 3 到 5 个字符",
            trigger: "blur"
          }
        ]
      },
      formData: {
        name: ""
      }
    };
  },
  methods: {
    // 请求数据
    fetchData() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.tableData = data;
          this.$store.dispatch("SETCROSSING", data);
        }
        this.loading = false;
      });
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "区域新增";
      this.formData = {};
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    handleDetails(row) {
      this.$router.push({
        path: "/region/" + row.id
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "区域编辑";
      this.formData = {
        id: row.id,
        name: row.name
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
