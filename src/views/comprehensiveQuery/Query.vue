<template>
  <el-container class="query-wrapper">
    <el-header class="page-header" :style="{height: 'auto'}">
      <div class="box">
        <div class="box-inner">
          <div class="box-inner-content">
            <div class="box-inner-content-label">区域:</div>
            <div class="box-inner-content-inner no-content" v-if="crossing_1.length==0">暂无数据</div>
            <div class="box-inner-content-inner" ref="crossing_box" v-else>
              <div class="box-inner-content-item" v-for="(item, index) in crossing_1" :key="index">
                <span class="tag">{{item.name}}</span>
              </div>
            </div>
            <div class="box-inner-content-button">按钮</div>
          </div>
          <div class="box-inner-content">
            <div class="box-inner-content-label">道路:</div>
            <div class="box-inner-content-inner no-content" v-if="crossing_2.length==0">暂无数据</div>
            <div class="box-inner-content-inner" ref="crossing_box1" v-else>
              <div class="box-inner-content-item" v-for="(item, index) in crossing_2" :key="index">
                <span class="tag">{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="box-inner-content">
            <div class="box-inner-content-label">路口:</div>
            <div class="box-inner-content-inner no-content" v-if="crossing_3.length==0">暂无数据</div>
            <div class="box-inner-content-inner" ref="crossing_box2" v-else>
              <div class="box-inner-content-item" v-for="(item, index) in crossing_3" :key="index">
                <span class="tag">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="6" :lg="4" v-for="item in crossing_3" :key="item.id" :style="{marginBottom: '16px'}">
          <el-card shadow="never" :body-style="{ padding: '0px' }">
            <img :src="require('@/assets/crossing.jpg')" alt="" style="width:100%;display:block">
            <div style="padding: 14px;">
              <el-tooltip class="button" :content="item.name_.join(' / ')">
                <span>{{ item.name }}</span>
              </el-tooltip>
              <el-button type="text" @click="viewMore(item)" :style="{float: 'right', padding: '4px 0'}">
                <i class="el-icon-view"></i>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      crossingData: [],
      crossing_1: [],
      crossing_2: [],
      crossing_3: []
    };
  },
  methods: {
    getCrossing() {
      this.crossing_1 = [];
      this.crossing_2 = [];
      this.crossing_3 = [];
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossingData = data;
          data.forEach(item1 => {
            this.crossing_1.push(item1);
            if (item1.children) {
              item1.children.forEach(item2 => {
                this.crossing_2.push(item2);
                if (item2.children) {
                  item2.children.forEach(item3 => {
                    item3.name_ = [item1.name, item2.name, item3.name];
                    this.crossing_3.push(item3);
                  });
                }
              });
            }
          });
        }
      });
    },
    getWidth() {
      let dom = this.$refs.crossing_box;
      let children = dom.childNodes;
      let width = getComputedStyle(dom).width;
      let _w = 0;
      children.forEach(item => {
        let w = item.offsetWidth;

        _w += w;
      });
      console.log(_w, parseInt(width));
    },
    viewMore(row) {
      this.$router.push({
        path: "/comprehensiveQuery/" + row.id
      });
    }
  },
  watch: {},
  computed: {},
  created() {
    this.getCrossing();
  },
  mounted() {
    let self = (window.onresize = () => {
      // console.log(this.getWidth);
    });
  },
  updated() {
    this.$nextTick(() => {
      this.getWidth();
      // console.log(this);
    });
  }
};
</script>

<style lang="scss" scoped>
.box {
  font-size: 12px;
  padding: 10px 0;
  &-inner {
    &-content {
      position: relative;
      min-height: 40px;
      &-inner {
        margin: 0 50px;
        border-bottom: 1px dashed #ccc;
      }
      &-item {
        display: inline-block;
        padding: 6px 16px;
      }
      &-label {
        position: absolute;
        padding: 6px 4px;
        line-height: 24px;
      }
      &-button {
        position: absolute;
        top: 0;
        right: 0;
        padding: 6px 4px;
        line-height: 24px;
      }
      .no-content {
        height: 38px;
        line-height: 36px;
        color: #909399;
      }
    }
    &-content:last-child > &-content-inner {
      border-bottom: none;
    }
  }
  .tag {
    background-color: rgba(64, 158, 255, 0.1);
    display: inline-block;
    padding: 0 10px;
    line-height: 24px;
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64, 158, 255, 0.2);
    white-space: nowrap;
  }
}
</style>
