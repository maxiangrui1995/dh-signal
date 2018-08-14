<template>
  <div>
    <canvas ref="canvasview" width="800" height="640" class="lightgroup-canvas"></canvas>

    <el-dialog title="灯组编辑" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="90px">
        <el-form-item label="相位标题">
          <el-select v-model="formData.title" placeholder="请选择" disabled>
            <el-option v-for="(item,key) in title" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相位灯型">
          <el-select v-model="formData.lightsharp" placeholder="请选择">
            <el-option label="满屏灯" value="0"></el-option>
            <el-option label="箭头灯" value="1"></el-option>
            <el-option label="行人灯" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标类型">
          <el-select v-model="formData.target" placeholder="请选择">
            <el-option label="直行" value="2"></el-option>
            <el-option label="左转" value="3"></el-option>
            <el-option label="右转" value="4"></el-option>
            <el-option label="直行" value="11"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绿延伸">
          <el-input-number v-model="formData.extendgreen" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="倒计时号牌">
          <el-input-number v-model="formData.countdown_id" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最小绿">
          <el-input-number v-model="formData.mingreen" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最大绿1">
          <el-input-number v-model="formData.maxgreen1" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最大绿2">
          <el-input-number v-model="formData.maxgreen2" :min="0" :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="最大绿3">
          <el-input-number v-model="formData.maxgreen3" :min="0" :max="255"></el-input-number>
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
import VIEW from "@/libs/view";
export default {
  data() {
    return {
      id: this.$route.params.id,
      lightData: [],
      crossingData: [
        {
          direction: "1",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "3",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "5",
          roadnum: "3",
          target: ["3", "2", "4"]
        },
        {
          direction: "7",
          roadnum: "3",
          target: ["3", "2", "4"]
        }
      ],
      fun: null,
      dialogVisible: false,
      formData: {},
      rules: {},
      dialogLoading: false,
      title: {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        H: "H",
        I: "I",
        J: "J",
        K: "K",
        L: "L",
        M: "M",
        N: "N",
        O: "O",
        P: "P"
      }
    };
  },
  methods: {
    drawView() {
      let draw = (this.fun = new VIEW());
      draw.init(this.$refs.canvasview);
      // 路口数据 TODO
      draw.CROSSINGDATA = this.crossingData;
      draw.draw();
    },
    // 请求灯组信息
    fetchData() {
      this.$http("index/d_phaseinfo/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 16
      }).then(res => {
        if (res.status) {
          this.lightData = res.data.list;
          this.fun.LIGHTDATA = res.data.list;
          this.fun.onClick = this.canvasClick;
          this.fun.draw();
        }
      });
    },
    canvasClick(row) {
      this.dialogVisible = true;
      this.formData = Object.assign({}, row);
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.dialogLoading = false;
    },
    handleFormSubmit() {
      this.dialogLoading = true;
      let arr = Object.assign([], this.lightData);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == this.formData.id) {
          arr[i] = Object.assign(arr[i], this.formData);
        }
      }
      this.$http("index/d_phaseinfo/updateAll", {
        plan_id: this.id,
        data: JSON.stringify(arr)
      }).then(res => {
        if (res.status) {
          this.fetchData();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
        this.dialogVisible = false;
        this.dialogLoading = false;
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.drawView();
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
.lightgroup-canvas {
  display: block;
  margin: 0 auto;
}
</style>
