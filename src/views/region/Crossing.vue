<template>
  <div>
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
          <el-col :xs="24" :sm="12" :md="6" :lg="4" v-for="item in tableData" :key="item.id" :style="{'margin-bottom':'10px'}">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="image-list">
                <img src="../../assets/1.jpg" alt="" style="width:100%;display:block">
                <div class="image-list-cover">
                  <div class="image-list-cover-wrapper">
                    <el-tooltip class="button" content="重新上传图片">
                      <el-button type="text">
                        <i class="el-icon-upload"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="button" content="查看大图">
                      <el-button type="text">
                        <i class="el-icon-view"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div style="padding: 14px;">
                <div class="bottom clearfix" style="margin-top: 0;">
                  <span>{{ item.name }}</span>
                  <el-tooltip :style="{padding: '0', marginLeft: '10px'}" content="编辑">
                    <el-button type="text">
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="button" content="绑定设备">
                    <el-button type="text" @click="handleBindDevs(item)">
                      <i class="fa fa-window-restore"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <div class="bottom clearfix">
                  <span class="time">{{ crossingType[item.direction] }}</span>
                  <el-tooltip :style="{padding: '0', marginLeft: '10px'}" content="编辑">
                    <el-button type="text">
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </el-tooltip>
                </div>
                <div class="bottom clearfix">
                  <span class="time">{{formatterLatLng(item.lat)}} , {{formatterLatLng(item.lng)}}</span>
                  <el-tooltip class="button" content="地图">
                    <el-button type="text" @click="handleViewInMap(item)">
                      <i class="el-icon-location"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
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
      }
    };
  },
  methods: {
    // 请求数据
    fetchData() {
      if (this.crossingData.length) {
        this.formatterData(this.crossingData);
      } else {
        this.$http("index/d_area/treeList").then(res => {
          let data = res.data;
          if (res.status === "1") {
            this.$store.dispatch("SETCROSSING", data);
          }
        });
      }
    },
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1 && item.children) {
          this.name1 = item.name;
          item.children.forEach(item => {
            if (item.id == this.id2 && item.children) {
              this.tableData = item.children;
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
    handleCreate() {},
    handleDetails(row) {
      console.log(row);
    },
    handleViewInMap(row) {
      this.$router.push({
        path: "/region/" + this.id1 + "/" + this.id2 + "/" + row.id + "/map"
      });
    },
    handleBindDevs(row) {
      this.$router.push({
        path: "/region/" + this.id1 + "/" + this.id2 + "/" + row.id + "/dev"
      });
    },
    handleDelete(row) {
      console.log(row);
    }
  },
  created() {
    this.fetchData();
  },
  computed: {
    crossingData() {
      return this.$store.state.crossingData;
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
.time {
  font-size: 13px;
  color: #999;
}

.button {
  padding: 0;
  float: right;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.image-list {
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
