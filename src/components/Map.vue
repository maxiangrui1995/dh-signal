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
      lng: "119.77495282888412",
      lat: "36.37174657521467"
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
      let center = new google.maps.LatLng(this.lat, this.lng);
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
      this.OverlayView(gMap);
      this.$store.dispatch("SETGMAP", gMap);
    },
    OverlayView(gmap) {
      // 标题叠加层
      function title(marker, htmlStr) {
        this.marker = marker;
        this.htmlStr = htmlStr;
        this.setMap(marker.map);
      }
      title.prototype = new google.maps.OverlayView();
      title.prototype.onAdd = function() {
        var div = document.createElement("div");
        div.innerHTML = this.htmlStr;
        div.style.position = "absolute";
        this.div_ = div;
        /* 
          MapPanes.mapPane（级别0）
          MapPanes.overlayLayer（1级）
          MapPanes.markerLayer（2级）
          MapPanes.overlayMouseTarget（3级）
          MapPanes.floatPane（4级）
        */
        // this.getPanes().overlayLayer.appendChild(div);
        this.getPanes().floatPane.appendChild(div);
      };
      title.prototype.draw = function() {
        var overlayProjection = this.getProjection();
        var sw = overlayProjection.fromLatLngToDivPixel(this.marker.position);
        var div = this.div_;
        div.style.left = sw.x + 18 + "px";
        div.style.top = sw.y - 30 + "px";
      };
      title.prototype.onRemove = function() {
        this.div_.className = "fade-leave";
        setTimeout(() => {
          this.div_.parentNode.removeChild(this.div_);
          this.div_ = null;
        }, 500);
      };
      gmap.popover = title;
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
