/**
 *  canvas绘制信号机
 * 
 */

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
/**
 * 
 * @param {* dom} selector canvas
 */
APP.prototype.init = function (selector) {
  selector.style.background = CC;

  this.canvas = selector;
  this.ctx = selector.getContext('2d')

  this.ctx.translate(selector.width / 2, selector.height / 2);
}
APP.prototype.draw = function () {
  let ctx = this.ctx;
  let canvas = this.canvas;
  let CW = canvas.width;
  let CH = canvas.height;
  let CX = CW / 2;
  let CY = CH / 2;

  let CROSSINGDATA = this.CROSSINGDATA;

  if (!CROSSINGDATA.length) {
    return console.error('没有路口信息');
  }
  console.log(CROSSINGDATA);

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
    console.log(o1, CH);

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
  drawYellow();
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
  drawLane();
}


export default APP;