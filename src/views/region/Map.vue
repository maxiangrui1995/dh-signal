<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle @click="_self.$router.push({ path: '/region/' + id1 + '/' + id2 })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>

    <div style="position:absolute;right:20px;top:20px;">
      <el-card :body-style="{ paddingBottom: '0px' }" :style="{width:'360px'}">
        <div slot="header">{{name3}}</div>
        <el-form ref="form" :model="formData" label-width="40px">
          <el-form-item label="纬度">
            <el-input v-model="formData.lat"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="formData.lng"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </el-form-item>
        </el-form>
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
      formData: {}
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
      let marker = new google.maps.Marker({
        position: p,
        icon: require("@/assets/marker_default.png"),
        title: data.name,
        id: data.id,
        map: this.gmap,
        draggable: true
      });
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
</style>
