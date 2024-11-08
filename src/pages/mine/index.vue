<route lang="json5">
{
  style: {
    navigationBarTitleText: '系统设置',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page h-full bg-#000617 p-8">
    <view class="w-112 h-full flex flex-col text-4">
      <view class="width-full flex flex-col px-12 pt-6 c-#ffffff bg-#082665 mb-3">
        <view class="flex justify-between items-center pb-5 mb-4 border-b-1 border-#2E5EBF">
          <view class="flex items-center">
            <view class="mr-3 label-icon"></view>
            <view class="">账户</view>
          </view>
          <view class="flex-1 flex flex-justify-end items-center">{{ userInfo.nickname }}</view>
        </view>
        <view class="flex justify-between items-center pb-5 mb-4 border-b-1 border-#2E5EBF">
          <view class="flex items-center">
            <view class="mr-3 label-icon"></view>
            <view class="">修改密码</view>
          </view>
          <view class="flex-1 flex flex-justify-end items-center" @click="openPasswordPopup">
            <uv-icon name="arrow-right" color="#ffffff" size="16"></uv-icon>
          </view>
        </view>
        <view class="flex justify-between items-center pb-5">
          <view class="flex items-center">
            <view class="mr-3 label-icon"></view>
            <view class="">版本号</view>
          </view>
          <view class="flex-1 flex flex-justify-end items-center c-#2289FF" @click="checkForUpdate">
            {{ appVersion.current }}
          </view>
        </view>
      </view>

      <view class="width-full flex flex-col px-12 pt-6 c-#ffffff bg-#082665 mb-5">
        <view class="flex justify-between items-center pb-5 mb-4 border-b-1 border-#2E5EBF">
          <view class="flex items-center">
            <view class="mr-3 label-icon"></view>
            <view class="">配置地址</view>
          </view>
          <view class="flex-1 flex flex-justify-end items-center">{{ serviceAddress }}</view>
        </view>
        <view class="flex justify-between items-center pb-5">
          <view class="flex items-center">
            <view class="mr-3 label-icon"></view>
            <view class="">设计方案</view>
          </view>
          <view class="flex-1 flex flex-justify-end items-center" @click="openProgrammeModal">
            <view class="mr-3">{{ planObj.name }}</view>
            <uv-icon name="arrow-right" color="#ffffff" size="16"></uv-icon>
          </view>
        </view>
      </view>

      <!-- <uv-button type="primary" text="去首页" @click="completeSettings"></uv-button> -->
      <uv-button class="w-full" type="primary" @click="handleLogout">退出登录</uv-button>
    </view>

    <!-- 底部功能按钮 -->
    <!-- <view class=""> -->
    <!-- <uv-button class="w-full mb-3" type="error" @click="clearAllCache">清除缓存</uv-button> -->

    <!-- <uv-button type="primary" text="去首页" @click="completeSettings"></uv-button> -->
    <!-- </view> -->

    <programmeModal
      ref="programmeFormModal"
      modalTitle="选择方案"
      @confirm-success="handleConfirmSuccess"
    />

    <uv-modal
      class="modal"
      ref="popupRef"
      :width="600"
      :showCancelButton="true"
      :asyncClose="true"
      @confirm="handleSure"
      @cancel="handleClose"
      cancelColor="#ffffff"
    >
      <view class="modal-content">
        <view class="modal-title">修改密码</view>
        <uv-form
          labelPosition="left"
          :model="passwordModel"
          :rules="passwordRules"
          ref="passwordForm"
          labelWidth="106"
          class="w-100 h-48"
        >
          <uv-form-item prop="originalPwd">
            <template v-slot:label>
              <view class="flex flex-justify-start flex-items-center mr-4 w-18">
                <view class="label-icon"></view>
                <view class="label-text">旧密码</view>
              </view>
            </template>
            <uv-input
              placeholder="请输入旧密码"
              v-model="passwordModel.originalPwd"
              border="none"
              clearable
            ></uv-input>
          </uv-form-item>
          <uv-form-item prop="newPwd">
            <template v-slot:label>
              <view class="flex flex-justify-start flex-items-center mr-4 w-18">
                <view class="label-icon"></view>
                <view class="label-text">新密码</view>
              </view>
            </template>
            <uv-input
              :password="showPassword"
              placeholder="请输入新密码"
              v-model="passwordModel.newPwd"
              border="none"
              clearable
            >
              <template v-slot:suffix>
                <uv-icon
                  :name="showPassword ? 'eye-fill' : 'eye'"
                  size="24"
                  color="#ffffff"
                  @click="showPassword = !showPassword"
                ></uv-icon>
              </template>
            </uv-input>
          </uv-form-item>
          <uv-form-item prop="confirmpassword">
            <template v-slot:label>
              <view class="flex flex-justify-start flex-items-center mr-4 w-18">
                <view class="label-icon"></view>
                <view class="label-text">确认密码</view>
              </view>
            </template>
            <uv-input
              :password="showPassword"
              placeholder="请再次输入新密码"
              v-model="passwordModel.confirmpassword"
              border="none"
              clearable
            >
              <template v-slot:suffix>
                <uv-icon
                  :name="showPassword ? 'eye-fill' : 'eye'"
                  size="24"
                  color="#ffffff"
                  @click="showPassword = !showPassword"
                ></uv-icon>
              </template>
            </uv-input>
          </uv-form-item>
        </uv-form>
      </view>
    </uv-modal>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore, useCommonStore } from '@/store'
import { useToast, useDialog } from '@/utils/modals'
import { updatePwd } from '@/service/home'
import CryptoJS from 'crypto-js'
import programmeModal from '@/components/programmeModal/index.vue'

const userStore = useUserStore()
const commonStore = useCommonStore()
const userInfo = userStore.userInfo || {}
const commonInfo = commonStore.commonInfo || {}

const appVersion = ref({
  current: '0.8.2',
  latest: '0.8.2',
})

const serviceAddress = commonInfo.serviceAddress || ''
const planObj = commonInfo.planObj || {}
const programmeFormModal = ref(null)

const popupRef = ref(null)
const passwordForm = ref(null)
const showPassword = ref(true)
const passwordModel = ref({
  originalPwd: '',
  newPwd: '',
  confirmpassword: '',
})

const passwordRules = {
  originalPwd: [
    { type: 'string', required: true, message: '请输入旧密码', trigger: ['blur', 'change'] },
  ],
  newPwd: [
    {
      type: 'string',
      required: true,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
    {
      pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,16}$/,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
  ],
  confirmpassword: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    validator: (rule, value, callback) => {
      if (!value && passwordModel.value.newPwd) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== passwordModel.value.newPwd) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    },
  },
}

onMounted(() => {})

const openProgrammeModal = () => {
  programmeFormModal.value.openModal()
}

const handleConfirmSuccess = (formData) => {
  console.log('用户已确认，数据:', formData)
  // 在这里执行其他操作，例如根据选择的方案更新页面或发送请求
  uni.navigateTo({
    url: '/pages/webview/index', // 跳转到H5页面
    success: () => {
      console.log('已跳转到H5页面')
    },
  })
}

const completeSettings = () => {
  if (!serviceAddress) {
    useToast('请先设置服务地址')
    uni.navigateTo({
      url: '/pages/login/index', // 跳转到H5页面
      success: () => {
        console.log('已跳转到H5页面')
      },
    })
    return
  }
  if (!planObj.id || !planObj.name) {
    useToast('请先设置方案')
    openProgrammeModal()
    return
  }

  // 返回上一页
  uni.navigateTo({
    url: '/pages/webview/index', // 跳转到H5页面
    success: () => {
      console.log('已跳转到H5页面')
    },
  })
}

const clearAllCache = async () => {
  const confirmed = await useDialog('确认清除所有缓存？清除后需重新登录。', {
    showCancelButton: true,
  })
  if (confirmed) {
    uni.clearStorageSync()
    userStore.reset()
    handleLogout(false)
  }
}

const handleLogout = async (isModal = true) => {
  if (isModal) {
    const confirmed = await useDialog('确认退出登录？', {
      showCancelButton: true,
    })
    if (!confirmed) return
  }
  userStore.logout()
}

const checkForUpdate = async () => {
  if (appVersion.value.current === appVersion.value.latest) {
    useToast('当前已是最新版本')
  } else {
    const confirmed = await useDialog('有新版本，确认更新吗？', {
      showCancelButton: true,
    })
    if (confirmed) {
      useToast('开始更新...')
      // TODO: 实现具体更新逻辑
    }
  }
}

const openPasswordPopup = () => {
  popupRef.value.open()
}

const handleClose = () => {
  popupRef.value.close()
  passwordModel.value.originalPwd = ''
  passwordModel.value.newPwd = ''
  passwordModel.value.confirmpassword = ''
}

const handleSure = () => {
  passwordForm.value
    .validate()
    .then(async () => {
      const params = JSON.parse(JSON.stringify(passwordModel.value))
      params.originalPwd = CryptoJS.MD5(passwordModel.value.originalPwd).toString()
      params.newPwd = CryptoJS.MD5(passwordModel.value.newPwd).toString()
      params.confirmpassword = CryptoJS.MD5(passwordModel.value.confirmpassword).toString()
      try {
        const { code, message } = await updatePwd(params)
        if (code === 200) {
          useToast('密码修改成功')
          handleClose()
          userStore.clearPassword()
          userStore.logout()
        } else {
          useToast(message)
        }
      } catch {
        useToast('网络异常')
      }
    })
    .catch((errors) => {
      console.error('验证失败:', errors)
    })
}
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-image: url('@/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.label-icon {
  width: 8px;
  height: 8px;
  background-image: url('@/static/common/label-icon.png');
}
</style>
