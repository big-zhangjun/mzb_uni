<template>
  <view class="chat">

    <div ref="chartContainer" :style="style"></div>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, defineProps } from 'vue';
import * as echarts from 'echarts';

defineProps({
  options: {
    type: Object,
    required: true
  },
  style: {
    type: Object,
    default: () => ({
      width: '100%',
      height: '400px'
    })
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value);
    chartInstance.setOption(props.options); // 使用 props.options
  }
};

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});

watch(() => props.options, (newOptions) => { // 使用 props.options
  if (chartInstance) {
    chartInstance.setOption(newOptions);
  }
}, { deep: true });
</script>

<style scoped>
/* 确保容器有宽高 */
.chat {
  width: 100vh;
  background-color: #000;
  height: 100vw;
  transform: rotate(90deg) translateY(-100%);
  transform-origin: left top;
  overflow: hidden;
}
</style>
