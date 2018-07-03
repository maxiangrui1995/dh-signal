<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle @click="_self.$router.push({ path: '/region/' + id1 + '/' + id2 })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import GMap from "@/components/Map";
export default {
  components: { GMap },
  data() {
    return {
      id1: this.$route.params.id1,
      id2: this.$route.params.id2,
      id3: this.$route.params.id3,
      name1: "",
      name2: "",
      name3: "",
      crossing: {}
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
    formatterData(data) {
      data.forEach(item => {
        if (item.id == this.id1 && item.children) {
          this.name1 = item.name;
          item.children.forEach(item => {
            if (item.id == this.id2 && item.children) {
              this.name2 = item.name;
              item.children.forEach(item => {
                if (item.id == this.id3) {
                  this.crossing = item;
                  this.name3 = item.name;
                }
              });
            }
          });
        }
      });
      this.loading = false;
    },
    drawMarker(){
      
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
    },
    crossing(data) {
      console.log(data);
    }
  }
};
</script>

<style>
</style>
