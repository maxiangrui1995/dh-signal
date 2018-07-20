<template>
  <div>
    <el-upload class="upload-demo" :action="uploadAction" name="image" :on-change="handleChange" :file-list="fileList3">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    {{baseUrl}}
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      baseUrl: axios.defaults.baseURL,
      uploadAction: axios.defaults.baseURL + "index/d_upload/imageUpload",
      fileList3: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList3 = fileList.slice(-3);
    }
  }
};
</script>