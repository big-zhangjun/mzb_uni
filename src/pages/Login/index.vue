<template>
    <view class="login">
      <image class="logo" width="160" height="160" mode="aspectFill" src="../../static/images/logo.jpg" alt=""></image>
      <h1 class="title">手机号登录</h1>
      <input class="phone" v-model="phone" type="number" placeholder="请输入手机号">
      <input class="password" v-model="password" type='password' placeholder="请输入密码">
      <view class="btn" @click="handleLogin">
        <span>登录</span>
      </view>
      <view class="more">
        <view>忘记密码</view>
        <!-- <span>注册</span> -->
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const loading = ref(false)
  const phone = ref("")
  const title = ref("uaa")
  
  const password = ref("")
  // 校验手机号是否正确
  const validatePhoneNumber = (phoneNumber) => {
    const pattern = /^1[0-9]{10}$/;  // 以1开头，后跟10位数字
    return pattern.test(phoneNumber);
  }
  
  // 点击登录
  const handleLogin = () => {
    if (!validatePhoneNumber(phone.value)) {
      console.log('不正确');
      return
    }
    if (!password.value) {
      console.log('不正确');
      return
    }
    if (loading.value) return
    loading.value = true
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