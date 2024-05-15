<template>
    <view>
      <ECharts :options="chartOptions" :style="{ width: '100%', height: '400px' }" />
    </view>
  </template>
  
  <script>
  import { ref } from 'vue';
  import ECharts from './components/china.vue';
  
  export default {
    components: {
      ECharts
    },
    setup() {
      const chartOptions = ref({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
  
      return {
        chartOptions
      };
    }
  };
  </script>
  
  <style scoped>
  /* 可以根据需要添加样式 */
  </style>
  