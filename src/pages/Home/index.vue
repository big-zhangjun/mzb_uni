<template>
    <view>
        <view class="search-box">
        <input class="search" type="text" placeholder="请输入搜索关键字">
        <view class="filter" @click="handleFilter">
            <text>筛选</text>
            <image mode="aspectFit" class="icon" src="../../static/filter.png"></image>
        </view>
    </view>
    <!-- 领导 -->
    <leader></leader>
    <!-- 员工 -->
    <employee></employee>
    <!-- 弹出层 -->
    <u-popup :show="show" @close="close" @open="open" mode="right" :closeOnClickOverlay="true">
       <filter></filter>
    </u-popup>
    </view>
</template>

<script setup>
import {ref} from 'vue'
import leader from "./components/leader.vue";
import employee from "./components/employee.vue";
import filter from "../../components/Filter.vue";
let show = ref(false)
const handleFilter = () => {
    show.value = true
}
const close = () => {
    show.value = false
}

const open = () => {
    
}
</script>

<style lang="less" scoped>
.search {
    background-color: #f1f1f1;
    height: 80rpx;
    font-size: 28rpx;
    padding: 0 24rpx;
    border-radius: 40rpx;
    box-sizing: border-box;
    flex: 1;
}

.search-box {
    width: calc(100vw - 48rpx);
    margin: 0 auto;
    margin-top: 24rpx;
    align-items: center;
    display: flex;

    .filter {
        margin-left: 24rpx;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #2c2c2c;

        .icon {
            width: 40rpx;
            object-fit: scale-down;
            height: 40rpx;
            margin-left: 10rpx;
        }
    }
}
</style>