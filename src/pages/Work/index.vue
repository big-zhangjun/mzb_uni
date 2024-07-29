<template>
    <div class="pages">
        <view class="header">
            <view class="search-box">
                <input class="search" confirm-type="search" @confirm="handleEnter" v-model="content"
                    @keyup.enter="handleEnter" @input="handleSearch" type="text" placeholder="请输入搜索关键字">
                <view class="filter" @click="handleFilter" v-if="!disabled">
                    <text>筛选</text>
                    <image mode="aspectFit" class="icon" src="../../static/filter.png"></image>
                </view>
            </view>
            <!-- 弹出层 -->
            <u-popup :show="show" @close="close" mode="right" :closeOnClickOverlay="true">
                <filter @handleConfirm="handleConfirm" @handleReset="handleReset" :filterData="filterData"
                    @handleCheck="handleCheck"></filter>
            </u-popup>
        </view>
        <view class="add" @click="handleAdd">
            <image class="img" mode="aspectFill" src="../../static/images/add.png" alt=""></image>
        </view>
        <view class="list" v-if="dataSource.length">
            <view class="card" v-for="item in dataSource" :key="item.id">
                <view class="card-header">
                    <view class="timer">时间：{{ item.blogDate }}</view>
                    <view class="productNumber">{{ item.productNumber }}</view>
                    <view class="name">{{ item.realName }}</view>
                </view>
                <view class="content">
                    <view class="item">
                        <view class="round">客</view>
                        <view class="right">
                            <view class="label">客户名称</view>
                            <view class="value">
                                <text>{{ item.customerName }}</text>
                                <text class="model">{{ item.model }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="item">
                        <view class="round nei">内</view>
                        <view class="right">
                            <view class="label">内容</view>
                            <view class="value">{{ item.content }}</view>
                        </view>
                    </view>
                    <view class="item">
                        <view class="round address">地</view>
                        <view class="right">
                            <view class="label">地址</view>
                            <view class="value">{{ item.address }}</view>
                        </view>
                    </view>
                    <view class="item" v-if="item.remark">
                        <!-- <view class="round">地</view> -->
                        <view class="right">
                            <view class="value">备注：{{ item.remark }}</view>
                            <!-- <view class="value">{{ item.content }}</view> -->
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="no-data" v-else style="margin-top: 100rpx;">
            <u-empty mode="data"  >
            </u-empty>
        </view>
 
    </div>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../request/index'
import filter from "../../components/Filter.vue";
import { onReachBottom } from '@dcloudio/uni-app';
const dataSource = ref([])
const content = ref("")

const filterData = ref([
    {
        title: "部门",
        single: true,
        key: "deptID",
        type: '',
        checkList: [],
        children: [

        ]
    },
    {
        title: "员工",
        key: "userID",
        single: true,
        checkList: [],
        type: 'number',
        children: [

        ]
    }
])
const show = ref(false)
const totalPage = ref(0)
const pageIndex = ref(1)
const disabled = ref(false)
const userList = ref([])
const deptList = ref([])
const form = ref({
    deptID: undefined,
    userID: undefined
})
const close = () => {
    show.value = false
}
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
onReachBottom(() => {
     
    pageIndex.value++
    getData()
})
const handleAdd = () => {
    SubscriptionMessage()
    uni.navigateTo({
        url: `/pages/Detail/workLog?type=add`
    })
}
const handleSearch = debounce(() => {
    handleEnter()
    // 处理搜索逻辑
}, 300); // 设置防抖延迟时间，单位为毫秒
// 搜索
const handleEnter = () => {
    dataSource.value = []
    pageIndex.value = 1
    getData()
};
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
const getUserInfo = async () => {
    let id = uni.getStorageSync('user').id
    let res = await $http.post('/user/get_user_info', { id })
    let dataAuth = res.data.dataAuth
    let deptRes = await $http.post('/dept/get_dept_list2', {})
    // let userRes = await $http.post('/dept/get_dept_list2', {  })({deptID:res.data.deptID })
    switch (dataAuth) {
        case 0:
            deptList.value = deptRes.data
            disabled.value = false
            userList.value = []
            form.value.deptID = undefined
            form.value.userID = undefined
            break;
        case 1:
            deptList.value = deptRes.data.filter(item => item.id == res.data.deptID)
            let userRess = await $http.post('/user/get_user_list2', { deptID: res.data.deptID })
            userList.value = userRess.data
            disabled.value = false
            form.value.deptID = res.data.deptID
            form.value.userID = res.data.id
            break
        case 2:
            deptList.value = deptRes.data.filter(item => item.id == res.data.deptID)
            form.value.deptID = res.data.deptID
            let userRes = await $http.post('/user/get_user_list2', { deptID: res.data.deptID })
            userList.value = userRes.data
            form.value.userID = res.data.id
            disabled.value = true
            break
        // userList.value = userRes.data.data
    }
    getFilterData('deptID', deptList.value, 'deptName', 'id')
    getFilterData('userID', userList.value, 'userName', 'id')
}
const handleCheck = async ({ data, value }) => {
    if (data.key == 'deptID') {
        let userRes = await $http.post('/user/get_user_list2', { deptID: value.id })
        form.value.userID = undefined
        form.value.deptID = value.id
        userList.value = userRes.data
        getFilterData('userID', userList.value, 'userName', 'id')
    }
}
const handleConfirm = () => {
    pageIndex.value = 1
    let keys = ['deptID', 'userID']
    filterData.value.forEach(item => {
        if (keys.includes(item.key)) {
            let v = item.checkList
            form.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    dataSource.value = []
    getData()
}
const handleReset = () => {
    pageIndex.value = 1
    let keys = ['deptID', 'userID']
    filterData.value.forEach(item => {
        item.checkList = []
        if (keys.includes(item.key)) {
            let v = item.checkList
            form.value[item.key] = item.type == 'number' ? v.join("") ? +v.join("") : 0 : v.join("")
        }
    })
    show.value = false
    dataSource.value = []
    getData()
}
const handleFilter = () => {
    show.value = true
}
// 获取列表
const getData = async () => {
    let params = {
        pageSize: 10,
        pageIndex: pageIndex.value,
        userID: +form.value.userID,
        deptID: +form.value.deptID,
        content: content.value
    }
    const res = await $http.post('/blog/get_blog_list', params)
    dataSource.value = [...dataSource.value, ...res.data.records]
    totalPage.value = res.data.totalCount
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
// onMo(() => {
getUserInfo().then(() => {
    getData()

})
// }),
</script>

<style lang="scss" scoped>
.pages {
    background-color: #f2f2f2;
    min-height: 100vh;
    padding-bottom: 30rpx;

    .header {
        background-color: #fff;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);
    }

    .item {
        padding: 30rpx 0;
        border-bottom: solid 1rpx #f1f1f1;
    }

    .list {
        margin-top: 30rpx;
    }

    .card {
        width: calc(100vw - 60rpx);
        background-color: #fff;
        margin: 0 auto;
        padding: 30rpx;
        border-radius: 18rpx;
        box-sizing: border-box;
        margin-bottom: 30rpx;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: solid 1rpx #e9e9e9;
            padding-bottom: 30rpx;
            font-size: 26rpx;

            .productNumber {
                margin-right: auto;
                margin-left: 20rpx;
                color: #9c9c9c;
            }

            .timer {
                color: #12151b;
            }

            .name {
                color: rgb(77, 105, 251);
            }
        }

        .content {
            .item {
                display: flex;
                font-size: 26rpx;
                margin-bottom: 10rpx;
                border: none;
                padding-bottom: 0;

                .right {
                    flex: 1;

                    .label {
                        font-weight: bold;
                        color: #12151b;
                        font-size: 28rpx;
                        margin-bottom: 8rpx;
                    }

                    .value {
                        color: #9c9c9c;

                        .model {
                            color: rgb(51, 192, 8);
                            margin-left: 20rpx;
                        }
                    }

                }
            }

            .round {
                margin-right: 30rpx;
                width: 40rpx;
                height: 40rpx;
                font-size: 20rpx;
                text-align: center;
                line-height: 40rpx;
                color: #fff;
                border-radius: 50%;
                background-color: rgb(69, 96, 225);
            }

            .nei {
                background-color: rgb(244, 186, 0);
            }

            .address {
                background-color: rgb(244, 77, 0);
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

.search-box {
    border-top: solid rgb(240, 240, 240) 1rpx;
    width: calc(100vw);
    background-color: #fff;
    padding: 0 24rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding-top: 24rpx;
    padding-bottom: 24rpx;
    align-items: center;
    display: flex;

    .search {
        background-color: #f1f1f1;
        height: 80rpx;
        font-size: 28rpx;
        padding: 0 24rpx;
        border-radius: 10rpx;
        box-sizing: border-box;
        flex: 1;
    }

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
</style>