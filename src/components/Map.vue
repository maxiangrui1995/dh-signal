<template>
  <div style="width:100%;height:100%;">
    <div id="gmap" style="height:100%;"></div>
  </div>
</template>

<script>
export default {
  name: "gmap",
  data() {
    return {
      lat: "119.77495282888412",
      lng: "36.37174657521467"
    };
  },
  methods: {
    loadGMap() {
      function LocalMapType() {}
      LocalMapType.prototype.tileSize = new google.maps.Size(256, 256);
      LocalMapType.prototype.maxZoom = 18;
      LocalMapType.prototype.minZoom = 10;
      LocalMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
        let img = ownerDocument.createElement("img");
        img.style.width = this.tileSize.width + "px";
        img.style.height = this.tileSize.height + "px";
        let strURL = `${window.googleMapsFilesUrl}tilemap/${zoom}/${coord.y}/${
          coord.x
        }.png`;
        let errorURL = `${window.googleMapsFilesUrl}404.png`;

        let imgObj = new Image();
        imgObj.src = strURL;
        imgObj.onload = function() {
          img.src = this.src;
        };
        imgObj.onerror = function() {
          img.src = errorURL;
        };
        return img;
      };
      let localMapType = new LocalMapType();
      let center = new google.maps.LatLng(this.lng, this.lat);
      let gMap = new google.maps.Map(document.getElementById("gmap"), {
        zoom: 14,
        center: center,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
      });
      gMap.mapTypes.set("locaMap", localMapType);
      gMap.setMapTypeId("locaMap");
      if (!gMap) {
        this.$Message.error("地图资源加载出错，请重新尝试！");
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.loadGMap();
    });
  }
};
</script>

<style>
</style>
