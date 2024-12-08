<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page h-full bg-#000617">
    <view class="main">
      <uv-form ref="formRef" :model="form" :rules="rules" labelWidth="60">
        <uv-form-item prop="username">
          <template v-slot:label>
            <uv-icon name="account" size="24" color="#ffffff" class="mr-4"></uv-icon>
          </template>
          <uv-input v-model="form.username" placeholder="请输入账号" border="none"></uv-input>
        </uv-form-item>
        <uv-form-item prop="password">
          <template v-slot:label>
            <uv-icon name="lock" size="24" color="#ffffff" class="mr-4"></uv-icon>
          </template>
          <uv-input
            v-model="form.password"
            :password="showPassword"
            placeholder="请输入密码"
            border="none"
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
        <view class="flex flex-justify-between flex-items-center text-#ffffff text-4">
          <uv-checkbox-group v-model="rememberMe" labelColor="#ffffff">
            <uv-checkbox label="记住密码" :name="true"></uv-checkbox>
          </uv-checkbox-group>
          <view class="flex flex-items-center" @click="openServiceModal">
            配置地址
            <uv-icon name="arrow-right" size="16" color="#ffffff" class="ml-1"></uv-icon>
          </view>
        </view>
      </uv-form>
      <uv-button type="primary" text="登录" @click="handleLogin" class="login-btn"></uv-button>
    </view>

    <uv-modal
      class="modal"
      ref="serviceModal"
      :width="600"
      :showCancelButton="true"
      :asyncClose="true"
      @confirm="onServiceConfirm"
      @cancel="onServiceCancel"
      cancelColor="#ffffff"
    >
      <view class="modal-content">
        <view class="modal-title">配置地址</view>
        <uv-form
          labelWidth="106"
          labelPosition="left"
          :model="serviceFormData"
          :rules="settingRules"
          ref="serviceForm"
          class="w-100 h-20"
        >
          <uv-form-item prop="serviceAddress">
            <template v-slot:label>
              <view class="flex flex-justify-start flex-items-center mr-4 w-18">
                <view class="label-icon"></view>
                <view class="label-text">服务地址</view>
              </view>
            </template>
            <uv-input
              v-model="serviceFormData.serviceAddress"
              clearable
              placeholder="请填写服务地址"
              border="none"
            ></uv-input>
          </uv-form-item>
        </uv-form>
      </view>
    </uv-modal>

    <planModal ref="planFormModal" title="选择方案" @confirm-success="handleConfirmSuccess" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { userLogin } from '@/service/home/index'
import { useUserStore, useCommonStore } from '@/store'
import { useToast } from '@/utils/modals'
import { currRoute } from '@/utils/index'
import { cloneDeep } from 'lodash-es'
import CryptoJS from 'crypto-js'
import planModal from '@/components/planModal/index.vue'

const userStore = useUserStore()
const commonStore = useCommonStore()
const commonInfo = commonStore.commonInfo || {}
const planFormModal = ref(null)
const serviceModal = ref(null)
const serviceForm = ref(null)
const formRef = ref(null)
const showPassword = ref(true)
const form = ref({
  username: '',
  password: '',
})
const rememberMe = ref([])
const rules = ref({
  username: [
    { type: 'string', required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
  ],
  password: [
    {
      type: 'string',
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change'],
    },
    // {
    //   min: 8,
    //   max: 16,
    //   message: '密码由数字、字母和特殊符号组成，长度8-16位',
    //   trigger: ['blur', 'change'],
    // },
  ],
})

// // 加密密码
// const encryptPassword = (password) => {
//   return btoa(password) // 使用 Base64 编码进行简单加密
// }

// // 解密密码
// const decryptPassword = (encryptedPassword) => {
//   try {
//     return atob(encryptedPassword) // 使用 Base64 解码进行解密
//   } catch (e) {
//     return ''
//   }
// }

const handleConfirmSuccess = (formData) => {
  console.log('用户已确认，数据:', formData)
  // 在这里执行其他操作，例如根据选择的方案更新页面或发送请求
  const { query } = currRoute()
  useToast('登录成功')
  const redirectUrl = query.redirect || '/pages/home/index'
  uni.reLaunch({
    url: redirectUrl,
  })
}

const handleLogin = async () => {
  const serviceAddress = commonInfo.serviceAddress
  if (!serviceAddress) {
    useToast('请先配置服务地址')

    // 弹出设置服务地址的弹窗
    openServiceModal()
    return
  }

  const valid = await formRef.value.validate()
  if (valid !== true) {
    return
  }

  const params = cloneDeep(form.value)
  params.password = CryptoJS.MD5(form.value.password).toString()

  const { code, message, data } = await userLogin(params)

  if (code === 200) {
    console.log('登录成功', data)
    const userInfo = data || {}
    userStore.setUserInfo({
      ...userInfo,
    })
    handleSuccess()

    const planObj = commonInfo.planObj || {}
    if (!planObj.id || !planObj.name) {
      useToast('请选择方案')

      // 弹出设置服务地址的弹窗
      planFormModal.value.openModal()
    } else {
      handleConfirmSuccess()
    }
  } else {
    useToast(message)
  }
}

const handleSuccess = () => {
  if (rememberMe.value.length > 0) {
    userStore.setPassword(form.value.password)
  } else {
    userStore.clearPassword()
  }
}

const serviceFormData = ref({
  serviceAddress: commonInfo.serviceAddress || '',
})
const settingRules = ref({
  serviceAddress: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写服务地址'))
      }
      // else if (!isUrl(value)) {
      //   callback(new Error('请填写正确的服务地址（如：http://127.0.0.1）'))
      // }
      else {
        callback()
      }
    },
  },
})

const openServiceModal = () => {
  serviceFormData.value.serviceAddress = commonInfo.serviceAddress || 'http://192.168.70.68'
  serviceModal.value.open()
}

const onServiceCancel = () => {
  serviceModal.value.close()
}

const onServiceConfirm = () => {
  serviceForm.value
    .validate()
    .then(() => {
      commonStore.setServiceAddress(serviceFormData.value.serviceAddress)
      useToast('设置成功')
      serviceModal.value.close()
    })
    .catch((errors) => {
      console.error('errors====>', errors)
      serviceModal.value.closeLoading()
    })
}

// 页面加载时读取缓存的账号密码
onMounted(() => {
  form.value.username = userStore.userInfo.id
  form.value.password = userStore.userInfo.password
  if (userStore.userInfo.id && userStore.userInfo.password) {
    rememberMe.value.push(true)
  }
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-image: url('@/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 658px;
  height: 460px;
  background-image: url('@/static/login/main-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  padding: 120px 100px 88px 100px;
  ::v-deep .uv-form-item__body {
    border: 1px solid #ffffff;
    margin-bottom: 16px;
    padding: 10px 14px;
    .uv-form-item__body__left__content__label {
      color: #ffffff;
    }
    .uni-input-input {
      color: #ffffff;
    }
  }
}
</style>
