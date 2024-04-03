<template>
    <view class="pages">
        <view class="header">
            <view class="order-title">工单名称工单名称工单名称</view>
            <view class="order-no">ID:123456</view>
            <view class="card">
                <view class="product-name">项目名称项目名称项目名称</view>
                <view class="tags">
                    <view class="tag">加急</view>
                    <view class="create">创建人：张三</view>
                </view>
                <view class="footer">
                    <view>预计交付时间：<text>2024-06-12</text></view>
                    <!-- <view>预计交付时间：<text>2024-06-12</text></view> -->
                </view>
            </view>
        </view>
        <u-tabs :list="list1" @click="click" :current="current"></u-tabs>
        <!-- 流程 -->
        <view v-show="!current" class="flow">
            <view class="card">
                <view class="card-header">
                    <view class="status green">完结</view>
                    <view class="people">经办人员：<text>张三</text></view>
                    <view class="date">2024-03-27</view>
                </view>
                <view class="content">领导派单（待派）</view>
            </view>
            <view class="card">
                <view class="card-header">
                    <view class="status green">完结</view>
                    <view class="people">经办人员：<text>张三</text></view>
                    <view class="date">2024-03-27</view>
                </view>
                <view class="content">领导派单（待派）</view>
            </view>
            <view class="card">
                <view class="card-header">
                    <view class="status green">完结</view>
                    <view class="people">经办人员：<text>张三</text></view>
                    <view class="date">2024-03-27</view>
                </view>
                <view class="content">领导派单（待派）</view>
            </view>
            <view class="card">
                <view class="card-header">
                    <view class="status green">完结</view>
                    <view class="people">经办人员：<text>张三</text></view>
                    <view class="date">2024-03-27</view>
                </view>
                <view class="content">领导派单（待派）</view>
            </view>
            <view class="card">
                <view class="card-header">
                    <view class="status green">完结</view>
                    <view class="people">经办人员：<text>张三</text></view>
                    <view class="date">2024-03-27</view>
                </view>
                <view class="content">领导派单（待派）</view>
            </view>
        </view>
        <!-- 日志 -->
        <view v-show="current">日志</view>
    </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
const current = ref(0)
const list1 = reactive([
    { name: '工作流程' },
    { name: '工作日志' }
]);
// 定义方法  
function click(item) {
    current.value = item.index
}  
</script>

<style lang="less" scoped>
.header {
    width: 100vw;
    height: 250rpx;
    background: linear-gradient(160deg, #DAAF7E 0%, #B37748 100%);
    position: relative;
    color: #FFFFFF;
    padding: 30rpx;
    box-sizing: border-box;
    margin-bottom: 125rpx;

    .order-no {
        font-size: 24rpx;
        margin-top: 10rpx;
    }

    .card {
        width: 690rpx;
        // height: 266rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);
        border-radius: 12rpx;
        border: 1rpx solid #d1d7e1;
        position: absolute;
        left: 50%;
        bottom: -125rpx;
        transform: translateX(-50%);
        padding: 30rpx;
        box-sizing: border-box;

        .product-name {
            font-size: 32rpx;
            color: #2E313C;
        }

        .tags {
            display: flex;
            align-items: center;
            margin-top: 25rpx;

            .tag {
                padding: 0 20rpx;
                line-height: 40rpx;
                background-color: rgba(242, 35, 48, .1);
                color: rgba(242, 35, 48, 1);
                font-size: 22rpx;
                border-radius: 4rpx;
            }

            .create {
                font-size: 28rpx;
                color: #919399;
                margin-left: 24rpx;
            }
        }

        .footer {
            display: flex;
            align-items: center;
            color: #2E313C;
            font-size: 24rpx;
            margin-top: 30rpx;
            justify-content: space-between;

            text {
                color: #919399;
            }
        }
    }

}

.flow {
    padding: 0 30rpx;

    .card {
        width: 100%;
        background-color: #fff;
        margin-top: 30rpx;
        padding: 30rpx 20rpx;
        border-radius: 18rpx;
        box-sizing: border-box;
        .card-header {
            display: flex;
            justify-content: space-between;

            .status {
                line-height: 36rpx;
                padding: 0 12rpx;
                font-size: 22rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
            }

            .green {
                color: green;
                border: solid 1rpx rgb(114, 190, 0);
            }

            .people {
                font-size: 32rpx;
                color: #2E313C;
                font-weight: bold;
                margin-right: auto;
            }

            .date {
                font-size: 24rpx;
                color: #919399;
            }
        }
        .content {
            font-size: 28rpx;
            color: #919399;
            margin-top: 30rpx;
        }
    }
}

.pages {
    background-color: rgb(244, 244, 244);
    min-height: 100vh;
}
</style>