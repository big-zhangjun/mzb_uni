<template>
    <view class="pages">
        <input type="text" class="search" placeholder="搜索" v-model="userName" @input="handleSearch">
        <view class="list">
            <view class="item" v-for="item in userList" :key="item.id" @click="handleCheck(item)">
                <view class="checkBox" :class="{ check: item.isChecked }"></view>
                <view class="card">
                    <view class="round">{{ item.userName.slice(0, 2) }}</view>
                    <view class="info">
                        <view class="name">{{ item.userName }}</view>
                        <view class="position">{{ item.mobile }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import * as $http from '../../request/index'
import { onLoad } from '@dcloudio/uni-app';
const pageIndex = ref(1)
const number = ref("")
const userList = ref([])
const projectID = ref("")
const detail = ref({})
const userName = ref("")
const type = ref("")
onLoad(async (options) => {
    projectID.value = options.id
    type.value = options.type
    console.log(options);
    number.value = options.number
    getData()
})
const getData = async () => {
    await getDetail()
    let params = { "pageSize": 10, "pageIndex": pageIndex.value, "userName": userName.value, "nickName": "" }
    const res = await $http.post("/user/get_user_list", params)
    userList.value = [...userList.value, ...res.data.records]
    let userIds = []
    switch (type.value) {
        case "ec":
            userIds = detail.value.ecRep.split(",");
            break
        case "si":
            userIds = detail.value.siRep.split(",");
            break
        case "as":
            userIds = detail.value.asRep.split(",");
            break
    }
    userList.value.forEach(item => {
        if (userIds.includes(String(item.id))) {
            item.isChecked = true
        }
    })
}
const handleSearch = () => {
    pageIndex.value = 1
    userList.value = []
    getData()
    console.log(userName.value);
}
// 获取详情
const getDetail = async () => {
    let params = {
        id: +projectID.value,
        number: number.value
    }
    const res = await $http.post("/project/get_project_info", params)
    detail.value = res.data
}
const handleCheck = (data) => {
    data.isChecked = !data.isChecked
    let params = {
        id: +projectID.value,
        rep: data.id,
        repName: data.userName
    }
    let addUrl, remmoveUrl = ''
    switch (type.value) {
        case "ec":
            addUrl = '/project/add_ec_rep'
            remmoveUrl = "/project/del_ec_rep";
            break
        case "si":
            addUrl = '/project/add_si_rep'
            remmoveUrl = "/project/del_si_rep";
            break
        case "as":
            addUrl = '/project/add_as_rep'
            remmoveUrl = "/project/del_as_rep";
            break
    }
    if (data.isChecked) {
        addUser(params, addUrl)
    } else {
        removeUser(params, remmoveUrl)
    }
}
const addUser = async (params, url) => {
    const res = await $http.post(url, params)
    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: 'none'
        })
    }
}
const removeUser = async (params, url) => {
    const res = await $http.post(url, params)
    console.log(res);

    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: 'none'
        })
    }
}
</script>

<style lang="less" scoped>
.pages {
    height: 100vh;
    background: #F2F2F7;
    padding: 30rpx;
    box-sizing: border-box;

    .search {
        border: solid #E1E1E6 1rpx;
        height: 80rpx;
        background-color: #fff;
        border-radius: 12rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
    }

    .list {
        margin-top: 30rpx;
        display: flex;
        flex-direction: column;
        gap: 30rpx;

        .item {
            display: flex;
            align-items: center;
            gap: 30rpx;

            .checkBox {
                width: 40rpx;
                height: 40rpx;
                border: 3rpx solid #AFAFB3;
                border-radius: 40rpx;
            }

            .check {
                border: 3rpx solid rgb(25, 140, 254);
                position: relative;

                &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 28rpx;
                    height: 28rpx;
                    background-color: rgb(25, 140, 254);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            .card {
                flex: 1;
                background: #FFFFFF;
                border-radius: 12rpx;
                border: 1rpx solid #DCDAD5;
                display: flex;
                padding: 30rpx;
                align-items: center;

                .round {
                    width: 80rpx;
                    height: 80rpx;
                    background: #50A6AB;
                    font-size: 28rpx;
                    color: #fff;
                    border-radius: 40rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20rpx;
                }

                .info {
                    .name {
                        font-size: 28rpx;
                        color: #2E313C;
                        font-weight: bold;
                        margin-bottom: 20rpx;
                    }

                    .position {
                        font-size: 24rpx;
                        color: #919399;
                    }
                }
            }
        }
    }

    .submit {
        width: calc(100% - 60rpx);
        line-height: 88rpx;
        background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
        border-radius: 8rpx;
        text-align: center;
        color: #fff;
        font-size: 28rpx;
        position: fixed;
        bottom: 20rpx;
        left: 50%;
        transform: translateX(-50%);

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }
}
</style>