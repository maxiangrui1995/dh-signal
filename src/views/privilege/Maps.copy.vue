<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle plain @click="_self.$router.push({ path: '/privilege' })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>

    <div style="position: absolute; top: 20px; right: 20px;">
      <!-- <el-button type="primary" plain>
        <i class="fa fa-cog" style="margin-right: 4px"></i>
        <span>路线规划</span>
      </el-button> -->
      <el-button type="primary" plain @click="setLine" v-if="!lineLoading">
        <i class="fa fa-cog" style="margin-right: 4px"></i>
        <span>路线规划</span>
      </el-button>
      <div v-else>
        <el-button type="primary" plain @click="cancelUpdateLine">
          <span>放弃</span>
        </el-button>
        <el-button type="primary" plain @click="resetLine">
          <span>清空重绘</span>
        </el-button>
        <el-button type="primary" plain @click="saveLine">
          <span>保存</span>
        </el-button>
      </div>
    </div>

    <!-- <el-dialog title="特勤方案编辑" :visible.sync="dialogVisible" width="30%">
      <div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
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
      plan: {}, //当前特勤方案
      crossingMarkers: {},
      popoverMarkers: {},
      circleMarkers: {},
      position: {
        //方向说明
        "1": "南",
        "2": "东",
        "3": "北",
        "4": "西"
      },
      dialogVisible: true,
      lineData: [],
      line: null,
      lineLoading: false,
      gmapClickEvent: null
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
    getPlan() {
      this.$http("index/d_secret_service_plan/singleList", {
        sch_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.plan = res.data;
        }
      });
    },
    getLine() {
      this.$http("index/d_secret_service_plan/getLine", {
        sch_id: this.id
      }).then(res => {
        if (res.status === "1") {
          if (res.data.length) {
            this.lineData = res.data;
            this.drawLineInMap(res.data);
          }
        }
      });
    },
    drawLineInMap(data) {
      let options = {
        path: [],
        geodesic: true, // 可测量的
        strokeColor: "#eb574a", // 线条颜色
        strokeOpacity: 0.86, // 透明度
        strokeWeight: 5 // 宽度
      };
      let bounds = new google.maps.LatLngBounds();
      data.forEach(item => {
        item.forEach(item => {
          let p = new google.maps.LatLng(item[0], item[1]);
          options.path.push(p);
          bounds.extend(p);
        });
      });
      if (this.line) {
        this.line.setMap(null);
      }
      let polyline = (this.line = new google.maps.Polyline(options));
      polyline.setMap(this.gmap); // 设置显示到map上
      this.gmap.fitBounds(bounds);
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
                  map: this.gmap
                });
              });
            }
          });
        }
      });
    },
    drawPlanMarkerInMap() {
      let data = this.plan;
      let position = this.position;
      if (data.children) {
        data.children.forEach(item => {
          let marker = this.crossingMarkers[item.crossing_id];
          if (marker) {
            marker.setIcon(require("@/assets/marker_default.png"));
            let html = `<div class="overlayview">
              <div class="overlayview-title">
                <b>${item.serial}-</b>
                <b>${marker.title}</b>
              </div>
              <div class="overlayview-body">
                <div class="overlayview-body-inner">信号机IP：${item.ip}</div>
                <div class="overlayview-body-inner">检测方向：由
                  <b>${position[item.dir_from]}</b> 向
                  <b>${position[item.dir_to]}</b>
                </div>
                <div class="overlayview-body-inner">
                  <span>检测范围：${item.distance} 米</span>
                </div>
                <div class="overlayview-body-inner">
                  <span>关闭延时：${item.delay} 秒</span>
                </div>
              </div>
              <div class="overlayview-arrow"></div>
            </div>`;
            let popover = (this.popoverMarkers[
              item.crossing_id
            ] = new this.gmap.popover(marker, html));
            let circle = (this.circleMarkers[
              item.crossing_id
            ] = new google.maps.Circle({
              map: this.gmap,
              center: marker.getPosition(),
              radius: ~~item.distance,
              strokeColor: "#d81e06",
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: "#d81e06",
              fillOpacity: 0.1
            }));
          }
        });
      }
    },
    showPlanList() {
      this.drawPlanMarkerInMap();
    },
    // 编辑线
    setLine() {
      let self = this;
      this.$message("提示：进入地图编辑");
      this.lineLoading = true;
      // 清空其他标记
      this.drawLineInMap(this.lineData);
      for (let i in this.crossingMarkers) {
        this.crossingMarkers[i].setVisible(false);
      }
      for (let i in this.popoverMarkers) {
        this.popoverMarkers[i].setMap(null);
      }
      for (let i in this.circleMarkers) {
        this.circleMarkers[i].setMap(null);
      }

      let isDrawing = false;
      let lenC = 0;
      let lenM = 0;
      let path = this.line.getPath();
      // 改变鼠标
      this.gmap.setOptions({
        draggableCursor: "crosshair"
      });
      // 地图点击
      this.gmapClickEvent = this.gmap.addListener("click", function(e) {
        self.line.getPath().push(e.latLng);
      });
    },
    cancelUpdateLine() {},
    resetLine() {
      console.log(this.line);

      this.line.setMap(null);
      this.line = new google.maps.Polyline({
        path: [],
        geodesic: true, // 可测量的
        strokeColor: "#eb574a", // 线条颜色
        strokeOpacity: 0.86, // 透明度
        strokeWeight: 5 // 宽度
      });
    },
    saveLine() {
      let path = this.line.getPath().b;
      let data = [];
      path.forEach(item => {
        data.push(item.d, item.e);
      });
      this.$http("index/d_secret_service_plan/setLine", {
        sch_id: this.id,
        data: data.join(",")
      }).then(res => {
        this.$message({
          type: res.data.status ? "success" : "error",
          message: res.data.msg
        });
        if (res.data.status) {
          this.logoutLine();
        }
      });
    },
    logoutLine() {
      delete this.gmap.draggableCursor;
      this.lineLoading = false;
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
      this.getLine();
    },
    crossing() {
      this.drawMarkerInMap();
      this.getPlan();
    },
    plan() {
      this.showPlanList();
    }
  }
};
</script>

<style>
</style>
