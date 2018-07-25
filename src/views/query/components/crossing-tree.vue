<template>
  <el-card class="my-card" :body-style="{ padding: '0' }">
    <div slot="header">
      <span>区域列表</span>
      <el-tooltip style="float: right; padding: 3px 0" :content="(switchCrossingName ? '关闭' : '开启') + '名称显示'">
        <el-switch v-model="switchCrossingName" @change="switchCrossing"></el-switch>
      </el-tooltip>
    </div>
    <el-scrollbar :style="{height: '500px'}">
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
      if (data.lat && data.lng) {
        let bounds = new google.maps.LatLngBounds();
        let p = new google.maps.LatLng(data.lat, data.lng);
        // bounds.extend(p);
        // this.gmap.fitBounds(bounds);
        this.gmap.panTo(p);
        this.$emit("treeClick", data);
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
}
</style>
