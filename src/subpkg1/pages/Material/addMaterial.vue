<template>
    <view class="pages">
        <view class="bg"></view>
        <view class="form">
            <view class="card" v-for="(item, idx) in form" :key="idx">
                <view class="title" v-if="!idx">基本信息</view>
                <view class="list">
                    <view class="item" v-for="(formData, index) in item" :key="formData.key">
                        <view class="label" :class="{ required: formData.required }">{{ formData.label }}：</view>
                        <view class="value">
                            <input type="text" minlength="6" :disabled="formData.disabled" v-model="formData.value"
                                :placeholder="formData.placeholder || '请输入'" v-if="!formData.type">
                            <view v-if="formData.type == 'select'"
                                @click="handleProductCheck(formData.value, formData.type, { idx, index }, formData.key)">
                                {{
                                    formData.value ||
                                    '请选择' }}</view>
                            <view v-if="formData.type == 'custom'" @click="handleCusCheck(formData)">
                                {{
                                    formData.value ||
                                    '请选择' }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <up-popup :show="show" mode="bottom" @close="show = false" @open="open" :round="30">
            <view class="flowForm">
                <view class="flowForm-header">
                    <view class="cancle" @click="show = false">取消</view>
                    <view class="title">项目信息</view>
                    <view class="confirm" @click="handleProjectConfirm">确定</view>
                </view>
                <input type="text" v-model="customerName" class="customerName" placeholder="请输入客户名称"
                    @input="handleSearch">
                <view class="content">
                    <scroll-view class="list" scroll-y="true" @scrolltolower="scrolltolower">
                        <view class="item" :class="{ active: projectID == item.id }" @click="handleCheckProduct(item)"
                            v-for="(item) in projectList" :key="item.id">
                            <view class="header">
                                {{ item.label }}
                            </view>
                            <view class="info">
                                <view class="productNumber"> {{ item.productNumber }}</view>
                                <view class="date"> {{ item.orderDate }}</view>
                            </view>
                        </view>
                    </scroll-view>
                    <view class="add" @click="handleAdd">新增</view>
                </view>
            </view>
        </up-popup>
        <up-picker :defaultIndex="defaultIndex" :show="productNameStatus" ref="uPickerRef" :columns="columns"
            @confirm="handleChangeEpStatus" @cancel="productNameStatus = false"></up-picker>
        <up-calendar :show="dateStatus" :defaultDate="defaultDate" @close="dateStatus = false"
            @confirm="handleDateConfirm"></up-calendar>
        <view class="footer">
            <view class="submit" @click="submit">提交</view>
            <!-- <view class="del" v-if="formOptions.type !== 'add'" @click="del">删除</view> -->
        </view>
    </view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../../request/index'
import { computed, ref } from 'vue';
const type = ref("")
const productNameStatus = ref(false)
const defaultIndex = ref([0])
const dateStatus = ref(false)
const defaultDate = ref([Date.now()])
const projectID = ref({})
// const columns = ref()
const show = ref(false)
const columnType = ref("delivered")
const columns = computed(() => {
    console.log(columnType, 'columnType');
    let k = columnType.value
    switch (k) {
        case "source":
            return [
                [
                    "项目现场安装",
                    "网购",
                    "售后"
                ]
            ]
        case "fromCompany":
            return [
                [
                    "凯之路（上海）复合材料科技有限公司",
                    "美洲豹空天软件开发（台州）有限公司",
                    "美洲豹（浙江）航空装备有限公司",
                    "浙江美洲豹特种设备有限公司",
                ]
            ]
    }

})
// 响应式表单数据  
const form = ref([
    [
        {
            label: "选择项目",
            key: "materialName",
            value: "",
            required: true,
            type: "custom"
        },
        {
            label: "发货单位",
            key: "fromCompany",
            value: "美洲豹（浙江）航空装备有限公司",
            required: true,
            type: "select"
        },
        {
            label: "来源",
            key: "source",
            value: "项目现场安装",
            required: true,
            type: "select"
        },
        {
            label: "完整率",
            key: "progress",
            value: 0,
            disabled: true
        },
        {
            label: "备注",
            key: "remark",
            required: true,
            value: "",
            placeholder: "请填入收货地址，收货人"
        },
    ],
]);
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
const dateType = ref("")
const customerName = ref("")
const formOptions = ref("")
const data = ref({})
const pageIndex = ref(1)
const projectDetail = ref({})
onLoad((options) => {
    formOptions.value = options
    // data.value = options.id
    if (options.id) {
        getDetail(+options.id)
    }
    getProjectList()

})
const handleCheckProduct = (data) => {
    projectID.value = data.id
    projectDetail.value = data
}
const handleProjectConfirm = () => {
    show.value = false
    console.log(projectDetail.value);
    form.value.forEach(item => {
        item.forEach(_item => {
            if (["materialName"].includes(_item.key)) {
                _item.value = projectDetail.value.label
            }
            console.log(projectDetail.value.id);

            if (projectDetail.value.id == -1) {
                if (["remark"].includes(_item.key)) {
                    _item.required = false
                }
            } else {
                if (["remark"].includes(_item.key)) {
                    _item.required = true
                }
            }
        })
    })
}
const scrolltolower = async () => {
    pageIndex.value++
    getProjectList()
}
const getProjectList = async () => {
    const params = {
        customerName: customerName.value,
        pageIndex: pageIndex.value,
        pageSize: 10
    }
    const res = await $http.post("/project/get_project_list", params)
    let result = res.data.records.map(item => {
        return {
            id: item.id,
            label: item.customerName + item.model,
            orderDate: item.orderDate,
            productNumber: item.productNumber
        }
    })
    if (!projectList.value[0]) {
        projectList.value = [{ id: -1, label: "通用耗材领料", orderDate: "", productNumber: "" }, ...result]
    } else {
        projectList.value = [...projectList.value, ...result]
    }
}
const handleDateConfirm = (v) => {
    let { idx, index } = dateType.value
    form.value[idx][index].value = v[0]
    dateStatus.value = false
}
const handleSearch = debounce(() => {
    pageIndex.value = 1
    projectList.value = []
    getProjectList()
    // 处理搜索逻辑
}, 300);
const handleCusCheck = (v) => {
    show.value = true
}
// 表单引用  
const handleProductCheck = (v, type, { index, idx }, key) => {
    columnType.value = key
    if (type == 'date-picker') {
        dateStatus.value = true
        dateType.value = { index, idx }
    } else {
        let index = columns.value[0].findIndex(item => item == v)
        if (index != -1) {
            defaultIndex.value = [index]
        }
        productNameStatus.value = true
    }


}
const handleAdd = () => {
    uni.navigateTo({
        url: "/pages/Product/productForm?type=add"
    })
}
const handleChangeEpStatus = (data) => {
    form.value.forEach(item => {
        let index = item.findIndex(_item => _item.key == columnType.value)
        if (index != -1) {
            item[index].value = data.value[0]
        }
    })
    productNameStatus.value = false
}
const projectList = ref([])
const errors = ref({});
const validate = () => {
    let valid = true;
    errors.value = {};
    form.value.forEach((section, sectionIndex) => {
        section.forEach((field, fieldIndex) => {
            if (field.required && !field.value) {
                errors.value = `${field.label}是必填项`;
                valid = false;
                console.log(errors.value);
            } else if (field.min && field.value.length <= 6) {
                errors.value = `${field.label}不得小于6位`;
                valid = false;
            }
        });
    });
    return valid;
};
const getCurrentDateFormatted = () => {
    // 创建一个Date对象，它会自动设置为当前日期和时间
    const now = new Date();

    // 获取年份（四位数）
    const year = now.getFullYear();

    // 获取月份（两位数，如果是一位数则在前面补0）
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // 获取日期（两位数，如果是一位数则在前面补0）
    const day = String(now.getDate()).padStart(2, '0');

    // 将年月日组合成"YYYY-MM-dd"的格式
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
const getDetail = async (id) => {
    let res = await $http.post("/shotage/get_shotage_info", { id })
    let keys = Object.keys(res.data)
    form.value.forEach(item => {
        item.forEach(_item => {
            if (keys.includes(_item.key)) {
                _item.value = res.data[_item.key]
            }
            if (_item.key === 'materialName') {
                _item.value = res.data.customerName
            }
        })
    })
}

// 提交方法  
function submit() {

    let formdata = form.value.flat().reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});
    if (!validate()) {
        uni.$u.toast(errors.value)
        return
    }
    let { materialName, ...data } = formdata

    if (!formOptions.value.id) {
        let params = {
            applyDate: getCurrentDateFormatted(),
            applyUserID: uni.getStorageSync("user").id,
            ...data,
            projectID: projectID.value
        }
        addShotageInfo(params)
    } else {
        let params = {
            ...data,
            id: +formOptions.value.id
        }
        updateShotageInfo(params)
    }
}
const addShotageInfo = (params) => {
    $http.post("/shotage/add_shotage_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }

    }).catch(err => {
        uni.$u.toast(err.status.msg)
    })
}
const updateShotageInfo = (params) => {
    $http.post("/shotage/update_shotage_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }

    }).catch(err => {
        uni.$u.toast(err.status.msg)
    })
}

</script>
<style scoped lang="less">
.pages {
    background-color: #F2F2F7;
    min-height: 100vh;
    padding-bottom: 30rpx;

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

                .required {
                    position: relative;
                    padding-left: 30rpx;

                    &::after {
                        content: "*";
                        display: block;
                        position: absolute;
                        color: red;
                        left: 0;
                        top: 0;
                    }
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
    color: #fff;
    font-size: 28rpx;
}

.del {
    width: calc(100% - 60rpx);
    margin: 0 auto;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    line-height: 88rpx;
    background: linear-gradient(160deg, rgb(194, 194, 194) 0%, rgb(202, 202, 202) 100%);
    border-radius: 8rpx;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}

.flowForm,
.work-list {
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

    .list {
        display: flex;
        flex-direction: column;

        .item {
            padding: 30rpx 0;
            padding-left: 60rpx;
            position: relative;
            border-bottom: 1rpx solid rgb(235, 235, 235);
            font-style: 28rpx;

            .info {
                display: flex;
                justify-content: space-between;
                color: #8a8a8a;
                font-size: 26rpx;
            }

            &::after {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                display: block;
                width: 36rpx;
                height: 36rpx;
                border-radius: 50%;
                // background-color: rgb(39, 124, 252);
                border: solid rgb(39, 124, 252) 2rpx;
            }
        }

        .active {
            &::before {
                content: "";
                position: absolute;
                left: 11rpx;
                top: 50%;
                transform: translateY(-50%);
                display: block;
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                background-color: rgb(39, 124, 252);
            }
        }
    }

    .content {
        width: 100%;
        background-color: #fff;
        margin-top: 30rpx;
        border-radius: 12rpx;
        overflow: hidden;
        box-sizing: border-box;
        padding: 30rpx;
        overflow-y: scroll;
    }

    .list {
        height: 60vh;
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

    .add-work {
        height: 96rpx;
        border: solid 1px rgb(184, 184, 184);
        color: rgb(184, 184, 184);
        width: 100%;
        border-radius: 14rpx;
        font-size: 32rpx;
        margin-top: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;

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

.last-work {
    position: fixed;
    width: calc(100vw - 60rpx);
    background-color: #fff;
    bottom: 0rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    box-sizing: border-box;
    padding: 40rpx;
    box-shadow: 4rpx 4rpx 20rpx 4rpx rgba(0, 0, 0, .12);

    .copy-title {
        font-size: 28rpx;
        margin-bottom: 48rpx;
    }

    .close {
        position: absolute;
        right: 40rpx;
        top: 40rpx;
    }
}
</style>