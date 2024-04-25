<template>
    <view class="pages">
        <view class="bg"></view>
        <view class="card">
            <view class="awater"></view>
            <view class="info">
                <view class="name">{{ user.userName }}</view>
                <view class="position">{{ user.roleName }}</view>
            </view>
        </view>
        <view class="logout" @click="show=true">退出登录</view>
        <up-modal showCancelButton @cancel="show=false" @confirm="logout" :show="show" title="提示" content='确认退出登录？'></up-modal>
    </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
const logout = () => {
    uni.clearStorageSync()
    uni.reLaunch({
        url: '/pages/Login/index',
    });
}
const user = ref({})
const show = ref(false)
onLoad(() => {
    user.value = uni.getStorageSync('user')
})
</script>

<style lang="scss" scoped>
.pages {
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(247, 247, 247);

    .bg {
        height: 150rpx;
        width: 100vw;
        background-color: #3785fa;
        position: fixed;
        top: 0;
        left: 0;
    }

    .card {
        width: calc(100vw - 60rpx);
        padding: 30rpx;
        background-color: #fff;
        z-index: 1;
        position: relative;
        box-sizing: border-box;
        border-radius: 20rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
        margin-top: 75rpx;
        gap: 30rpx;

        .awater {
            width: 100rpx;
            height: 100rpx;
            background-color: #e2e2e2;
            border-radius: 50%;
        }

        .info {
            .name {
                font-size: 32rpx;
                font-weight: bold;
                color: #12151b;
                margin-bottom: 10rpx;
            }

            .position {
                font-size: 28rpx;
                color: #aaaaaa;
            }
        }
    }

    .logout {
        width: calc(100% - 60rpx);
        margin: 0 auto;
        margin-top: 40rpx;
        margin-bottom: 40rpx;
        line-height: 88rpx;
        background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
        border-radius: 8rpx;
        text-align: center;
        color: #fff;
        font-size: 28rpx;
        position: fixed;
        bottom: 40rpx;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>