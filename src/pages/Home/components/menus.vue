<template>
    <view class="pages">
        <view class="card">
            <view class="menu-item" @click="goPoduct">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/client.png" alt=""></image>
                </view>
                <text class="txt">项目管理</text>
            </view>
            <view class="menu-item" @click="goElectrical">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/report.png" alt=""></image>
                </view>
                <text class="txt">电气计划</text>
            </view>
            <view class="menu-item" @click="addWorkLog">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/order.png" alt=""></image>
                </view>
                <text class="txt">创建日志</text>
            </view>
            <view class="menu-item" @click="goStatistics">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/order.png" alt=""></image>
                </view>
                <text class="txt">出差分布</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const goPoduct = () => {
    uni.navigateTo({
        url: "/pages/Product/index"
    })
}
const goElectrical = () => {
    uni.navigateTo({
        url: "/pages/Electrical/index"
    })
}
const addWorkLog = () => {
    wx.requestSubscribeMessage({
        tmplIds: ['u8RuqCb4KsxNnPOrTaFkidLPJhmv-h4A4JvVVz2zIkc'], // 替换为你的消息模板ID
        success(res) {
            if (res['u8RuqCb4KsxNnPOrTaFkidLPJhmv-h4A4JvVVz2zIkc'] === 'accept') {
                // 用户同意订阅消息，可以进行后续处理
                console.log('订阅成功');
                uni.navigateTo({
                    url: `/pages/Detail/workLog?type=add`
                })
            }
        },
        fail(err) {
            console.error('订阅消息失败', err);
        }
    });
}
const goStatistics = () => {
    uni.navigateTo({
        url: `/pages/Statistics/index`
    })
}
</script>

<style lang="less" scoped>
.pages {
    // margin-top: 24rpx;
    background-color: #f2f2f2;
    padding-top: 24rpx;
}

.card {
    width: calc(100vw - 48rpx);
    background: #fff;
    border-radius: 20rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 60rpx 32rpx;
    display: flex;
    justify-content: space-between;

    .menu-item {
        display: flex;
        flex-direction: column;
        font-size: 28rpx;
        align-items: center;
        color: rgb(64, 62, 64);

        .icon {
            width: 88rpx;
            height: 88rpx;
            background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
            border-radius: 88rpx;
            margin-bottom: 18rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .img {
                width: 52rpx;
                height: 52rpx;
            }
        }

        &:nth-child(2) {
            .icon {
                background: linear-gradient(160deg, rgb(244, 204, 114) 0%, rgb(245, 170, 97) 100%);

                .img {
                    width: 44rpx;
                    height: 44rpx;
                }
            }
        }

        &:nth-child(3) {
            .icon {
                background: linear-gradient(160deg, rgb(80, 147, 233) 0%, rgb(82, 125, 252) 100%);
                ;

                .img {
                    width: 50rpx;
                    height: 50rpx;
                }
            }
        }

    }
}
</style>