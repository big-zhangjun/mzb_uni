<template>
    <view class="search-box">
        <input class="search" confirm-type="search" @confirm="handleEnter" v-model="customerName"
            @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入搜索关键字">
        <view class="filter" @click="handleFilter">
            <text>筛选</text>
            <image mode="aspectFit" class="icon" src="../../static/filter.png"></image>
        </view>
    </view>
    <view class="pages">
        <view class="card" v-for="item in list" :key="item.id" @click="goDetail(item)" v-if="list.length">
            <view class="header">
                <view class="title">{{ item.customerName || "通用耗材领料" }}</view>
                <up-icon name="lock" color="#2979ff" size="24" v-if="item.locked == 2"></up-icon>
                <up-icon name="lock-fill" color="#2979ff" size="24" v-if="item.locked == 1"></up-icon>
                <!-- <view class="level" :class="getColor(item.level)">P{{ item.level }}</view> -->
            </view>
            <view class="content">
                <view class="item" v-if="item.model">
                    <view class="size">规格型号：</view>
                    <view class="size-name">{{ item.model }}</view>
                </view>
                <view class="productName">
                    {{ item.applyRealName }}
                </view>
            </view>
            <view class="footer">
                <view class="item">
                    <view class="label">申请日期：</view>
                    <view class="name">{{ item.applyDate }}</view>
                </view>
                <view class="item" v-if="item.productNumber">
                    <view class="label">产品编号：</view>
                    <view class="name">{{ item.productNumber }}</view>
                </view>
            </view>
        </view>
        <u-empty mode="data" v-else>
        </u-empty>
    </view>
    <!-- 弹出层 -->
    <u-popup :show="show" @close="close" @open="open" mode="right" :closeOnClickOverlay="true">
        <filter @handleConfirm="handleConfirm" @handleReset="handleReset" :filterData="filterData"
            @handleCheck="handleCheck"></filter>
    </u-popup>
    <!-- <view class="add" @click="handleAdd" v-if="authority.includes(1)">
        <image class="img" mode="aspectFill" src="../../static/images/add.png" alt=""></image>
    </view> -->
    <FloatingButton @handleClick="handleAddShot" :type="'add'"></FloatingButton>

</template>

<script setup>
import FloatingButton from '../../../components/FloatingButton.vue';
import { ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app';
import * as $http from '../../../request/index'
import filter from "../../../components/Filter.vue";
const list = ref([])
const customerName = ref("")
let show = ref(false)
const param = ref({
    level: 0,
    productName: ''
})
const authority = ref([])
const filterData = ref([
    {
        title: "部门",
        single: true,
        key: "applyDeptID",
        type: '',
        checkList: [],
        children: [

        ]
    },
    {
        title: "在职离职",
        single: true,
        key: "resign",
        type: '',
        checkList: [],
        children: [
            {
                label: "在职",
                id: 2
            },
            {
                label: "离职",
                id: 1
            }
        ]
    },

    {
        title: "员工",
        key: "applyUserID",
        single: true,
        checkList: [],
        type: 'number',
        children: [

        ]
    }
])
const resign = ref(2)
const deptID = ref()
const disabled = ref(false)
const userList = ref([])
const deptList = ref([])
const form = ref({
    applyDeptID: undefined,
    applyUserID: undefined
})
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
const handleSearch = debounce(() => {
    handleEnter()
    // 处理搜索逻辑
}, 300); // 设置防抖延迟时间，单位为毫秒
const handleFilter = () => {
    show.value = true
}
const handleAddShot = () => {
    uni.navigateTo({
        url: "/subpkg1/pages/Material/addMaterial?type=add"
    })
}
const close = () => {
    show.value = false
}

const open = () => {

}
const getUserInfo = async () => {
    let id = uni.getStorageSync('user').id
    let res = await $http.post('/user/get_user_info', { id })
    let dataAuth = res.data.dataAuth
    let deptRes = await $http.post('/dept/get_dept_list2', {})
    // let userRes = await $http.post('/dept/get_dept_list2', {  })({applyDeptID:res.data.applyDeptID })
    switch (dataAuth) {
        case 0:
            deptList.value = deptRes.data
            disabled.value = false
            userList.value = []
            // form.value.applyDeptID = undefined
            // form.value.applyUserID = undefined
            break;
        case 1:
            deptList.value = deptRes.data.filter(item => item.id == res.data.deptID)
            let userRess = await $http.post('/user/get_user_list2', { deptID: res.data.deptID })
            userList.value = userRess.data
            disabled.value = false
            // form.value.applyDeptID = res.data.applyDeptID
            // form.value.applyUserID = res.data.id
            break
        case 2:
            deptList.value = deptRes.data.filter(item => item.id == res.data.deptID)
            form.value.applyDeptID = res.data.deptID
            let userRes = await $http.post('/user/get_user_list2', { deptID: res.data.deptID })
            userList.value = userRes.data
            // form.value.applyUserID = res.data.id
            disabled.value = true
            break
        // userList.value = userRes.data.data
    }
    getFilterData('applyDeptID', deptList.value, 'deptName', 'id')
    getFilterData('applyUserID', userList.value, 'userName', 'id')
}
const handleCheck = async ({ data, value }) => {
    if (data.key == "resign") {
        resign.value = value.id
        let userRes = await $http.post('/user/get_user_list2', { deptID: deptID.value, resign: resign.value })
        form.value.applyUserID = undefined
        form.value.applyDeptID = deptID.value
        userList.value = userRes.data
        getFilterData('applyUserID', userList.value, 'userName', 'id')
    }
    if (data.key == 'applyDeptID') {
        deptID.value = value.id
        let userRes = await $http.post('/user/get_user_list2', { deptID: deptID.value, resign: resign.value })
        form.value.applyUserID = undefined
        form.value.applyDeptID = value.id
        userList.value = userRes.data
        getFilterData('applyUserID', userList.value, 'userName', 'id')
    }

}
const handleConfirm = () => {
    pageIndex.value = 1
    let keys = ['productName', 'level', 'applyDeptID', 'applyUserID']
    filterData.value.forEach(item => {
        if (keys.includes(item.key)) {
            let v = item.checkList
            form.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    list.value = []
    getData()
}
const getFilterData = (key, list, label, id) => {
    let res = filterData.value.find(item => item.key == key)
    if (res) {
        res.children = list.map(item => {
            return {
                id: item[id],
                label: item[label]
            }
        })
    }
}
const handleReset = () => {
    pageIndex.value = 1
    let keys = ['productName', 'level', 'applyDeptID', 'applyUserID']

    filterData.value.forEach(item => {
        item.checkList = []
        if (keys.includes(item.key)) {
            let v = item.checkList
            form.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    list.value = []
    getData()
}
const totalPage = ref(1)
onReachBottom(() => {
    console.log(totalPage.value , pageIndex.value);
    if(totalPage.value <= pageIndex.value) return
    pageIndex.value++
    getData()
})
const pageIndex = ref(1)
const goDetail = (data) => {
    uni.navigateTo({
        url: `/subpkg1/pages/Material/detail?id=${data.id}&number=${data.number}`
    })
}

onShow(() => {
    authority.value = uni.getStorageSync("authority").filter(item => item.moduleID == 16).map(item => item.operateID);
    list.value = []
    getData()
    getUserInfo()
})
const getData = () => {
    let params = {
        customerName: customerName.value,
        deleted: 2,
        pageSize: 10,
        productName: param.value.productName,
        pageIndex: pageIndex.value,
        applyDeptID: +form.value.applyDeptID || 0,
        applyUserID: +form.value.applyUserID,
    }
    $http.post("/shotage/get_shotage_list", params).then(res => {
        list.value = [...list.value, ...res.data.records]
        totalPage.value = res.data.totalPage
    })
}
// 获取颜色class
const getColor = (v) => {
    let classNames = ['red', 'orange', 'green', 'cyan', 'blue']
    return classNames[v - 1]
}
// 搜索
const handleEnter = () => {
    list.value = []
    pageIndex.value = 1
    getData()
};
// 筛选确定
// const handleConfirm = () => {
//     list.value = []
//     pageIndex.value = 1
//     let keys = ['productName', 'level']
//     filterData.value.forEach(item => {
//         if (keys.includes(item.key)) {
//             let v = item.checkList
//             param.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
//         }
//     })
//     show.value = false
//     getData()
// }
// const handleReset = () => {
//     list.value = []
//     pageIndex.value = 1
//     let keys = ['productName', 'level']
//     filterData.value.forEach(item => {
//         item.checkList = []
//         if (keys.includes(item.key)) {
//             let v = item.checkList
//             param.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
//         }
//     })
//     show.value = false
//     getData()
// }
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
    // width: calc(100vw - 48rpx);
    // margin: 0 auto;
    padding: 0 24rpx;
    padding-bottom: 24rpx;
    padding-top: 24rpx;
    align-items: center;
    display: flex;
    z-index: 100;
    background-color: #fff;
    border-bottom: 24rpx solid #f1f1f1;

    .filter {
        margin-left: 24rpx;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #2c2c2c;

        .icon {
            width: 40rpx;
            object-fit: scale-down;
            height: 40rpx;
            margin-left: 10rpx;
        }
    }
}

.pages {
    // min-height: 100vh;
    background: linear-gradient(180deg, #FFFFFF 0%, #F2F3F5 100%);
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    min-height: calc(100vh - 216rpx);

    .card {
        width: 100%;
        // height: 200rpx;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);
        background-color: #fff;
        padding: 30rpx;
        box-sizing: border-box;
        border-radius: 12rpx;

        .header {
            font-size: 32rpx;
            color: #2E313C;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                max-width: 500rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .level {
                font-size: 24rpx;
                font-weight: normal;
                border-radius: 40rpx;
                padding: 8rpx 20rpx;
                color: #fff;
                background-color: rgb(252, 15, 15);
            }

            .red {
                color: #fff;
                background-color: rgb(252, 15, 15);
            }

            .orange {
                color: #fff;
                background-color: rgb(254, 178, 56);
            }

            .green {
                color: #fff;
                background-color: rgb(101, 192, 96);
            }

            .cyan {
                color: #fff;
                background-color: rgb(81, 215, 214);
            }

            .blue {
                color: #fff;
                background-color: rgb(47, 161, 224);
            }
        }

        .content {
            display: flex;
            margin-top: 20rpx;
            color: #919399;
            font-size: 28rpx;
            align-items: center;
            justify-content: space-between;

            .item {
                display: flex;
            }

            .size-name {
                color: #12151b;
            }
        }

        .footer {
            margin-top: 30rpx;
            width: 100%;
            box-sizing: border-box;
            border-top: solid 1rpx #EFEFEF;
            padding-top: 30rpx;
            font-size: 26rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #919399;

            .item {
                display: flex;
                align-items: center;
                gap: 10rpx;
            }

            .name {
                border-radius: 6rpx;
                color: #12151b;
            }
        }
    }
}

.add {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
    right: 30rpx;
    bottom: 137rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;

    .img {
        width: 50rpx;
        height: 50rpx;
    }
}
</style>