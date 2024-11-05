<template>
  <view
    class="block-header"
    :style="[{ height: `${height}px`, backgroundColor: bgColor }, headerStyle]"
  >
    <view class="left" :style="leftStyle">
      <slot name="left">
        <view class="left-bar" :style="{ backgroundColor: barColor }"></view>
      </slot>
    </view>
    <view class="center" :style="centerStyle">
      <slot name="center">
        <view class="title">{{ title }}</view>
      </slot>
    </view>
    <view class="right" :style="rightStyle">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: 'transparent',
  },
  barColor: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 40,
  },
  // 接收外部传入的样式
  headerStyle: {
    type: Object,
    default: () => ({}),
  },
  leftStyle: {
    type: Object,
    default: () => ({}),
  },
  centerStyle: {
    type: Object,
    default: () => ({}),
  },
  rightStyle: {
    type: Object,
    default: () => ({}),
  },
})

const barColor = ref(props.barColor)

const randomColor = computed(() => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
})

onMounted(() => {
  if (!barColor.value) {
    barColor.value = randomColor.value
  }
})
</script>

<style scoped>
.block-header {
  display: flex;
  align-items: center;
  /* padding: 12px 16px; */
  /* height: 42rpx; */
  /* margin-bottom: 15rpx; */
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 24rpx;
  margin-right: 10rpx;
}

.left-bar {
  width: 8rpx;
  height: 100%;
}

.center {
  flex: 1;
  overflow: hidden;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  /* line-height: 42rpx; */
  color: #1d2129;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right {
  margin-left: auto;
}
</style>
