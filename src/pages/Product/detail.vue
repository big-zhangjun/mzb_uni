<template>
    <view class="pages">
        <view class="bg">
        </view>
        <view class="card">
            <view class="top">
                <view class="title">{{ detail.customerName }}</view>
                <view class="flex">
                    <view class="number">产品名称：{{ detail.productName }}</view>
                    <view class="number">项目编号：{{ detail.number }}</view>
                </view>
            </view>
            <view class="bottom">
                <view class="item">
                    <view class="label">规格/型号</view>
                    <view class="value">{{ detail.model || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">罐体尺寸</view>
                    <view class="value">{{ detail.tankSize || '--' }}</view>
                </view>
                <view class="item">
                    <view class="label">优先等级</view>
                    <view class="value">{{ 'p'+ detail.level || '--' }}</view>
                </view>
            </view>
        </view>
        <view class="info mt border">
            <view class="item">
                <view class="label">工作压力(MPa)</view>
                <view class="value">{{ detail.workingPressure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">设计压力(MPa)</view>
                <view class="value">{{ detail.designPressure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">工作温度(℃)</view>
                <view class="value">{{ detail.workingTemperature || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐体厚度(mm)</view>
                <view class="value">{{ detail.tankthickness || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">球冠封头厚度(mm)</view>
                <view class="value">{{ detail.sphericalCrownThickness || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">椭圆封头厚度(mm)</view>
                <view class="value">{{ detail.ellipticalHeadThickness || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">加热功率(kw)</view>
                <view class="value">{{ detail.heatingPower || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">循环风机</view>
                <view class="value">{{ detail.circulatingFan || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">热电偶</view>
                <view class="value">{{ detail.thermocouple || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">检测口</view>
                <view class="value">{{ detail.inspectionPort || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">罐门结构</view>
                <view class="value">{{ detail.doorStructure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">开门方向</view>
                <view class="value">{{ detail.openingDirection || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">真空路数</view>
                <view class="value">{{ detail.vacuumNumber || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">真空泵</view>
                <view class="value">{{ detail.vacuumPump || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">缓冲罐(m³)</view>
                <view class="value">{{ detail.bufferTank || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">真空度</view>
                <view class="value">{{ detail.vacuumDegree || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">储气罐规格</view>
                <view class="value">{{ detail.assModel || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">储气罐工作压力(MPa)</view>
                <view class="value">{{ detail.assWorkingPressure || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">储气罐筒体厚度(mm)</view>
                <view class="value">{{ detail.assTankthickness || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">储气罐封头厚度(mm)</view>
                <view class="value">{{ detail.assHeadThickness || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">空压机</view>
                <view class="value">{{ detail.airCompressor || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">制氮机</view>
                <view class="value">{{ detail.nitrogenPlant || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">增压机</view>
                <view class="value">{{ detail.supercharger || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐内小车</view>
                <view class="value">{{ detail.carInTank || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">罐外小车</view>
                <view class="value">{{ detail.carOutTank || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">桥架</view>
                <view class="value">{{ detail.bridgeTray || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">牵引车</view>
                <view class="value">{{ detail.tractor || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">泄压阀</view>
                <view class="value">{{ detail.pressureReliefValve || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">进气阀组</view>
                <view class="value">{{ detail.intakeValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">排气阀组</view>
                <view class="value">{{ detail.exhaustValveGroup || '--' }}</view>
            </view>
        </view>
        <view class="info pt border">
            <view class="item">
                <view class="label">容积(m³)</view>
                <view class="value">{{ detail.volume || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">冷却阀组</view>
                <view class="value">{{ detail.coolingValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">排空阀组</view>
                <view class="value">{{ detail.emptyValveGroup || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">气冷阀组</view>
                <view class="value">{{ detail.airCooledValve || '--' }}</view>
            </view>
        </view>
        <view class="delete" v-if="authority.includes(2)" @click="handleDelete">删除</view>
    </view>
    <!-- <view class="edit" @click="handleEdit">
        <image class="img" mode="aspectFill" src="../../static/images/edit.png" alt=""></image>
    </view> -->
    <up-modal :show="show" @confirm="confirm" @cancel="show = false" showCancelButton title="提示"
        content='确认删除该条数据？'></up-modal>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../request/index'
import { onLoad, onShow } from '@dcloudio/uni-app';
const handleEdit = () => {
    uni.navigateTo({
        url: `/pages/Product/productForm?type=edit&id=${data.value}&number=${detail.value.number}`
    })
}
const authority = ref([])

let data = ref("")
let number = ref("")
const getStatus = (v) => {
    let list =
        [
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
    let res = list.find(item => item.id == v)
    if (res) {
        return res.label
    } else {
        return '未开始'
    }
}
const show = ref(false)
const detail = ref({})
onLoad((options) => {
    const { id, number } = options
    data.value = +id
    number.value = number

})
const getData = (id, number) => {
    let params = {
        id,
        number
    }
    $http.post("/project/get_project_info", params).then(res => {
        detail.value = res.data
    })

}
onShow(()=> {
    authority.value = uni.getStorageSync("authority").filter(item=> item.moduleID == 16).map(item=> item.operateID);
    getData(+data.value , number.value)

})
const handleDelete = () => {
    show.value = true
}
const confirm = () => {
    $http.post("/project/del_project_info", { id: data.value }).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            show.value = false
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }

    })

}
</script>

<style lang="less" scoped>
.pages {
    height: 100vh;
    position: relative;
    overflow: auto;

    .bg {
        background: rgb(55, 133, 250);
        height: 160rpx;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }

    .flex {
        display: flex;
        justify-content: space-between;
    }

    .card {
        width: calc(100% - 60rpx);
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;
        box-sizing: border-box;
        position: relative;
        z-index: 10;
        margin: 0 auto;
        margin-top: 50rpx;
        margin-bottom: 40rpx;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);

        .top {
            border-bottom: solid #ebebeb 1px;
            padding-bottom: 20rpx;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: #12151b;
            }

            .number {
                margin: 20rpx 0;
                font-size: 28rpx;
                color: #666;
            }
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            text-align: center;
            margin: 0 20rpx;
            margin-top: 30rpx;
            color: rgb(97, 103, 129);
            font-size: 28rpx;

            .label {
                color: rgb(160, 167, 193);
                margin-bottom: 8rpx;
            }
        }
    }

    .info {
        padding: 0 30rpx;
        display: flex;
        flex-direction: column;
        gap: 30rpx;

        .item {
            display: flex;
            font-size: 28rpx;
            justify-content: space-between;

            .label {
                color: rgb(97, 103, 129);
            }

            .value {
                color: #12151b;
            }
        }
    }

    .border {
        border-bottom: solid 20rpx rgb(243, 244, 246);
        padding-bottom: 30rpx;
    }
    .pt {
        padding-top: 30rpx;
    }
}

.delete {
    width: calc(100% - 60rpx);
    margin: 0 auto;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    line-height: 88rpx;
    background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
    border-radius: 8rpx;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
}

.edit {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(175, 113, 72, 0.45);
    right: 30rpx;
    bottom: 137rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;

    .img {
        width: 60rpx;
        height: 60rpx;
    }
}
</style>