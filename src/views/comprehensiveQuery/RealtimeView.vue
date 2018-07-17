<template>
	<div>
		<el-container>
			<el-header class="page-header">
				<div class="page-header-inner">
					<el-breadcrumb separator="/">
						<el-breadcrumb-item>综合查询</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</el-header>
			<el-main>
				<el-card shadow="never">
					<el-tabs v-model="activeName">
						<el-tab-pane :label="'信号机'+signalIP" name="1">

						</el-tab-pane>
						<el-tab-pane :label="'备用电源'+upsIp" name="2">
							<div ref="ups-chart-1" :style="{width: '800px', height: '600px'}"></div>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      signalIP: "(192.168.0.8)",
      upsIp: "(192.168.0.1)"
    };
  },
  mounted() {
    // this.drawLine();
    this.upsChart1();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表

      function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
          name: now.toString(),
          value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
            Math.round(value)
          ]
        };
      }

      var data = [];
      var now = +new Date(1997, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var value = Math.random() * 1000;
      for (var i = 0; i < 1000; i++) {
        data.push(randomData());
      }

      let option = {
        title: {
          text: "动态数据 + 时间坐标轴"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }
        ]
      };
      myChart.setOption(option);
      /* setInterval(function() {
        for (var i = 0; i < 5; i++) {
          data.shift();
          data.push(randomData());
        }

        myChart.setOption({
          series: [
            {
              data: data
            }
          ]
        });
      }, 1000); */
    },
    upsChart1() {
      let ele = this.$refs["ups-chart-1"];
      let myChart = this.$echarts.init(ele);

      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            "市输出电压",
            "市故障电压",
            "输出电压",
            "负载百分比",
            "输出频率",
            "直流电压",
            "机内温度"
          ]
        },
        xAxis: {
          type: "category",
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          show: false
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "市输出电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "市故障电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "输出电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "负载百分比",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "输出频率",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "直流电压",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          },
          {
            name: "机内温度",
            data: [220, 220, 220, 220, 221, 222, 223],
            type: "line"
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.ups-inner {
  width: 300px;
  height: 240px;
  display: inline-block;
  vertical-align: top;
}
</style>
