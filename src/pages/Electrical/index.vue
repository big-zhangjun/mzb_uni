<template>
    <view class="search-box">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="customerName"
            @keyup.enter="handleEnter" type="text" placeholder="请输入搜索关键字">
        <view class="filter" @click="handleFilter">
            <text>筛选</text>
            <image mode="aspectFit" class="icon" src="../../static/filter.png"></image>
        </view>
    </view>
    <view class="pages">
        <view class="card" v-for="item in list" :key="item.id" @click="goDetail(item)" v-if="list.length">
            <view class="header">
                <view class="title">{{ item.customerName }}</view>
                <view class="level" :class="getColor(item.level)">P{{ item.level }}</view>
            </view>
            <view class="content">
                <view class="size">规格型号：</view>
                <view class="size-name">{{ item.model }}</view>
            </view>
            <view class="footer">
                <view class="item">
                    <view class="label">项目编号：</view>
                    <view class="name">{{ item.number }}</view>
                </view>
                <view class="item">
                    <view class="label">产品编号：</view>
                    <view class="name">{{ item.productNumber }}</view>
                </view>
            </view>
        </view>
        <u-empty mode="data" v-else>
        </u-empty>
    </view>
    <!-- 弹出层 -->
    <u-popup :show="show" @close="close" @open="open" mode="right" :closeOnClickOverlay="true">
        <filter @handleConfirm="handleConfirm" @handleReset="handleReset" :filterData="filterData"></filter>
    </u-popup>
</template>

<script setup>
import { ref } from 'vue'
import filter from "../../components/Filter.vue";
import { onShow } from '@dcloudio/uni-app';
import * as $http from '../../request/index'
const list = ref([])
const customerName = ref("")
let show = ref(false)
const param = ref({
    level: 0,
    productName: ''
})
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
const handleFilter = () => {
    show.value = true
}
const close = () => {
    show.value = false
}

const open = () => {

}
const handleAdd = () => {
    uni.navigateTo({
        url: "/pages/Product/productForm?type=add"
    })
}
const goDetail = (data) => {
    uni.navigateTo({
        url: `/pages/Detail/index?id=${data.id}&number=${data.number}`
    })
}
onShow(() => {
    getData()
})
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
    $http.post("/project/get_project_list", params).then(res => {
        list.value = res.data.records
    })
}
// 获取颜色class
const getColor = (v) => {
    let classNames = ['red', 'orange', 'green', 'cyan', 'blue']
    return classNames[v - 1]
}
// 搜索
const handleEnter = () => {
    getData()
};
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

.search-box {
    position: sticky;
    top: 0;
    // width: calc(100vw - 48rpx);
    // margin: 0 auto;
    padding: 0 24rpx;
    padding-bottom: 24rpx;
    padding-top: 24rpx;
    align-items: center;
    display: flex;
    background-color: #fff;
    border-bottom: 24rpx solid #f1f1f1;

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

.pages {
    // min-height: 100vh;
    background: linear-gradient(180deg, #FFFFFF 0%, #F2F3F5 100%);
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    min-height: 100vh;

    .card {
        width: 100%;
        // height: 200rpx;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);
        background-color: #fff;
        padding: 30rpx;
        box-sizing: border-box;
        border-radius: 12rpx;

        .header {
            font-size: 32rpx;
            color: #2E313C;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                max-width: 500rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .level {
                font-size: 24rpx;
                font-weight: normal;
                border-radius: 40rpx;
                padding: 8rpx 20rpx;
            }

            .red {
                color: #fff;
                background-color: rgb(252, 15, 15);
            }

            .orange {
                color: #fff;
                background-color: rgb(254, 178, 56);
            }

            .green {
                color: #fff;
                background-color: rgb(101, 192, 96);
            }

            .cyan {
                color: #fff;
                background-color: rgb(81, 215, 214);
            }

            .blue {
                color: #fff;
                background-color: rgb(47, 161, 224);
            }
        }

        .content {
            display: flex;
            margin-top: 20rpx;
            color: #919399;
            font-size: 28rpx;
            align-items: center;

            .size-name {
                color: #12151b;
            }
        }

        .footer {
            margin-top: 30rpx;
            width: 100%;
            box-sizing: border-box;
            border-top: solid 1rpx #EFEFEF;
            padding-top: 30rpx;
            font-size: 26rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #919399;

            .item {
                display: flex;
                align-items: center;
                gap: 10rpx;
            }

            .name {
                border-radius: 6rpx;
                color: #12151b;
            }
        }
    }
}

.add {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(160deg, #E2C18E 0%, #A56239 100%);
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(175, 113, 72, 0.45);
    right: 30rpx;
    bottom: 137rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;

    .img {
        width: 50rpx;
        height: 50rpx;
    }
}
</style>