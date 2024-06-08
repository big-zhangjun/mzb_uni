<template>
    <view class="pages">
        <view class="title">重置密码</view>
        <view class="info">
            请输入旧密码
        </view>
        <input class="old" type='password' v-model="password" placeholder="请输入旧密码">
        <input class="new" type='password' v-model="realName" placeholder="请输入新密码">
        <view class="btn" @click="handleConfirm">确认</view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import md5 from "js-md5";
import * as $http from '../../../request/index'
const realName = ref("")
const password = ref("")
function getMD5Up(val) {
    let screct = md5(val)
    let bigScrect = screct.toUpperCase()
    return bigScrect
}
const handleConfirm = async () => {
    let id = uni.getStorageSync('user').id
    if(!realName.value || !password.value) {
        uni.$u.toast('请输入密码')
        return
    }
    let params = {
        id,
        realName: getMD5Up(realName.value),
        password: getMD5Up(password.value),
    }
    try {
        let res = await $http.post("/user/upload_user_password", params)
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }
    } catch {
        uni.$u.toast('密码错误')
    }

}
</script>

<style lang="less" scoped>
.pages {
    padding: 24px;
    box-sizing: border-box;
    background: rgb(248, 250, 251);
    height: 100vh;

    .title {
        font-size: 42rpx;
        margin-top: 60rpx;
        font-weight: bold;
    }

    .info {
        font-size: 26rpx;
        color: #7e7e7e;
        margin-top: 20rpx;
        margin-bottom: 60rpx;
    }

    .old,
    .new {
        background-color: #fff;
        height: 98rpx;
        margin-top: 30rpx;
        font-size: 28rpx;
        padding: 0 24rpx;
        border-radius: 12rpx;
        border: solid 1px #e7e7e7;
    }

    .btn {
        height: 96rpx;
        background-color: rgb(25, 140, 254);
        color: #fff;
        width: 100%;
        border: none;
        border-radius: 12rpx;
        font-size: 32rpx;
        margin-top: 76rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }

}
</style>