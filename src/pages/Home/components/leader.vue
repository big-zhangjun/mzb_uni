<template>
    <view class="page">
        <view class="card">
            <view class="content">
                <view class="item">
                    <view class="num">14</view>
                    <view class="label">我提交的</view>
                </view>
                <view class="item">
                    <view class="num">14</view>
                    <view class="label">我受理中的</view>
                </view>
                <view class="item">
                    <view class="num">14</view>
                    <view class="label">我完结的</view>
                </view>
            </view>
            <view class="btn" @click="newOrder">创建工单</view>
        </view>
        <view class="title">
            <div class="label">待办事项</div>
            <div class="num"><text>8</text>条待办</div>
        </view>
        <view class="list">
            <view class="item" v-for="item in 9" :key="item" @click="goDetail">
                <view class="header">
                    <text>美新源环保有限公司</text>
                    <view class="tag">
                        <view class="exigency">紧急</view>
                        <view class="orange">进行中</view>
                    </view>
                </view>
                <view class="content">水电费美新源环保有限公司美新源环保有限公司美新源环保有限公司美新源环保有限公司</view>
                <view class="footer">
                    <view class="idNo">D:12245744</view>
                    <view class="date">2024-03-26</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>

const goDetail = () => {
    uni.navigateTo({
        url: "/pages/Detail/index"
    })
}
const newOrder = () => {
    uni.navigateTo({
        url: "/pages/Order/index"
    })
}
</script>

<style lang="less" scoped>
.page {
    background-color: #f2f2f2;
    margin-top: 32rpx;
    padding-top: 32rpx;
    min-height: 100vh;
}

.card {
    width: calc(100vw - 72rpx);
    background: linear-gradient( 160deg, #DAAF7E 0%, #B37748 100%);
    border-radius: 20rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 60rpx 100rpx 30rpx;
    margin-top: 0;

    .content {
        display: flex;
        justify-content: space-between;
    }

    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;

        .label {
            font-size: 20rpx;
        }

        .num {
            font-size: 50rpx;
            margin-bottom: 6rpx;
        }
    }

    .btn {
        color: #93673D;
        background-color: #fff;
        width: 180rpx;
        font-size: 24rpx;
        line-height: 68rpx;
        text-align: center;
        border-radius: 68rpx;
        margin: 0 auto;
        font-weight: bold;
        margin-top: 30rpx;
    }
}

.title {
    display: flex;
    padding: 0 36rpx;
    justify-content: space-between;
    margin-top: 32rpx;

    .label {
        color: #12151b;
        font-size: 30rpx;
        font-weight: bold;
    }

    .num {
        font-size: 24rpx;
        color: gray;

        text {
            color: rgb(58, 159, 251);
        }
    }
}
.list {
    // padding: 0 36rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 36rpx;
    background-color: #fff;
    box-sizing: border-box;
    width: calc(100vw - 72rpx);
    .item {
        padding: 36rpx;
        border-bottom:1px rgb(238, 238, 238) solid ;
        .header {
            display: flex;
            justify-content: space-between;
            text {
                font-size: 32rpx;
                color: #12151b;
                font-weight: bold;
            }
            .tag {
                display: flex;
                align-items: center;
                gap: 20rpx;
                font-size: 22rpx;
                view {
                    box-sizing: border-box;
                    padding: 0rpx 12rpx;
                    line-height: 38rpx;
                    display: block;
                }
                .exigency {
                    color: #fff;
                    background-color: rgb(253,70,88);
                    border: solid 1rpx rgb(253,70,88);
                    border-radius: 8rpx;
                }
                .orange {
                    color: orange;
                    border: solid 1rpx orange;
                    border-radius: 8rpx;
                }
            }
        }
        .content {
            font-size: 28rpx;
            color: #999999;
            margin-top: 20rpx;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            font-size: 26rpx;
            margin-top: 30rpx;
            .date {
                color: #999999;
            }
        }
    }
}
</style>