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
            <el-input suffix-icon="el-icon-search" placeholder="请输入名称进行检索" style="width: 200px"></el-input>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <div class="el-table__empty-block" v-if="tableData.length===0">
            <span class="el-table__empty-text">暂无数据</span>
          </div>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in tableData" :key="item.id" :style="{'margin-bottom':'10px'}">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="box-image">
                <img :src="require('@/assets/crossing.jpg')" alt="" style="width:100%;display:block">
                <div class="box-image-cover">
                  <div class="box-image-cover-wrapper">
                   <!--  <el-tooltip class="button" content="重新上传图片">
                      <el-button type="text">
                        <i class="el-icon-upload"></i>
                      </el-button>
                    </el-tooltip> -->
                    <!--  <el-tooltip class="button" content="查看大图">
                      <el-button type="text" @click="handleViewImage(item)">
                        <i class="el-icon-view"></i>
                      </el-button>
                    </el-tooltip> -->
                  </div>
                </div>
              </div>
              <div class="box-content">
                <div class="box-content-inner">
                  <span>{{ item.name }}</span>
                  <el-tooltip class="button" content="编辑">
                    <el-button type="text" @click="handleUpdateName(item)">
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <!--  <div class="box-content-inner">
                  <span class="item">{{ crossingType[item.direction] }}</span>
                  <el-tooltip class="button" content="编辑">
                    <el-button type="text">
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </el-tooltip>
                </div> -->
                <div class="box-content-inner">
                  <span class="item">{{formatterLatLng(item.lat)}} , {{formatterLatLng(item.lng)}}</span>
                  <el-tooltip class="button" content="取点">
                    <el-button type="text" @click="handleViewInMap(item)">
                      <i class="el-icon-location"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <div class="box-content-inner">
                  <el-button type="text" @click="handleBindDevs(item)" :style="{padding: '0'}">绑定设备</el-button>
                  <div class="el-divider"></div>
                  <el-button type="text" @click="handleDelete(item)" :style="{padding: '0'}">删除路口</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog title="路口图片" :visible.sync="dialogCrossingVisible" width="40%">
      <div>
        <img :src="crossingImage" alt="" style="width: 100%; display: block;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      name1: "",
      name2: "",
      loading: true,
      tableData: [],
      crossingType: {
        "1357": "普通十字路口"
      },
      dialogCrossingVisible: false,
      crossingImage: ""
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
    handleCreate() {
      this.$prompt("输入名称后将新增一条默认路口", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          if (!value) {
            return false;
          } else if (value.replace(/(^\s*)|(\s*$)/g, "")) {
            return true;
          } else {
            return false;
          }
        },
        inputErrorMessage: "请填写名称",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "初始化中...";
            // ajax
            this.$http("index/d_crossing/dataAdd", {
              name: instance.inputValue,
              lat: this.latLng.lat,
              lng: this.latLng.lng,
              area_id: this.id2,
              direction: "1357",
              road_data: [
                { direction: 1, roadnum: 3, target: [3, 2, 4] },
                { direction: 3, roadnum: 3, target: [3, 2, 4] },
                { direction: 5, roadnum: 3, target: [3, 2, 4] },
                { direction: 7, roadnum: 3, target: [3, 2, 4] }
              ]
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
        .then(() => {})
        .catch(() => {});
    },
    handleViewImage(row) {
      this.dialogCrossingVisible = true;
      this.crossingImage = require("@/assets/crossing.jpg");
    },
    handleUpdateName(row) {
      this.$prompt("重新输入名称替换当前路口名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.name,
        inputValidator: value => {
          if (!value) {
            return false;
          } else if (value.replace(/(^\s*)|(\s*$)/g, "")) {
            return true;
          } else {
            return false;
          }
        },
        inputErrorMessage: "请填写名称",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "修改中...";
            // ajax
            this.$http("index/d_crossing/dataUpdate", {
              id: row.id,
              name: instance.inputValue,
              lat: row.lat,
              lng: row.lng,
              area_id: row.area_id,
              direction: row.direction,
              road_data: row.road_data
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
        .then(() => {})
        .catch(() => {});
    },
    handleViewInMap(row) {
      this.$router.push({
        path: "/region/" + this.id1 + "/" + this.id2 + "/" + row.id + "/map"
      });
    },
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
    handleBindDevs(row) {
      this.$router.push({
        path: "/region/" + this.id1 + "/" + this.id2 + "/" + row.id + "/dev"
      });
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
.box-content {
  padding: 6px 14px;
  &-inner {
    height: 30px;
    line-height: 30px;
    &:before,
    &:after {
      display: table;
      content: "";
    }
    &:after {
      clear: both;
    }
    .item {
      font-size: 0.88em;
      color: #999;
    }
    .button {
      padding: 0;
      float: right;
      position: relative;
      top: 8px;
    }
  }
}

.box-image {
  position: relative;
  &-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    i {
      color: #fff;
      font-size: 24px;
      margin: 0 10px;
      cursor: pointer;
    }
    i:hover {
      color: #2d8cf0;
    }
  }
  &-cover-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:hover &-cover {
    display: block;
  }
}
</style>
