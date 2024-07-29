<template>
    <view class="project-info">
        <view class="header-info">
            <view class="header">基本信息</view>
            <view class="info">
                <view class="item">
                    <view class="label">客户名称：</view>
                    <view class="value">{{ electricalIno.customerName || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">产品名称：</view>
                    <view class="value">{{ electricalIno.productName || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">项目编号：</view>
                    <view class="value">{{ electricalIno.number || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">产品编号：</view>
                    <view class="value">{{ electricalIno.productNumber || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">规格/型号：</view>
                    <view class="value">{{ electricalIno.model || '--' }}</view>
                </view>
                <view class="item b0">
                    <view class="label">优先等级：</view>
                    <view class="value">{{ 'p' + electricalIno.level || '--' }}</view>
                </view>
                <view class="item b0">
                    <view class="label">下单日期：</view>
                    <view class="value">{{ getDate(electricalIno.orderDate) || '--' }}</view>
                </view>
                <view class="item b0">
                    <view class="label">发货日期：</view>
                    <view class="value">{{ getDate(electricalIno.deliveryDate) || '--' }}</view>
                </view>
            </view>
        </view>
        <view class="line"></view>
        <view class="shade">
            <view class="header">电气柜</view>
            <view class="flex">
                <view class="item">
                    <view class="label">开始日期：</view>
                    <view class="value">{{ getDate(electricalIno.ecStartDate) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">结束日期：</view>
                    <view class="value">{{ getDate(electricalIno.ecEndDate) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">安装状态：</view>
                    <view class="value">{{ getStatus(electricalIno.ecStatus) || '--' }}</view>
                </view>
                <view class="item people">
                    <view class="label">负责人：</view>
                    <view class="value">{{ electricalIno.ecRepName || '--' }}</view>
                </view>
            </view>
        </view>
        <view class="shade">
            <view class="header">现场安装</view>
            <view class="flex">
                <view class="item">
                    <view class="label">开始日期：</view>
                    <view class="value">{{ getDate(electricalIno.siStartTime) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">结束日期：</view>
                    <view class="value">{{ getDate(electricalIno.siEndTime) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">安装状态：</view>
                    <view class="value">{{ getStatus(electricalIno.siStatus) || '--' }}</view>
                </view>
                <view class="item people">
                    <view class="label">负责人：</view>
                    <view class="value">{{ electricalIno.siRepName || '--' }}</view>
                </view>
            </view>
        </view>
        <view class="card">
            <view class="header">文件状态</view>
            <view class="flex">
                <view class="item">
                    <view class="label">发货清单：</view>
                    <view class="value">{{ getHasFile(electricalIno.deliveryList) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">电气清单：</view>
                    <view class="value">{{ getHasFile(electricalIno.electricalList) || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">电气图：</view>
                    <view class="value">{{ getHasFile(electricalIno.electricalDiagram) || '--' }}</view>
                </view>
                <view class="item people">
                    <view class="label">是否验收：</view>
                    <view class="value">{{ getAcceptance(electricalIno.acceptance) || '--' }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import * as $http from '../../../../request/index'
import { ref } from 'vue'
const props = defineProps(["queryParams"])
const electricalIno = ref("")
// 获取详情
const getDetail = async () => {
    let params = {
        id: +props.queryParams.id,
    }
    console.log(props.queryParams, 'params');
    const res = await $http.post("/project/get_ep_info", params)
    electricalIno.value = res.data
}
const getDate = (date) => {
    if (date == '1000-01-01') return '--'
    return date
}
const getStatus = (v) => {
    let statusList = [
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
    let res = statusList.find(item => item.id == v)
    if (res) {
        return res.label
    }
}
const getHasFile = (v) => {
    return v ? '有' : '无'
}
const getAcceptance = (v) => {
    if (v == 1) {
        return '是'
    } else if (v == 2) {
        return '否'
    } else return '--'
}
getDetail()
</script>

<style lang="scss" scoped>
.project-info {
    padding-bottom: 30rpx;

    .card {
        border: solid 1rpx rgb(235, 235, 235);
        margin: 32rpx;
        padding: 32rpx;
        border-radius: 8rpx;

        .header {
            position: relative;
            font-weight: bold;
            font-size: 28rpx;
            padding-left: 26rpx;
            margin-bottom: 32rpx;

            &::before {
                content: "";
                display: block;
                width: 6rpx;
                height: 28rpx;
                background-color: rgb(12, 100, 245);
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .flex {
            display: flex;
            flex-wrap: wrap;
        }


        .item {
            width: 50%;
            font-size: 26rpx;
            margin-bottom: 42rpx;

            .label {
                font-weight: bold;
                margin-bottom: 18rpx;
            }

            .value {
                font-size: 24rpx;
                color: rgb(177, 177, 177);
                // padding: 0 30rpx;
                position: relative;
                display: inline;

                // &::after {
                //     content: "";
                //     display: block;
                //     width: 16rpx;
                //     height: 4rpx;
                //     background-color: rgb(36, 36, 36);
                //     position: absolute;
                //     left: 0;
                //     top: 50%;
                //     transform: translateY(-50%);
                // }

                // &::before {
                //     content: "";
                //     display: block;
                //     width: 16rpx;
                //     height: 4rpx;
                //     background-color: rgb(223, 38, 28);
                //     position: absolute;
                //     right: 0;
                //     top: 50%;
                //     transform: translateY(-50%);
                // }
            }
        }

        .b0 {
            margin-bottom: 0;
        }
    }



    .line {
        height: 24rpx;
        background-color: rgb(242, 245, 245);
    }

    .header-info {
        margin: 32rpx;

        .header {
            position: relative;
            font-weight: bold;
            font-size: 28rpx;
            padding-left: 26rpx;

            &::before {
                content: "";
                display: block;
                width: 6rpx;
                height: 28rpx;
                background-color: rgb(12, 100, 245);
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .info {
            padding-top: 30rpx;
            margin-top: 30rpx;
            border-top: 1px solid rgb(243, 243, 243);
        }

        .item {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            margin-bottom: 24rpx;
        }
    }

    .shade {
        border: solid 1rpx rgb(235, 235, 235);
        margin: 32rpx;
        padding: 32rpx;
        border-radius: 8rpx;

        .header {
            position: relative;
            font-weight: bold;
            font-size: 28rpx;
            margin-bottom: 32rpx;
            padding-left: 26rpx;

            &::before {
                content: "";
                display: block;
                width: 6rpx;
                height: 28rpx;
                background-color: rgb(12, 100, 245);
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .flex {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .item {
            width: 48%;
            font-size: 24rpx;
            background-color: rgb(242, 245, 247);
            padding: 24rpx;
            margin-bottom: 24rpx;
            box-sizing: border-box;

            .label {
                margin-bottom: 12rpx;
            }

            .value {
                color: rgb(145, 145, 145);
            }
        }

    }
}
</style>