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
            <!-- <view class="menu-item" @click="goMaterial">
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/order.png" alt=""></image>
                </view>
                <text class="txt">缺料报备</text>
            </view> -->
        </view>
        <view class="pic-menu">
            <view class="pic-menu-item"  @click="goMaterial">
                <text>缺料报备</text>
                <view class="icon">
                    <image class="img" mode="aspectFill" src="../../../static/menu/rl.png" alt=""></image>
                </view>

            </view>
            <view class="pic-menu-item red"  @click="goMarkdown">
                <text>备忘录</text>
                <view class="icon bwl">
                    <image class="img" mode="aspectFill" src="../../../static/menu/bwl.png" alt=""></image>
                </view>
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
const goMaterial = () => {
    SubscriptionMessage()
    uni.navigateTo({
        url: `/subpkg1/pages/Material/index`

    })
}
const goMarkdown = () => {
    SubscriptionMessage()
    uni.navigateTo({
        url: `/subpkg1/pages/Product/components/memorandums`
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
    padding: 32rpx 22rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .menu-item {
        display: flex;
        width: 20%;
        flex-direction: column;
        font-size: 24rpx;
        align-items: center;
        color: rgb(64, 62, 64);

        .icon {
            width: 78rpx;
            height: 78rpx;
            background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
            border-radius: 78rpx;
            margin-bottom: 18rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .img {
                width: 42rpx;
                height: 42rpx;
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

.pic-menu {
    display: flex;
    background-color: #fff;
    width: calc(100vw - 48rpx);
    margin: 0 auto;
    box-sizing: border-box;
    padding: 24rpx 10rpx;
    border-radius: 12rpx;
    margin-top: 24rpx;

    .pic-menu-item {
        width: calc(50% - 28rpx);
        background: linear-gradient(to right, #fdf6ee, #fcf1df);
        margin: 0 14rpx;
        box-sizing: border-box;
        padding: 0 24rpx;
        height: 108rpx;
        border-radius: 12rpx;
        font-weight: bold;
        font-size: 26rpx;
        display: flex;
        padding-top: 24rpx;
        padding-right: 0;
        justify-content: space-between;
        position: relative;

        .img {
            // width: 42rpx;
            width: 60rpx;
            height: 60rpx;
            position: absolute;
            right: 24rpx;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .icon {
        width: 108rpx;
        height: 108rpx;
        position: absolute;
        right: 0;
        top: 0;

        &::before {
            content: "";
            background: url("../../../static/menu/rl.png") no-repeat;
            background-size: contain;
            width: 100%;
            height: 100%;
            opacity: .2;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .red {
        background: linear-gradient(to right, rgb(255, 241, 238), rgb(255, 207, 197));
    }
    .bwl {
        &::before {
            content: "";
            background: url("../../../static/menu/bwl.png") no-repeat;
            background-size: contain;
            width: 100%;
            height: 100%;
            opacity: .2;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
}
</style>