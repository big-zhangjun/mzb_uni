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
                            <view v-else @click="handleProductCheck(formData.value)">{{ formData.value || '请选择' }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <up-picker :defaultIndex="defaultIndex" :show="productNameStatus" ref="uPickerRef" :columns="columns"
            @confirm="handleChangeEpStatus"  @cancel="productNameStatus = false"></up-picker>
        <view class="submit" @click="submit">提交</view>
    </view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../request/index'
import { ref } from 'vue';
const type = ref("")
const productNameStatus = ref(false)
const defaultIndex = ref([0])
const columns = ref([
    [
        "热压罐",
        "储气罐",
        "液压釜",
        "固化炉",
        "系统改造"
    ]
])
// 响应式表单数据  
const form = ref([
    [
        {
            label: "项目编号",
            key: "number",
            value: ""
        },
        {
            label: "产品编号",
            key: "productNumber",
            value: ""
        },
        {
            label: "客户名称",
            key: "customerName",
            value: ""
        },
        {
            label: "产品名称",
            key: "productName",
            type: 'select',
            value: ""
        },
        {
            label: "规格/型号",
            key: "model",
            value: ""
        }
    ], [
        {
            label: "罐体尺寸",
            key: "tankSize",
            value: ""
        },
        {
            label: "优先等级",
            key: "level",
            value: ""
        },
        {
            label: "容积(m³)",
            key: "volume",
            value: ""
        },
        {
            label: "工作压力(MPa)",
            key: "workingPressure",
            value: ""
        },
        {
            label: "设计压力(MPa)",
            key: "designPressure",
            value: ""
        }
    ],
    [
        {
            label: "工作温度(℃)",
            key: "workingTemperature",
            value: ""
        },
        {
            label: "罐体厚度(mm)",
            key: "tankthickness",
            value: ""
        },
        {
            label: "球冠封头厚度(mm)",
            key: "sphericalCrownThickness",
            value: ""
        },
        {
            label: "椭圆封头厚度(mm)",
            key: "ellipticalHeadThickness",
            value: ""
        },
        {
            label: "加热功率(kw)",
            key: "heatingPower",
            value: ""
        }
    ],
    [
        {
            label: "循环风机",
            key: "circulatingFan",
            value: ""
        },
        {
            label: "热电偶",
            key: "thermocouple",
            value: ""
        },
        {
            label: "检测口",
            key: "inspectionPort",
            value: ""
        },
        {
            label: "罐门结构",
            key: "doorStructure",
            value: ""
        },
        {
            label: "开门方向",
            key: "openingDirection",
            value: ""
        }
    ],
    [
        {
            label: "真空路数",
            key: "vacuumNumber",
            value: ""
        },
        {
            label: "真空泵",
            key: "vacuumPump",
            value: ""
        },
        {
            label: "缓冲罐(m³)",
            key: "bufferTank",
            value: ""
        },
        {
            label: "真空度",
            key: "vacuumDegree",
            value: ""
        },
        {
            label: "储气罐规格",
            key: "assModel",
            value: ""
        }
    ],
    [
        {
            label: "储气罐工作压力(MPa)",
            key: "assWorkingPressure",
            value: ""
        },
        {
            label: "储气榷筒体厚度(mm)",
            key: "assTankthickness",
            value: ""
        },
        {
            label: "储气罐封头厚度(mm)",
            key: "assHeadThickness",
            value: ""
        },
        {
            label: "空压机",
            key: "airCompressor",
            value: ""
        },
        {
            label: "制氮机",
            key: "nitrogenPlant",
            value: ""
        }
    ], [
        {
            label: "增压机",
            key: "supercharger",
            value: ""
        },
        {
            label: "罐内小车",
            key: "carInTank",
            value: ""
        },
        {
            label: "罐外小车",
            key: "carOutTank",
            value: ""
        },
        {
            label: "桥架",
            key: "bridgeTray",
            value: ""
        },
        {
            label: "牵引车",
            key: "tractor",
            value: ""
        }
    ],
    [
        {
            label: "泄压阀",
            key: "pressureReliefValve",
            value: ""
        },
        {
            label: "进气阀组",
            key: "intakeValveGroup",
            value: ""
        },
        {
            label: "排气阀组",
            key: "exhaustValveGroup",
            value: ""
        },
        {
            label: "冷却阀组",
            key: "coolingValveGroup",
            value: ""
        },
        {
            label: "排空阀组",
            key: "emptyValveGroup",
            value: ""
        },
        {
            label: "气冷阀组",
            key: "airCooledValve",
            value: ""
        }
    ]
]);
const number = ref("")
const data = ref("")
onLoad((options) => {
    console.log(options);
    type.value = options.type
    data.value = options.id
    number.value = options.number
    if (type.value == 'add') {
        uni.setNavigationBarTitle({
            title: '新建项目'
        })
    } else {
        uni.setNavigationBarTitle({
            title: "编辑项目"
        })
        getData(+options.id, options.number)
    }
})

// 表单引用  
const handleProductCheck = (v) => {
    
    let index = columns.value[0].findIndex(item=> item == v)
    if(index!=-1) {
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
// 获取数据
const getData = (id, number) => {
    let params = {
        id,
        number
    }
    $http.post("/project/get_project_info", params).then(res => {
        let keys = Object.keys(res.data)
        form.value.forEach(item => {
            item.forEach(_item => {
                if (keys.includes(_item.key)) {
                    _item.value = res.data[_item.key]
                }
            })
        })
    })

}
const handleChangeEpStatus = (data) => {
    form.value.forEach(item=> {
        let index = item.findIndex(_item=> _item.key == 'productName')
        if(index!=-1) {
            item[index].value = data.value[0]
        }
    })
    productNameStatus.value = false
}
// 提交方法  
function submit() {
    // let params = {
    //     ...form.value,
    //     level: Number(form.value.level)
    // }
    let params = form.value.flat().reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});
    params.level = params.level ? +params.level : 1
    if (type.value == 'add') {
        $http.post("/project/add_project_info", params).then(res => {
            if (res.status.retCode == 0) {
                uni.$u.toast('操作成功')
                setTimeout(() => {
                    uni.navigateBack()
                }, 2000);
            }

        }).catch(err => {
            uni.$u.toast(err.status.msg)
        })
    } else {
        editFormFun(params)
    }

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
</style>