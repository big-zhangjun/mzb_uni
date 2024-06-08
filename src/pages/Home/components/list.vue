<template>
    <view class="page">
        <view class="title">
            <div class="label">公告列表</div>
            <div class="num"><text>{{ productList.length }}</text> 条</div>
        </view>
        <view class="list">
            <view class="item" v-if="productList.length" v-for="item in productList" :key="item.id"
                @click="goDetail(item)">
                <view class="header">
                    <view class="text">
                        <text class="title">{{ item.title }}</text>
                        <text class="date">创建时间：{{ item.createTime }}</text>
                    </view>
                    <image class="cover" width="160" height="160" mode="aspectFill" :src="getImg(item)" alt=""></image>
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
        url: `/pages/Notice/index?id=${data.id}`
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
    let res = dict.find(item => item.id == v)
    if (res) {
        return res.label
    }
}
const getImg = (data) => {
    if (!data.cover) {
        let randomNum = Math.floor(Math.random() * 5) + 1;
        let imgs = [
            "1.jpg",
            "2.jpg",
            "3.jpg",
            "4.png",
            "5.png"
        ]
        return `http://192.168.2.48:8012/pic/notice/${imgs[randomNum - 1]}`
    } else if (data.cover.includes("custom")) {
        return `http://192.168.2.48:8012/pic/notice/${data.cover.split("/")[1]}`
    } else {
        return 'http://192.168.2.48:8012' + data.cover.replace(/^\./, '')
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
            .cover {
                width: 200rpx;
                height: 140rpx;
                object-fit: scale-down;
                border-radius: 12rpx;
            }
            .title {
                font-size: 32rpx;
                color: #12151b;
                display: block;
                font-weight: bold;
                max-width: 400rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
                display: block;
                padding: 0;
                white-space: nowrap;
            }

            .date {
                display: block;
                font-size: 22rpx;
                margin-top: 20rpx;
                color: #999999;
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