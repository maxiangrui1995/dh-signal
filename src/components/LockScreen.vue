<template>
    <div style="width: 100%; height: 100%; background: rgb(102, 122, 166);">
        <div class="con">
            <div class="con-body">已锁定</div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  height: 100%;
  &-body {
    position: absolute;
    width: 400px;
    height: 100px;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
    transform-origin: center center;
    z-index: 10;
    text-align: center;
  }
}
</style>

