<template>
    <view class="pages">
        <view class="tabs">
            <view v-for="item in tabs" :class="{ active: active == item.id }" :key="item.id">{{ item.label }}</view>
        </view>
        <view class="filter">
            <view class="date">2024-05-30</view>
        </view>
        <view class="card">
            <lineChart />
        </view>
    </view>
</template>

<script setup>
import lineChart from './components/lineChart'
import { ref } from 'vue'
const tabs = ref([
    {
        id: 1,
        label: '项目统计'
    },
    {
        id: 2,
        label: '电气分析'
    },
    {
        id: 3,
        label: '日志统计'
    }
])
const active = ref(1)
</script>

<style lang="scss" scoped>
.pages {
    min-height: 100vh;
    background-color: #f5f5f5;
}
.tabs {
    display: flex;
    line-height: 98rpx;
    box-shadow: 0 16rpx 16rpx rgba(0, 0, 0, .04);
    background-color: #fff;
    padding: 0 40rpx;
    align-items: center;
    gap: 80rpx;

    .active {
        position: relative;
        color: rgb(65, 74, 140);

        &::before {
            content: "";
            display: block;
            width: 40rpx;
            height: 6rpx;
            background-color: rgb(65, 74, 140);
            position: absolute;
            border-radius: 6rpx;
            transform: translateX(-50%);
            bottom: 8rpx;
            left: 50%;
        }
    }
}

.filter {
    display: flex;
    justify-content: flex-end;
    margin-top: 40rpx;
    padding: 0 40rpx;

    .date {
        padding: 14rpx 20rpx;
        font-size: 20rpx;
        color: #7a7a7a;
        border-radius: 12rpx;
        border: solid rgb(214, 214, 214) 1px;
    }
}

.card {
    width: calc(100% - 56rpx);
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 12rpx;
    margin-top: 30rpx;
    background-color: #fff;
    box-shadow: 0 16rpx 16rpx rgba(0, 0, 0, .04);
    padding: 30rpx;
}
</style>