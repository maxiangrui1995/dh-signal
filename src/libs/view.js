/**
 *  canvas绘制信号机
 * 
 */
import lane_left from "@/assets/signal/lane_left.svg";
import lane_right from "@/assets/signal/lane_right.svg";
import lane_vertical from "@/assets/signal/lane_vertical.svg";
import light_left from "@/assets/signal/light_left.svg";
import light_right from "@/assets/signal/light_right.svg";
import light_vertical from "@/assets/signal/light_vertical.svg";
import light_foot from "@/assets/signal/light_foot.svg";
import light_left_red from "@/assets/signal/light_left_red.svg";
import light_right_red from "@/assets/signal/light_right_red.svg";
import light_vertical_red from "@/assets/signal/light_vertical_red.svg";
import light_foot_red from "@/assets/signal/light_foot_red.svg";
import light_left_yellow from "@/assets/signal/light_left_yellow.svg";
import light_right_yellow from "@/assets/signal/light_right_yellow.svg";
import light_vertical_yellow from "@/assets/signal/light_vertical_yellow.svg";
import light_foot_yellow from "@/assets/signal/light_foot_yellow.svg";
import light_left_green from "@/assets/signal/light_left_green.svg";
import light_right_green from "@/assets/signal/light_right_green.svg";
import light_vertical_green from "@/assets/signal/light_vertical_green.svg";
import light_foot_green from "@/assets/signal/light_foot_green.svg";
import light_round from "@/assets/signal/light_round.svg";
import light_round_red from "@/assets/signal/light_round_red.svg";
import light_round_yellow from "@/assets/signal/light_round_yellow.svg";
import light_round_green from "@/assets/signal/light_round_green.svg";

let img_lane = {};
img_lane[3] = new Image();
img_lane[3].src = lane_left;
img_lane[2] = new Image();
img_lane[2].src = lane_vertical;
img_lane[4] = new Image();
img_lane[4].src = lane_right;
let img_light = { 3: {}, 2: {}, 4: {}, 11: {}, round: {} };
img_light[3]['default'] = new Image();
img_light[3]['default'].src = light_left;
img_light[3]['1'] = new Image();
img_light[3]['1'].src = light_left_red;
img_light[3]['6'] = img_light[3]['1'];

img_light[3]['2'] = new Image();
img_light[3]['2'].src = light_left_yellow;
img_light[3]['7'] = img_light[3]['2'];

img_light[3]['3'] = new Image();
img_light[3]['3'].src = light_left_green;
img_light[3]['8'] = img_light[3]['3'];

img_light[2]['default'] = new Image();
img_light[2]['default'].src = light_vertical;
img_light[2]['1'] = new Image();
img_light[2]['1'].src = light_vertical_red;
img_light[2]['6'] = img_light[2]['1'];

img_light[2]['2'] = new Image();
img_light[2]['2'].src = light_vertical_yellow;
img_light[2]['7'] = img_light[2]['2'];

img_light[2]['3'] = new Image();
img_light[2]['3'].src = light_vertical_green;
img_light[2]['8'] = img_light[2]['3'];

img_light[4]['default'] = new Image();
img_light[4]['default'].src = light_right;
img_light[4]['1'] = new Image();
img_light[4]['1'].src = light_right_red;
img_light[4]['6'] = img_light[4]['1'];

img_light[4]['2'] = new Image();
img_light[4]['2'].src = light_right_yellow;
img_light[4]['7'] = img_light[4]['2'];

img_light[4]['3'] = new Image();
img_light[4]['3'].src = light_right_green;
img_light[4]['8'] = img_light[4]['3'];

img_light[11]['default'] = new Image();
img_light[11]['default'].src = light_foot;
img_light[11]['1'] = new Image();
img_light[11]['1'].src = light_foot_red;
img_light[11]['6'] = img_light[11]['1'];

img_light[11]['2'] = new Image();
img_light[11]['2'].src = light_foot_yellow;
img_light[11]['7'] = img_light[11]['2'];

img_light[11]['3'] = new Image();
img_light[11]['3'].src = light_foot_green;
img_light[11]['8'] = img_light[11]['3'];

img_light['round']['default'] = new Image();
img_light['round']['default'].src = light_round;
img_light['round']['1'] = new Image();
img_light['round']['1'].src = light_round_red;
img_light['round']['6'] = img_light['round']['1'];

img_light['round']['2'] = new Image();
img_light['round']['2'].src = light_round_yellow;
img_light['round']['7'] = img_light['round']['2'];

img_light['round']['3'] = new Image();
img_light['round']['3'].src = light_round_green;
img_light['round']['8'] = img_light['round']['3'];

// 双黄线
const YW = 4;
const YC = "#a5a756";
// 人行道
const RW = 30;
const RC = "#ccc";
// 车行道
const LW = 30;
const LC = "#ddd";
// 画布属性
const CC = "rgb(57, 61, 73)";

function APP() { }
// 路口数据
APP.prototype.CROSSINGDATA = [];
// 灯组数据
APP.prototype.LIGHTDATA = [];
// 阶段数据
APP.prototype.PHASEDATA = [];
APP.prototype.init = function (elem) {
  elem.style.background = CC;
  this.selector = jQuery(elem);
  this.selector.translateCanvas({
    translateX: elem.width / 2, translateY: elem.height / 2
  })
}
APP.prototype.clearCanvas = function () {
  this.selector.clearCanvas().removeLayers();
}

APP.prototype.draw = function () {
  this.clearCanvas();
  let selector = this.selector;
  let CW = selector.width();
  let CH = selector.height();
  let CX = CW / 2;
  let CY = CH / 2;

  let CROSSINGDATA = this.CROSSINGDATA;
  let LIGHTDATA = this.LIGHTDATA;

  if (!CROSSINGDATA.length) {
    return console.error('没有路口信息');
  }

  // 格式化路口每个方向的数目和其车道的类型
  let formatterNUM = {};
  let formatterTARGET = {};

  CROSSINGDATA.forEach(item => {
    formatterNUM["n" + item.direction] = ~~item.roadnum;
    formatterTARGET["target" + item.direction] = item.target;
  });
  let { n1, n3, n5, n7 } = formatterNUM;
  let { target1, target3, target5, target7 } = formatterTARGET;

  // 从中心点(起点)到上下左右各个方向的距离
  let corner = RW * 3;
  // 双黄线宽度+车道宽度*车道数目+拐角宽度*3
  let o1 = -(YW + LW * n3 + corner);
  let o3 = YW + LW * n5 + corner;
  let o5 = YW + LW * n7 + corner;
  let o7 = -(YW + LW * n1 + corner);

  // 双黄线
  const drawYellow = () => {
    let fn = (x1, y1, x2, y2) => {
      selector.drawLine({
        layer: true,
        strokeStyle: YC,
        strokeWidth: YW,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      })
    }
    // 1
    fn(-4, o1, -4, -CY);
    fn(4, o1, 4, -CY);
    // 3
    fn(o3, -4, CX, -4);
    fn(o3, 4, CX, 4);
    // 5
    fn(-4, o5, -4, CY);
    fn(4, o5, 4, CY);
    // 7
    fn(o7, -4, -CX, -4);
    fn(o7, 4, -CX, 4);
  }
  drawYellow();
  // 绘制行车道
  const drawLane = () => {
    let fn = (x1, y1, x2, y2) => {
      selector.drawLine({
        layer: true,
        strokeStyle: LC,
        strokeWidth: 2,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      })
    }

    let yw = YW * 1.5;
    // 1
    for (let i = 1; i < n1; i++) {
      fn(-LW * i - yw, -CY, -LW * i - yw, o1 - 4);
    }
    fn(o7 + corner, o1 - 4, -yw, o1 - 4);
    // 3
    for (let i = 1; i < n3; i++) {
      fn(o3 + 4, -LW * i - yw, CX, -LW * i - yw);
    }
    fn(o3 + 4, o1 + corner, o3 + 4, -yw);
    // 5
    for (let i = 1; i < n5; i++) {
      fn(LW * i + yw, CY, LW * i + yw, o5 + 4);
    }
    fn(o3 - corner, o5 + 4, yw, o5 + 4);
    // 7
    for (let i = 1; i < n7; i++) {
      fn(o7 - 4, LW * i + yw, -CX, LW * i + yw);
    }
    fn(o7 - 4, o5 - corner, o7 - 4, yw);
  };
  drawLane();
  // 绘制虚线行车道
  const drawDashLane = () => {
    let fn = (x1, y1, x2, y2) => {
      selector.drawLine({
        layer: true,
        strokeStyle: LC,
        strokeWidth: 1,
        strokeDash: [5],
        strokeDashOffset: 1,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      })
    }
    let yw = YW * 1.5;
    // 1
    for (let i = 1; i < n1; i++) {
      fn(-LW * i - yw, o5, -LW * i - yw, CY);
    }
    // 3
    for (let i = 1; i < n3; i++) {
      fn(o7, -LW * i - yw, -CX, -LW * i - yw);
    }
    // 5
    for (let i = 1; i < n5; i++) {
      fn(LW * i + yw, o1, LW * i + yw, -CY);
    }
    // 7
    for (let i = 1; i < n7; i++) {
      fn(o3, LW * i + yw, CX, LW * i + yw);
    }

  };
  drawDashLane();
  // 绘制人行道
  const drawRoadWay = () => {
    let fn = (x1, y1, x2, y2) => {
      selector.drawLine({
        layer: true,
        strokeStyle: RC,
        strokeWidth: RW,
        strokeDash: [5],
        strokeDashOffset: 1,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      })
    }
    let rw = RW / 2;
    // 1
    fn(o7 + corner, o1 + rw, o3 - corner, o1 + rw);
    // 3
    fn(o3 - rw, o1 + corner, o3 - rw, o5 - corner);
    // 5
    fn(o7 + corner, o5 - rw, o3 - corner, o5 - rw);
    // 7
    fn(o7 + rw, o1 + corner, o7 + rw, o5 - corner);
  };
  drawRoadWay();
  // 绘制围栏
  const drawWrapper = () => {
    let line = (x1, y1, x2, y2) => {
      selector.drawLine({
        layer: true,
        strokeStyle: RC,
        strokeWidth: 4,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      })
    }
    let arc = (x, y, radius, start, end) => {
      selector.drawArc({
        layer: true,
        strokeStyle: RC,
        strokeWidth: 4,
        x: x, y: y,
        radius: radius,
        // start and end angles in degrees
        start: start, end: end
      })
    }
    let lw = LW + 2;
    let rw = RW;
    // 1
    line(-lw * n1, -CY, -lw * n1, o1 + rw);
    line(lw * n5, -CY, lw * n5, o1 + rw);
    arc(o3 - rw + 2, o1 + rw - 2, rw * 2, 180, 270);
    // 3
    line(o3 - rw, -lw * n3, CX, -lw * n3);
    line(o3 - rw, lw * n7, CX, lw * n7);
    arc(o7 + rw - 2, o5 - rw + 2, rw * 2, 0, 90);
    // 5
    line(lw * n5, o5 - rw, lw * n5, CY);
    line(-lw * n1, o5 - rw, -lw * n1, CY);
    arc(o3 - rw + 2, o5 - rw + 2, rw * 2, 270, 360);
    // 7
    line(o7 + rw, lw * n7, -CX, lw * n7);
    line(o7 + rw, -lw * n3, -CX, -lw * n3);
    arc(o7 + rw - 2, o1 + rw - 2, rw * 2, 90, 180);

  };
  drawWrapper();
  // 绘制车道类型
  const drawLaneTarget = () => {
    let draw = (x, y, rotate, img) => {
      selector.drawImage({
        layer: true,
        x: x,
        y: y,
        rotate: rotate,
        source: img_lane[img],
        opacity: 0.5
      })
    }
    let yw = YW * 1.5;
    // 1
    for (let i = 0; i < n1; i++) {
      draw(-yw - LW * i - 15, o1 - 4 - 15, 180, target1[i]);
    }
    // 3
    for (let i = 0; i < n3; i++) {
      draw(o3 + 4 + 15, -yw - LW * i - 15, 270, target3[i]);
    }
    // 5
    for (let i = 0; i < n5; i++) {
      draw(yw + LW * i + 15, o5 + 4 + 15, 0, target5[i]);
    }
    // 7
    for (let i = 0; i < n7; i++) {
      draw(o7 - 4 - 15, yw + LW * i + 15, 90, target7[i]);
    }
  };
  drawLaneTarget();
  // 绘制信号灯
  const drawLight = () => {
    // 初始化灯组信息
    let formatterLIGHT = {};
    LIGHTDATA.forEach(item => {
      if (!formatterLIGHT["d" + item.position]) {
        formatterLIGHT["d" + item.position] = { car: [], man: [] };
      }
      if (item.lightorder === "0") {
        formatterLIGHT["d" + item.position].car.push(item);
      } else {
        formatterLIGHT["d" + item.position].man.push(item);
      }
    });
    let { d1, d2, d3, d4 } = formatterLIGHT;

    const draw = (x, y, rotate, item) => {
      let str = "ABCDEFGHIJKLMNOPQ";
      let index = str.indexOf(item.title);
      let color = "default";
      let name = item.title + Math.random() * 99999;

      if (this.PHASEDATA) {
        color = this.PHASEDATA[index];
        if ("123678".indexOf(color) === -1) {
          color = "default";
        }
      }
      selector.drawImage({
        layer: true,
        x: x,
        y: y,
        name: name,
        rotate: rotate,
        opacity: 1,
        source: img_light[
          item.lightorder === "0"
            ? item.lightsharp === "1" ? item.target : "round"
            : "11"
        ][color],
        cursors: {
          mouseover: 'pointer',
          mouseout: 'default'
        },
        click: () => {
          this.onClick(item);
        }
      })
      if (color === "6" || color === "7" || color === "8") {
        selector.animateLayer(name, {
          opacity: 0.2
        }, 1000);
      }
    };
    const drawTitle = (x, y, title) => {
      selector.drawText({
        layer: true,
        x: x,
        y: y,
        fillStyle: '#ce874a',
        opacity: 0.5,
        strokeWidth: 1,
        fontSize: 20,
        fontFamily: 'Verdana, sans-serif',
        text: title || "??"
      })
    }

    let yw = YW * 1.5;
    let lw = LW;
    // 1 - db(1)
    let draw_1 = () => {
      for (let i = 0; i < d3.car.length; i++) {
        let x = -yw - lw * (i + n1 - d3.car.length) - lw / 2;
        let y = o5 + lw / 2 + 4;
        let item = d3.car[i];
        draw(x, y, 180, item);
        drawTitle(x, y + lw, item.title);
      }
      let x = o7 + lw / 2;
      let y1 = o5 + lw / 2 - corner;
      let y2 = o1 - lw / 2 + corner;
      let item = d3.man["0"];
      draw(x, y1, 180, item);
      drawTitle(x, y1 + lw, item.title);
      draw(x, y2, 0, item);
      drawTitle(x, y2 - lw, item.title);
    };

    // 5 - db(3)
    let draw_5 = () => {
      for (let i = 0; i < d1.car.length; i++) {
        let x = yw + lw * (i + n1 - d1.car.length) + lw / 2;
        let y = o1 - lw / 2 - 4;
        let item = d1.car[i];
        draw(x, y, 0, item);
        drawTitle(x, y - lw, item.title);
      }
      let x = o3 - lw / 2;
      let y1 = o1 - lw / 2 + corner;
      let y2 = o5 + lw / 2 - corner;
      let item = d1.man["0"];
      draw(x, y1, 0, item);
      drawTitle(x, y1 - lw, item.title);
      draw(x, y2, 180, item);
      drawTitle(x, y2 + lw, item.title);
    };
    // 3 - db(2)
    let draw_3 = () => {
      for (let i = 0; i < d2.car.length; i++) {
        let x = o7 - lw / 2 - 4;
        let y = -yw - lw * (i + n3 - d2.car.length) - lw / 2;
        let item = d2.car[i];
        draw(x, y, 270, item);
        drawTitle(x - lw, y, item.title);
      }
      let x1 = o7 + corner - lw / 2;
      let x2 = o3 - corner + lw / 2;
      let y = o1 + lw / 2;
      let item = d2.man["0"];
      draw(x1, y, 270, item);
      drawTitle(x1 - lw, y, item.title);
      draw(x2, y, 90, item);
      drawTitle(x2 + lw, y, item.title);
    };
    // 7 - db(4)
    let draw_7 = () => {
      for (let i = 0; i < d4.car.length; i++) {
        let x = o3 + lw / 2 + 4;
        let y = yw + lw * (i + n7 - d4.car.length) + lw / 2;
        let item = d4.car[i];
        draw(x, y, 90, item);
        drawTitle(x + lw, y, item.title);
      }
      let x1 = o7 + corner - lw / 2;
      let x2 = o3 - corner + lw / 2;
      let y = o5 - lw / 2;
      let item = d4.man["0"];
      draw(x1, y, 270, item);
      drawTitle(x1 - lw, y, item.title);
      draw(x2, y, 90, item);
      drawTitle(x2 + lw, y, item.title);
    };

    draw_1();
    draw_3();
    draw_5();
    draw_7();
  };
  // 倒计时
  const countDown = () => {
    selector.drawText({
      layer: true,
      fillStyle: '#ce874a',
      strokeWidth: 2,
      fontSize: 36,
      fontFamily: 'Verdana, sans-serif',
      text: this.COUNT,
      x: 0,
      y: 0
    });
  }
  if (LIGHTDATA.length) {
    drawLight();
  }
  if (this.COUNT !== undefined) {
    countDown();
  }
}

APP.prototype.drawText = function (text, color, clear) {
  if (!clear) {
    this.clearCanvas();
  }
  this.selector.drawText({
    layer: true,
    fillStyle: color || "#00bcd4",
    strokeWidth: 2,
    fontSize: 20,
    fontFamily: 'Verdana, sans-serif',
    text: text || "",
    x: 0,
    y: 0
  })
}


export default APP;