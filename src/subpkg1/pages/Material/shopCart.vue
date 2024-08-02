<template>
    <view class="card">
        <view class="radio-item" v-for="(item, idx) in shopList" :key="item.code">
            <!-- <view class="radio" :class="{ check: checkIdsList.includes(item.id) }"></view> -->
            <view class="info">
                <view class="it">
                    <view class="label">{{ item[0].materialName }}</view>
                    <view class="value">{{ item[0].MaterialModel }}</view>
                </view>
                <view class="it">
                    <view class="label">{{ item[0].code }}</view>
                    <view class="value">{{ item[0].unit }}</view>
                </view>
            </view>
            <view class="addOrRedu">
                <view class="redu" @click="handleDel(item[0], idx)">-</view>
                <view class="num">{{ item.length }}</view>
                <view class="add" @click="handleAdd(item[0], idx)">
                    <view class="text">+</view>
                </view>
            </view>
        </view>
    </view>
    <view class="footer">
        <view class="cart">
            <view class="num">{{ shopList.flat().length }}</view>
            <image class="cart-img" width="160" height="160" mode="aspectFill" src="../../../static/images/pack.png"
                alt=""></image>
        </view>
        <view class="submit" @click="handleSubmit">添加</view>
    </view>
</template>

<script setup>
import * as $http from '../../../request/index'
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
const shotageID = ref("")
const shopList = ref([])
const handleSubmit = () => {
    if (!shopList.value.length) {
        uni.showToast({
            title: "请选择数据",
            icon: "none"
        })
        return
    }
    // const groupList = Object.values(groupById(shopList.value));
    shopList.value.forEach(async item => {
        await handleAddMaterial(item[0], item.length)
    })
    getMaterialShotList()
}
const handleAddMaterial = (data, amount) => {
    let params = {
        materialID: +data.id,
        unit: data.unit,
        shotageID: +shotageID.value,
        amount
    }
    $http.post("/shotage/add_material_shot_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.showToast({
                title: "操作成功",
                icon: "none"
            })
        }
    }).catch(err => {
        uni.showToast({
            title: err.status.msg,
            icon: "none"
        })
    })

}

const getMaterialShotList = async () => {
    let dataSource = await $http.post("/shotage/get_material_shot_list", { shotageID: +shotageID.value })
    let fm = dataSource.data.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let fz = dataSource.data.map(item => item.ready).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let res = await $http.post("/shotage/get_shotage_info", { id: +shotageID.value })
    let params = {
        fromCompany: res.data.fromCompany,
        id: res.data.id,
        progress: +(fz / fm * 100).toFixed(0),
        source: res.data.source
    }
    updateShotageInfo(params)
}
const handleDel = (data, idx) => {
    console.log(data);
    let index = shopList.value[idx].findIndex(item => item.id == data.id)
    if (index != -1) {
        shopList.value[idx].splice(index, 1)
        if(!shopList.value[idx].length) {
            shopList.value.splice(idx, 1)
        }
    }
    uni.setStorageSync('shopList',shopList.value.flat() )
}

const updateShotageInfo = (params) => {
    $http.post("/shotage/update_shotage_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.redirectTo({
                    url: `/subpkg1/pages/Material/detail?id=${shotageID.value}`
                })
            }, 2000);
        }

    }).catch(err => {
        uni.$u.toast(err.status.msg)
    })
}
const groupById = (array) => {
    return array.reduce((acc, item) => {
        // 如果累加器中没有这个id，创建一个新的数组
        if (!acc[item.id]) {
            acc[item.id] = [];
        }
        // 将当前项目推入对应id的数组中
        acc[item.id].push(item);
        return acc;
    }, {});
};
const handleAdd = (data, idx) => {
    shopList.value[idx].push(data)
    uni.setStorageSync('shopList',shopList.value.flat() )
}
onLoad((options)=> {
    shotageID.value = options.shotageID
    shopList.value =  Object.values(groupById(uni.getStorageSync("shopList")))
})
</script>

<style lang="scss" scoped>
.radio-item {
    border: solid rgb(236, 237, 239) 1rpx;
    padding: 20rpx 38rpx;
    box-sizing: border-box;
    width: calc(100vw - 56rpx);
    margin: 0 auto;
    margin-top: 30rpx;
    align-items: center;

    .radio {
        width: 36rpx;
        height: 36rpx;
        border-radius: 36rpx;
        border: solid 2rpx rgb(92, 166, 251);
        margin-right: 30rpx;
    }

    .check {
        position: relative;

        &::before {
            content: "";
            display: block;
            width: 16rpx;
            height: 16rpx;
            background-color: rgb(92, 166, 251);
            position: absolute;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .info {
        flex: 1;
        font-size: 24rpx;

        .it {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20rpx;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .addOrRedu {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 36rpx;

        .redu,
        .add {
            border: solid #5ca6fb 1rpx;
            border-radius: 8rpx;
            width: 60rpx;
            line-height: 60rpx;
            text-align: center;
            position: relative;
        }

        .num {
            font-size: 26rpx;
            margin: 0 30rpx;
        }
    }
}

.footer {
    position: fixed;
    bottom: 0;
    height: 160rpx;
    width: 100%;
    left: 0;
    display: flex;
    padding: 0 30rpx;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.05);
    padding-left: 0;

    .submit {
        height: 98rpx;
        flex: 1;
        background-color: rgb(92, 166, 251);
        border-radius: 12rpx;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cart {
        width: 128rpx;
        height: 128rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .num {
            background-color: red;
            position: absolute;
            right: 22rpx;
            top: 30rpx;
            color: #fff;
            padding: 4rpx 12rpx;
            border-radius: 30rpx;
            ;
            font-size: 20rpx;
        }

        .cart-img {
            width: 60rpx;
            height: 60rpx;
        }
    }
}
</style>