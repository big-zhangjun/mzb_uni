<template>
    <div ref="chartContainer" :style="style"></div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import * as echarts from 'echarts';
  
  export default {
    name: 'ECharts',
    props: {
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
    },
    setup(props) {
      const chartContainer = ref(null);
      let chartInstance = null;
  
      const initChart = () => {
        if (chartContainer.value) {
          chartInstance = echarts.init(chartContainer.value);
          chartInstance.setOption(props.options);
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
  
      watch(() => props.options, (newOptions) => {
        if (chartInstance) {
          chartInstance.setOption(newOptions);
        }
      }, { deep: true });
  
      return {
        chartContainer
      };
    }
  };
  </script>
  
  <style scoped>
  /* 可以根据需要添加样式 */
  </style>
  