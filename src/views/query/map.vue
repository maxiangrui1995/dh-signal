<template>
  <div style="position:absolute; top:0; left:0; width:100%; height:100%;">
    <GMap />

    <div style="position:absolute; top:20px; left:20px; width:360px;">
      <crossing-tree :crossingData="crossingData" :gmap="gmap" @treeClick="handleTreeClick" @switchCrossingName="handleSwitchCrossingName"></crossing-tree>
    </div>

    <realtime-monitor :dialogVisible="visible_monitor" :crossingView="crossingView" @dialogClose="monitorDialogClose"></realtime-monitor>
  </div>
</template>

<script>
import GMap from "@/components/Map";
import crossingTree from "./components/crossing-tree";
import realtimeMonitor from "./components/realtime-monitor";
export default {
  components: { GMap, crossingTree, realtimeMonitor },
  data() {
    return {
      crossingMarkers: {}, //路口标记
      crossingTitleMarkers: {},
      crossingInfoWindow: {},
      bounds: null, //地图标记点的集合
      imageLoadError: "this.src='" + require("@/assets/crossing.jpg") + "'",
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "../web/public/"
          : "http://192.168.1.14/SignalControl/web/public/",
      visible_monitor: false, //实时监控
      crossingView: {} //路口的设备信息
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
      /* // 路口标题
      this.crossingTitleMarkers[row.id] = new this.gmap.showTitle(
        this.crossingMarkers[row.id],
        row.name
      );
       */
      // 路口弹窗
      this.crossingInfoWindow[row.id] = new google.maps.InfoWindow();

      this.bounds.extend(p);
      this.handleCrossingClick(this.crossingMarkers[row.id]);
    },
    // 路口树的点击事件
    handleTreeClick(data) {
      // 选中的路口变形,其他的恢复
      for (let i in this.crossingMarkers) {
        let d = this.crossingMarkers[i];
        if (i == data.id) {
          d.setIcon(require("@/assets/gmarker_selected.png"));
          this.showInfoWIndow(d);
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
    // 显示路口消息弹窗
    showInfoWIndow(marker) {
      let info = this.crossingInfoWindow[marker.id];

      info.setContent("loading...");
      info.open(this.gmap, marker);
      this.getCrossingView(marker.id, info);
    },
    // 获得路口下设备信息
    getCrossingView(id, infoWindow) {
      this.$http("index/d_crossing/dataView", {
        id: id
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          let dev = res.data;
          let crossing = dev.crossing;
          let machine = dev.machine ? [dev.machine] : "";
          let ups = dev.ups ? [dev.ups] : "";
          let ipc = dev.ipc ? dev.ipc : [];
          let camera = dev.camera ? dev.camera : [];
          let img = this.baseUrl + "uploads/" + crossing.image;
          let str = `<div class="info-container">
            <div class="info-container-title">${crossing.name}</div>
            <div class="info-container-info">
              <span class="tag">信号机<sup class="badge">
              ${machine.length}</sup></span>
              <span class="tag">备用电源<sup class="badge">
              ${ups.length}</sup></span>
              <span class="tag">相机<sup class="badge">
              ${camera.length}</sup></span>
              <span class="tag">工控机<sup class="badge">
              ${ipc.length}</sup></span>
            </div>
            <div class="info-container-content">
              <img src="${img}" onerror="${this.imageLoadError}"/>
            </div>
            <div class="info-container-footer">
              <button class="button" id="infowindow-${id}">实时监控</button>
              <button class="button" id="infowindow1-${id}">电子警察视频</button>
              <button class="button" id="infowindow2-${id}">车流量视频</button>
            </div>
          </div>`;
          infoWindow.setContent(str);

          this.crossingView = dev;

          document.getElementById(`infowindow-${id}`).onclick = () => {
            if (!machine.length) {
              return this.$message.warning("未配置信号机");
            }
            this.showRealtimeMonitorDialog(id);
          };
          document.getElementById(`infowindow1-${id}`).onclick = () => {
            if (!camera.length) {
              this.$message.warning("未配置相机");
            } else {
              let arr = [];
              camera.forEach(item => {
                if (item.type == "1") {
                  arr.push(item);
                }
              });
              if (!arr.length) {
                this.$message.warning("未配置电子警察相机");
              } else {
                this.showElectronPoliceDialog(id);
              }
            }
          };
          document.getElementById(`infowindow2-${id}`).onclick = () => {
            if (!camera.length) {
              this.$message.warning("未配置相机");
            } else {
              let arr = [];
              camera.forEach(item => {
                if (item.type == "2") {
                  arr.push(item);
                }
              });
              if (!arr.length) {
                this.$message.warning("未配置车流量相机");
              } else {
                this.showRealtimeMonitorDialog(id);
              }
            }
          };
        }
      });
    },
    // 弹出实时监测对话框
    showRealtimeMonitorDialog(crossing_id) {
      console.log(crossing_id);
      this.visible_monitor = true;
    },
    monitorDialogClose() {
      this.visible_monitor = false;
    },
    // 弹出电子警察视频
    showElectronPoliceDialog(crossing_id) {
      console.log(crossing_id);
    },
    // 弹出车流量视频
    showVehicleFlowDialog(crossing_id) {
      console.log(crossing_id);
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
    }
  }
};
</script>

<style lang="scss">
@import "./main.scss";
</style>
