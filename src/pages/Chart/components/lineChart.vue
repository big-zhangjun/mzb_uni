<template>
    <view class="chat">
        <view style="width:100%; height:100%"><l-echart ref="chartRef"></l-echart></view>
    </view>
</template>
<script setup>
// 插件内的 二选一 
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import * as $http from '../../../request/index'

//   import chinaMapData from './components/china.json'; // 修改路径为你的实际路径
const chartRef = ref(null)
const employeeData = ref([])
const option = ref({});
const getOptions = async () => {
    let res = await $http.post("/statistics/project_count", { year: "" })
    initLineChart(res.data)
}
const initLineChart = async (data) => {
    const option = {
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
    if (!chartRef.value) return
    //   echarts.registerMap('china', chinaMapData);
    const myChart = await chartRef.value.init(echarts)
    myChart.setOption(option)
}
onMounted(() => {
    // 组件能被调用必须是组件的节点已经被渲染到页面上
    setTimeout(async () => {
        if (!chartRef.value) return
        getOptions()
    }, 300)
})
</script>
<style>
.chat {
    width: calc(100%);
    height: 400rpx;
}

.uni-ec-canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>