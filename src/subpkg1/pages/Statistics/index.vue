<template>
  <view class="chat">
    <view style="width:750rpx; height:100%"><l-echart ref="chartRef"></l-echart></view>
  </view>
</template>
<script setup>
// 插件内的 二选一 
// import * as echarts from 'echarts'
const echarts = require('../../../static/echarts.min.js')
console.log(echarts, 'echarts');
import { ref, onMounted } from 'vue'
// import chinaMapData from './china.json'; // 修改路径为你的实际路径
import * as $http from '../../../request/index'
const chartRef = ref(null)
const dataValue = ref()

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
        console.log(`该位置位于：${province}`);
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
        dataValue.value = Object.keys(grouped).map(province => ({
          province: province,
          result: grouped[province],
          value: [grouped[province][0].longitude, grouped[province][0].latitude]
        }));
        if (!chartRef.value) return

        wx.request({
          url: 'https://www.ktsoftware.cn/doc/china.json',
          header: {
            'content-type': 'application/json'
          },
          async success(res) {
            wx.hideLoading();
            console.log(res.data)
            echarts.registerMap('china', res.data);
            const myChart = await chartRef.value.init(echarts)
            const option = {
              //设置一个标题
              title: {
                text: '',
                x: 'center',
                textStyle: {
                  color: '#fff',
                  fontSize: "40"
                }
              },
    
              //鼠标划过省份下弹框
              tooltip: {
                show: true,
              },
              geo: {
                map: "china",
                show: true,
                roam: true,
                zoom: 1.3,//地图缩放比例
                center: [105, 30],//地图位置
                itemStyle: {
                  // 地图区域的颜色
                  areaColor: "#71d5a1", // 绿色
                  // 图形的描边颜色
                  borderColor: "#2979ff", // 蓝色
                },
                label: {
                  normal: {
                    show: true,
                    fontSize: '11.5',
                    color: "rgb(255,255,153)"
                  }
                },
                emphasis: {
                  // 设置区域样式
                  itemStyle: {
                    areaColor: "#ffff99", // 黄色
                    borderColor: "#f29100", // 描边颜色黄色
                  },
                  // 设置字体
                  label: {
                    fontSize: 16, // 16px
                    color: "#f29100", // 黄色
                  },
                },
    
              },
    
              series: [
                //我们的散点
                {
                  type: "map",
                  map: "china",
                  geoIndex: 0,
                  roam: true,
                },
                {
                  name: '点',
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  zlevel: 6,
                  itemStyle: {
                    color: "red",
                    shadowColor: "red"
                  }
                },
                //涟漪特效
                {
    
                  name: "产品销量",
                  type: "effectScatter",
                  coordinateSystem: "geo",
                  data: dataValue.value,//传入的地图点数据
                  symbolSize: 12,//涟漪大小
                  showEffectOn: "render",
                  //涟漪效应
                  rippleEffect: {
                    brushType: "stroke",
                    color: "red",
                    period: 10,//周期
                    scale: 4//规模
                  },
                  hoverAnimation: true,//悬停动画
                  //地图点样式
                  label: {
                    formatter: "{b}",
                    position: "top",
                    show: true,
                    fontSize: "10",
                  },
                  itemStyle: {
                    color: "#f13434",
                    shadowBlur: 2,
                    shadowColor: "#333"
                  },
                  //鼠标点击散点的下弹框
                  tooltip: {
                    show: true,
                    triggerOn: "click",
                    formatter: function (data1) {
                      let list = data1.data.result
                      let str = ""
                      list.forEach(item => {
                        str += `姓名：${item.userName} 日期：${item.blogDate}`
                      })
                      return str
                    }
                  },
                  zlevel: 1
                }
              ]
            }
            myChart.setOption(option)
          }
        })


      }
    })
  });
}
onMounted(() => {
  // 组件能被调用必须是组件的节点已经被渲染到页面上
  setTimeout(async () => {
    getUserLocation()
    //   if (!chartRef.value) return
    //   echarts.registerMap('china', chinaMapData);
    //   const myChart = await chartRef.value.init(echarts)
    //   myChart.setOption(option)
  }, 300)
})
</script>
<style>
.chat {
  width: 100%;
  background-color: #f2f2f2;
  height: 100vh;
  overflow: hidden;
}

.uni-ec-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>