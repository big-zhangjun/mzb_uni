<template>
    <view class="work-log">
        <view class="item">
            <view class="label required">1.请选择日期：</view>
            <view class="value" :class="{ actove: open }" @click="open = true"><text>{{ formatDate(formData.blogDate) ||
                '请选择日期'
                    }}</text><up-icon :name="open ? 'arrow-up-fill' : 'arrow-down-fill'"
                    color="rgba(8, 14, 23, 0.4)"></up-icon></view>
        </view>
        <view class="item" @click="getPosoition">
            <view class="label required">2.请选择地址</view>
            <view class="value" :class="{ actove: open }">
                <text>{{ formData.address || '请选择地址'
                    }}</text>
                <!-- <input type="text" v-model="formData.address" class="adress" placeholder="请输入地址"> -->
            </view>
            <view class="position" @click="getPosoition">自动定位</view>
        </view>
        <view class="item">
            <view class="label required">3.项目信息：</view>
            <view class="value" :class="{ actove: show }" @click="show = true"><text>{{ fullName ||
                '请选择项目信息'
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
        <up-datetime-picker hasInput :show="open" mode="date" :formatter="formatter" v-model="formData.blogDate"
            @cancel="handleCancel" @confirm="handleConfirm"></up-datetime-picker>
    </view>
    <up-popup :show="show" mode="bottom" @close="show = false" @open="open" :round="30">
        <view class="flowForm">
            <view class="flowForm-header">
                <view class="cancle" @click="show = false">取消</view>
                <view class="title">项目信息</view>
                <view class="confirm" @click="handleProjectConfirm">确定</view>
            </view>
            <input type="text" v-model="customerName" class="customerName" placeholder="请输入客户名称" @input="handleSearch">
            <view class="content">
                <view class="list">
                    <up-radio-group v-model="formData.projectName" placement="column">
                        <up-radio :customStyle="{ marginBottom: '40rpx' }" v-for="(item) in projectList" :key="item.id"
                            :label="item.label" :name="item.id">
                        </up-radio>
                    </up-radio-group>
                </view>
                <view class="add" @click="handleAdd">新增</view>
            </view>
        </view>
    </up-popup>
</template>

<script setup>
import { computed, ref } from 'vue';
import * as $http from '../../request/index'
import { onLoad, onShow } from '@dcloudio/uni-app';
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
    blogDate: Date.now()
})
const latitude = ref(0)
const longitude = ref(0)
const customerName = ref("")
const blogList = ref([])
const projectName = ref("")
const projectList = ref([])
const address = ref("")
const type = ref("")
const open = ref(false)
const show = ref(false)

onLoad(async (options) => {
    type.value = options.type
    if (options.type == 'edit') {
        //  getData()
    }
})
onShow(async () => {
    await getProjectList()
    if (type.value == 'edit') {
        getData()
    }
})
const fullName = computed(() => {
    let res = projectList.value.find(item => item.id == formData.value.projectName)
    console.log(res, 'ss');
    if (res) {
        return res.label
    }
});
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
    getProjectList()
    // 处理搜索逻辑
}, 300); // 设置防抖延迟时间，单位为毫秒
const getData = () => {
    let result = uni.getStorageSync("detail")
    let keys = Object.keys(formData.value)
    keys.forEach(item => {
        formData.value[item] = result[item]
    })
    formData.value.content = result.content.split(",")
    let res = projectList.value.find(item => item.id == result.projectID)
    console.log(res, 'sss');
    if (res) {
        formData.value.projectName = res.id
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
        customerName: customerName.value,
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
const handleAdd = () => {
    uni.navigateTo({
        url: "/pages/Product/productForm?type=add"
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
        success: function () {
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
                    latitude.value = locationRes.latitude
                    longitude.value = locationRes.longitude
                    console.log(locationRes);
                    console.log('详细地址：' + address);
                    console.log('省份：' + province);
                    console.log('城市：' + city);
                    console.log('区县：' + district);
                    console.log('街道：' + street);
                },
                fail: function (locationRes) {
                    console.log('获取位置失败：' + locationRes.errMsg);
                    wx.getSetting({
                        success: res => {
                            if (typeof (res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']) {
                                // 用户拒绝了授权，跳转设置页面
                                uni.showModal({
                                    title: '您未开启定位授权',
                                    content: '为了给您提供更好的服务，请您授权定位',
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
                        }
                    });
                }
            });
        },
        fail: function (res) {
            console.log('获取经纬度失败：' + res.errMsg);
            wx.getSetting({
                        success: res => {
                            if (typeof (res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']) {
                                // 用户拒绝了授权，跳转设置页面
                                uni.showModal({
                                    title: '您未开启定位授权',
                                    content: '为了给您提供更好的服务，请您授权定位',
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
                        }
                    });
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
    const { projectName, address, remark, content, blogDate } = formData.value
    if (!projectName || !address || !remark || !content || !blogDate) {
        uni.showToast({
            title: "请检查必填信息",
            icon: "none"
        })
        return
    }
    let res = await $http.post("/blog/check_blog_exist", { userID: uni.getStorageSync("user").id, blogDate: formatDate(blogDate) })
    if (res.data.data) {
        uni.showToast("该日以创建过日志了，将会覆盖掉上次日志")
    }
    let projectData = projectList.value.find(item => item.label == projectName)
    let params = {
        userID: uni.getStorageSync("user").id,
        blogDate: formatDate(blogDate),
        projectID: projectName,
        address,
        longitude: longitude.value,
        latitude: latitude.value,
        content: content.join(","),
        remark
    }
    if (type.value == 'add') {
        addWork(params)
    } else {
        editWork(params)
    }

    let addFun = blogList.value.filter(item => content.includes(item.content)).map(item => item.contentType)
    addFun = [...new Set(addFun)]
    addFun.forEach(async item => {
        await addUser(item, projectData.id)
    })
}
const addUser = async (type, id) => {
    let url = ""
    switch (type) {
        case 1:
            url = '/project/add_ec_rep'
            break
        case 2:
            url = '/project/add_si_rep'
            break
        case 3:
            url = '/project/add_as_rep'
            break
    }
    const user = uni.getStorageSync('user')
    let params = {
        id,
        "rep": user.id,
        "repName": user.userName
    }
    const res = await $http.post(url, params)
    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: 'none'
        })
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

.customerName {
    border: solid #d4d4d4 1rpx;
    padding: 20rpx 30rpx;
    border-radius: 8rpx;
    margin: 30rpx 0;
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
        height: 60vh;
        overflow: hidden;
        box-sizing: border-box;
        padding: 30rpx;
        overflow-y: scroll;
    }

    .add {
        height: 96rpx;
        background-color: rgb(25, 140, 254);
        color: #fff;
        width: 100%;
        border: none;
        border-radius: 14rpx;
        font-size: 32rpx;
        margin-top: 76rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            background-color: rgb(80, 167, 253);
        }
    }

}
</style>