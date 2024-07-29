<template>
    <view class="project-info">
        <view class="header-info">
            <view class="header">基本信息</view>
            <view class="info">
                <view class="item">
                    <view class="label">客户名称：</view>
                    <view class="value">{{ projectInfo.customerName || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">产品名称：</view>
                    <view class="value">{{ projectInfo.productName || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">项目编号：</view>
                    <view class="value">{{ projectInfo.number || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">规格/型号：</view>
                    <view class="value">{{ projectInfo.model || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">罐体尺寸：</view>
                    <view class="value">{{ projectInfo.tankSize || '--' }}</view>
                </view>
                <view class="item b0">
                    <view class="label">优先等级：</view>
                    <view class="value">{{ 'p' + projectInfo.level || '--' }}</view>
                </view>
            </view>
        </view>
        <view class="line"></view>
        <view class="shade">
            <view class="item">
                <view class="label">容积(m³)</view>
                <view class="value">{{ projectInfo.volume || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">桥架</view>
                <view class="value">{{ projectInfo.bridgeTray || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">牵引车</view>
                <view class="value">{{ projectInfo.tractor || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">泄压阀</view>
                <view class="value">{{ projectInfo.pressureReliefValve || '--' }}</view>
            </view>
        </view>
        <view class="card">
            <view class="item">
                <view class="label">工作压力(MPa)</view>
                <view class="value">{{ projectInfo.workingPressure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">设计压力(MPa)</view>
                <view class="value">{{ projectInfo.designPressure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">工作温度(℃)</view>
                <view class="value">{{ projectInfo.workingTemperature || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐体厚度(mm)</view>
                <view class="value">{{ projectInfo.tankthickness || '--' }}</view>
            </view>
            <view class="item b0">
                <view class="label">球冠封头厚度(mm)</view>
                <view class="value">{{ projectInfo.sphericalCrownThickness || '--' }}</view>
            </view>
        </view>
        <view class="card">
            <view class="item">
                <view class="label">椭圆封头厚度(mm)</view>
                <view class="value">{{ projectInfo.ellipticalHeadThickness || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">加热功率(kw)</view>
                <view class="value">{{ projectInfo.heatingPower || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">循环风机</view>
                <view class="value">{{ projectInfo.circulatingFan || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">热电偶</view>
                <view class="value">{{ projectInfo.thermocouple || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">检测口</view>
                <view class="value">{{ projectInfo.inspectionPort || '--' }}</view>
            </view>
        </view>
        <view class="card">
            <view class="item">
                <view class="label">空压机</view>
                <view class="value">{{ projectInfo.airCompressor || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">制氮机</view>
                <view class="value">{{ projectInfo.nitrogenPlant || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">增压机</view>
                <view class="value">{{ projectInfo.supercharger || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐内小车</view>
                <view class="value">{{ projectInfo.carInTank || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐外小车</view>
                <view class="value">{{ projectInfo.carOutTank || '--' }}</view>
            </view>
        </view>
        <view class="card">

            <view class="item">
                <view class="label">冷却阀组</view>
                <view class="value">{{ projectInfo.coolingValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">排空阀组</view>
                <view class="value">{{ projectInfo.emptyValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">气冷阀组</view>
                <view class="value">{{ projectInfo.airCooledValve || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">进气阀组</view>
                <view class="value">{{ projectInfo.intakeValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">排气阀组</view>
                <view class="value">{{ projectInfo.exhaustValveGroup || '--' }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
const props = defineProps(["projectInfo"])
</script>

<style lang="scss" scoped>
.project-info {
    padding-bottom: 30rpx;
    .card {
        border: solid 1rpx rgb(235, 235, 235);
        margin: 32rpx;
        padding: 32rpx;
        border-radius: 8rpx;
        display: flex;
        flex-wrap: wrap;



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
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            width: 30%;
            font-size: 24rpx;
            background-color: rgb(242, 245, 247);
            padding: 24rpx;
            margin-bottom: 24rpx;
            box-sizing: border-box;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>