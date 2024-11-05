<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page h-full bg-f8fcfd overflow-hidden">
    <view class="banner"></view>
    <view class="main">
      <view class="header">用户登录</view>
      <uv-form ref="formRef" :model="form" :rules="rules" labelPosition="top">
        <uv-form-item prop="username">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="account" size="24" color="#2979ff" class="mr-1"></uv-icon>
              <view class="label">账号</view>
            </view>
          </template>
          <uv-input v-model="form.username" placeholder="请输入账号" border="bottom" />
        </uv-form-item>
        <uv-form-item prop="password">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="lock" size="24" color="#2979ff" class="mr-1"></uv-icon>
              <view class="label">密码</view>
            </view>
          </template>
          <uv-input
            v-model="form.password"
            clearable
            :password="showPassword"
            placeholder="请输入密码"
            border="bottom"
          >
            <template v-slot:suffix>
              <uv-icon
                :name="showPassword ? 'eye-fill' : 'eye'"
                size="24"
                :class="[!showPassword ? 'uni-eye-active' : '']"
                @click="showPassword = !showPassword"
              ></uv-icon>
            </template>
          </uv-input>
        </uv-form-item>
        <uv-form-item prop="captcha">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="more-circle" size="24" color="#2979ff" class="mr-1"></uv-icon>
              <view class="label">验证码</view>
            </view>
          </template>
          <jh-captcha
            ref="captchaRef"
            class="w-full"
            v-model="form.captcha"
            @update:timestamp="handleTimestampUpdate"
          />
        </uv-form-item>
        <uv-form-item>
          <uv-checkbox-group v-model="rememberMe" class="flex justify-end">
            <uv-checkbox label="记住密码" :name="true"></uv-checkbox>
          </uv-checkbox-group>
        </uv-form-item>
        <uv-button
          type="primary"
          text="登录"
          customStyle="margin-top: 10px"
          @click="handleLogin"
        ></uv-button>
      </uv-form>
    </view>
    <view
      class="footer absolute inset-x-0 bottom-0 text-center mb-4 color-#C9CDD4 font-size-3 flex justify-center items-center"
    >
      <view class="line-left"></view>
      <view class="text">当前版本： {{ version }}</view>
      <view class="line-right"></view>
    </view>
    @/service/home
  </view>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { version } from '../../../package.json'
import { login, queryByUsername } from '@/service/home/index'
import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'
import { currRoute } from '@/utils/index'
import JhCaptcha from '@/components/jh-captcha.vue'

const userStore = useUserStore()
const formRef = ref(null)
const captchaRef = ref(null)
const timestamp = ref(null)
const showPassword = ref(true)
const form = ref({
  username: '',
  password: '',
  captcha: '',
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
    {
      min: 8,
      max: 16,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
  ],
  captcha: [
    {
      validator: (rule, value, callback) => {
        console.error('value', value)
        if (!value) {
          callback(new Error('请输入验证码'))
        } else if (!captchaRef.value.validateCaptcha()) {
          callback(new Error('验证码错误'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
})

// 加密密码
const encryptPassword = (password) => {
  return btoa(password) // 使用 Base64 编码进行简单加密
}

// 解密密码
const decryptPassword = (encryptedPassword) => {
  try {
    return atob(encryptedPassword) // 使用 Base64 解码进行解密
  } catch (e) {
    return ''
  }
}

const handleLogin = async () => {
  const valid = await formRef.value.validate()
  if (valid !== true) {
    return
  }

  const params = {
    username: form.value.username,
    password: form.value.password,
    captcha: form.value.captcha,
    checkKey: timestamp.value,
  }
  const { code, message, result } = await login(params)

  if (code === 200) {
    let userInfo = result.userInfo || {}
    userStore.setToken(result.token)
    const {
      code: companyCode,
      message: companyMessage,
      result: companyResult,
    } = await queryByUsername({})

    if (companyCode === 200) {
      userInfo = { ...userInfo, ...companyResult }
      userStore.setUserInfo(userInfo)

      handleSuccess()

      const { query } = currRoute()
      useToast('登录成功')
      const redirectUrl = query.redirect || '/pages/home/index'
      uni.reLaunch({
        url: redirectUrl,
      })
    } else {
      useToast(companyMessage)
    }
  } else {
    useToast(message)
  }
}

const handleSuccess = () => {
  if (rememberMe.value.length > 0) {
    userStore.setEncryptedPassword(encryptPassword(form.value.password))
  } else {
    userStore.clearEncryptedPassword()
  }
}

const handleTimestampUpdate = (newTimestamp) => {
  timestamp.value = newTimestamp
}

// 页面加载时读取缓存的账号密码
onMounted(() => {
  if (userStore.userInfo.username && userStore.encryptedPassword) {
    form.value.username = userStore.userInfo.username
    form.value.password = decryptPassword(userStore.encryptedPassword)
    rememberMe.value.push(true)
  }
})
</script>

<style lang="scss" scoped>
.page {
  position: relative;
}
.banner {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 318px;
  background-image: url('@/static/login/banner.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.main {
  min-height: 468px;
  position: absolute;
  top: 217px;
  right: 28px;
  // bottom: 167px;
  left: 28px;
  z-index: 10;
  padding: 30px 28px;
  background: #fff;
  border-radius: 18px 18px 18px 18px;
  box-shadow: 0px 3px 10px 0px rgba(172, 196, 219, 0.3);
}
.header {
  height: 20px;
  margin-bottom: 34px;
  font-size: 18px;
  line-height: 20px;
  color: #1d2129;
  text-align: left;
  font-weight: bold;
}
.label {
  font-size: 16px;
}

.captcha-image {
  width: 100px;
  height: 36px;
  img {
    width: 100%;
    height: 100%;
  }
}

.footer {
  .line-left,
  .line-right {
    width: 63px;
    height: 1px;
    border: 1px solid;
    opacity: 0.6;
  }
  .line-left {
    border-image: linear-gradient(-90deg, rgba(201, 205, 212, 1), rgba(247, 247, 247, 0)) 1 1;
  }
  .line-right {
    border-image: linear-gradient(90deg, rgba(201, 205, 212, 1), rgba(247, 247, 247, 0)) 1 1;
  }
  .text {
    font-size: 12px;
    color: #c9cdd4;
    line-height: 20px;
    margin: 0 8px;
  }
}
</style>
