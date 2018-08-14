<template>
  <div class="crossing-setting">
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/region' }">区域管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region/'+id1 }">{{name1}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{name2}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="float:right;">
            <el-button type="primary" icon="el-icon-plus" :style="{marginRight: '10px'}" @click="handleCreate">
              新增
            </el-button>
            <el-input suffix-icon="el-icon-search" placeholder="请输入名称进行检索" style="width: 200px" readonly></el-input>
          </div>
        </div>
      </el-header>
      <el-main class="container">
        <!--  <el-card shadow="never">
          <el-table :data="tableData" v-loading="loading" :show-header="false" style="width: 100%">
            <el-table-column prop="image" label="image" width="180">
              <template slot-scope="scope">
                <img :src="baseUrl+'uploads/'+scope.row.image" :onerror="imageLoadError" alt="" style="width: 100%; display:block">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="name">
              <template slot-scope="scope">
                <h3>{{scope.row.name}}</h3>
              </template>
            </el-table-column>
            <el-table-column prop="latlng" label="latlng">
              <template slot-scope="scope">
                <span>{{formatterLatLng(scope.row.lat)}}</span>
                <span> , </span>
                <span>{{formatterLatLng(scope.row.lng)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card> -->
        <water-fall :imgsArr="tableData" @uploadSuccess="uploadSuccess" @deleteSuccess="deleteSuccess"></water-fall>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import waterFall from "./components/water-fall";
const ROAD_DATA = [
  { direction: 1, roadnum: 3, target: [3, 2, 4] },
  { direction: 3, roadnum: 3, target: [3, 2, 4] },
  { direction: 5, roadnum: 3, target: [3, 2, 4] },
  { direction: 7, roadnum: 3, target: [3, 2, 4] }
];
export default {
  components: {
    waterFall
  },
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      name1: "",
      name2: "",
      loading: true,
      tableData: [], //路口数据
      imageLoadError: "this.src='" + require("@/assets/crossing.jpg") + "'",
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "../web/public/"
          : "http://192.168.1.14/SignalControl/web/public/",
      uploadAction: this.ajaxURL + "index/d_upload/imageUpload"
    };
  },
  methods: {
    // 请求数据
    getDataList() {
      this.loading = true;
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
            if (item.id == this.id2) {
              this.tableData = item.children || [];
              this.name2 = item.name;
            }
          });
        }
      });
      this.loading = false;
    },
    // 转换经纬度格式 度°分`秒`
    formatterLatLng(latlng) {
      if (!latlng) {
        return "";
      } else {
        let ddd = Math.floor(latlng);
        let dec = (latlng - ddd) * 60;
        let mmm = Math.floor(dec);
        let dec2 = (dec - mmm) * 60;
        let sss = Math.floor(dec2);
        return `${ddd}°${mmm}"${sss}"`;
      }
    },
    uploadSuccess() {
      this.getDataList();
    },
    deleteSuccess() {
      this.getDataList();
    },
    handleCreate() {}
  },
  created() {
    if (this.crossingData.length) {
      this.formatterData(this.crossingData);
    } else {
      this.getDataList();
    }
  },
  computed: {
    crossingData() {
      return this.$store.state.crossingData;
    },
    latLng() {
      return this.$store.state.latLng;
    }
  },
  watch: {
    crossingData(data) {
      this.formatterData(data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
