<template>
    <view class="pages">
        <view class="h1">
            项目统计
        </view>
        <view class="card">
            <view class="filter">
                <view class="type">
                    <view class="item" @click="productType = item.id" :class="{ active: productType == item.id }"
                        v-for="item in types" :key="item.id">
                        {{
                            item.label }}</view>
                </view>
                <view class="date" @click="handleChangeDate(1)">
                    <up-icon name="calendar" size="20"></up-icon>
                    <text>{{ productYear }}</text>
                </view>
            </view>
            <view class="box" v-show="!show">
                <lineChart :options="productLineData" v-if="productType == 1" />
                <barChart v-else :options="productBarData" />
            </view>
        </view>
        <view class="h1">
            日志统计
        </view>
        <view class="card">
            <view class="filter">
                <view class="type">
                    <view class="item" @click="LogType = item.id" :class="{ active: LogType == item.id }"
                        v-for="item in types" :key="item.id">
                        {{
                            item.label }}</view>
                </view>
                <view class="date" @click="handleChangeDate(2)">
                    <up-icon name="calendar" size="20"></up-icon>
                    <text>{{ logYear }}-{{ month }}</text>
                </view>
            </view>
            <view class="box" v-show="!show">
                <lineChart :options="logLineOption" v-if="LogType == 1" />
                <barChart v-else :options="logBarOption" />
            </view>
        </view>
        <view class="h1">
            出差分布
        </view>
        <view class="card">
            <view class="header">
                <view class="item city">地区</view>
                <view class="item" style="color: #12151b;">人员</view>
            </view>
            <view v-for="(item, idx) in mapData" :key="idx">
                <view class="content" v-for="_item in item.result">
                    <view class="item city">{{ _item.city }}</view>
                    <view class="item">{{ getRealName(_item) }}</view>
                </view>
            </view>
        </view>
        <up-picker :show="show" :columns="yearList" @cancel="show = false" @confirm="confirm"></up-picker>
    </view>
</template>

<script setup>
import lineChart from './components/lineChart'
import barChart from './components/barChart'
import * as $http from '../../request/index'
const show = ref(false)
import { ref } from 'vue'
const productLineData = ref({})
const productBarData = ref({})
const logBarOption = ref({})
const LogType = ref(1)
const productType = ref(1)
const yearList = ref([])
const logLineOption = ref({})
const poupType = ref(1)
const types = ref([
    {
        id: 1,
        label: '折'
    },
    {
        id: 2,
        label: '柱'
    },
])
const month = ref((new Date().getMonth() + 1).toString().padStart(2, '0'))

const months = ref([
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
])
const logYear = ref("2024")
const productYear = ref('2024')
const mapData = ref([])
const getYearList = async () => {
    let res = await $http.post("/statistics/project_year", { deptID: 1 })
    yearList.value = [res.data, months.value]
}
const getProductOptions = async () => {
    let year = productYear.value == '未知' ? '' : productYear.value
    let res = await $http.post("/statistics/project_count", { year })
    getProductBarOption(res.data)
    getProductLineOption(res.data)
}
const handleChangeDate = (type) => {
    if(type == 1) {
        yearList.value = [yearList.value[0]]
    } else {
        yearList.value = [yearList.value[0], months.value]
    }
    poupType.value = type
    show.value = true
}
const getRealName = (item) => {
    return item.data.map(item => item.realName).join("，")
}
const confirm = (v) => {
    if (poupType.value == 1) {
        productYear.value = v.value[0]
        getProductOptions()
    } else {
        logYear.value = v.value[0]
        month.value = v.value[1]
        getLogOptions()
    }
    show.value = false
}
const getProductBarOption = (data) => {
    let undoneData = data.map((item, idx) => {
        return {
            value: item.undone,
            itemStyle: {
                color: 'rgb(84,112,198)'
            }
        }
    })
    let totalData = data.map((item, idx) => {
        return {
            value: item.total,
            itemStyle: {
                color: 'rgb(250,200,88)'
            }
        }
    })
    let doneData = data.map((item, idx) => {
        return {
            value: item.done,
            itemStyle: {
                color: 'rgb(145,204,117)'
            }
        }
    })
    productBarData.value = {
        title: {
            text: '',
            left: 'center',
            show: false
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: [
                {
                    name: "未完成",
                },
                {
                    name: "已完成",
                },
                {
                    name: "总数",
                }
            ]
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.label),
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: "未完成",
                data: undoneData,
                type: 'bar',
                barWidth: '20%'
            },
            {
                name: "已完成",
                data: doneData,
                type: 'bar',
                barWidth: '20%'
            },
            {
                name: "总数",
                data: totalData,
                type: 'bar',
                barWidth: '20%'
            }
        ]
    };

}
const getProductLineOption = (data) => {
    productLineData.value = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.label)
        },
        yAxis: {
            type: 'value',
            max: Math.max(...data.map(item => item.total)) + 20
        },
        legend: {
            data: [
                {
                    name: "未完成",
                },
                {
                    name: "已完成",
                },
                {
                    name: "总数",
                }
            ]
        },
        series: [
            {
                name: "已完成",
                data: data.map(item => item.done),
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: 'rgb(145,204,117)',
                    width: 3
                },
                itemStyle: {
                    color: 'rgb(145,204,117)',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(79, 141, 249, 0.2)'
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#666'
                }
            },
            {
                name: "总数",
                data: data.map(item => item.total),
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: 'rgb(250,200,88)',
                    width: 3
                },
                itemStyle: {
                    color: 'rgb(250,200,88)',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(79, 141, 249, 0.2)'
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#666'
                }
            },
            {
                name: "未完成",
                data: data.map(item => item.undone),
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#4f8df9',
                    width: 3
                },
                itemStyle: {
                    color: '#4f8df9',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(79, 141, 249, 0.2)'
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#666'
                }
            },
        ]
    };
}
const getLogOptions = async () => {
    let year = logYear.value == '未知' ? '1000' : logYear.value

    let params = {
        year,
        month: month.value,
        deptID: 51,
        resign: 2
    }
    let res = await $http.post("/statistics/blog_count", params)
    getLogLineOption(res.data)
    getLogBarOption(res.data)
}
const getLogLineOption = async (data) => {
    logLineOption.value = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },

        dataZoom: [
            {
                type: 'slider',
                realtime: true,
                start: 0,
                end: 100,
                show: true,
                height: 10,
                bottom: 0,
                handleSize: 0, // 左右2个滑动条的大小
                borderColor: '#fff', // 滑动通道的边框颜色
                showDetail: false,
                fillerColor: '#eee',
                backgroundColor: '#fff', // 未选中的滑动条的颜色
                showDataShadow: false, // 是否显示数据阴影 默认auto
            },
            {
                //没有下面这块的话，只能拖动滚动条，鼠标滚轮在区域内不能控制外部滚动条(当前滑块可控制)
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100,
            },
        ],
        xAxis: {
            type: 'category',
            data: data.map(item => item.userName),
            axisLabel: {
                formatter(value, index) {
                    if (index % 5 === 0 || index === 23) { // 控制每 4 个刻度显示一次，最后一个刻度始终显示
                        return value;
                    } else {
                        return '';
                    }
                },
                rotate: 45, // 将标签旋转45度
                interval: 0,  // 显示所有标签，如果标签过多可以适当调整
            }
        },
        yAxis: {
            type: 'value',
            max: Math.max(...data.map(item => item.number)) + 2
        },
        dataZoom: [
            {
                type: 'inside', // 使用 inside 类型
                start: 0,
                end: 100,
                zoomLock: false // 允许拖拽
            }
        ],
        series: [
            {
                data: data.map(item => item.number),
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: 'rgb(145,204,117)',
                    width: 3
                },
                itemStyle: {
                    color: 'rgb(145,204,117)',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(79, 141, 249, 0.2)'
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#666'
                }
            }
        ]
    };
}
const getLogBarOption = (data) => {
    let datas = data.map((item, idx) => {
        return {
            value: item.number,
            itemStyle: {
                color: 'rgb(145,204,117)'
            }
        }
    })
    logBarOption.value = {
        title: {
            text: '',
            left: 'center',
            show: false
        },
        tooltip: {
            trigger: 'item'
        },
        dataZoom: [
            {
                type: 'inside', // 使用 inside 类型
                start: 0,
                end: 100,
                zoomLock: false // 允许拖拽
            }
        ],
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.userName),
            axisLabel: {
                interval: 0,
                rotate: 0,
                formatter(value, index) {
                    if (index % 5 === 0 || index === 23) { // 控制每 4 个刻度显示一次，最后一个刻度始终显示
                        return value;
                    } else {
                        return '';
                    }
                },
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: datas,
                type: 'bar',
                barWidth: '20%'
            },
        ]
    };
}

const getProvince = async ({ latitude, longitude }, callback) => {

    // 调用逆地址解析 API
    wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
            location: `${latitude},${longitude}`,
            key: '2OYBZ-IDQ3J-C5AFC-XDWJK-AVD4F-S7FQN' // 替换为你的腾讯地图 API Key
        },
        success: (res) => {
            if (res.data.status === 0) {
                const result = res.data.result;
                const province = result.address_component.province;
                const city = result.address_component.city
                console.log(`该位置位于：${province}${city}`);
                callback(res, '逆地址解析')
            } else {
                console.error('逆地址解析失败', res.data.message);
            }
        },
        fail: (error) => {
            console.error('请求失败', error);
        }
    });
}
const getUserLocation = async () => {
    const res = await $http.post("/statistics/user_location", { deptID: 51 })
    let employeeData = res.data.filter(item => item.longitude)
    let idx = 0;
    let list = []
    employeeData.forEach(element => {
        getProvince(element, async (res) => {
            const result = res.data.result;
            idx++
            list.push({ ...result.address_component, ...element })
            if (idx == employeeData.length) {
                let grouped = list.reduce((acc, current) => {
                    let province = current.province;
                    if (!acc[province]) {
                        acc[province] = [];
                    }
                    acc[province].push(current);
                    return acc;
                }, {});
                console.log(grouped, 'grouped');
                mapData.value = Object.keys(grouped).map(province => {
                    let groupedByCity = grouped[province].reduce((acc, curr) => {
                        if (!acc[curr.city]) {
                            acc[curr.city] = [];
                        }
                        acc[curr.city].push(curr);
                        return acc;
                    }, {});
                    let groupedByCityArray = Object.keys(groupedByCity).map(city => {
                        return {
                            city,
                            data: groupedByCity[city]
                        };
                    });

                    return {
                        province: province,
                        result: groupedByCityArray,
                        value: [grouped[province][0].longitude, grouped[province][0].latitude]
                    }
                });

                console.log(mapData.value, 'ss');

            }
        })
    });
}
getUserLocation()
getYearList()
getLogOptions()
getProductOptions()
</script>

<style lang="scss" scoped>
.pages {
    min-height: 100vh;
    padding-top: 30rpx;
    background-color: #f5f5f5;
    padding-bottom: 60rpx;
}

// .tabs {
//     display: flex;
//     line-height: 98rpx;
//     box-shadow: 0 16rpx 16rpx rgba(0, 0, 0, .04);
//     background-color: #fff;
//     padding: 0 40rpx;
//     align-items: center;
//     gap: 80rpx;

//     .active {
//         position: relative;
//         color: rgb(65, 74, 140);

//         &::before {
//             content: "";
//             display: block;
//             width: 40rpx;
//             height: 6rpx;
//             background-color: rgb(65, 74, 140);
//             position: absolute;
//             border-radius: 6rpx;
//             transform: translateX(-50%);
//             bottom: 8rpx;
//             left: 50%;
//         }
//     }
// }
.h1 {
    font-size: 38rpx;
    font-weight: bold;
    color: #12151b;
    margin: 0 0 40rpx 30rpx;
}

.filter {
    display: flex;
    justify-content: space-between;
    // margin-top: 40rpx;
    padding: 10rpx;
    margin-bottom: 40rpx;

    .date {
        padding: 10rpx 20rpx;
        font-size: 24rpx;
        color: #7a7a7a;
        border-radius: 12rpx;
        border: solid rgb(197, 197, 197) 1px;
        display: flex;
        align-items: center;
        gap: 10rpx;
    }
}

.card {
    .type {
        gap: 40rpx;
        display: flex;

        .item {
            width: 72rpx;
            text-align: center;
            line-height: 72rpx;
            border-radius: 8rpx;
            border: solid 1rpx #e2e2e2;
        }

        .active {
            background-color: rgb(54, 98, 233);
            color: #fff;
            border: none;
        }
    }

    .header,
    .content {
        display: flex;
        border: solid rgb(216, 216, 216) 1rpx;
        border-right: none;

        .item {
            width: 70%;
            text-align: center;
            font-weight: bold;
            line-height: 68rpx;
            border-right: 1rpx solid rgb(216, 216, 216);
            padding: 0 12rpx;
            color: rgb(54, 98, 233);
        }

        .city {
            display: flex;
            width: 30%;
            color: #12151b;
            align-items: center;
            justify-content: center;
        }
    }

    .content {
        border-top: none;
        border-right: none;

        .item {
            line-height: 88rpx;
            font-weight: normal;

        }
    }

    width: calc(100% - 56rpx);
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 12rpx;
    background-color: #fff;
    box-shadow: 0 16rpx 16rpx rgba(0, 0, 0, .04);
    padding: 30rpx;
    margin-bottom: 60rpx;
}
</style>