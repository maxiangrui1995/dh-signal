<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/comprehensiveQuery/'+id }">实时监控</el-breadcrumb-item>
            <el-breadcrumb-item>{{crossing.name || '路口'}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-tabs v-model="activeName">
            <el-tab-pane label="车流量视频" name="1">
              <div class="not-content" v-if="cameraObj['1'].length==0">暂无数据</div>
            </el-tab-pane>
            <el-tab-pane label="电子警察视频" name="2">
              <div class="not-content" v-if="cameraObj['2'].length==0">暂无数据</div>
              <div v-else v-for="item in cameraObj['2']" :key="item.id">
                <video id="video1" class="video-js vjs-default-skin" autoplay preload="auto">
                  <source src="rtmp://192.168.0.182:1935/live/1" type="rtmp/flv">
                </video>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
require("video.js/dist/video-js.css");
export default {
  data() {
    return {
      id: this.$route.params.id,
      activeName: "1",
      crossing: {},
      camera: {},
      cameraObj: { "1": [], "2": [] }
    };
  },
  methods: {
    // 获取路口信息
    getCrossing() {
      this.$http("index/d_crossing/dataView", {
        id: this.id
      }).then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossing = data.crossing || {};
          this.camera = data.camera || [];
          this.camera.forEach(item => {
            this.cameraObj[item.type].push(item);
          });
        }
      });
    }
  },
  created() {
    this.getCrossing();
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      videojs("video1", {}, function() {
        this.play();
      });
    });
  },
  beforeDestroy() {}
};
</script>

<style>
</style>
