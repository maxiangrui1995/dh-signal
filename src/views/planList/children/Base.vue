<template>
  <div style="width:600px; margin:0 auto;">
    <el-form ref="form" :inline="true" :rules="rules" :model="formData" label-position="right" label-width="100px" class="theme-form">
      <el-form-item label="方案名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="相位差">
          <el-input-number v-model="formData.phase_difference" :min="0" :max="255"></el-input-number>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="脉冲倒计时">
          <el-input-number v-model="formData.mc_countdown" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="脉冲宽度">
          <el-input-number v-model="formData.mc_width" :min="0" :max="255"></el-input-number>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="最小绿上限">
          <el-input-number v-model="formData.min_green_down" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最小绿下限">
          <el-input-number v-model="formData.min_green_up" :min="0" :max="255"></el-input-number>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="最大绿上限">
          <el-input-number v-model="formData.max_green_down" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最大绿下限">
          <el-input-number v-model="formData.max_green_up" :min="0" :max="255"></el-input-number>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="绿延伸上限">
          <el-input-number v-model="formData.extends_down" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="绿延伸下限">
          <el-input-number v-model="formData.extends_up" :min="0" :max="255"></el-input-number>
        </el-form-item>
      </div>
      <el-form-item label=" ">
        <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
        <el-button type="text" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        phase_difference: 0,
        mc_countdown: 0,
        mc_width: 0,
        min_green_down: 0,
        min_green_up: 0,
        max_green_down: 0,
        max_green_up: 0,
        extends_down: 0,
        extends_up: 0
      },
      rules: {
        /* name: [{ message: "名称不能为空" }] */
      },
      loading: false
    };
  },
  methods: {
    formatterData(data) {
      this.formData = {
        id: data.id,
        name: data.name,
        phase_difference: ~~data.phase_difference,
        mc_countdown: ~~data.mc_countdown,
        mc_width: ~~data.mc_width,
        min_green_down: ~~data.min_green_down,
        min_green_up: ~~data.min_green_up,
        max_green_down: ~~data.max_green_down,
        max_green_up: ~~data.max_green_up,
        extends_down: ~~data.extends_down,
        extends_up: ~~data.extends_up
      };
    },
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.$http("index/d_plan/dataUpdate", this.formData).then(res => {
          if (res.status) {
            this.$store.dispatch("planModule/SETBASE", this.formData);
          }
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
          this.loading = false;
        });
      });
    },
    handleReset() {
      this.formatterData(this.baseData);
    }
  },
  computed: {
    baseData() {
      return this.$store.state.planModule.baseData;
    }
  },
  watch: {
    baseData(data) {
      this.formatterData(data);
    }
  },
  created() {
    if (Object.keys(this.baseData).length) {
      this.formatterData(this.baseData);
    }
  }
};
</script>

<style>
</style>
