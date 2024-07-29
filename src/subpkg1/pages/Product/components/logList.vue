<template>
    <view class="pages">
        <view class="card" v-for="item in list" :key="item.id">
            <view class="custom">[{{ item.productNumber }}] - [{{ item.customerName }}] - [{{ item.model }}]</view>
            <view class="content">{{ item.content }}</view>
            <view class="address">{{ item.address }}</view>
            <view class="line"></view>
            <view class="footer">
                <view class="user">{{ item.realName }}</view>
                <view class="date">{{ item.blogDate }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../../../request/index'
const props = defineProps(["queryParams"])
const list = ref([])
const pageIndex = ref(1)
// import { onReachBottom } from '@dcloudio/uni-app';
// onReachBottom(() => {
//      pageIndex.value++
//      getLigList()
// })
// 获取详情
const getLigList = async () => {
    let params = {
        projectID: +props.queryParams.id,
        endDate:"",
        pageIndex: pageIndex.value,
        pageSize: 1000,
        startDate: ""
    }
    const res = await $http.post("/blog/get_blog_list", params)
    list.value = res.data.records
}
getLigList()
</script>
<!-- / -->
<style lang="scss" scoped>
.pages {
    background-color: rgb(243, 244, 246);
    min-height: calc(100vh - 116rpx);
    box-sizing: border-box;
    padding: 24rpx;

    .card {
        padding: 24rpx;
        background-color: #fff;
        border-radius: 12rpx;
        margin-bottom: 24rpx;
        .custom {
            font-weight: bold;
            font-size: 30rpx;
            margin-bottom: 20rpx;
        }

        .date {
            font-size: 26rpx;
            color: #8f8f8f;
            margin-bottom: 12rpx;
        }

        .content {
            font-size: 26rpx;
            margin-bottom: 24rpx;
            color: #8f8f8f;
        }

        .line {
            width: 100%;
            height: 1rpx;
            background-color: #ececec;
            margin: 30rpx 0;
        }

        .user {
            font-size: 26rpx;
            margin-bottom: 12rpx;
        }
        .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .address {
            font-size: 26rpx;
        }
    }
}
</style>