<template>
    <view class="search-box">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="materialName"
            @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入物料名称">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="MaterialModel"
            @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入规格型号">
    </view>
    <view class="pages">
        <view class="router">
            <view class="title" @click="handleRoute(item, idx)" :class="{ active: parentID !== item.id }"
                v-for="(item, idx) in routeList" :key="item.id">
                <view class="text">{{ item.groupName }}</view>
                <up-icon name="arrow-right" v-if="routeList.length - 1 !== idx"></up-icon>
            </view>
        </view>
        <view class="item" @click="handleTree(item)" :class="{ active: parentID == item.id }" v-for="item in treeList"
            :key="item.id">
            <view class="icon">
                <up-icon size="20" name="plus-square-fill" color="rgb(91, 166, 250)"></up-icon>
            </view>
            <view class="text">{{ item.groupName }}</view>
            <up-icon name="arrow-right"></up-icon>
        </view>
        <view class="line" v-show="treeList.length"></view>
        <view class="radio-item" v-for="item in materialList" :key="item.code" @click="handleCheck(item)">
            <view class="radio" :class="{ check: materialID == item.id }"></view>
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
        </view>
        <view class="footer">
            <view class="submit" @click="handleSubmit">确定</view>
        </view>
    </view>

</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../../request/index'
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
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
const routeList = ref([
    {
        id: 0,
        groupName: "全部",
        code: "",
    },
    {
        id: 4,
        groupName: "原材料",
        code: "04"
    },
    {
        id: 699,
        code: "0403",
        groupName: "电气类"
    }
])
const totalPage = ref(0)
const MaterialModel = ref("")
const materialName = ref("")
const pageIndex = ref(1)
const code = ref("0403")
const shotageID = ref("")
const groupID = ref(699)
const parentID = ref(699)
const treeList = ref([])
const materialList = ref([])
const materialID = ref("")
const materialData = ref({})
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
    pageIndex.value++
    getMaerialList()
})
const handleEnter = () => {
    materialList.value = []
    pageIndex.value = 1
    getMaerialList()
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
const handleCheck = (data) => {
    materialID.value = data.id
    materialData.value = data
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
        totalPage.value = res.data.totalCount
        materialList.value = [...materialList.value, ...res.data.records]
    })

}
const handleSubmit = () => {
    if (!materialID.value) {
        uni.showToast({
            title: "请选择数据",
            icon: "none"
        })
        return
    }
    handleAddMaterial()
}
const handleAddMaterial = () => {
    let params = {
        materialID: +materialID.value,
        unit: materialData.value.unit,
        shotageID: +shotageID.value
    }
    $http.post("/shotage/add_material_shot_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.showToast({
                title: "操作成功",
                icon: "none"
            })
            getMaterialShotList()
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
onLoad((options) => {
    shotageID.value = options.id
    getGroupShotList()
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
    margin-top: 24rpx;
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
        overflow-x: auto;

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
        display: flex;
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
        align-items: center;
        justify-content: center;
        background-color: #fff;
        box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.05);

        .submit {
            width: calc(100% - 60rpx);
            height: 98rpx;
            background-color: rgb(92, 166, 251);
            border-radius: 12rpx;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>