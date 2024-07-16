<template>
  <view
    class="floating-button"
    :style="{ top: top + 'px', left: left + 'px' }"
    @touchstart="handleTouchStart"
    @touchmove.prevent="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <button>复</button>
  </view>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';

const top = ref(0);
const left = ref(0);
const startX = ref(0);
const startY = ref(0);
const isDragging = ref(false);
const emit = defineEmits(['handleClick']);

const setInitialPosition = () => {
  const { windowHeight, windowWidth } = uni.getSystemInfoSync();
  top.value = windowHeight - 300; // 30px 上边距 + 50px 按钮高度
  left.value = windowWidth - 60; // 30px 左边距 + 50px 按钮宽度
};

const handleTouchStart = (event) => {
  const touch = event.touches[0];
  startX.value = touch.pageX - left.value;
  startY.value = touch.pageY - top.value;
  isDragging.value = true;
};

const handleTouchMove = (event) => {
  if (isDragging.value) {
    const touch = event.touches[0];
    top.value = touch.pageY - startY.value;
    left.value = touch.pageX - startX.value;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
};

const handleClick = () => {
  emit("handleClick");
};

onMounted(() => {
  setInitialPosition();
});
</script>

<style scoped>
.floating-button {
  position: absolute;
  z-index: 1000;
  touch-action: none; /* 确保在拖拽时禁用默认的滚动行为 */
}
button {
  width: 50px;
  height: 50px;
  background-color: rgb(69, 96, 225);
  color: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 5rpx 5rpx 25rpx rgb(0,0,0,0.2);
}
</style>
