<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle @click="_self.$router.push({ path: '/region/' + id1 + '/' + id2 })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>

    <div style="position:absolute;right:20px;top:20px;">
      <el-card :body-style="{ padding: '10px' }" :style="{width:'360px'}" class="map-card">
        <div class="pos-wrapper">
          <div class="pos-wrapper-inner">
            <div>拖动路口图标进行定位</div>
            <div class="num">
              <span>{{formData.lat}},{{formData.lng}}</span>
            </div>
          </div>
          <div class="pos-wrapper-inner">
            <el-button type="text" @click="handleSubmit" :style="{padding: '0'}">保存</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import GMap from "@/components/Map";
export default {
  components: { GMap },
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      id3: this.$route.params.id3,
      name1: "",
      name2: "",
      name3: "",
      formData: {},
      marker: null
    };
  },
  methods: {
    getDataList() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.$store.dispatch("SETCROSSING", data);
        }
      });
    },
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1 && item.children) {
          this.name1 = item.name;
          item.children.forEach(item => {
            if (item.id == this.id2 && item.children) {
              this.name2 = item.name;
              item.children.forEach(item => {
                if (item.id == this.id3) {
                  this.name3 = item.name;
                  this.formData = Object.assign({}, item);
                }
              });
            }
          });
        }
      });
      this.loading = false;
    },
    drawMarker(data) {
      let self = this;
      let p = new google.maps.LatLng(data.lat, data.lng);
      let marker = (this.marker = new google.maps.Marker({
        position: p,
        icon: require("@/assets/marker_default.png"),
        title: data.name,
        id: data.id,
        map: this.gmap,
        draggable: true
      }));
      /* let html = `<div class="overlayview">${
        this.name3
      }<div class="overlayview-arrow"></div></div>`;
      let popover = new this.gmap.popover(marker, html); */
      this.gmap.panTo(p);

      // 添加拖动事件监听器
      google.maps.event.addListener(marker, "drag", function() {
        let p = marker.getPosition();
        self.formData.lat = p.d;
        self.formData.lng = p.e;
      });
    },
    changeMarkerPos() {},
    handleSubmit() {
      let row = this.formData;

      this.$http("index/d_crossing/dataUpdate", {
        id: row.id,
        name: row.name,
        lat: row.lat,
        lng: row.lng,
        area_id: row.area_id,
        direction: row.direction,
        road_data: row.road_data
      }).then(res => {
        if (res.status) {
          this.getDataList();
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    }
  },
  computed: {
    crossingData() {
      return this.$store.state.crossingData;
    },
    gmap() {
      return this.$store.state.gmap;
    }
  },
  watch: {
    crossingData(data) {
      this.formatterData(data);
    },
    formData(data) {
      this.drawMarker(data);
    },
    gmap() {
      if (this.crossingData.length) {
        this.formatterData(this.crossingData);
      } else {
        this.getDataList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  display: table;
  &-inner,
  &-tools {
    display: table-cell;
  }
}
.pos-wrapper {
  width: 340px;
  &-inner {
    display: inline-block;
    vertical-align: middle;
    .num {
      font-size: 12px;
      color: #606266;
      margin-top: 6px;
    }
  }
  &-inner:nth-child(1) {
    width: 279px;
    border-right: 1px solid #dfe1e6;
    overflow: hidden;
  }
  &-inner:nth-child(2) {
    width: 60px;
    text-align: center;
  }
}
</style>
