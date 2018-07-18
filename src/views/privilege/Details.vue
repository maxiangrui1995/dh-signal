<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/privilege' }">特勤联动</el-breadcrumb-item>
            <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
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
        <el-card shadow="never">
          <el-table :data="tableData" v-loading="loading" :show-header="false" style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="">
              <template slot-scope="scope">
                <b>{{scope.row.name}}</b><br>
                <span>{{scope.row.ip}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dir" label="">
              <template slot-scope="scope">
                <span>检测方向</span><br>
                <span>由{{position[scope.row.dir_from]}}</span>
                <span>向{{position[scope.row.dir_to]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="distance" label="">
              <template slot-scope="scope">
                <span>触发范围</span><br>
                <span>{{scope.row.distance}}米</span>
              </template>
            </el-table-column>
            <el-table-column prop="delay" label="延时(s)">
              <template slot-scope="scope">
                <span>延时关闭</span><br>
                <span>{{scope.row.delay}}秒</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                <div class="el-divider"></div>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" :close="dialogClose" :show-close="false">
      <el-form :model="formData" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="路口" prop="crossing_id">
          <el-cascader :options="crossingData" v-model="formData.crossing_id" :style="{ width: '100%' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="等待位置" prop="dir_from">
          <el-select v-model="formData.dir_from" placeholder="请选择" :style="{ width: '100%' }">
            <el-option v-for="(value,key) in position" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标位置" prop="dir_to">
          <el-select v-model="formData.dir_to" placeholder="请选择" :style="{ width: '100%' }">
            <el-option v-for="(value,key) in position" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测范围" prop="distance">
          <el-input-number v-model.number="formData.distance" :min="0" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
        <el-form-item label="延时关闭" prop="delay">
          <el-input-number v-model.number="formData.delay" :min="0" :max="120" :style="{ width: '100%' }"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleFormCancel">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit" :loading="dialogLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      name: "",
      pagePage: 1,
      pageRows: 20,
      loading: true,
      allData: [],
      tableData: [],
      crossingData: [],
      position: {
        //方向说明
        "1": "南",
        "2": "东",
        "3": "北",
        "4": "西"
      },
      dialogVisible: false,
      dialogTitle: "",
      dialogLoading: false,
      formData: {},
      rules: {
        crossing_id: [
          {
            type: "array",
            min: 3,
            required: true,
            message: "请选择路口"
          }
        ]
      }
    };
  },
  methods: {
    // 请求数据
    getDataList() {
      this.loading = true;
      this.$http("index/d_secret_service_plan/singleList", {
        sch_id: this.id
      }).then(res => {
        if (res.status === "1") {
          this.allData = res.data;
          this.tableData = res.data.children;
          let data = [];
          res.data.children.forEach(item => {
            data[item.serial - 1] = item;
          });
          this.tableData = data;
          this.name = res.data.sch_name;
        }
        this.loading = false;
      });
    },
    getCrossing() {
      this.$http("index/d_area/treeList").then(res => {
        let data = res.data;
        if (res.status === "1") {
          this.crossingData = data;
        }
      });
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "特勤路口新增";
      this.formData = {
        crossing_id: [],
        dir_from: "2",
        dir_to: "4",
        distance: 500,
        delay: 120,
        TYPE: "create"
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
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

            let data = [];
            let sch_id = this.allData.sch_id;
            let sch_name = this.allData.sch_name;
            let boundPlate = this.allData.boundPlate;
            let index = 1;
            this.allData.children.forEach(item => {
              if (item.serial !== row.serial) {
                data.push(
                  `(${sch_id},'${sch_name},'${boundPlate}',${index++},${
                    item.id
                  },${item.dir_from},${item.dir_to},${item.distance},${
                    item.delay
                  })`
                );
              }
            });
            // ajax
            this.$http("index/d_secret_service_plan/planEdit", {
              data: data.join(",")
            }).then(res => {
              if (res.data.status) {
                this.getDataList();
              }
              this.$message({
                type: res.data.status ? "success" : "error",
                message: res.data.message
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
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "特勤路口编辑";
      let crossing_id = [];
      this.crossingData.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            if (item2.children) {
              item2.children.forEach(item3 => {
                if (item3.id == row.crossing_id) {
                  crossing_id = [item1.id, item2.id, item3.id];
                }
              });
            }
          });
        }
      });
      this.formData = Object.assign({}, row, { crossing_id: crossing_id });
    },
    handleFormCancel() {
      this.dialogVisible = false;
    },
    handleFormSubmit() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        console.log(this.formData);
        let formData = this.formData;
        let allData = Object.assign({}, this.allData);
        let data = [];
        let sch_id = allData.sch_id;
        let sch_name = allData.sch_name;
        let boundPlate = allData.boundPlate;
        allData.children.forEach(item => {
          if (item.serial == formData.serial) {
            item = Object.assign(item, formData);
          }
          data[item.serial - 1] = `(${sch_id},'${sch_name},'${boundPlate}',${
            item.serial
          },${item.id},${item.dir_from},${item.dir_to},${item.distance},${
            item.delay
          })`;
        });

        if (formData.TYPE === "create") {
        } else {
        }
        console.log(data);
        // "(1212,'121萨达·1','苏A12332',1,78,2,4,500,120),(1212,'121萨达·1','苏A12332',2,116,2,4,500,120),(1212,'121萨达·1','苏A12332',3,117,2,4,500,120)"

        this.$http("index/d_secret_service_plan/planEdit", {
          data: data.join(",")
        }).then(res => {
          if (res.data.status) {
            this.getDataList();
          }
          this.$message({
            type: res.data.status ? "success" : "error",
            message: res.data.message
          });
        });
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
    }
  },
  created() {
    this.getCrossing();
    this.getDataList();
  }
};
</script>

<style>
</style>
