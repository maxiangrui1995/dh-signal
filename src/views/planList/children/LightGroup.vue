<template>
    <div>
        <el-row>
            <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="14">
                <canvas class="lightgroup-canvas"></canvas>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.lightgroup-canvas {
  width: 100%;
  height: 100%;
  background: #000;
}
</style>
