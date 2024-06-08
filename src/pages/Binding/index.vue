<template>
    <view class="login">
        <image class="logo" width="160" height="160" mode="aspectFill" src="../../static/images/logo.jpg" alt="">
        </image>
        <h1 class="title">绑定账号</h1>
        <input class="phone" v-model="phone" placeholder="请输入账号">
        <input class="password" v-model="password" type='password' placeholder="请输入密码">
        <view class="btn" @click="handleLogin">
            <span>绑定</span>
        </view>
        <u-toast ref="uToastRef"></u-toast>
        <view class="more">
            <!-- <view>忘记密码</view> -->
            <!-- <button open-type="getUserInfo" @getuserinfo="onGetUserInfo">微信登录</button> -->
            <!-- <span>注册</span> -->
        </view>
    </view>
</template>

<script setup>
import md5 from "js-md5";
import { ref } from 'vue'
import * as $http from '../../request/index'
import { onLoad } from "@dcloudio/uni-app";
const loading = ref(false)
const phone = ref("")
// 方法
const openId = ref("")
const uToastRef = ref(null)
const password = ref("")
// 校验手机号是否正确
const validatePhoneNumber = (phoneNumber) => {
    const pattern = /^1[0-9]{10}$/;  // 以1开头，后跟10位数字
    return pattern.test(phoneNumber);
}
function getMD5Up(val) {
    let screct = md5(val)
    let bigScrect = screct.toUpperCase()
    return bigScrect
}
onLoad((options) => {
    openId.value = options.openId
})
// 点击登录
const handleLogin = () => {
    console.log($http);
    if (!phone.value) {
        uToastRef.value.show({
            type: 'default',
            message: "请正确输入账号"
        });
        return
    }
    if (!password.value) {
        uToastRef.value.show({
            type: 'default',
            message: "请正确输入密码"
        });
        return
    }
    if (loading.value) return
    // loading.value = true
    let params = { userName: phone.value, Password: getMD5Up(password.value), openID: openId.value }
    $http.post("/user/login", params).then(res => {
        console.log(res.data);
        uni.setStorageSync("user", res.data)
        uToastRef.value.show({
            type: 'default',
            message: "登录成功", complete() {
                uni.switchTab({
                    url: "/pages/Home/index"
                });
            }
        });
    }).catch(err => {
        loading.value = false
        const { msg } = err.status
        uToastRef.value.show({
            type: 'default',
            message: msg
        });
    })
}
</script>

<style lang="less" scoped>
.login {
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
        margin-top: 80rpx;
        width: 220rpx;
        height: 220rpx;
        object-fit: cover;
    }

    .title {
        font-size: 44rpx;
        // margin-top: 80rpx;
        color: rgb(51, 51, 51);
        position: relative;
        font-weight: bold;

        &::before {
            content: "";
            display: block;
            position: absolute;
            width: 140rpx;
            height: 16rpx;
            background: linear-gradient(to right, rgb(25, 140, 254), #fff);
            bottom: 0;
            left: 0;
            z-index: -1;
            border-radius: 16rpx 8rpx 8rpx 0;
        }
    }

    input {
        border: none;
        background-color: rgb(244, 245, 244);
        height: 96rpx;
        width: 100%;
        box-sizing: border-box;
        border-radius: 24rpx;
        font-size: 32rpx;
        padding: 0 32rpx;
        outline: none;

        &::placeholder {
            color: rgb(150, 150, 150);
        }
    }

    .phone {
        margin-top: 72rpx;
        margin-bottom: 40rpx;
    }

    .btn {
        height: 96rpx;
        background-color: rgb(25, 140, 254);
        color: #fff;
        width: 100%;
        border: none;
        border-radius: 24rpx;
        font-size: 32rpx;
        margin-top: 76rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }

    .more {
        display: flex;
        justify-content: space-between;
        color: rgb(150, 150, 150);
        margin-top: 12rpx;
        font-size: 28rpx;
        margin-top: 30rpx;
    }
}
</style>