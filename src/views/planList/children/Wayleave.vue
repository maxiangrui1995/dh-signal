<template>
  <div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="间隔总时间">
        <el-input-number v-model="time_interval" :min="0" :max="9"></el-input-number>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="item in formData" :key="item.id">
          <el-card shadow="never" :style="{'margin-bottom':'20px'}">
            <div slot="header">
              <span>{{cardTitle[item.type]}}</span>
              <!-- 
              <el-tooltip content="通行权预览" :style="{float: 'right', padding: '5px 0'}">
                <el-button type="text">
                  <i class="el-icon-view" style="font-size: 16px;"></i>
                </el-button>
              </el-tooltip> -->
            </div>
            <el-row :gutter="10">
              <el-col :span="6" :offset="1">
                <el-select v-model="item.first_step" placeholder="请选择" :style="{width: '100%', marginBottom: '20px'}">
                  <el-option v-for="(val, key, index) in colorOptions" :key="index" :label="val" :value="key">
                  </el-option>
                </el-select>
                <el-input-number v-model="item.first_step_time" :min="0" :max="9" :style="{width: '100%'}"></el-input-number>
              </el-col>
              <el-col :span="2" class="next">
                <i class="el-icon-d-arrow-right"></i>
              </el-col>
              <el-col :span="6">
                <el-select v-model="item.sec_step" placeholder="请选择" :style="{width: '100%', marginBottom: '20px'}">
                  <el-option v-for="(val, key, index) in colorOptions" :key="index" :label="val" :value="key">
                  </el-option>
                </el-select>
                <el-input-number v-model="item.sec_step_time" :min="0" :max="9" :style="{width: '100%'}"></el-input-number>
              </el-col>
              <el-col :span="2" class="next">
                <i class="el-icon-d-arrow-right"></i>
              </el-col>
              <el-col :span="6">
                <el-select v-model="item.third_step" placeholder="请选择" :style="{width: '100%', marginBottom: '20px'}">
                  <el-option v-for="(val, key, index) in colorOptions" :key="index" :label="val" :value="key">
                  </el-option>
                </el-select>
                <el-input-number v-model="item.third_step_time" :min="0" :max="9" :style="{width: '100%'}"></el-input-number>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      <el-button type="text" @click="handleReset">重置</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      time_interval: 0,
      formData: [],
      cardTitle: {
        "0": "行车-获得通行权",
        "1": "行车-失去通行权",
        "2": "行人-获得通行权",
        "3": "行人-失去通行权"
      },
      colorOptions: {
        "1": "红",
        "2": "黄",
        "3": "绿",
        "6": "红闪",
        "7": "黄闪",
        "8": "绿闪"
      },
      loading: false
    };
  },
  methods: {
    fetchData() {
      this.$http("index/d_passage/dataList", {
        plan_id: this.id,
        page: 1,
        rows: 4
      }).then(res => {
        if (res.status) {
          res.data.list.forEach(item => {
            item.first_step_time = ~~item.first_step_time;
            item.sec_step_time = ~~item.sec_step_time;
            item.third_step_time = ~~item.third_step_time;
          });
          this.formData = res.data.list;
        }
      });
    },
    handleSubmit() {
      let arr = [];
      let warning = [];
      this.formData.forEach((item, index) => {
        arr.push({
          first_step: item.first_step,
          first_step_time: item.first_step_time,
          sec_step: item.sec_step,
          sec_step_time: item.sec_step_time,
          third_step: item.third_step,
          third_step_time: item.third_step_time,
          type: item.type,
          remark: item.remark,
          id: item.id
        });
        if (
          ~~item.first_step_time +
            ~~item.sec_step_time +
            ~~item.third_step_time !==
          ~~this.time_interval
        ) {
          warning.push(this.cardTitle[index]);
        }
      });
      if (warning.length) {
        this.$alert(
          "<b>" +
            warning.join("</b> , <b>") +
            "</b>  三步时间之和 ≠ 间隔总时间",
          "系统提示",
          {
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        );
      } else {
        this.loading = true;
        this.$http("index/d_passage/dataUpdateList", {
          data: arr,
          plan_id: this.id,
          time_interval: this.time_interval
        }).then(res => {
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
          this.loading = false;
        });
      }
    },
    handleReset() {
      this.fetchData();
    }
  },
  computed: {
    baseData() {
      return this.$store.state.planModule.baseData;
    }
  },
  watch: {
    baseData(data) {
      this.time_interval = data.time_interval;
    }
  },
  created() {
    this.fetchData();
    if (Object.keys(this.baseData).length) {
      this.time_interval = this.baseData.time_interval;
    }
  }
};
</script>

<style lang="scss" scoped>
.next {
  text-align: center;
  line-height: 80px;
}
</style>
