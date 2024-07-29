<template>
    <view class="list">
        <view class="item" v-for="item in list" :key="item.id" @click="handleDetail(item)">
            <view class="projectName">
                [{{ item.customerName }}]-[{{ item.model }}]-[{{ item.productNumber }}]
            </view>
            <view class="content"> {{ item.content }} </view>
            <view class="info">
                <view class="realName">{{ item.realName }}</view>
                <view class="time">{{ item.createTime }}</view>
            </view>
        </view>
        <u-empty mode="data" v-if="!list.length"></u-empty>
    </view>
    <FloatingButton @handleClick="handleAddShot" :type="'add'"></FloatingButton>
</template>

<script setup>
import * as $http from '../../../../request/index'
import FloatingButton from '../../../../components/FloatingButton.vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { onMounted, ref } from 'vue'
const props = defineProps(["queryParams"])
const list = ref([])
const deptList = ref([])
const userList = ref([])
const form = ref({})
const pageIndex = ref(1)
const disabled = ref(false)
onShow(() => {
    pageIndex.value = 1
    list.value = []
    if (props.queryParams.id) {
        getList()
    } else {
        getUserInfo().then(() => {
            getList()
        })
    }
})
onReachBottom(() => {
    pageIndex.value++
    getList()
})
console.log(props.queryParams, "===");
uni.setNavigationBarTitle({
    title: '备忘录'
})
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
    // getFilterData('deptID', deptList.value, 'deptName', 'id')
    // getFilterData('userID', userList.value, 'userName', 'id')
}
onMounted(() => {
    if (props.queryParams.id) {
        getList()
    }
})
const getList = async () => {
    let params = {
        userID: form.value.userID ? +form.value.userID : undefined,
        deptID: form.value.deptID ? +form.value.deptID : undefined,
        projectID: +props.queryParams.id || 0,
        pageSize: 10,
        pageIndex: pageIndex.value
    }
    console.log("参数：", params);
    let res = await $http.post("/memo/get_memo_list", params)
    list.value = [...list.value, ...res.data.records]
}
const handleAddShot = () => {
    uni.navigateTo({
        url: `/subpkg1/pages/Product/memorandoums`
    })
}
const handleDetail = (data) => {
    uni.navigateTo({
        url: `/subpkg1/pages/Product/memorandoums?id=${data.id}&customerName=${data.customerName}`
    })
}
</script>

<style lang="scss" scoped>
.list {
    background-color: rgb(243, 244, 246);
    min-height: calc(100vh - 116rpx);
    box-sizing: border-box;
    padding: 24rpx;

    .item {
        background-color: #fff;
        padding: 24rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        margin-bottom: 24rpx;

        .realName {
            font-size: 28rpx;
            margin-bottom: 14rpx;
        }

        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .time {
                font-size: 24rpx;
            }
        }

        .projectName {
            font-size: 26rpx;
            font-weight: bold;
        }

        .content {
            font-size: 24rpx;
            margin: 12rpx 0;
            color: #b4b4b4;
        }
    }
}
</style>