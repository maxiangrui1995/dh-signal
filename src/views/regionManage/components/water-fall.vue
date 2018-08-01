<template>
  <div>
    <waterfall align="center" :line-gap="300" :min-line-gap="150" :max-line-gap="340" :single-max-width="300" :watch="imgsArr" ref="waterfall">
      <waterfall-slot v-for="(item, index) in imgsArr" :width="imgWidth(item.image_width)" :height="imgHeight(item.image_high)" :order="index" :key="index" move-class="item-move">
        <div class="item" :index="index">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <div class="box-image">
              <img :src="baseUrl+'uploads/'+item.image" :onerror="imageLoadError" alt="" style="width:100%; display:block">
              <div class="box-image-title">{{item.name}}</div>
              <div class="box-image-cover">
                <div class="box-image-cover-wrapper">
                  <el-tooltip class="button" content="重新上传图片">
                    <el-upload :action="uploadAction" name="image" :show-file-list="false" :on-progress="uploadProgress" :on-success="uploadSuccess" :on-error="uploadError">
                      <el-button type="text" @click="handleUpdate(item)">
                        <i class="el-icon-upload"></i>
                      </el-button>
                    </el-upload>
                  </el-tooltip>
                  <el-tooltip class="button" content="添加设备">
                    <el-button type="text" @click="handleBindDev(item)">
                      <i class="fa fa-chain"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="button" content="编辑路口">
                    <el-button type="text" @click="handleModify(item)">
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="button" content="删除路口">
                    <el-button type="text" @click="handleDelete(item)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </waterfall-slot>
    </waterfall>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="500">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="路口名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.lng"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Waterfall from "vue-waterfall/lib/waterfall";
import WaterfallSlot from "vue-waterfall/lib/waterfall-slot";
export default {
  components: {
    Waterfall,
    WaterfallSlot
  },
  props: {
    imgsArr: Array
  },
  data() {
    return {
      imageLoadError: "this.src='" + require("@/assets/crossing.jpg") + "'",
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "../web/public/"
          : "http://192.168.1.14/SignalControl/web/public/",
      uploadAction: this.ajaxURL + "index/d_upload/imageUpload",
      imageChecked: null,
      dialogVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      imgsArr_my: [
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/01.jpg",
          width: 210,
          height: 285
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/02.jpg",
          width: 210,
          height: 164
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/03.jpg",
          width: 210,
          height: 287
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/04.jpg",
          width: 210,
          height: 323
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/05.jpg",
          width: 210,
          height: 285
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/06.jpg",
          width: 210,
          height: 315
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/07.jpg",
          width: 210,
          height: 282
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/01.jpg",
          width: 210,
          height: 285
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/02.jpg",
          width: 210,
          height: 164
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/03.jpg",
          width: 210,
          height: 287
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/04.jpg",
          width: 210,
          height: 323
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/05.jpg",
          width: 210,
          height: 285
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/06.jpg",
          width: 210,
          height: 315
        },
        {
          src:
            "http://www.17sucai.com/preview/1/2013-05-06/%E7%80%91%E5%B8%83%E6%B5%81/images/pic/07.jpg",
          width: 210,
          height: 282
        }
      ]
    };
  },
  methods: {
    imgWidth(value) {
      return value || 500;
    },
    imgHeight(value) {
      return value || 300;
    },
    handleUpdate(row) {
      this.imageChecked = row;
    },
    uploadSuccess(response, file, fileList) {
      let row = this.imageChecked;
      if (response.status) {
        let img = response.data.save_name;
        this.$http("index/d_crossing/dataUpdate", {
          id: row.id,
          name: row.name,
          lat: row.lat,
          lng: row.lng,
          area_id: row.area_id,
          direction: row.direction,
          road_data: row.road_data,
          image: img
        }).then(res => {
          if (res.status) {
            this.$emit("uploadSuccess", true);
          }
          this.$message({
            type: res.status ? "success" : "error",
            message: res.message
          });
        });
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
    handleBindDev(row) {},
    handleModify(row) {
      this.dialogVisible = true;
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
                this.$emit("deleteSuccess", true);
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
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.item-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.wf-transition {
  transition: opacity 0.3s ease;
}
.wf-enter {
  opacity: 0;
}
img {
  width: 100%;
  display: block;
}
.item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
}
.box-image {
  position: relative;
  &-title {
    position: absolute;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    text-align: center;
    color: #f1f1f1;
    height: 36px;
    line-height: 36px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
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
      font-size: 18px;
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
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    .button {
      display: inline-block;
    }
  }
  &:hover &-cover {
    display: block;
  }
}
</style>
