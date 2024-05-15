<template>
    <view class="pages">
        <view class="bg"></view>
        <view class="card">
            <view class="awater">
                <image class="user" width="100" height="10" mode="aspectFill" src="../../static/images/user.png" alt="">
                </image>
            </view>
            <view class="info">
                <view class="name">{{ user.userName }}</view>
                <view class="position">{{ user.roleName }}</view>
            </view>
        </view>
        <view class="card m25 nf">
            <view class="title">基本信息</view>
            <view class="item" @click="resetPassword">
                <up-icon name="lock-open" color="#12151b" size="24"></up-icon>
                <view class="label">修改密码</view>
                <up-icon name="arrow-right" color="rgb(144,157,153)" size="14"></up-icon>
            </view>
            <view class="item" @click="editUser">
                <up-icon name="list-dot" color="#12151b" size="24"></up-icon>
                <view class="label">修改信息</view>
                <up-icon name="arrow-right" color="rgb(144,157,153)" size="14"></up-icon>
            </view>
        </view>
        <view class="logout" @click="show = true">退出登录</view>
        <up-modal showCancelButton @cancel="show = false" @confirm="logout" :show="show" title="提示"
            content='确认退出登录？'></up-modal>
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
const resetPassword = () => {
    uni.navigateTo({
        url: "/subpkg1/pages/Mine/resetPassword"
    })
}

const editUser = () => {
    uni.navigateTo({
        url: "/subpkg1/pages/Mine/info"
    })
}
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
        border-radius: 16rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 30rpx;
        margin-top: 75rpx;
        .title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20rpx;
        }
        .item {
            display: flex;
            justify-content: space-between;
            height: 110rpx;
            align-items: center;
            border-bottom: 1px rgb(247, 247, 247) solid;
            .label {
                color: #12151b;
                margin-right: auto;
                margin-left: 20rpx;
            }
            &:last-child {
                border: none;
            }
        }
        .awater {
            width: 100rpx;
            height: 100rpx;
            background-color: #e2e2e2;
            border-radius: 50%;

            .user {
                width: 100rpx;
                height: 100rpx;
            }
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

    .m25 {
        
        display: block;
        margin-top: 25rpx;
        padding-bottom: 0;
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