<template>
    <view class="chat">
        <view style="width:100%; height:100%"><l-echart ref="chartRef"></l-echart></view>
    </view>
</template>
<script setup>
// 插件内的 二选一 
const echarts = require('../../../static/echarts.min.js')

import { ref, onMounted, defineProps, watch } from 'vue'
const props = defineProps({
    options: [Object, Array]
})
watch(
    () => props.options,
    (newVal, oldVal) => {
        if (newVal, oldVal) {
            //这里是数据更新变化后需要执行的动作
            initLineChart(newVal)
        }
    },
    { immediate: true, deep: true }
)
console.log(props.options);
const chartRef = ref(null)
const initLineChart = async (option) => {

    if (!chartRef.value) return
    const myChart = await chartRef.value.init(echarts)
    myChart.setOption(option)
}
onMounted(() => {
    // 组件能被调用必须是组件的节点已经被渲染到页面上
    setTimeout(async () => {
        console.log(props.options, 'props.options');
        if (!chartRef.value || !props.options) return
        initLineChart(props.options)
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