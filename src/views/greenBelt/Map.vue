<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle plain @click="_self.$router.push({ path: '/greenBelt' })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
      <el-button type="primary" circle plain @click="showSearchBox = !showSearchBox">
        <i class="fa fa-search"></i>
      </el-button>
      <!-- <el-button type="primary" plain>
        <i class="fa fa-cog" style="margin-right: 4px"></i>
        <span>绿波配置</span>
      </el-button>
      <el-button type="primary" plain>
        <i class="el-icon-plus"></i>
        <span>绿波新增</span>
      </el-button> -->
      <!-- <el-card :body-style="{ padding: '10px' }" :style="{marginTop: '20px'}">
        <div v-for="item in tableData" :key="item.id">
          {{item.name}}
        </div>
      </el-card> -->
    </div>

    <div style="position: absolute; top: 70px; left: 20px;">
      <el-cascader :options="crossing" v-model="selectedCrossing" v-if="showSearchBox" filterable clearable change-on-select placeholder="路口快速定位" :style="{width: '260px'}">
      </el-cascader>
    </div>

    <!-- <div class="side-dialog" style="position: absolute; top: 0; right: 0;">
      A
    </div> -->
  </div>
</template>

<script>
import GMap from "@/components/Map";
export default {
  components: { GMap },
  data() {
    return {
      id: this.$route.params.id,
      pagePage: 1,
      pageRows: 20,
      pageTotals: 0,
      tableLoading: true,
      tableData: [],
      crossing: [],
      crossingMarkers: {},
      phase: {
        "0": "由东向西左转",
        "1": "由东向西直行",
        "2": "由东向西右转",
        "3": "由东向西行人",
        "4": "由南向北左转",
        "5": "由南向北直行",
        "6": "由南向北右转",
        "7": "由南向北行人",
        "8": "由西向东左转",
        "9": "由西向东直行",
        "10": "由西向东右转",
        "11": "由西向东行人",
        "12": "由北向南左转",
        "13": "由北向南直行",
        "14": "由北向南右转",
        "15": "由北向南行人"
      },
      selectedCrossing: [],
      checkPopoverVisible: false,
      showSearchBox: false
    };
  },
  methods: {
    getDataList() {
      this.$http("index/d_green_wave_sub/dataList", {
        pid: this.id,
        page: this.pagePage,
        rows: this.pageRows
      }).then(res => {
        if (res.status === "1") {
          this.tableData = res.data.list;
          this.pageTotals = ~~res.data.total;
          if (res.data.total > 0) {
            this.drawLineInMap(res.data.list);
          } else {
            this.$notify({
              title: "绿波提示",
              message: "当前绿波下暂无信号机,可点击<b>路口标记</b>进行配置。",
              offset: 70,
              type: "info",
              dangerouslyUseHTMLString: true,
              duration: 6000
            });
          }
        }
      });
    },
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing = data;
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
                let marker = (this.crossingMarkers[
                  item.id
                ] = new google.maps.Marker({
                  position: p,
                  icon: require("@/assets/marker_blue.png"),
                  title: item.name,
                  id: item.id,
                  map: this.gmap
                }));
                this.markerEvents(marker);
              });
            }
          });
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
        let p = new google.maps.LatLng(item.lat, item.lng);
        options.path.push(p);
        bounds.extend(p);
        this.changeMarkerInMap(item);
      });
      let polyline = new google.maps.Polyline(options);
      polyline.setMap(this.gmap); // 设置显示到map上
      this.gmap.fitBounds(bounds);
    },
    changeMarkerInMap(item) {
      let marker = this.crossingMarkers[item.crossing_id];
      if (marker) {
        marker.setIcon(require("@/assets/marker_default.png"));
        let html = `<div class="overlayview">
              <div class="overlayview-title">
                <b>${item.serial_num}-</b><b>${item.name}</b>
              </div>
              <div class="overlayview-body">
                <div class="overlayview-body-inner">
                  <span>路段距离：${item.road_distance}</span>
                </div>
                <div class="overlayview-body-inner">
                  <span>限制速度：${item.forward_speed}</span>
                </div>
                <div class="overlayview-body-inner">
                  <span>路口相位差：${item.phase_difference}</span>
                </div>
                <div class="overlayview-body-inner">
                  <span>协调相位：${this.phase[item.positive_phase]}</span>
                </div>
              </div>
              <div class="overlayview-arrow"></div>
            </div>`;
        let popover = new this.gmap.popover(marker, html);
      }
    },
    markerEvents(marker) {
      let gmap = this.gmap;
      google.maps.event.addListener(marker, "click", function() {
        let p = this.getPosition();
        console.log(p);
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
      this.getDataList();
    },
    crossing() {
      this.drawMarkerInMap();
    }
  }
};
</script>

<style>
</style>
