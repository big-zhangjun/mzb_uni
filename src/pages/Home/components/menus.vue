<template>
    <view class="pages">
        <view class="card">
            <view class="menu-item" @click="goPoduct">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/client.png" alt=""></image>
                </view>
                <text class="txt">项目管理</text>
            </view>
            <view class="menu-item" @click="goElectrical">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/report.png" alt=""></image>
                </view>
                <text class="txt">电气计划</text>
            </view>
            <view class="menu-item" @click="addWorkLog">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/order.png" alt=""></image>
                </view>
                <text class="txt">日志列表</text>
            </view>
            <view class="menu-item" @click="goStatistics">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/order.png" alt=""></image>
                </view>
                <text class="txt">统计报表</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const goPoduct = () => {
    SubscriptionMessage()
    uni.navigateTo({
        url: "/pages/Product/index"
    })
}
const goElectrical = () => {
    SubscriptionMessage()
    uni.navigateTo({
        url: "/pages/Electrical/index"
    })
}
// 订阅消息按钮
const SubscriptionMessage = () => {
    const tmplIds = "u8RuqCb4KsxNnPOrTaFkidLPJhmv-h4A4JvVVz2zIkc"
    // 获取小程序订阅状态
    uni.getSetting({
        withSubscriptions: true,
        success(res) {
            console.log(res, '订阅信息', res.subscriptionsSetting);
            if (!res.subscriptionsSetting.mainSwitch) {
                uni.openSetting({
                    success(res) {
                        console.log('打开设置页', res.authSetting);
                    }
                })
            } else {
                uni.requestSubscribeMessage({
                    tmplIds: [tmplIds],
                    success(res) {
                        console.log('requestSubscribeMessage 订阅信息', res);
                        if (res[tmplIds] ==
                            "accept") { // 用户点击确定后
                            console.log('用户订阅点击确定按钮');
                            // 后端接口
                        } else {
                            uni.showModal({
                                title: '您未开启消息订阅',
                                content: '为了给您提供更好的服务，请您授权消息订阅',
                                success: res2 => {
                                    if (res2.confirm) {
                                        uni.openSetting({
                                            success(res) {
                                                console.log('打开设置页', res.authSetting);
                                            }
                                        })
                                    } else {
                                        console.log('决绝')
                                    }
                                }
                            })

                        }
                    },
                    fail(errMessage) {
                        console.log("订阅消息 失败 ", errMessage);
                    },
                    complete() {
                        console.log("成功 失败都执行 ");
                    }
                })
            }
        },
    })
}
const addWorkLog = () => {
    SubscriptionMessage()
    // uni.navigateTo({
    //     url: `/pages/Detail/workLog?type=add`
    // })
    uni.navigateTo({
        url: `/pages/Work/index`
    })
}
const goStatistics = () => {
    SubscriptionMessage()
    uni.navigateTo({
        // url: `/subpkg1/pages/Statistics/index`
        url: `/pages/Chart/index`
    })
}
</script>

<style lang="less" scoped>
.pages {
    // margin-top: 24rpx;
    background-color: #f2f2f2;
    padding-top: 24rpx;
}

.card {
    width: calc(100vw - 48rpx);
    background: #fff;
    border-radius: 20rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 60rpx 32rpx;
    display: flex;
    justify-content: space-between;

    .menu-item {
        display: flex;
        flex-direction: column;
        font-size: 28rpx;
        align-items: center;
        color: rgb(64, 62, 64);

        .icon {
            width: 88rpx;
            height: 88rpx;
            background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
            border-radius: 88rpx;
            margin-bottom: 18rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .img {
                width: 52rpx;
                height: 52rpx;
            }
        }

        &:nth-child(2) {
            .icon {
                background: linear-gradient(160deg, rgb(244, 204, 114) 0%, rgb(245, 170, 97) 100%);

                .img {
                    width: 44rpx;
                    height: 44rpx;
                }
            }
        }

        &:nth-child(3) {
            .icon {
                background: linear-gradient(160deg, rgb(80, 147, 233) 0%, rgb(82, 125, 252) 100%);
                ;

                .img {
                    width: 50rpx;
                    height: 50rpx;
                }
            }
        }

    }
}
</style>