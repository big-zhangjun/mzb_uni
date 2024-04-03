<template>
    <view class="proup">
        <view class="label">
            当前部门
        </view>
        <view class="list">
            <view class="item" :class="{active: activeId == item.id}" v-for="item in list" :key="item.id">{{ item.label }}</view>
        </view>
        <view class="label">
            工单类型
        </view>
        <view class="list">
            <view class="item" v-for="item in list" :key="item.id">{{ item.label }}</view>
        </view>
        <view class="label">
            工单状态
        </view>
        <view class="list">
            <view class="item" v-for="item in list" :key="item.id">{{ item.label }}</view>
        </view>
        <view class="label">
            是否加急
        </view>
        <view class="list">
            <view class="item">是</view>
            <view class="item">否</view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
const activeId = ref(1)
const list = reactive([
    {
        label: '全部',
        id: 1
    },
    {
        label: '技术部',
        id: 2
    },
    {
        label: '电控部',
        id: 3
    },
    {
        label: '工程部',
        id: 4
    },
    {
        label: '业务部',
        id: 5
    },
    {
        label: '财务部',
        id: 6
    }
])
</script>

<style lang="scss" scoped>
.proup {
    width: 75vw;
    box-sizing: border-box;
    padding: 24rpx;
    .label {
        font-weight: bold;
        font-size: 32rpx;
        margin-bottom: 40rpx;
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        gap: 28rpx;
        margin-bottom: 60rpx;
        .item {
            padding: 0 28rpx;
            background-color: rgb(244,244,244);

            line-height: 60rpx;
            font-size: 28rpx;
            border-radius: 60rpx;
            color: rgb(112, 104, 104);;
        }
        .active {
            border: solid 1px rgb(57, 158, 250);
            color: #12151b;
            font-weight: bold;
        }
    }
}
</style>