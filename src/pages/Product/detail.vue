<template>
    <view class="pages">
        <view class="card">
            <view class="item">
                <view class="label">客户名称：</view>
                <view class="value">{{ detail.customerName }}</view>
            </view>
            <view class="item">
                <view class="label">产品名称：</view>
                <view class="value">{{ detail.productName }}</view>
            </view>
            <view class="item">
                <view class="label">规格型号：</view>
                <view class="value">{{ detail.model }}</view>
            </view>
            <view class="item">
                <view class="label">优先级：</view>
                <view class="value">P{{ detail.level }}</view>
            </view>
        </view>
        <view class="card">
            <view class="item">
                <view class="label">电气柜负责人：</view>
                <view class="value">{{ detail.ecRepName || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">电气柜安装状态：</view>
                <view class="value">{{ getStatus(detail.ecStatus) }}</view>
            </view>
            <view class="item">
                <view class="label">电气柜开始日期：</view>
                <view class="value">{{ detail.ecStartDate }}</view>
            </view>
            <view class="item">
                <view class="label">电气柜结束日期：</view>
                <view class="value">{{ detail.ecEndDate }}</view>
            </view>
        </view>
        <view class="card">
            <view class="item">
                <view class="label">安装负责人：</view>
                <view class="value">{{ detail.siRepName || '--' }}</view>
            </view>
            <view class="item">
                <view class="label">安装开始时间：</view>
                <view class="value">{{ detail.siStartTime }}</view>
            </view>
            <view class="item">
                <view class="label">安装结束时间：</view>
                <view class="value">{{ detail.siEndTime }}</view>
            </view>
            <view class="item">
                <view class="label">现场安装情况：</view>
                <view class="value">{{ getStatus(detail.siStatus) }}</view>
            </view>
        </view>
        <view class="delete" @click="handleDelete">删除</view>
    </view>
    <view class="edit" @click="handleEdit">
        <image class="img" mode="aspectFill" src="../../static/images/edit.png" alt=""></image>
    </view>
    <up-modal :show="show" @confirm="confirm" @cancel="show = false" showCancelButton title="提示"
        content='确认删除该条数据？'></up-modal>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../request/index'
import { onLoad } from '@dcloudio/uni-app';
const handleEdit = () => {
    uni.navigateTo({
        url: `/pages/Product/productForm?type=edit&id=${data.value}&number=${detail.value.number}`
    })
}
let data = ref("")
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
    getData(+id, number)
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
    background: #F2F2F7;
    padding: 30rpx;

    .card {
        background-color: #fff;
        width: 100%;
        box-sizing: border-box;
        border-radius: 12rpx;
        padding: 0 30rpx;
        margin-bottom: 30rpx;

        .item {
            display: flex;
            padding: 32rpx 0;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #EBEBEB;

            &:last-child {
                border: none;
            }

            .label {
                font-size: 32rpx;
                color: #12151b;
                font-weight: bold;
                min-width: 200rpx;
            }

            .value {
                color: #2E313C;
                font-size: 32rpx;
                flex: 1;
                text-align: right;
            }
        }
    }

}

.delete {
    width: 100%;
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