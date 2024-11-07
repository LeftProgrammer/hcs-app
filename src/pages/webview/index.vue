<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  needLogin: true,
}
</route>
<template>
  <view class="container">
    <web-view v-show="!isLoading" id="webview" :src="src" @message="onMessageFromH5"></web-view>
    <view v-if="isLoading" class="loading">
      <uv-loading-icon text="加载中"></uv-loading-icon>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(false)
const serviceAddress = uni.getStorageSync('settingData') || ''
const programmeObj = JSON.parse(uni.getStorageSync('programmeObj') || '{}')
// const settingData = {
//   serviceAddress: 'http://192.168.70.68',
//   fileName: '1727250800901',
// }
const src = ref('')
const fileName = programmeObj.fileName || 'page'

// 页面加载时设置 `src`
onMounted(() => {
  src.value = `${serviceAddress}/hcs-design-h5/${fileName}/index.html`
  console.error('this.src===>', src.value)
})

// 接收来自 H5 的消息
const onMessageFromH5 = (event) => {
  console.log('接收来自 H5 的消息', event)
  const {
    detail: {
      data: [{ action, callBackFn, params }],
    },
  } = event

  if (action === 'openSettings') {
    // const pages = getCurrentPages()
    // console.log('pages ', pages[pages.length - 1].$getAppWebview())
    // 跳转到 uni-app 设置页面
    uni.navigateTo({
      url: '/pages/mine/index', // 跳转到设置页面
      success: () => {
        console.log('已跳转到设置页面')
      },
    })
  } else if (action === 'openOtherPage') {
    isLoading.value = true // 开始加载动画
    if (params) {
      src.value = `${serviceAddress}/hcs-design-h5/${fileName}/index.html?${params}`
    } else {
      src.value = `${serviceAddress}/hcs-design-h5/${fileName}/index.html`
    }
    setTimeout(() => {
      isLoading.value = false
    }, 3500)
  } else if (action === 'pageLoaded') {
    // TODO
    isLoading.value = false // 停止加载动画
    console.log('页面加载完成')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
