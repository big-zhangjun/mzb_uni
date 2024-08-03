<template>
    <view class="floder">
        <view class="file" v-show="!fileTp">
            <view class="item" @click="lookFile(1)">
                <image class="img" mode="aspectFill" src="../../../static/images/floder.svg" alt=""></image>
                <view class="title">
                    <view class="name">发货清单</view>
                </view>
            </view>
            <view class="item" @click="lookFile(2)">
                <image class="img" mode="aspectFill" src="../../../static/images/floder.svg" alt=""></image>
                <view class="title">
                    <view class="name">电气清单</view>
                </view>
            </view>
            <view class="item" @click="lookFile(3)">
                <image class="img" mode="aspectFill" src="../../../static/images/floder.svg" alt=""></image>
                <view class="title">
                    <view class="name">电气布线图</view>
                </view>
            </view>
        </view>
        <view class="fileList file" v-show="fileTp">
            <view class="item" @click="lookFileDetail(item)" v-for="item in fileList" :key="item.id">
                <image class="fileIccon" v-if="getFileType(item.filePath) == 1" mode="aspectFill"
                    src="../../../static/images/1.png" alt=""></image>
                <image class="fileIccon2" v-if="getFileType(item.filePath) == 2" mode="aspectFill"
                    src="../../../static/images/2.png" alt=""></image>
                <image class="fileIccon3" v-if="getFileType(item.filePath) == 3" mode="aspectFill"
                    src="../../../static/images/3.png" alt=""></image>
                <image class="fileIccon4" v-if="getFileType(item.filePath) == 4" mode="aspectFill"
                    src="../../../static/images/4.png" alt=""></image>
                <view class="title">
                    <view class="name">{{ item.fileName }}</view>
                    <view class="realName">{{ item.realName }}</view>
                </view>
                <view class="more">
                    <image class="more-icon" mode="aspectFill" src="../../../static/images/more.svg" alt=""></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import * as $http from '../../../request/index'
import { ref, defineProps } from 'vue';
const fileTp = ref("")
const props = defineProps(["detail"])
const fileList = ref([])
const lookFile = async (fileType) => {
    fileTp.value = fileType
    let res = await $http.post("/project/get_project_file", { fileType, projectID: props.detail.id })
    fileList.value = res.data
    // 
}
const lookFileDetail = (data) => {
    const BASE_URL = "https://www.ktsoftware.cn";
    let url = BASE_URL + data.filePath.replace(/^\./, '')
    const extension = getFileExtension(data.filePath);

    previewFile(url, extension.replace(".", ''))
}

const previewFile = (url, fileType) => {
    uni.showLoading({ title: '加载中...' });
    uni.downloadFile({
        url: url,
        success: (res) => {
            if (res.statusCode === 200) {
                let filePath = res.tempFilePath;
                // let fileType = url.endsWith('.xlsx') ? 'xlsx' : 'xls'; // 根据文件URL判断文件类型  
                console.log(fileType, 'fileType');

                uni.openDocument({
                    filePath: filePath,
                    fileType: fileType,
                    success: (res) => {
                        uni.hideLoading();
                        uni.showToast({ title: '文件预览成功', icon: 'success' });
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        uni.showToast({ title: '文件预览失败，请重试', icon: 'none' });
                    }
                });
            } else {
                uni.hideLoading();
                uni.showToast({ title: '文件下载失败，请重试', icon: 'none' });
            }
        },
        fail: (err) => {
            uni.hideLoading();
            uni.showToast({ title: '文件下载失败，请重试', icon: 'none' });
        }
    });
}
const getFileType = (filePath) => {
    const extension = getFileExtension(filePath);
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return '2';
        case '.png':
            return '2';
        case '.gif':
            return '2';
        case '.bmp':
            return 'BMP Image';
        case '.pdf':
            return '3';
        case '.doc':
        case '.docx':
            return '4';
        case '.xls':
        case '.xlsx':
            return '1';
        // 添加更多文件类型判断
        default:
            return '5';
    }
}
const getFileExtension = (filePath) => {
    // 使用正则表达式提取文件扩展名
    const match = filePath.match(/\.\w+$/);
    return match ? match[0].toLowerCase() : '';
}
</script>

<style lang="scss" scoped>
.floder {
    margin: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 15rpx 0;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 108rpx;
        padding-left: 30rpx;
        margin: 20rpx 0;
        .more-icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 30rpx;
        }
        .img {
            width: 66rpx;
            height: 66rpx;
            margin-right: 30rpx;
        }

        .fileIccon {
            width: 88rpx;
            height: 88rpx;
            margin-right: 30rpx;
        }

        .fileIccon4 {
            width: 70rpx;
            height: 70rpx;
            margin-right: 48rpx;
        }

        .fileIccon2,
        .fileIccon3 {
            width: 78rpx;
            height: 78rpx;
            margin-right: 40rpx;
        }

        .title {
            margin-right: auto;
            .name {
                font-size: 30rpx;
                color: #12151b;
                max-width: 400rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .realName {
                font-size: 24rpx;
                color: #777777;
                margin-top: 6rpx;
            }
        }
    }
}
</style>