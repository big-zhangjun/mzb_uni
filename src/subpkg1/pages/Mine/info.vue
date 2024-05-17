<template>
    <view class="pages">
        <view class="bg"></view>
        <view class="form">
            <view class="card" v-for="(item, idx) in form" :key="idx">
                <view class="title" v-if="!idx">基本信息</view>
                <view class="list">
                    <view class="item" v-for="formData in item" :key="formData.key">
                        <view class="label">{{ formData.label }}：</view>
                        <view class="value">
                            <input type="text" v-model="formData.value" placeholder="请输入" v-if="!formData.type">
                            <view v-else @click="handleProductCheck(formData.value)">{{ formData.value || '请选择' }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <up-picker :defaultIndex="defaultIndex" :show="productNameStatus" ref="uPickerRef" :columns="columns"
            @confirm="handleChangeEpStatus" @cancel="productNameStatus = false"></up-picker>
        <view class="submit" @click="submit">提交</view>
    </view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../../request/index'
import { ref } from 'vue';
const type = ref("")
const userInfo = ref({})
const productNameStatus = ref(false)
const defaultIndex = ref([0])
const columns = ref([
    [
        "男",
        "女",
    ]
])
// 响应式表单数据  
const form = ref([
    [
        {
            label: "手机号码",
            key: "mobile",
            value: ""
        },
        {
            label: "邮箱",
            key: "email",
            value: ""
        },
        {
            label: "性别",
            key: "sex",
            type: 'select',
            value: ""
        },
        {
            label: "地址",
            key: "address",
            value: ""
        },
    ]
]);
const number = ref("")
const data = ref("")
onLoad((options) => {
    getUserInfo()
})

// 表单引用  
const handleProductCheck = (v) => {

    let index = columns.value[0].findIndex(item => item == v)
    if (index != -1) {
        defaultIndex.value = [index]
    }
    productNameStatus.value = true
}
const editFormFun = (params) => {
    params.id = +data.value
    $http.post("/project/update_project_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }
    })

}
const handleChangeEpStatus = (data) => {
    form.value.forEach(item => {
        let index = item.findIndex(_item => _item.key == 'sex')
        if (index != -1) {
            item[index].value = data.value[0]
        }
    })
    productNameStatus.value = false
}
const getUserInfo = () => {
    let id = uni.getStorageSync("user").id
    let params = { id }
    $http.post("/user/get_user_info", params).then(res => {
        userInfo.value = res.data
        let user = res.data
        let keys = Object.keys(user)
        form.value.forEach(item => {
            item.forEach(_item => {
                if (keys.includes(_item.key)) {
                    _item.value = user[_item.key]
                }
                if (_item.key == 'sex') {
                    _item.value = user[_item.key] == 0 ? '男' : '女'
                }
            })
        })
    })

}
// 提交方法  
function submit() {
    const { deptID, nickName, id, roleID, userName } = userInfo.value
    let values = form.value.flat().reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});
    let params = {
        ...values,
        deptID,
        id,
        roleID,
        sex: values.sex == '男' ? 0 : 1,
        nickName,
        userName,
        resign: 1 // 是否在职
    }
    $http.post("/user/update_user_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }

    })

}  
</script>
<style scoped lang="less">
.pages {
    background-color: #F2F2F7;
    height: 100vh;
    // padding-bottom: 30rpx;

    .bg {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 300rpx;
        background: rgb(55, 133, 250);
    }

    .form {
        padding-top: 20rpx;

        .card {
            width: calc(100% - 60rpx);
            border-radius: 20rpx;
            box-sizing: border-box;
            padding: 0 30rpx;
            margin: 0 auto;
            margin-top: 30rpx;
            background-color: #fff;
            position: relative;
            z-index: 10;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: rgb(27, 29, 43);
                margin-bottom: 30rpx;
                padding-top: 30rpx;
            }

            .list {
                display: flex;
                flex-direction: column;
            }

            .item {
                color: rgb(97, 103, 129);
                font-size: 28rpx;
                display: flex;
                align-items: center;
                height: 88rpx;
                justify-content: space-between;

                &:last-child {
                    border-bottom: none;
                }

                .label {
                    color: rgb(49, 54, 57);
                    font-weight: bold;
                    white-space: nowrap;
                }

                .value {
                    flex: 1;
                    text-align: right;
                }

                border-bottom: solid 1rpx #F2F2F7;
            }
        }

        .mt {
            margin-top: 30rpx;
            padding: 0 30rpx;
        }
    }

}

.submit {
    width: calc(100% - 60rpx);
    margin: 0 auto;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    line-height: 88rpx;
    background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
    border-radius: 8rpx;
    text-align: center;
    position: fixed;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 28rpx;
}
</style>