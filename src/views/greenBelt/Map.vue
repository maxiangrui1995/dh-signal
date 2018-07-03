<template>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
    <GMap />

    <div style="position: absolute; top: 20px; left: 20px;">
      <el-button type="primary" circle @click="_self.$router.push({ path: '/greenBelt' })">
        <i class="fa fa-mail-reply"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import GMap from "@/components/Map";
export default {
  components: { GMap }
};
</script>

<style>
</style>
