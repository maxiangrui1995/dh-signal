
/**
 * 自定义地图标记气泡提示
 * 
 * 
 */
function poptip(marker, htmlStr) {
  console.log(marker);

  this.marker = marker;
  this.htmlStr = htmlStr;
  this.setMap(marker.map);
}
poptip.prototype = new google.maps.OverlayView();
poptip.prototype.onAdd = function () {
  var div = document.createElement("div");
  div.innerHTML = this.htmlStr;
  div.style.position = "absolute";
  this.div_ = div;
  this.getPanes().floatPane.appendChild(div);
};
poptip.prototype.draw = function () {
  var overlayProjection = this.getProjection();
  var sw = overlayProjection.fromLatLngToDivPixel(this.marker.position);
  var div = this.div_;
  div.style.left = sw.x + 18 + "px";
  div.style.top = sw.y - 30 + "px";
};
poptip.prototype.onRemove = function () {
  this.div_.className = "fade-leave";
  setTimeout(() => {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }, 500);
};

export default poptip;