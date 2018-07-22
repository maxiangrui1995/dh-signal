<template>
    <div class="error-page">
        <div class="imgBlock">
            <img src="@/assets/404.svg" alt="">
        </div>
        <div class="content">
            <h1>404</h1>
            <div class="desc">抱歉，你访问的页面不存在</div>
            <div class="actions">
                <el-button type="primary" @click="_self.$router.push({path: '/'})">返回首页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
