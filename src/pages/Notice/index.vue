<template>
    <view class="pages">
        <text class="title">{{ title }}</text>
        <view v-html="noticeDetail"></view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import * as $http from '../../request/index'
import { onLoad, onShow } from '@dcloudio/uni-app';
const noticeDetail = ref("")
const title = ref("")
onLoad((options) => {
    $http.post("/notice/get_notice_info", { id: +options.id }).then(res => {
        noticeDetail.value = res.data.content
        title.value = res.data.title
    })
})
</script>

<style lang="less" scoped>
.pages {
    .title {
        font-weight: bold;
        margin-bottom: 30rpx;
        display: block;
    }
    min-height: 100vh;
    min-width: 100vw;
    box-sizing: border-box;
    position: relative;
    overflow: auto;
    padding: 24rpx;

}
</style>