<template>
    <input class="search" type="text" placeholder="请输入搜索关键字">
    <!-- 领导 -->
    <leader></leader>
    <!-- 员工 -->
    <employee></employee>
</template>

<script setup>
import leader from "./components/leader.vue";
import employee from "./components/employee.vue";
</script>

<style lang="less" scoped>
.search {
    width: calc(100vw - 64rpx);
    margin: 0 auto;
    background-color: #f1f1f1;
    height: 80rpx;
    font-size: 28rpx;
    padding: 0 24rpx;
    border-radius: 40rpx;
    box-sizing: border-box;
    margin-top: 32rpx;
}
</style>