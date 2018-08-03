<template>
  <el-card class="my-card" :body-style="{ padding: '0' }">
    <div slot="header">
      <span>区域列表</span>
      <!-- <el-tooltip style="float: right; padding: 3px 0" :content="(switchCrossingName ? '关闭' : '开启') + '名称显示'">
        <el-switch v-model="switchCrossingName" @change="switchCrossing"></el-switch>
      </el-tooltip> -->
    </div>
    <el-scrollbar :style="{height: '460px'}">
      <div style="padding: 10px;">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" :style="{marginBottom: '10px'}"></el-input>
        <el-tree :data="crossingData" :filter-node-method="filterTree" :highlight-current="true" ref="tree" @node-click="handleTreeClick"></el-tree>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script>
export default {
  props: ["crossingData", "gmap"],
  data() {
    return { filterText: "", switchCrossingName: true };
  },
  methods: {
    handleTreeClick(data) {
      let bounds = new google.maps.LatLngBounds();
      // 若点击的是区域1（pid=0）
      if (data.pid === "0") {
        if (data.children && data.children.length) {
          data.children.forEach(item => {
            if (item.children && item.children.length) {
              item.children.forEach(item => {
                let p = new google.maps.LatLng(item.lat, item.lng);
                bounds.extend(p);
              });
            }
          });
        }
      } else {
        // 路口
        if (data.lat && data.lng && !data.children) {
          let p = new google.maps.LatLng(data.lat, data.lng);
          this.gmap.panTo(p);
          this.$emit("treeClick", data);
        } else {
          // 区域2
          if (data.children) {
            data.children.forEach(item => {
              let p = new google.maps.LatLng(item.lat, item.lng);
              bounds.extend(p);
            });
          }
        }
      }
      if (
        bounds.fa.b !== 180 &&
        bounds.fa.b !== -180 &&
        bounds.ta.d !== 1 &&
        bounds.ta.b !== -1
      ) {
        this.gmap.fitBounds(bounds);
      }
    },
    filterTree(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    switchCrossing(newvalue) {
      this.$emit("switchCrossingName", newvalue);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss">
.my-card {
  .el-card__header {
    padding: 14px 20px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
