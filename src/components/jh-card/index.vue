<template>
  <view
    class="new-card-class new-card"
    :class="[full ? 'card-full' : '', border ? 'card-border' : '']"
    @click="handleClick"
    @longpress="longTap"
  >
    <slot>
      <view class="card-header" :style="{ background: header.bgcolor || '#fff' }">
        <view class="header-left">
          <image
            v-if="imageUrl || image.url"
            :src="imageUrl || image.url"
            class="header-thumb"
            mode="widthFix"
          ></image>
          <view
            class="header-content"
            :style="tagText || tag ? { justifyContent: 'space-between' } : null"
          >
            <text
              class="header-title"
              :style="{
                fontSize: (title.size || 34) + 'rpx',
                color: title.color || '#1D2129',
              }"
              v-if="titleText || title.text"
            >
              {{ titleText || title.text }}
            </text>
            <view
              class="header-date"
              :style="{
                fontSize: (tag.size || 24) + 'rpx',
                color: tag.color || '#b2b2b2',
              }"
              v-if="tagText || tag.text"
            >
              {{ tagText || tag.text }}
            </view>
          </view>
        </view>
        <view class="header-right" v-if="$slots.right">
          <slot name="right"></slot>
        </view>
      </view>
    </slot>
    <view class="card-body" v-if="$slots.body">
      <slot name="body"></slot>
    </view>
    <view class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  // 是否铺满
  full: {
    type: Boolean,
    default: true,
  },
  // 优先级高于image 中 url
  imageUrl: {
    type: String,
    default: '',
  },
  image: {
    type: Object,
    default: () => ({
      url: '', // 图片地址
      height: 60, // 图片高度
      width: 60, // 图片宽度
      circle: false,
    }),
  },
  // v2.9.6+ 标题文本，优先级高于 title中 text
  titleText: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: Object,
    default: () => ({
      text: '', // 标题文字
      size: 30, // 字体大小
      color: '#7A7A7A', // 字体颜色
    }),
  },
  dateText: {
    type: String,
    default: '',
  },
  // 时间
  date: {
    type: Object,
    default: () => ({
      text: '', // 时间文字
      size: 30, // 字体大小
      color: '#7A7A7A', // 字体颜色
    }),
  },
  // 标签文本，优先级高于 tag中 text
  tagText: {
    type: String,
    default: '',
  },
  // 标签，时间等
  tag: {
    type: Object,
    default: () => ({
      text: '', // 标签文字
      size: 24, // 字体大小
      color: '#b2b2b2', // 字体颜色
    }),
  },
  header: {
    type: Object,
    default: () => ({
      bgcolor: '#fff', // 背景颜色
      line: false, // 是否去掉底部线条
    }),
  },
  // 是否设置外边框
  border: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['click', 'longclick'])

const handleClick = () => {
  emit('click', {
    index: props.index,
  })
}

const longTap = () => {
  emit('longclick', {
    index: props.index,
  })
}
</script>

<style lang="scss" scoped>
.new-card {
  box-sizing: border-box;
  // margin: 0 30rpx;
  overflow: hidden;
  font-size: 28rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx #eee;
}

// .card-full {
//   margin: 0 !important;
//   // border-radius: 0 !important;
// }

.card-full::after {
  border-radius: 0 !important;
}

.card-border {
  position: relative;
  box-shadow: 0rpx 8 12rpx 0rpx rgba(152, 178, 244, 0.1);
  border-radius: 16rpx;
}

.card-header {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 24rpx;
  overflow: hidden;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
}

.header-left {
  display: flex;
  align-items: center;
}
.header-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}
.header-right {
  flex-shrink: 0;
}

.header-thumb {
  width: 96rpx;
  height: 96rpx;
  margin-right: 28rpx;
  vertical-align: middle;
}

.header-title {
  display: inline-block;
  max-width: 460rpx;
  overflow: hidden;
  font-size: 36rpx;
  color: #1d2129;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.header-date {
  font-size: 24rpx;
  color: #86909c;
  margin-top: 8rpx;
}
.card-body {
  box-sizing: border-box;
  font-size: 32rpx;
  color: #262b3a;
}

.card-footer {
  box-sizing: border-box;
  font-size: 28rpx;
  color: #596d96;
  border-bottom-right-radius: 10rpx;
  border-bottom-left-radius: 10rpx;
}
</style>
