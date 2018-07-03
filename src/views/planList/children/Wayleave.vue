<template>
  <div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="间隔总时间">
        <el-input-number v-model="lighttime" :min="0" :max="9"></el-input-number>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="item in formData" :key="item.id">
          <el-card shadow="never" :style="{'margin-bottom':'20px'}">
            <div slot="header">
              <span>{{cardTitle[item.type]}}</span>
              <el-tooltip content="通行权预览" :style="{float: 'right', padding: '3px 0'}">
                <el-button type="text">
                  <i class="el-icon-view" style="font-size: 20px;"></i>
                </el-button>
              </el-tooltip>
            </div>
            asda
          </el-card>
        </el-col>
      </el-row>
      <el-button type="primary">确定</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      lighttime: 0,
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
      }
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
    }
  },
  computed: {
    baseData() {
      return this.$store.state.planModule.baseData;
    }
  },
  watch: {
    baseData(data) {
      this.lighttime = data.time_interval;
    }
  },
  created() {
    this.fetchData();
    if (Object.keys(this.baseData).length) {
      this.lighttime = this.baseData.time_interval;
    }
  }
};
</script>

<style>
</style>
