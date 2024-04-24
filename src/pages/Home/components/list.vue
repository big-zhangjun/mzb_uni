<template>
    <view class="page">
        <view class="title">
            <div class="label">电气项目计划表</div>
            <div class="num"><text>{{ productList.length }}</text> 条</div>
        </view>
        <view class="list">
            <view class="item" v-if="productList.length" v-for="item in productList" :key="item.id"
                @click="goDetail(item)">
                <view class="header">
                    <text class="title">{{ item.customerName }}</text>
                    <view class="tag">
                        <view class="productName">{{ item.productName }}</view>
                        <view class="exigency" :class="getColor(item.level)">P{{ item.level }}</view>
                        <!-- <view class="orange">进行中</view> -->
                    </view>
                </view>
                <view class="content">
                    <view class="content_item">电气柜安装状态：<text class="red">{{ getEpStatus(item.ecStatus) }}</text></view>
                    <view class="content_item">现场安装情况：<text class="red">未开始</text></view>
                    <view class="content_item">售后状态：<text class="red">未开始</text></view>
                </view>
                <view class="footer">
                    <view class="idNo">项目编号：{{ item.number }}</view>
                    <view class="idNo">产品编号：{{ item.productNumber }}</view>
                </view>
            </view>
            <view v-show="!productList.length" style="margin: 200rpx 0; ">
                <u-empty mode="data"></u-empty>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    productList: Array
})
const goDetail = (data) => {
    uni.navigateTo({
        url: `/pages/Detail/index?id=${data.id}&number=${data.number}`
    })
}
// 获取颜色class
const getColor = (v) => {
    let classNames = ['red', 'orange', 'green', 'cyan', 'blue']
    return classNames[v - 1]
}
const getEpStatus = (v) => {
    let dict = [
        {
            label: "未开始",
            id: 1
        },
        {
            label: "进行中",
            id: 2
        },
        {
            label: "缺料中",
            id: 3
        },
        {
            label: "已完成",
            id: 4
        }
    ]
    let res = dict.find(item=> item.id == v)
    if(res) {
        return res.label
    } 
}
</script>

<style lang="less" scoped>
.page {
    background-color: #f2f2f2;
    padding-top: 32rpx;
    padding-bottom: 30rpx;
}

.title {
    display: flex;
    padding: 0 36rpx;
    justify-content: space-between;

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
    width: calc(100vw - 48rpx);

    .item {
        padding: 36rpx;
        border-bottom: 1px rgb(238, 238, 238) solid;

        .header {
            display: flex;
            justify-content: space-between;

            text {
                font-size: 32rpx;
                color: #12151b;
                font-weight: bold;
                max-width: 440rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
                display: block;
                padding: 0;
                white-space: nowrap;
            }

            .tag {
                display: flex;
                align-items: center;
                gap: 20rpx;
                font-size: 22rpx;

                .productName {
                    color: orange;
                }

                view {
                    box-sizing: border-box;
                    padding: 0rpx 12rpx;
                    line-height: 38rpx;
                    display: block;
                }

                .exigency {
                    color: #fff;
                    background-color: rgb(252, 15, 15);
                    border-radius: 8rpx;
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
        }

        .content {
            font-size: 28rpx;
            color: #999999;
            margin-top: 20rpx;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .content_item {
                margin-bottom: 14rpx;

                .red {
                    // color: #12151b;
                }
            }

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