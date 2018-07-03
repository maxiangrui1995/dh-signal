<template>
  <div>
    <el-container>
      <el-header class="page-header">
        <div class="page-header-inner">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/region' }">区域管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region/'+id1 }">{{name1}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region/'+id1+'/'+id2 }">{{name2}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{name3}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>信号机</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text">新增</el-button>
              </div>
              <el-table :data="signalData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>备用电源</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text">新增</el-button>
              </div>
              <el-table :data="upsData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>相机</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text">新增</el-button>
              </div>
              <el-table :data="cameraData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column prop="type" label="type">
                  <template slot-scope="scope">
                    <div>{{ cameraType[scope.row.type] }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="username">
                </el-table-column>
                <el-table-column prop="password" label="password">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="12" :style="{marginBottom: '20px'}">
            <el-card shadow="never">
              <div slot="header">
                <span>车检服务器</span>
                <el-button :style="{float: 'right', padding: '8px 0'}" type="text">新增</el-button>
              </div>
              <el-table :data="ipcData" :show-header="false" style="width: 100%">
                <el-table-column prop="ip" label="ip">
                </el-table-column>
                <el-table-column prop="name" label="name">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <div class="el-divider"></div>
                    <el-popover placement="top" width="200" :ref="`popover-${scope.$index}`">
                      <p>
                        <i class="el-icon-question el-popover-box_status"></i>
                        <span>确定删除这条记录吗?</span>
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleDelete(scope.row),scope._self.$refs[`popover-${scope.$index}`].doClose()">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
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
      id3: this.$route.params.id3,
      name1: "",
      name2: "",
      name3: "",
      loading: true,
      signalData: [],
      upsData: [],
      ipcData: [],
      cameraData: [],
      cameraType: {
        "1": "电子警察",
        "2": "车流量相机"
      }
    };
  },
  methods: {
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
    fetchDevData() {
      this.$http("index/d_crossing/dataView", { id: this.id3 }).then(res => {
        if (res.status) {
          let data = res.data;
          this.signalData = [data.machine];
          this.upsData = [data.ups];
          this.ipcData = data.ipc;
          this.cameraData = data.camera;
        }
      });
    },
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1 && item.children) {
          this.name1 = item.name;
          item.children.forEach(item => {
            if (item.id == this.id2 && item.children) {
              this.name2 = item.name;
              item.children.forEach(item => {
                if (item.id == this.id3) {
                  this.tableData = item.children;
                  this.name3 = item.name;
                }
              });
            }
          });
        }
      });
      this.loading = false;
    }
  },
  created() {
    this.fetchData();
    this.fetchDevData();
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
</style>
