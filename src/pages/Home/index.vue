<template>
    <view class="pages">
        <view class="search-box">
            <input class="search" v-model="customerName" type="text" placeholder="请输入搜索关键字" @input="handleSearch">
            <view class="filter" @click="handleFilter">
                <text>筛选</text>
                <image mode="aspectFit" class="icon" src="../../static/filter.png"></image>
            </view>
        </view>
        <!-- 菜单 -->
        <menus></menus>
        <!-- 列表 -->
        <list :productList="productList"></list>
        <!-- 弹出层 -->
        <u-popup :show="show" @close="close" @open="open" mode="right" :closeOnClickOverlay="true">
            <filter @handleConfirm="handleConfirm" @handleReset="handleReset" :filterData="filterData"></filter>
        </u-popup>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../request/index'
import list from "./components/list.vue"
import menus from "./components/menus.vue"
import filter from "../../components/Filter.vue";
import { onLoad, onShow } from '@dcloudio/uni-app';
let show = ref(false)
const handleFilter = () => {
    show.value = true
}
onShow(() => {
    if (!uni.getStorageSync("user")) {
        uni.showToast({
            title: '登录过期，请重新登录',
            icon: 'none',
            duration: 2000,
            complete: () => {
                uni.reLaunch({
                    url: '/pages/Login/index',
                });
            },
        });
    }
})
const productList = ref([])
const param = ref({
    level: 0,
    productName: ''
})
const debounce = (func, delay) => {
    let timeoutId;

    return function () {
        const context = this;
        const args = arguments;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};
const handleSearch = debounce(() => {
    handleConfirm()
    // 处理搜索逻辑
}, 300); // 设置防抖延迟时间，单位为毫秒

const customerName = ref("")
const close = () => {
    show.value = false
}
const filterData = ref([
    {
        title: "产品名称",
        single: true,
        key: "productName",
        type: '',
        checkList: [],
        children: [
            {
                label: "热压罐",
                id: "热压罐"
            },
            {
                label: "储气罐",
                id: "储气罐"
            },
            {
                label: "液压釜",
                id: "液压釜"
            },
            {
                label: "固化炉",
                id: "固化炉"
            },
            {
                label: "系统改造",
                id: "系统改造"
            }
        ]
    },
    {
        title: "级别",
        key: "level",
        single: true,
        checkList: [],
        type: 'number',
        children: [
            {
                label: "P0",
                id: 0
            },
            {
                label: "P1",
                id: 1
            },
            {
                label: "P2",
                id: 2
            },
            {
                label: "P3",
                id: 3
            },
            {
                label: "P4",
                id: 4
            }
        ]
    }
])
const open = () => {

}
const getData = () => {
    let params = {
        number: "",
        productNumber: "",
        customerName: customerName.value,
        productName: param.value.productName,
        level: param.value.level,
        pageSize: 10,
        pageIndex: 1
    }
    $http.post("/project/get_ep_list", params).then(res => {
        productList.value = res.data.records
    })
}
// 筛选确定
const handleConfirm = () => {
    let keys = ['productName', 'level']
    filterData.value.forEach(item => {
        if (keys.includes(item.key)) {
            let v = item.checkList
            param.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    getData()
}
const handleReset = () => {
    let keys = ['productName', 'level']
    filterData.value.forEach(item => {
        item.checkList = []
        if (keys.includes(item.key)) {
            let v = item.checkList
            param.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    getData()
}
getData()
</script>

<style lang="less" scoped>
.search {
    background-color: #f1f1f1;
    height: 80rpx;
    font-size: 28rpx;
    padding: 0 24rpx;
    border-radius: 40rpx;
    box-sizing: border-box;
    flex: 1;
}
.pages {
    background-color: #f2f2f2;
    min-height: 100vh;
}
.search-box {
    width: calc(100vw);
    background-color: #fff;
    padding: 0 24rpx;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 24rpx;
    padding-bottom: 24rpx;
    align-items: center;
    display: flex;

    .filter {
        margin-left: 24rpx;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #2c2c2c;

        .icon {
            width: 40rpx;
            object-fit: scale-down;
            height: 40rpx;
            margin-left: 10rpx;
        }
    }
}
</style>