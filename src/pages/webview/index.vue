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
    <uv-overlay :show="isLoading" :duration="300" :z-index="999" :opacity="1">
      <view class="w-full h-full flex justify-center items-center bg-#000E2D">
        <uv-loading-icon></uv-loading-icon>
      </view>
    </uv-overlay>
    <!-- <iframe
          ref="iframe"
          :src="src"
          frameborder="0"
          style="width: 100%; height: 100%"
          @load="onIframeLoad"
        ></iframe> -->
    <web-view
      id="webview"
      :src="src"
      @message="onMessageFromH5"
      @onPostMessage="onMessageFromH5"
    ></web-view>
  </view>
</template>

<script setup>
import { useCommonStore } from '@/store'
const commonInfo = useCommonStore().commonInfo || {}

const isLoading = ref(true)
const serviceAddress = commonInfo.serviceAddress || ''
const planObj = commonInfo.planObj || {}
const planId = planObj.id || 'page'
const src = ref('')
// const iframe = ref(null)

// 页面加载时设置 `src`
onLoad(() => {
  console.log('onShow-src.value===>', src.value)
  if (!serviceAddress || !planId) {
    uni.redirectTo({
      url: '/pages/mine/index',
    })
    return
  }
  src.value = `${serviceAddress}/hcs-design-h5/${planId}/index.html`
  // src.value = 'http://192.168.70.68/hcs-design-h5/1727250800901/index.html'
  console.error('this.src===>', src.value)
  setTimeout(() => {
    isLoading.value = false
  }, 2500)
})

// const onIframeLoad = () => {
//   console.log('iframe 页面加载完成')
//   setTimeout(() => {
//     isLoading.value = false
//   }, 2500)
// }

// onMounted(() => {
//   window.addEventListener('message', onMessageFromH5)
// })

// const onMessageFromH5 = (event) => {
//   console.log('接收来自 H5 的消息', event)

//   // // 确保消息是从受信任的源发送的
//   // if (event.origin !== 'http://你的H5页面域名') {
//   //   console.warn('消息来源不可信')
//   //   return
//   // }

//   const { action, params } = event.data

//   if (action === 'openSettings') {
//     uni.navigateTo({
//       url: '/pages/mine/index',
//       success: () => {
//         console.log('已跳转到设置页面')
//       },
//     })
//   } else if (action === 'openOtherPage') {
//     isLoading.value = true
//     if (params) {
//       src.value = `${serviceAddress}/hcs-design-h5/${planId}/index.html?${params}`
//     } else {
//       src.value = `${serviceAddress}/hcs-design-h5/${planId}/index.html`
//     }
//     setTimeout(() => {
//       isLoading.value = false
//     }, 2500)
//   } else if (action === 'pageLoaded') {
//     isLoading.value = false
//     console.log('页面加载完成')
//   }
// }

// 接收来自 H5 的消息
const onMessageFromH5 = (event) => {
  console.log('接收来自 H5 的消息', event)
  const {
    detail: {
      data: [{ action, params }],
    },
  } = event

  if (action === 'openSettings') {
    // 跳转到 uni-app 设置页面
    uni.navigateTo({
      url: '/pages/mine/index', // 跳转到设置页面
    })
  } else if (action === 'openOtherPage') {
    isLoading.value = true // 开始加载动画
    if (params) {
      src.value = `${serviceAddress}/hcs-design-h5/${planId}/index.html?${params}`
    } else {
      src.value = `${serviceAddress}/hcs-design-h5/${planId}/index.html`
    }
    setTimeout(() => {
      isLoading.value = false
    }, 2500)
  } else if (action === 'pageLoaded') {
    // TODO
    isLoading.value = false // 停止加载动画
    console.log('页面加载完成')
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}
</style>
