<template>
    <div>
        <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
            <el-table-column prop="serial_number" label="阶段号">
                <template slot-scope="scope">
                    <span>阶段{{ ~~scope.row.serial_number + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="channel_1" label="车道1">
            </el-table-column>
            <el-table-column prop="channel_2" label="车道2">
            </el-table-column>
            <el-table-column prop="channel_3" label="车道3">
            </el-table-column>
            <el-table-column prop="channel_4" label="车道4">
            </el-table-column>
            <el-table-column prop="channel_5" label="车道5">
            </el-table-column>
            <el-table-column prop="channel_6" label="车道6">
            </el-table-column>
            <el-table-column prop="channel_7" label="车道7">
            </el-table-column>
            <el-table-column prop="channel_8" label="车道8">
            </el-table-column>
            <el-table-column prop="min_green" label="最小绿">
            </el-table-column>
            <el-table-column prop="max_green" label="最大绿">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="车检器编辑" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false" :show-close="false">
            <el-form :model="formData" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="车道1">
                    <el-input-number controls-position="right" v-model="formData.channel_1" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道2">
                    <el-input-number controls-position="right" v-model="formData.channel_2" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道3">
                    <el-input-number controls-position="right" v-model="formData.channel_3" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道4">
                    <el-input-number controls-position="right" v-model="formData.channel_4" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道5">
                    <el-input-number controls-position="right" v-model="formData.channel_5" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道6">
                    <el-input-number controls-position="right" v-model="formData.channel_6" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道7">
                    <el-input-number controls-position="right" v-model="formData.channel_7" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="车道8">
                    <el-input-number controls-position="right" v-model="formData.channel_8" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="最小绿">
                    <el-input-number controls-position="right" v-model="formData.min_green" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
                </el-form-item>
                <el-form-item label="最大绿">
                    <el-input-number controls-position="right" v-model="formData.max_green" :max="255" :min="0" :style="{width:'100%'}"></el-input-number>
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
      id: this.$route.params.id,
      tableData: [],
      tableLoading: true,
      dialogVisible: false,
      dialogLoading: false,
      formData: {},
      rules: {}
    };
  },
  methods: {
    getDataList() {
      this.tableLoading = true;
      this.$http("index/d_car_sensor/dataList", {
        page: 1,
        rows: 10,
        plan_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.tableData = res.data.list;
        }
        this.tableLoading = false;
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.formData = Object.assign({}, row);
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
    handleFormSubmit() {
      this.dialogLoading = true;
      this.$http("index/d_car_sensor/dataUpdate", this.formData).then(res => {
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
    }
  },
  created() {
    this.getDataList();
  }
};
</script>

<style>
</style>
