<template>
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
          <!-- <el-input suffix-icon="el-icon-search" placeholder="请输入名称进行检索" style="width: 200px" readonly></el-input> -->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="content-card-wrapper">
        <Wrapper>
          <el-table :data="tableData" v-loading="loading" style="width: 100%">
            <el-table-column prop="image" label="" width="160">
              <template slot-scope="scope">
                <img :src="crossingImageUrl + scope.row.image" :onerror="imageLoadError" alt="" style="width: 60px; display:block; cursor: pointer;">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="路口名称">
            </el-table-column>
            <el-table-column prop="lat" label="纬度">
            </el-table-column>
            <el-table-column prop="lng" label="经度">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleBindDevs(scope.row)">设备</el-button>
              </template>
            </el-table-column>
          </el-table>
        </Wrapper>
      </div>
    </el-main>
    <!-- 弹窗编辑新增 -->
    <el-dialog :title="{'create':'路口新增', 'update':'路口编辑'}[handleStatus]" :visible.sync="dialogVisible" width="500px" :before-close="handleDialogClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="路口名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.lng"></el-input>
        </el-form-item>
        <el-form-item label="路口图片">
          <img :src="crossingImageUrl + form.image" :onerror="imageLoadError" alt="" style="width: 160px; display:block;">
        </el-form-item>
        <el-form-item label="">
          <el-upload :action="uploadAction" name="image" :show-file-list="false" :on-progress="uploadProgress" :on-success="uploadSuccess" :on-error="uploadError" :style="{ display: 'inline-block', marginRight: '10px' }">
            <el-button>
              <i class="el-icon-upload"></i>上传图片</el-button>
          </el-upload>
          <el-button @click="handleViewMap">
            <i class="el-icon-location"></i>地图取点</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗地图取点 -->
    <el-dialog title="地图取点" :visible.sync="mapDialogVisible" width="900px">
      <div style="position: relative; width: 100%; height: 600px;">
        <GMap/>
        <div style="position:absolute;right:20px;top:20px;">
          <el-card :body-style="{ padding: '10px' }" :style="{width:'360px'}" class="map-card">
            <div class="pos-wrapper">
              <div class="pos-wrapper-inner">
                <div>拖动路口图标进行定位</div>
                <div class="num">
                  <span>{{form_.lat}},{{form_.lng}}</span>
                </div>
              </div>
              <div class="pos-wrapper-inner">
                <el-button type="text" @click="handleSubmitCrossingLatlng" :style="{padding: '0'}">保存</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import GMap from "@/components/Map";
const ROAD_DATA = [
  { direction: 1, roadnum: 3, target: [3, 2, 4] },
  { direction: 3, roadnum: 3, target: [3, 2, 4] },
  { direction: 5, roadnum: 3, target: [3, 2, 4] },
  { direction: 7, roadnum: 3, target: [3, 2, 4] }
];
export default {
  components: { GMap },
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      name1: "",
      name2: "",
      loading: true,
      tableData: [], //路口数据
      imageLoadError: "this.src='" + require("@/assets/crossing.jpg") + "'", // 加载失败的图片
      uploadAction: this.ajaxURL + "index/d_upload/imageUpload", //上传的地址
      handleStatus: "", // 编辑/新增
      dialogVisible: false, // 弹窗开关
      form: {},
      form_: {},
      mapDialogVisible: false //地图取点弹窗
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
    // 新增
    handleCreate() {
      this.handleStatus = "create";
      this.dialogVisible = true;
      this.form = { name: "", lat: "", lng: "", image: "" };
    },
    // 编辑
    handleUpdate(row) {
      this.handleStatus = "update";
      this.dialogVisible = true;
      this.form = Object.assign({}, row);
    },
    // 删除
    handleDelete(row) {
      this.$msgbox({
        title: "提示",
        message: "此操作将永久删除该文件, 是否继续?",
        showCancelButton: true,
        type: "warning",
        confirmButtonText: "删除",
        cancelButtonText: "放弃",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "删除中...";
            // ajax
            this.$http("index/d_crossing/dataDelete", {
              id: row.id
            }).then(res => {
              if (res.status) {
                this.getDataList();
              }
              this.$message({
                type: res.status ? "success" : "error",
                message: res.message
              });
              done();
              instance.confirmButtonLoading = false;
            });
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
        }
      })
        .then(action => {})
        .catch(action => {});
    },
    // 绑定设备
    handleBindDevs(row) {
      this.$router.replace({
        path: "/region/" + this.id1 + "/" + this.id2 + "/" + row.id + "/dev"
      });
    },
    // 查看地图
    handleViewMap(row) {
      this.mapDialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      if (response.status) {
        // 得到返回值
        let img = response.data.save_name;
        this.form.image = img;
      } else {
        this.$message.error(response.message);
      }
    },
    uploadError(err, file, fileList) {
      this.$message.error("上传失败");
    },
    uploadProgress(event, file, fileList) {
      // console.log(event, file, fileList);
    },
    handleDialogClose(done) {
      this.$refs["form"].resetFields();
      done();
    },
    onSubmit() {
      console.log(this.form);
      let url = "";
      let data = {};
      if (this.handleStatus == "create") {
        url = "index/d_crossing/dataAdd";
        data = {
          name: this.form.name,
          lat: this.form.lat,
          lng: this.form.lng,
          area_id: this.id2,
          image: this.form.image,
          direction: "1357",
          road_data: ROAD_DATA
        };
      } else {
        url = "index/d_crossing/dataUpdate";
        data = {
          id: this.form.id,
          name: this.form.name,
          lat: this.form.lat,
          lng: this.form.lng,
          image: this.form.image,
          area_id: this.form.area_id,
          direction: this.form.direction,
          road_data: ROAD_DATA
        };
      }

      this.$http(url, data).then(res => {
        if (res.status) {
          this.getDataList();
          this.dialogVisible = false;
        }
        this.$message({
          type: res.status ? "success" : "error",
          message: res.message
        });
      });
    },
    drawMarker() {
      let self = this;
      if (!this.form.lat && !this.form.lng) {
        this.form_ = { lat: this.latLng.lat, lng: this.latLng.lng };
      } else {
        this.form_ = { lat: this.form.lat, lng: this.form.lng };
      }

      let p = new google.maps.LatLng(this.form_.lat, this.form_.lng);
      let marker = (this.marker = new google.maps.Marker({
        position: p,
        icon: require("@/assets/marker_default.png"),
        map: this.gmap,
        draggable: true
      }));
      this.gmap.panTo(p);

      // 添加拖动事件监听器
      google.maps.event.addListener(marker, "drag", function() {
        let p = marker.getPosition();
        self.form_.lat = p.d;
        self.form_.lng = p.e;
      });
    },
    handleSubmitCrossingLatlng() {
      this.form = Object.assign(this.form, this.form_);
      this.mapDialogVisible = false;
    }
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
    },
    crossingImageUrl() {
      return this.$store.state.crossingImageUrl;
    },
    gmap() {
      return this.$store.state.gmap;
    }
  },
  watch: {
    crossingData(data) {
      this.formatterData(data);
    },
    gmap() {
      if (this.mapDialogVisible) {
        this.drawMarker();
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
.pos-wrapper {
  width: 340px;
  &-inner {
    display: inline-block;
    vertical-align: middle;
    .num {
      font-size: 12px;
      color: #606266;
      margin-top: 6px;
    }
  }
  &-inner:nth-child(1) {
    width: 279px;
    border-right: 1px solid #dfe1e6;
    overflow: hidden;
  }
  &-inner:nth-child(2) {
    width: 60px;
    text-align: center;
  }
}
</style>
