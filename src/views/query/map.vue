<template>
  <div style="position:absolute; top:0; left:0; width:100%; height:100%;">
    <GMap />

    <div style="position:absolute; top:20px; left:20px; width:360px;">
      <crossing-tree :crossingData="crossingData" :gmap="gmap" @treeClick="handleTreeClick" @switchCrossingName="handleSwitchCrossingName"></crossing-tree>
    </div>

    <!-- <div style="position:absolute; top:20px; left:50%; transform: translateX(-50%)" v-if="Object.keys(crossingSelected).length > 0">
      <el-button type="primary">实时监控</el-button>
      <el-button type="primary">电子警察视频</el-button>
      <el-button type="primary">车流量视频</el-button>
      <el-button type="primary">车流量</el-button>
    </div> -->
  </div>
</template>

<script>
import GMap from "@/components/Map";
import crossingTree from "./components/crossing-tree";
export default {
  components: { GMap, crossingTree },
  data() {
    return {
      crossingMarkers: {}, //路口标记
      crossingTitleMarkers: {},
      crossingInfoWindow: {},
      bounds: null, //地图标记点的集合
      crossingSelected: {} //选中的路口
    };
  },
  methods: {
    // 获得区域数据
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing = data;
          this.$store.dispatch("SETCROSSING", data);
        }
      });
    },
    // 准备在地图上绘制标记
    drawStart() {
      this.bounds = new google.maps.LatLngBounds();
      // 先过滤区域数据取路口信息
      let data = this.crossingData;
      data.forEach(item => {
        if (item.children) {
          item.children.forEach(item => {
            if (item.children) {
              item.children.forEach(item => {
                this.drawMarkers(item);
              });
            }
          });
        }
      });
      // 得到所有标记点的集合,并自动全部展示
      this.gmap.fitBounds(this.bounds);
    },
    // 绘制标记
    drawMarkers(row) {
      let p = new google.maps.LatLng(row.lat, row.lng);
      // 路口标记
      this.crossingMarkers[row.id] = new google.maps.Marker({
        position: p,
        icon: require("@/assets/gmarker.png"),
        title: row.name,
        id: row.id,
        map: this.gmap,
        data: row
      });
      // 路口标题
      this.crossingTitleMarkers[row.id] = new this.gmap.showTitle(
        this.crossingMarkers[row.id],
        row.name
      );
      // 路口弹窗
      this.crossingInfoWindow[row.id] = new google.maps.InfoWindow({
        content: "123"
      });

      this.bounds.extend(p);
      this.handleCrossingClick(this.crossingMarkers[row.id]);
    },
    // 路口树的点击事件
    handleTreeClick(data) {
      // 选中的路口变形,其他的恢复
      for (let i in this.crossingMarkers) {
        let d = this.crossingMarkers[i];
        if (i == data.id) {
          this.crossingSelected = d.data;
          d.setIcon(require("@/assets/gmarker_selected.png"));
          this.crossingInfoWindow[data.id].open(this.gmap, d);
        } else {
          d.setIcon(require("@/assets/gmarker.png"));
          this.crossingInfoWindow[i].setMap(null);
        }
      }
    },
    // 切换路口名称显示状态
    handleSwitchCrossingName(newValue) {
      // 所有路口
      for (let i in this.crossingTitleMarkers) {
        let d = this.crossingTitleMarkers[i];
        if (!newValue) {
          d.setMap(null);
        } else {
          d.setMap(this.gmap);
        }
      }
    },
    // 地图上路口标记的点击事件
    handleCrossingClick(marker) {
      let self = this;
      google.maps.event.addListener(marker, "click", function() {
        self.handleTreeClick(this.data);
      });
    },
    // 显示控制按钮(实时监控，实时视频。。。)
    showControlButton() {
      // console.log(this.crossingSelected);
    }
  },
  computed: {
    gmap() {
      return this.$store.state.gmap;
    },
    crossingData() {
      return this.$store.state.crossingData;
    }
  },
  watch: {
    gmap() {
      if (this.crossingData.length) {
        this.getCrossing();
      } else {
        this.getCrossing();
      }
    },
    crossingData() {
      this.drawStart();
    },
    crossingSelected() {
      this.showControlButton();
    }
  }
};
</script>

<style>
</style>
