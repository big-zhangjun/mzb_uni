<template>
    <view class="work-log">
        <view class="item">
            <view class="label required">1.请选择日期：</view>
            <view class="value" :class="{ actove: open }" @click="open = true"><text>{{ formatDate(formData.blogDay) ||
                '请选择日期'
                    }}</text><up-icon :name="open ? 'arrow-up-fill' : 'arrow-down-fill'"
                    color="rgba(8, 14, 23, 0.4)"></up-icon></view>
        </view>
        <view class="item">
            <view class="label required">2.请输入地址</view>
            <view class="value" :class="{ actove: open }">
                <input type="text" v-model="formData.address" class="adress" placeholder="请输入地址">
            </view>
            <view class="position" @click="getPosoition">自动定位</view>
        </view>
        <view class="item">
            <view class="label required">3.项目信息：</view>
            <view class="value" :class="{ actove: show }" @click="show = true"><text>{{ formData.projectName || '请用户信息'
                    }}</text><up-icon :name="show ? 'arrow-up-fill' : 'arrow-down-fill'"
                    color="rgba(8, 14, 23, 0.4)"></up-icon></view>
        </view>
        <view class="item">
            <view class="label required">4.工作内容：</view>
            <view class="work-list">
                <up-checkbox-group v-model="formData.content" placement="column">
                    <up-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in blogList" :key="index"
                        :label="item.content" :name="item.content">
                    </up-checkbox>
                </up-checkbox-group>
            </view>
        </view>
        <view class="item">
            <view class="label required">5.备注：</view>
            <up-textarea v-model="formData.remark" height="206rpx" placeholder="请输入内容"></up-textarea>
        </view>
        <view class="btn" @click="submit">提交</view>
        <up-datetime-picker hasInput :show="open" mode="date" :formatter="formatter" v-model="formData.blogDay"
            @cancel="handleCancel" @confirm="handleConfirm"></up-datetime-picker>
    </view>
    <up-popup :show="show" mode="bottom" @close="show = false" @open="open" :round="30">
        <view class="flowForm">
            <view class="flowForm-header">
                <view class="cancle" @click="show = false">取消</view>
                <view class="title">用户信息</view>
                <view class="confirm" @click="handleProjectConfirm">确定</view>
            </view>
            <view class="content">
                <view class="list">
                    <up-radio-group v-model="formData.projectName" placement="column">
                        <up-radio :customStyle="{ marginBottom: '40rpx' }" v-for="(item) in projectList" :key="item.id"
                            :label="item.label" :name="item.label">
                        </up-radio>
                    </up-radio-group>
                </view>
            </view>
        </view>
    </up-popup>
</template>

<script setup>
import { reactive, ref } from 'vue';
import * as $http from '../../request/index'
import { onLoad } from '@dcloudio/uni-app';
const formatter = (type, value) => {
    if (type === 'year') {
        return `${value}年`;
    }
    if (type === 'month') {
        return `${value}月`;
    }
    if (type === 'day') {
        return `${value}日`;
    }
    return value;
};
const formData = ref({
    remark: "",
    content: "",
    address: "",
    projectName: "",
    blogDay: Date.now()
})
const blogList = ref([])
const projectName = ref("")
const projectList = ref([])
const address = ref("")
const type = ref("")
const open = ref(false)
const show = ref(false)

onLoad(async (options) => {
    await getProjectList()
    type.value = options.type
    if (options.type == 'edit') {
        getData()
    }
})
const getData = () => {
    let result = uni.getStorageSync("detail")
    let keys = Object.keys(formData.value)
    keys.forEach(item => {
        formData.value[item] = result[item]
    })
    formData.value.content = result.content.split(",")
    let res = projectList.value.find(item => item.id == result.projectID)
    if (res) {
        formData.value.projectName = res.label
    }
}
const handleCancel = () => {
    open.value = false
}
const handleConfirm = () => {
    open.value = false
}
const getProjectList = async () => {
    const params = {
        pageIndex: 1,
        pageSize: 100
    }
    const res = await $http.post("/project/get_project_list", params)
    projectList.value = res.data.records.map(item => {
        return {
            id: item.id,
            label: item.customerName + item.model
        }
    })
}

const getBlogList = async () => {
    const res = await $http.post("/blog/get_blog_content_list", {})
    blogList.value = res.data
}
getBlogList()
const getPosoition = () => {
    uni.getLocation({
        type: 'wgs84', // 获取经纬度坐标信息
        success: function (res) {
            var latitude = res.latitude; // 纬度
            var longitude = res.longitude; // 经度

            // 调用微信小程序的wx.chooseLocation方法，获取位置详细信息
            uni.chooseLocation({
                success: function (locationRes) {
                    var name = locationRes.name; // 位置名称
                    var addresss = locationRes.address; // 详细地址
                    var province = locationRes.province; // 省份
                    var city = locationRes.city; // 城市
                    var district = locationRes.district; // 区县
                    var street = locationRes.street; // 街道
                    formData.value.address = addresss + name
                    // 在这里可以根据需要对获取到的位置信息进行处理
                    console.log(locationRes);
                    console.log('详细地址：' + address);
                    console.log('省份：' + province);
                    console.log('城市：' + city);
                    console.log('区县：' + district);
                    console.log('街道：' + street);
                },
                fail: function (locationRes) {
                    console.log('获取位置失败：' + locationRes.errMsg);
                }
            });
        },
        fail: function (res) {
            console.log('获取经纬度失败：' + res.errMsg);
        }
    });
}
const handleProjectConfirm = () => {
    console.log(projectName.value);
    show.value = false
}
const formatDate = (timestamp) => {
    if (!timestamp) {
        return ''
    }
    const date = new Date(timestamp); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, 0)}-${String(day).padStart(2, 0)}`;
}

const submit = async () => {
    const { projectName, address, remark, content, blogDay } = formData.value
    if(!projectName || !address || !remark || !content || !blogDay ) {
        uni.showToast({
            title:"请检查必填信息",
            icon: "none"
        })
        return
    }
    let projectData = projectList.value.find(item => item.label == projectName)
    let params = {
        userID: uni.getStorageSync("user").id,
        blogDay: formatDate(blogDay),
        projectID: projectData.id,
        address,
        content: content.join(","),
        remark
    }
    console.log(type.value);
    if (type.value == 'add') {
        addWork(params)
    } else {
        editWork(params)
    }


}
const addWork = async (params) => {
    const res = await $http.post("/blog/add_blog_info", params)
    if (res.status.retCode == 0) {
        uni.showToast({
            title: "操作成功",
            icon: "none"
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 2000);
    }
}
const editWork = async (params) => {
    let result = uni.getStorageSync("detail")
    const res = await $http.post("/blog/update_blog_info", { ...params, id: result.id })
    if (res.status.retCode == 0) {
        uni.showToast({
            title: "操作成功",
            icon: "none"
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 2000);
    }
}
</script>

<style lang="less" scoped>
.work-log {
    width: calc(100% - 60rpx);
    background-color: #fff;
    border-radius: 18rpx;
    margin: 0 auto;
    margin-top: 30rpx;
    padding: 30rpx;
    box-sizing: border-box;
    padding-top: 80rpx;

    .item {
        padding-left: 20rpx;
        margin-bottom: 80rpx;

        &:deep(.u-textarea) {
            background-color: #F1F0F5;
        }

        .label {
            font-weight: bold;
            font-size: 32rpx;
            margin-bottom: 16rpx;
        }

        .value {
            height: 80rpx;
            border: rgba(8, 14, 23, 0.12) solid 1rpx;
            border-radius: 10rpx;
            line-height: 80rpx;
            font-size: 28rpx;
            padding: 0 30rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            color: rgba(8, 14, 23, 0.4);

            text {
                width: 100%;
                white-space: nowrap;
                overflow-x: auto;
            }

            .adress {
                height: 80rpx;
                width: 100%;
                color: rgba(8, 14, 23, 0.4);
                ;
            }
        }

        .position {
            color: rgb(55, 133, 250);
            font-size: 28rpx;
            margin-top: 20rpx;
        }

        .actove {
            border: solid rgb(55, 133, 250) 1rpx;
        }

        .required {
            position: relative;

            &::before {
                content: "*";
                position: absolute;
                color: red;
                left: -28rpx;
                top: 0;
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
        font-size: 28rpx;

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }
}

.flowForm {
    background-color: #F5F5F7;
    padding: 30rpx;

    .flowForm-header {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 20;

        .cancle {
            font-size: 32rpx;
            color: #666666;
        }

        .title {
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }

        .confirm {
            color: #12151b;
            font-size: 32rpx;
        }
    }

    .content {
        width: 100%;
        background-color: #fff;
        margin-top: 30rpx;
        border-radius: 12rpx;
        height: 853rpx;
        overflow: hidden;
        box-sizing: border-box;
        padding: 30rpx;
        overflow-y: scroll;
    }

}
</style>