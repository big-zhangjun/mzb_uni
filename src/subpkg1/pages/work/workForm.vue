<template>
    <view class="pages">
        <view class="card">
            <view class="required item flex" @click="show = true">
                <view class="label">类别</view>
                <view class="value">
                    <view class="none">{{ text || '请选择' }}<up-icon color="#f0f0f0" name="arrow-right" size="22"></up-icon>
                    </view>
                </view>
            </view>
            <view class="item required">
                <view class="label">工作内容</view>
                <view class="value">
                    <up-textarea v-model="content" placeholder="请输入内容" count></up-textarea>
                </view>
            </view>
        </view>
        <view class="btn" @click="handleSave">保存</view>
        <up-picker @cancel="show = false" :show="show" :columns="columns" keyName="label" @confirm="confirm"></up-picker>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as $http from '../../../request/index'
const show = ref(false)
const columns = ref([[
    {
        label: "电气柜",
        type: 1
    },
    {
        label: "现场安装",
        type: 2
    },
    {
        label: "售后",
        type: 3
    }
]])
const contentType = ref(1)
const content = ref("")
const text = ref("")
const confirm = (v) => {
    contentType.value = v.value[0].type
    text.value = v.value[0].label
    show.value = false
}
const handleSave = async () => {
    if(!content.value || !contentType.value) {
        uni.$u.toast('请检查必填信息')
        return
    }
    let params = {
        content: content.value,
        contentType: contentType.value
    }
    let res = await $http.post("/blog/add_blog_content", params)
    if (res.status.retCode == 0) {
        uni.$u.toast('操作成功')
        setTimeout(() => {
            uni.navigateBack()
        }, 2000);
    }
}
</script>

<style lang="scss" scoped>
.pages {
    height: 100vh;
    overflow: hidden;
    background-color: #eeeeee;
    padding: 30rpx;

    .card {
        padding: 30rpx;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 20rpx;
        padding-top: 0;
        padding-bottom: 0;

        .item {
            font-size: 28rpx;
            padding: 30rpx 0;
            border-bottom: solid 1rpx #f0f0f0;

            &:last-child {
                border: none;
            }

            .label {
                font-weight: bold;
                margin-bottom: 30rpx;
            }

            .value {
                color: #afafaf;

                .none {
                    display: flex;
                    align-items: center;
                    gap: 12rpx;
                }

                &:deep(.u-textarea) {
                    background-color: #f0f0f0;
                    padding: 20rpx;

                    .u-textarea__count {
                        background-color: #f0f0f0 !important
                    }
                }
            }
        }

        .required {
            padding-left: 30rpx;
            position: relative;

            &::before {
                content: "*";
                display: block;
                position: absolute;
                left: 0;
                color: red;
            }
        }

        .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .label {
                margin-bottom: 0;
            }

        }
    }

    .btn {
        width: 100%;
        line-height: 88rpx;
        background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
        border-radius: 8rpx;
        text-align: center;
        color: #fff;
        margin-top: 80rpx;
        font-size: 28rpx;

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }
}
</style>