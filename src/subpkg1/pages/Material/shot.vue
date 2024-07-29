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
                            <input :disabled="formData.disabled" type="text" minlength="6" v-model="formData.value" placeholder="请输入"
                                v-if="!formData.type">
                            <view v-else
                                @click="handleProductCheck(formData.value, formData.type, { idx, index }, formData.key)">
                                {{
                                    formData.value ||
                                    '请选择' }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <up-picker :defaultIndex="defaultIndex" :show="productNameStatus" ref="uPickerRef" :columns="columns"
            @confirm="handleChangeEpStatus" @cancel="productNameStatus = false"></up-picker>
        <up-calendar :show="dateStatus" :defaultDate="defaultDate" @close="dateStatus = false"
            @confirm="handleDateConfirm"></up-calendar>
        <view class="submit" @click="submit">提交</view>
        <view class="del" @click="del" v-if="locked!=1">删除</view>
    </view>
</template>
<script setup>
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
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../../request/index'
import { computed, ref } from 'vue';
const type = ref("")
const defaultDate = ref(getCurrentDateFormatted())
const productNameStatus = ref(false)
const defaultIndex = ref([0])
const dateStatus = ref(false)
// const columns = ref()
const columnType = ref("delivered")
const columns = computed(() => {
    console.log(columnType, 'columnType');
    let k = columnType.value
    switch (k) {
        case "reason":
            return [
                [
                    "缺料",
                    "网购",
                    "待生产",
                ]
            ]
        case "logistics":
            return [
                [
                    "物流",
                    "快递",
                    "自带",
                ]
            ]
        case "delivered":
            return [
                [
                    "是",
                    "否"
                ]
            ]

    }

})
// 响应式表单数据  
const form = ref([
    [
        {
            label: "名称",
            key: "materialName",
            value: "",
            disabled: true
        },
        {
            label: "规格",
            key: "materialModel",
            value: "",
            disabled: true
        },
        {
            label: "数量",
            key: "amount",
            value: "",
            disabled: false
        },
        {
            label: "单位",
            key: "unit",
            value: "",
            disabled: true
        },
        {
            label: "是否发货",
            key: "delivered",
            type: 'select',
            value: "",
            hasKeyName: true
        },
        {
            label: "未发原因",
            key: "reason",
            type: 'select',
            value: "",
        },
    ],
    [
        {
            label: "预计发货时间",
            key: "expectDate",
            type: 'date-picker',
            value: "",
        },
        {
            label: "最终发货时间",
            key: "deliveryDate",
            type: 'date-picker',
            value: "",
        },
        {
            label: "物流方式",
            key: "logistics",
            type: 'select',
            value: "",
        },
        {
            label: "快递单号",
            key: "courierNumber",
            value: "",
        },
        {
            label: "签收数量",
            key: "ready",
            value: "",
            hasKeyName: true
        },
        {
            label: "备注",
            key: "remark",
            value: "",
        },
    ]
]);
const detail = ref({})
const dateType = ref("")
const data = ref("")
const shotageID = ref("")
const locked = ref("")
onLoad((options) => {
    data.value = options.id
    shotageID.value = options.shotageID
    locked.value = options.locked
    
    if(options.locked == '1') {
        let keys = ['amount']
        console.log(form.value[0][2], 'ss', options.locked);
        form.value.forEach(item => {
        item.forEach(_item => {
            if (keys.includes(_item.key)) {
                _item.disabled = true
            }
        })
    })
    }
    getDetail(+options.id)

})
const handleDateConfirm = (v) => {
    let { idx, index } = dateType.value
    form.value[idx][index].value = v[0]
    dateStatus.value = false
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
const getDetail = async (id) => {
    let res = await $http.post("/shotage/get_material_shot_info", { id })
    detail.value = res.data
    let keys = Object.keys(res.data)
    form.value.forEach(item => {
        item.forEach(_item => {
            if (keys.includes(_item.key)) {
                _item.value = res.data[_item.key] === '1000-01-01' ? getCurrentDateFormatted() : res.data[_item.key]
            }
            if (["delivered"].includes(_item.key)) {
                _item.value = res.data[_item.key] == 1 ? '是' : '否'
            }
        })
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
};3
function isNumber(value) {
  return /^[\d.]+$/.test(value);
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
    if(!isNumber(formdata.ready) || !isNumber(formdata.amount)) {
        uni.$u.toast("数量请输入数字")
        return
    }
    if(formdata.ready > +formdata.amount) {
        uni.$u.toast("签收数量不能大于总数")
        return
    }
    let params = {
        ...detail.value,
        ...formdata,
        amount: +formdata.amount,
        ready: +formdata.ready,
        delivered: formdata.delivered == '是' ? 1 : 0,
    }
    $http.post("/shotage/update_material_shot_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            // setTimeout(() => {
            //     uni.navigateBack()
            // }, 2000);
            getMaterialShotList()
        }

    }).catch(err => {
        uni.$u.toast(err.status.msg)
    })
}
const getMaterialShotList = async () => {
    let dataSource = await $http.post("/shotage/get_material_shot_list", { shotageID: +shotageID.value })
    let fm = dataSource.data.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let fz = dataSource.data.map(item => item.ready).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let res = await $http.post("/shotage/get_shotage_info", { id: +shotageID.value })
    let params = {
        fromCompany: res.data.fromCompany,
        id: res.data.id,
        progress: +(fz / fm * 100).toFixed(0),
        source: res.data.source
    }
    updateShotageInfo(params)
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
const del = () => {
    uni.showModal({
        title: "确认删除该条数据？",
        success: (res) => {
            if (res.confirm) {
                $http.post("/shotage/delete_material_shot_info", { id: +data.value, deleted: 1 }).then(res => {
                    if (res.status.retCode == 0) {
                        uni.$u.toast('操作成功')
                        getMaterialShotList()
                    }

                }).catch(err => {
                    uni.$u.toast(err.status.msg)
                })
            }
        }
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
</style>