<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate" :style="{marginBottom: '10px'}">
            新增
        </el-button>
        <el-table :data="planData" v-loading="loading" style="width: 100%">
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
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                        <p>
                            <i class="el-icon-question el-popover-box_status"></i>
                            <span>确定删除这条记录吗?</span>
                        </p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                        </div>
                        <el-button type="text" slot="reference" :disabled="scope.$index < pageTotals - 1">删除</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pagePage" :page-size="pageRows" layout="total, sizes, prev, pager, next, jumper" :total="pageTotals" v-if="pageTotals>0" :style="{'margin':'10px 0 0','text-align':'right'}">
        </el-pagination>

        <el-dialog title="方案新增" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
            <div>输入名称可自动生成</div>
            <el-form :model="formData" :rules="rules" ref="form" :style="{marginTop: '20px'}">
                <el-form-item label="" prop="name">
                    <el-input clearable v-model="formData.name" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleFormCancel">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="方案编辑" :visible.sync="dialogVisible_modify" width="30%" :close-on-click-modal="false">
            <el-form :model="formData" :rules="rules" ref="form">
                <el-form-item label="" prop="name">
                    <el-input clearable v-model="formData.name" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleFormCancel">取 消</el-button>
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
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      planData: [],
      id: this.$route.params.id,
      dialogVisible: false,
      dialogVisible_modify: false,
      formData: {},
      rules: {}
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
    fetchData() {
      this.$http("index/d_pattern/dataList", {
        page: this.pagePage,
        rows: this.pageRows,
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.planData = res.data.list;
          this.pageTotals = ~~res.data.total;
        }
        this.loading = false;
      });
    },
    handleCreate() {
      this.$confirm("即将自动生成一条默认方案,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "成功!"
          });
        })
    },
    handleUpdate(row) {
      console.log(row);
      this.dialogVisible_modify = true;
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
    handleFormSubmit() {}
  },
  created() {
    this.fetchData();
  }
};
</script>

<style>
</style>
