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
img_light[11]['6'] = img_light[4]['1'];

img_light[11]['2'] = new Image();
img_light[11]['2'].src = light_foot_yellow;
img_light[11]['7'] = img_light[4]['2'];

img_light[11]['3'] = new Image();
img_light[11]['3'].src = light_foot_green;
img_light[11]['8'] = img_light[4]['3'];

img_light['round']['default'] = new Image();
img_light['round']['default'].src = light_round;
img_light['round']['1'] = new Image();
img_light['round']['1'].src = light_round_red;
img_light['round']['6'] = img_light[11]['1'];

img_light['round']['2'] = new Image();
img_light['round']['2'].src = light_round_yellow;
img_light['round']['7'] = img_light[11]['2'];

img_light['round']['3'] = new Image();
img_light['round']['3'].src = light_round_green;
img_light['round']['8'] = img_light[11]['3'];

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
/**
 * 
 * @param {* dom} selector canvas
 */
APP.prototype.init = function (selector) {
  selector.style.background = CC;

  this.canvas = selector;
  this.ctx = selector.getContext('2d')

  this.ctx.translate(selector.width / 2, selector.height / 2);
  this.engine();
}
APP.prototype.draw = function () {
  let ctx = this.ctx;
  let canvas = this.canvas;
  let CW = canvas.width;
  let CH = canvas.height;
  let CX = CW / 2;
  let CY = CH / 2;

  let CROSSINGDATA = this.CROSSINGDATA;
  let LIGHTDATA = this.LIGHTDATA;

  canvas.height = CH;
  ctx.translate(CX, CY);

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
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = YW;
    ctx.strokeStyle = YC;
    // 1
    ctx.moveTo(-4, o1);
    ctx.lineTo(-4, -CY);
    ctx.moveTo(4, o1);
    ctx.lineTo(4, -CY);
    ctx.closePath();
    // 3
    ctx.moveTo(o3, -4);
    ctx.lineTo(CX, -4);
    ctx.moveTo(o3, 4);
    ctx.lineTo(CX, 4);
    // 5
    ctx.moveTo(-4, o5);
    ctx.lineTo(-4, CY);
    ctx.moveTo(4, o5);
    ctx.lineTo(4, CY);
    // 7
    ctx.moveTo(o7, -4);
    ctx.lineTo(-CX, -4);
    ctx.moveTo(o7, 4);
    ctx.lineTo(-CX, 4);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };
  // 绘制行车道
  const drawLane = () => {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = LC;

    let yw = YW * 1.5;
    // 1
    for (let i = 1; i < n1; i++) {
      ctx.moveTo(-LW * i - yw, -CY);
      ctx.lineTo(-LW * i - yw, o1 - 4);
    }
    ctx.moveTo(o7 + corner, o1 - 4);
    ctx.lineTo(-yw, o1 - 4);
    // 3
    for (let i = 1; i < n3; i++) {
      ctx.moveTo(o3 + 4, -LW * i - yw);
      ctx.lineTo(CX, -LW * i - yw);
    }
    ctx.moveTo(o3 + 4, o1 + corner);
    ctx.lineTo(o3 + 4, -yw);
    // 5
    for (let i = 1; i < n5; i++) {
      ctx.moveTo(LW * i + yw, CY);
      ctx.lineTo(LW * i + yw, o5 + 4);
    }
    ctx.moveTo(o3 - corner, o5 + 4);
    ctx.lineTo(yw, o5 + 4);
    // 7
    for (let i = 1; i < n7; i++) {
      ctx.moveTo(o7 - 4, LW * i + yw);
      ctx.lineTo(-CX, LW * i + yw);
    }
    ctx.moveTo(o7 - 4, o5 - corner);
    ctx.lineTo(o7 - 4, yw);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
  // 绘制虚线行车道
  const drawDashLane = () => {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = LC;
    ctx.setLineDash([10]);

    let yw = YW * 1.5;
    // 1
    for (let i = 1; i < n1; i++) {
      ctx.moveTo(-LW * i - yw, o5);
      ctx.lineTo(-LW * i - yw, CY);
    }
    // 3
    for (let i = 1; i < n3; i++) {
      ctx.moveTo(o7, -LW * i - yw);
      ctx.lineTo(-CX, -LW * i - yw);
    }
    // 5
    for (let i = 1; i < n5; i++) {
      ctx.moveTo(LW * i + yw, o1);
      ctx.lineTo(LW * i + yw, -CY);
    }
    // 7
    for (let i = 1; i < n7; i++) {
      ctx.moveTo(o3, LW * i + yw);
      ctx.lineTo(CX, LW * i + yw);
    }

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
  // 绘制车道类型
  const drawLaneTarget = () => {
    let draw = (x, y, p, t) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 180 * p);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(img_lane[t], 0, 0);
      ctx.restore();
    };
    let yw = YW * 1.5;
    // 1
    for (let i = 0; i < n1; i++) {
      let x = -yw - LW * i;
      let y = o1 - 4;
      draw(x, y, 180, target1[i]);
    }
    // 3
    for (let i = 0; i < n3; i++) {
      draw(o3 + 4, -yw - LW * i, 270, target3[i]);
    }
    // 5
    for (let i = 0; i < n5; i++) {
      draw(yw + LW * i, o5 + 4, 0, target5[i]);
    }
    // 7
    for (let i = 0; i < n7; i++) {
      draw(o7 - 4, yw + LW * i, 90, target7[i]);
    }
  };
  // 绘制人行道
  const drawRoadWay = () => {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = RW;
    ctx.strokeStyle = RC;
    ctx.setLineDash([4]);

    let rw = RW / 2;
    // 1
    ctx.moveTo(o7 + corner, o1 + rw);
    ctx.lineTo(o3 - corner, o1 + rw);
    // 3
    ctx.moveTo(o3 - rw, o1 + corner);
    ctx.lineTo(o3 - rw, o5 - corner);
    // 5
    ctx.moveTo(o7 + corner, o5 - rw);
    ctx.lineTo(o3 - corner, o5 - rw);
    // 7
    ctx.moveTo(o7 + rw, o1 + corner);
    ctx.lineTo(o7 + rw, o5 - corner);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
  // 绘制围栏
  const drawWrapper = () => {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = RC;
    ctx.lineWidth = 4;

    let lw = LW + 2;
    let rw = RW;
    // 1
    ctx.moveTo(-lw * n1, -CY);
    ctx.lineTo(-lw * n1, o1 + rw);
    ctx.moveTo(lw * n5, -CY);
    ctx.lineTo(lw * n5, o1 + rw);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(o3 - rw + 2, o1 + rw - 2, rw * 2, Math.PI * 0.5, Math.PI); //右上
    // 3
    ctx.moveTo(o3 - rw, -lw * n3);
    ctx.lineTo(CX, -lw * n3);
    ctx.moveTo(o3 - rw, lw * n7);
    ctx.lineTo(CX, lw * n7);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(o7 + rw - 2, o5 - rw + 2, rw * 2, Math.PI * 1.5, 0); //左下
    // 5
    ctx.moveTo(lw * n5, o5 - rw);
    ctx.lineTo(lw * n5, CY);
    ctx.moveTo(-lw * n1, o5 - rw);
    ctx.lineTo(-lw * n1, CY);
    ctx.stroke();
    ctx.closePath();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(o3 - rw + 2, o5 - rw + 2, rw * 2, Math.PI, Math.PI * 1.5); //右下
    // 7
    ctx.moveTo(o7 + rw, lw * n7);
    ctx.lineTo(-CX, lw * n7);
    ctx.moveTo(o7 + rw, -lw * n3);
    ctx.lineTo(-CX, -lw * n3);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(o7 + rw - 2, o1 + rw - 2, rw * 2, 0, Math.PI * 2 / 4); //左上

    ctx.stroke();
    ctx.restore();
  };
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

    let draw = (x, y, r, item) => {
      let img = img_light["round"]["default"];
      let w = img.width;
      let h = img.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 180 * r);
      let str = "ABCDEFGHIJKLMNOPQ";
      let index = str.indexOf(item.title);
      let color = "default";

      if (this.PHASEDATA) {
        color = this.PHASEDATA[index];
        if ("123678".indexOf(color) === -1) {
          color = "default";
        } else if (color === "6" || color === "7" || color === "8") {
          console.log('倒计时');
          setTimeout(() => {
            ctx.globalAlpha = 0.1
          }, 300)
          setTimeout(() => {
            ctx.globalAlpha = 1
          }, 600)
        }
      }

      ctx.drawImage(
        img_light[
        item.lightorder === "0"
          ? item.lightsharp === "1" ? item.target : "round"
          : "11"
        ][color],
        -w / 2,
        -h / 2
      );
      if (this.isPointInsideCircle(x, y, 15)) {
        if (this.onClick) {
          this.onClick(item);
        }
        this._x = "";
        this._y = ""
      }

      ctx.globalAlpha = 0.3;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    };
    const drawTitle = (x, y, title) => {
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.font = "30px Verdana";
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#836249";
      ctx.fillText(title, x - ctx.measureText(title).width / 2, y);
      ctx.restore();
    };

    let yw = YW * 1.5;
    let lw = LW;
    // 1 - db(1)
    let draw_1 = () => {
      for (let i = 0; i < d1.car.length; i++) {
        let x = -yw - lw * (i + n1 - d1.car.length) - lw / 2;
        let y = o5 + lw / 2 + 4;
        let item = d1.car[i];
        draw(x, y, 180, item);
        drawTitle(x, y + lw, item.title);
      }
      let x = o7 + lw / 2;
      let y1 = o5 + lw / 2 - corner;
      let y2 = o1 - lw / 2 + corner;
      let item = d1.man["0"];
      draw(x, y1, 180, item);
      drawTitle(x, y1 + lw, item.title);
      draw(x, y2, 0, item);
      drawTitle(x, y2 - lw, item.title);
    };
    // 5 - db(3)
    let draw_5 = () => {
      for (let i = 0; i < d1.car.length; i++) {
        let x = yw + lw * (i + n1 - d3.car.length) + lw / 2;
        let y = o1 - lw / 2 - 4;
        let item = d3.car[i];
        draw(x, y, 0, item);
        drawTitle(x, y - lw, item.title);
      }
      let x = o3 - lw / 2;
      let y1 = o1 - lw / 2 + corner;
      let y2 = o5 + lw / 2 - corner;
      let item = d3.man["0"];
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
  const drawCountTime = () => {
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.font = "30px Verdana";
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#836249";
    ctx.fillText(
      this.COUNT,
      -ctx.measureText(this.COUNT).width / 2,
      0
    );
    ctx.restore();
  };


  // 基本视图
  const baseView = () => {
    drawYellow();
    drawLane();
    drawDashLane()
    drawRoadWay();
    drawWrapper();
    drawLaneTarget();
    if (this.COUNT !== undefined) {
      drawCountTime();
    }
    if (LIGHTDATA.length) {
      drawLight();
    }
  };
  baseView();

}
APP.prototype.isPointInsideCircle = function (x, y, r) {
  // 点到圆心的距离小于半经
  if (r === 0) return false;
  if (!this._x || !this._y) return false;
  return Math.sqrt(Math.pow(this._x - x, 2) + Math.pow(this._y - y, 2)) < r;
}
APP.prototype.engine = function () {
  let canvas = this.canvas;
  let self = this;
  canvas.addEventListener("click", function (event) {
    let e = event || window.event;
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    self._x = x - canvas.width / 2;
    self._y = y - canvas.height / 2;
    self.draw();
  }, false);
}

export default APP;