<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle @click="_self.$router.push({ path: '/comprehensiveQuery' })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>

    <div style="position: absolute; top: 20px; right: 20px;">
      <el-button type="primary" :style="{marginRight: '10px'}" @click="handleView">实时监控</el-button>
      <el-button type="primary" :style="{marginRight: '10px'}" @click="handleVideo">实时视频</el-button>
      <!-- <el-dropdown>
        <el-button type="primary" :style="{marginRight: '10px'}">
          <span>实时视频</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>电子警察视频</el-dropdown-item>
          <el-dropdown-item>车流量视频</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- <el-button type="primary">车流量</el-button>
      <el-button type="primary">设备</el-button> -->
    </div>

  </div>
</template>

<script>
import GMap from "@/components/Map";
export default {
  components: { GMap },
  data() {
    return {
      id: this.$route.params.id,
      crossing: [], //路口数据
      crossingMarkers: {},
      devs: {}
    };
  },
  methods: {
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing = data;
        }
      });
    },
    getCrossingView() {
      this.$http("index/d_crossing/dataView", {
        id: this.id
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.showMarker(data);
        }
      });
    },
    drawMarkerInMap() {
      let data = this.crossing;
      data.forEach(item => {
        if (item.children) {
          item.children.forEach(item => {
            if (item.children) {
              item.children.forEach(item => {
                let p = new google.maps.LatLng(item.lat, item.lng);
                this.crossingMarkers[item.id] = new google.maps.Marker({
                  position: p,
                  icon: require("@/assets/marker_blue.png"),
                  title: item.name,
                  id: item.id,
                  map: this.gmap,
                  data: item
                });
              });
            }
          });
        }
      });
      this.getCrossingView();
    },
    showMarker(dev) {
      let marker = this.crossingMarkers[this.id];
      let row = marker.data;
      let machine = dev.machine ? [dev.machine] : "";
      let ups = dev.ups ? [dev.ups] : "";
      let ipc = dev.ipc ? dev.ipc : [];
      let camera = dev.camera ? dev.camera : [];
      let img = require("@/assets/crossing.jpg");

      let html = `<div class="overlayview">
              <div class="overlayview-title">
                <div style="font-size: 18px; margin: 12px 0;">${row.name}</div>
                <div style="color:#606266;">
                  <div style="display:inline-block;margin-right:8px;">
                    <span>${machine.length || 0}台</span>
                    <br>信号机</div>
                  <div style="display:inline-block;margin-right:8px;">
                    <span>${ups.length || 0}台</span>
                    <br>备用电源</div>
                  <div style="display:inline-block;margin-right:8px;">
                    <span>${camera.length || 0}台</span>
                    <br>相机</div>
                  <div style="display:inline-block;">
                    <span>${ipc.length || 0}台</span>
                    <br>车检器</div>
                </div>
              </div>
              <div class="overlayview-body">
                <img src="${img}" style="width: 100%; display: block;"/>
              </div>
              <div class="overlayview-arrow"></div>
            </div>`;
      let popover = new this.gmap.popover(marker, html);

      // let bounds = new google.maps.LatLngBounds();
      // bounds.extend(marker.getPosition());
      // this.gmap.fitBounds(bounds);
      this.gmap.panTo(marker.getPosition());
    },
    /* 实时监控 */
    handleView() {
      this.$router.push({
        path: "/comprehensiveQuery/" + this.id + "/view"
      });
    },
    /* 实时视频 */
    handleVideo() {
      this.$router.push({
        path: "/comprehensiveQuery/" + this.id + "/video"
      });
    }
  },
  computed: {
    gmap() {
      return this.$store.state.gmap;
    }
  },
  watch: {
    gmap() {
      this.getCrossing();
    },
    crossing() {
      this.drawMarkerInMap();
    }
  }
};
</script>

<style lang="scss">
</style>
