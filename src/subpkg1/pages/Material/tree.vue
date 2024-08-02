<template>
    <view class="search-box">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="materialName"
            @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入物料名称">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="MaterialModel"
            @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入规格型号">
    </view>
    <view class="pages">
        <view class="router">
            <view class="left">
                <view class="title" @click="handleRoute(item, idx)" :class="{ active: parentID !== item.id }"
                    v-for="(item, idx) in routeList" :key="item.id">
                    <view class="text">{{ item.groupName }}</view>
                    <up-icon name="arrow-right" v-if="routeList.length - 1 !== idx"></up-icon>
                </view>
            </view>
            <view class="right" @click="upOrDown = !upOrDown">
                <up-icon name="arrow-down" v-if="!upOrDown"></up-icon>
                <up-icon name="arrow-up" v-else></up-icon>
            </view>
        </view>
        <view class="cus" :class="{ upOrDown }">
            <view class="item" @click="handleTree(item)" :class="{ active: parentID == item.id }"
                v-for="item in treeList" :key="item.id">
                <view class="icon">
                    <up-icon size="20" name="plus-square-fill" color="rgb(91, 166, 250)"></up-icon>
                </view>
                <view class="text">{{ item.groupName }}</view>
                <up-icon name="arrow-right"></up-icon>
            </view>
        </view>

        <view class="line" v-show="treeList.length" v-if="upOrDown"></view>
        <view class="radio-item" v-for="item in materialList" :key="item.code">
            <!-- <view class="radio" :class="{ check: checkIdsList.includes(item.id) }"></view> -->
            <view class="info">
                <view class="it">
                    <view class="label">{{ item.materialName }}</view>
                    <view class="value">{{ item.MaterialModel }}</view>
                </view>
                <view class="it">
                    <view class="label">{{ item.code }}</view>
                    <view class="value">{{ item.unit }}</view>
                </view>
            </view>
            <view class="addOrRedu">
                <view class="redu" @click="handleDel(item)">-</view>
                <view class="num">{{ getNum(item.id) }}</view>
                <view class="add" @click="handleAdd($event, item)">
                    <view class="text">+</view>
                </view>
            </view>
        </view>
        <view class="footer">
            <view class="cart" @click="handleGoShopCart">
                <view class="num">{{ shopList.length }}</view>
                <image class="cart-img" width="160" height="160" mode="aspectFill" src="../../../static/images/pack.png"
                    alt=""></image>
            </view>
            <view class="submit" @click="handleSubmit">添加</view>
        </view>
    </view>
    <!-- <view class="bar" :style="{ left: targetX + 'rpx', top: targetY + 'rpx' }" ref="barA"></view> -->
</template>

<script setup>
import { computed, ref } from 'vue'
import * as $http from '../../../request/index'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
const debounce = (func, delay) => {
    let timeoutId;

    return function () {
        const context = this;
        const args = arguments;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};
const targetX = ref(750)
const targetY = ref(1000)
const routeList = ref([
    {
        id: 0,
        groupName: "全部",
        code: "",
    },
])
const barA = ref(null)
const upOrDown = ref(false)
const totalPage = ref(0)
const MaterialModel = ref("")
const materialName = ref("")
const pageIndex = ref(1)
const code = ref("")
const shotageID = ref("")
const groupID = ref(0)
const parentID = ref(0)
const treeList = ref([])
const materialList = ref([])
const materialID = ref("")
const materialData = ref({})
const shopList = ref([])
const handleSearch = debounce(() => {
    handleEnter()
}, 300); // 设置防抖延迟时间，单位为毫秒
const getGroupShotList = () => {
    // shotage/get_material_group_list
    materialList.value = []
    pageIndex.value = 1
    $http.post("/shotage/get_material_group_list", { parentID: parentID.value }).then(res => {
        treeList.value = res.data
        // code.value = res.data[0].code
        getMaerialList()
    })
}
onReachBottom(() => {
    //  
    console.log(totalPage.value, pageIndex.value);
    if (totalPage.value <= pageIndex.value) return
    pageIndex.value++
    getMaerialList()
})
const checkIdsList = computed(() => {
    // if (shopList.value) {
    return shopList.value.map(item => item.id)
    // } else {
    //     return []
    // }
})
const handleEnter = () => {
    materialList.value = []
    pageIndex.value = 1
    getMaerialList()
}
const getNum = (v) => {
    return shopList.value.filter(item => item.id == v).length
}
const handleTree = (data) => {
    parentID.value = data.id
    groupID.value = data.id
    code.value = data.code
    routeList.value.push(data)
    getGroupShotList()
}
const handleRoute = (data, idx) => {
    routeList.value.splice(idx + 1, routeList.value.length - idx - 1)
    code.value = data.code
    parentID.value = data.id
    groupID.value = data.id
    getGroupShotList()

}
const handleDel = (data) => {
    console.log(data);
    let index = shopList.value.findIndex(item => item.id == data.id)
    if (index != -1) {
        shopList.value.splice(index, 1)
    }
    uni.setStorageSync("shopList", shopList.value)
}
const handleAdd = ($event, data) => {
    console.log($event);
    let x = $event.target.x
    let y = $event.target.y
    targetY.value = y
    targetX.value = x
    createBall02(x, y)
    materialID.value = data.id
    materialData.value = data
    shopList.value.push({
        ...materialData.value,
        shotageID: +shotageID.value
    })
    uni.setStorageSync("shopList", shopList.value)
}
const getMaerialList = () => {
    let params = {
        MaterialModel: MaterialModel.value,
        code: code.value,
        groupID: groupID.value,
        materialName: materialName.value,
        pageIndex: pageIndex.value,
        pageSize: 10
    }
    $http.post("/shotage/get_material_list", params).then(res => {
        totalPage.value = res.data.totalPage
        materialList.value = [...materialList.value, ...res.data.records]
    })

}
const handleGoShopCart = () => {
    uni.navigateTo({
        url: `/subpkg1/pages/Material/shopCart?shotageID=${shotageID.value}`
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
const handleSubmit = () => {
    // shopList.value
    if (!shopList.value.length) {
        uni.showToast({
            title: "请选择数据",
            icon: "none"
        })
        return
    }
    const groupList = Object.values(groupById(shopList.value));
    console.log(groupList);
    groupList.forEach(async item => {
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
const updateShotageInfo = (params) => {
    $http.post("/shotage/update_shotage_info", params).then(res => {
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

const createBall02 = (x, y) => {
    console.log(barA.value, 'ss');
    return
    const bar = document.createElement('div')
    bar.style.position = 'absolute'
    bar.style.left = '0'
    bar.style.top = '0'
    bar.style.width = '0.533333rem'
    bar.style.height = '0.533333rem'
    bar.style.borderRadius = '50%'
    bar.style.backgroundColor = '#02b6fd'
    // transform
    bar.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    bar.style.transition = 'transform .5s linear'


    document.body.appendChild(bar)
    // 添加动画属性
    setTimeout(() => {
        let target = document.querySelector('.ele_car_icon')
        let targetX = (target.offsetLeft + target.offsetWidth / 2)
        let targetY = (target.offsetTop)
        bar.style.transform = 'translate(' + targetX + 'px,' + targetY + 'px)'
    }, 0);

    /**
     * 动画结束后，删除自己
     */
    bar.ontransitionend = function () {
        this.remove()
    }
}
onLoad((options) => {
    shotageID.value = options.id
    getGroupShotList()
})
onShow(() => {
    shopList.value = uni.getStorageSync("shopList") || []
})
</script>

<style lang="less" scoped>
.search {
    background-color: #f1f1f1;
    height: 80rpx;
    font-size: 28rpx;
    padding: 0 24rpx;
    border-radius: 40rpx;
    box-sizing: border-box;
    flex: 1;
}

.search-box {
    position: sticky;
    top: 0;
    padding: 0 24rpx;
    padding-bottom: 24rpx;
    padding-top: 24rpx;
    align-items: center;
    display: flex;
    gap: 30rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
    background-color: #fff;
    z-index: 110;
}

.pages {
    padding-bottom: 190rpx;

    .item {
        padding: 16rpx 32rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 12rpx 0;

        &:active {
            background-color: rgb(240, 240, 240);
        }

        .icon {
            width: 68rpx;
            height: 68rpx;
            background-color: rgb(223, 239, 254);
            margin-right: 20rpx;
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .text {
            margin-right: auto;
        }
    }

    .router {
        border-bottom: solid rgb(242, 241, 246) 24rpx;
        display: flex;
        align-items: center;
        gap: 12rpx;
        padding: 0 24rpx;
        padding-bottom: 24rpx;
        padding-top: 24rpx;
        overflow-x: auto;
        position: relative;
        justify-content: space-between;
        .left {
            flex: 1;
            display: flex;
                align-items: center;
        }
        .right {
            width: 60rpx;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .title {
            display: flex;
            align-items: center;
            gap: 12rpx;

            .text {
                white-space: nowrap;
            }
        }
    }

    .line {
        height: 24rpx;
        background-color: rgb(242, 241, 246);
    }

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

    .active {
        color: rgb(92, 166, 251);
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
}

.bar {
    position: absolute;
    width: 30rpx;
    height: 30rpx;
    background-color: rgb(92, 166, 251);
    border-radius: 50%;
    transition: .5s linear;
    z-index: 120;
}

.cus {
    height: 0;
    overflow: hidden;
}

.upOrDown {
    height: auto;
}
</style>
