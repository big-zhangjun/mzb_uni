<template>
    <view class="pages">
        <view class="card">
            <view class="header">
                <view class="title">缺料信息</view>
                <up-icon name="lock" color="#2979ff" size="24" v-if="detail.locked == 2"></up-icon>
                <up-icon name="lock-fill" color="#2979ff" size="24" v-if="detail.locked == 1"></up-icon>
                <view class="edit" @click="handleEdit">编辑</view>
                <view class="del" @click="del" v-if="authority.includes(2)">删除</view>
            </view>
            <view class="item" v-if="detail.productNumber">
                <view class="label">产品编号：</view>
                <view class="value">{{ detail.productNumber }}</view>
            </view>
            <view class="item" v-if="detail.model">
                <view class="label">型号：</view>
                <view class="model">{{ detail.model }}</view>
            </view>
            <view class="item" v-if="detail.customerName">
                <view class="label">客户名称：</view>
                <view class="value">{{ detail.customerName }}</view>
            </view>
            <view class="item">
                <view class="label">发货单位：</view>
                <view class="value">{{ detail.fromCompany }}</view>
            </view>
            <view class="item">
                <view class="label">申请人：</view>
                <view class="value">{{ detail.applyRealName }}</view>
            </view>
            <view class="item">
                <view class="label">来源：</view>
                <view class="value">{{ detail.source }}</view>
            </view>
            <view class="item">
                <view class="label">申请日期：</view>
                <view class="value">{{ detail.applyDate }}</view>
            </view>
            <view class="item">
                <view class="label">完整率：</view>
                <view class="value">{{ getProgress(detail.progress) }}</view>
            </view>
            <view class="item">
                <view class="label">备注：</view>
                <view class="value">{{ detail.remark || '--'}}</view>
            </view>
        </view>
        <view class="card">
            <view class="header">
                <view class="title">缺料列表</view>
            </view>
            <view class="list-item" v-for="item in shotList" :key="item.id">
                <view class="info">
                    <view class="title">
                        <view class="name">{{ item.materialName }} </view>
                       
                    </view>
                    <view class="model">{{ item.materialModel }}</view>
                    <view class="num">
                        <view class="amount">总数（{{ item.amount }}）</view>
                        <view class="amount">签收数量（{{ item.ready }}）</view>
                    </view>
                </view>
                <view class="look" @click="handleLook(item)">去查看</view>
            </view>
            <!-- <view class="add" @click="handleAddShot">+新增</view> -->
        </view>
        <FloatingButton @handleClick="handleAddShot" :type="'add'"></FloatingButton>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import * as $http from '../../../request/index'
import FloatingButton from '../../../components/FloatingButton.vue';
// import FloatingButton from '../../../components/FloatingButton.vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
const detail = ref("")
const shotList = ref([])
const id = ref("")
const authority = ref([])
onLoad((options) => {
    id.value = +options.id
    authority.value = uni.getStorageSync("authority").filter(item => item.moduleID == 100).map(item => item.operateID);
})
onShow(() => {
    getDetail(id.value)
    getMaterialShotList(id.value)
})
const getDetail = async (id) => {
    let res = await $http.post("/shotage/get_shotage_info", { id })
    detail.value = res.data

}
const getMaterialShotList = async (shotageID) => {
    let res = await $http.post("/shotage/get_material_shot_list", { shotageID })
    shotList.value = res.data
}
const handleLook = (data) => {
    uni.navigateTo({
        url: `/subpkg1/pages/Material/shot?id=${data.id}&shotageID=${id.value}&locked=${detail.value.locked}`
    })
    console.log(data);
}
const getProgress = (v) => {
    // if (v) {
    return v + '%'
    // }
}
const del = () => {
    if (detail.value.locked == 1) {
        uni.showToast({
            title: "该数据已经锁定，不允许删除",
            icon: "none"
        })
        return
    }
    uni.showModal({
        title: "确认删除该条数据？",
        success: (res) => {
            if (res.confirm) {
                $http.post("/shotage/delete_shotage_info", { id: +id.value, deleted: 1 }).then(res => {
                    if (res.status.retCode == 0) {
                        uni.$u.toast('操作成功')
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 2000);
                    }

                }).catch(err => {
                    uni.$u.toast(err.status.msg)
                })
            }
        }
    })
}
const handleAddShot = () => {
    if (detail.value.locked == 1) {
        uni.showToast({
            title: "该数据已经锁定，不允许新增",
            icon: "none"
        })
        return
    }
    uni.setStorageSync("shopList", [])
    uni.navigateTo({
        url: `/subpkg1/pages/Material/tree?id=${detail.value.id}`
    })
}
const handleEdit = () => {
    uni.navigateTo({
        url: `/subpkg1/pages/Material/addMaterial?type=edit&id=${detail.value.id}`
    })
}
</script>

<style lang="scss" scoped>
.pages {
    min-height: 100vh;
    background-color: rgb(242, 246, 249);
    overflow: hidden;

    .card {
        background-color: #fff;
        margin: 28rpx;
        border-radius: 12rpx;
        padding: 32rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);

        .header {
            margin-bottom: 32rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .edit {
                color: rgb(13, 175, 156);
                margin-left: auto;
            }

            .del {
                color: #7c7c7c;
                margin-left: 40rpx;
            }

            .title {
                position: relative;
                padding-left: 30rpx;
                font-weight: bold;
                margin-right: 20rpx;

                &::before {
                    content: "";
                    display: block;
                    width: 6rpx;
                    height: 30rpx;
                    background-color: rgb(55, 133, 250);
                    position: absolute;
                    left: 0;
                    top: 50%;
                    border-radius: 6rpx;
                    transform: translateY(-50%);
                }
            }
        }

        .item {
            display: flex;
            margin-bottom: 28rpx;
            align-items: center;
            font-size: 26rpx;

            &:last-child {
                margin-bottom: 0;
            }

            .label {
                color: #12151b;
            }

            .value {
                color: rgb(151, 151, 151);
            }

            .model {
                background-color: rgb(253, 229, 224);
                color: rgb(197, 124, 109);
                padding: 8rpx 12rpx;
                font-size: 22rpx;
                border-radius: 8rpx;
            }
        }

        .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 24rpx;
            background-color: rgb(239, 248, 247);
            border-radius: 12rpx;
            padding: 30rpx 36rpx;
            margin-bottom: 24rpx;

            .title {
                font-weight: bold;
                display: flex;
                .amount {
                    margin-left: 20rpx;
                    font-weight: normal;
                }
            }

            .info {
                flex: 1;
            }
            .num{
                display: flex;
                margin-top: 20rpx;
            }

            .model {
                margin-right: auto;
                color: rgb(27, 178, 163);
                margin-top: 20rpx;
            }

            .look {
                color: rgb(27, 178, 163);
                border-radius: 30rpx;
                font-weight: bold;
                border: solid 1rpx rgb(27, 178, 163);
                padding: 10rpx 18rpx;
                width: 82rpx;
            }
        }

        .add {
            width: 100%;
            line-height: 98rpx;
            border: solid 1rpx rgb(161, 240, 229);
            text-align: center;
            margin-top: 20rpx;
            border-radius: 12rpx;
            color: rgb(27, 178, 163);
            font-size: 26rpx;
        }
    }
}
</style>