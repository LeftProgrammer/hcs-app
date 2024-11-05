<template>
  <view class="captcha">
    <uv-input v-model="localValue" placeholder="请输入验证码" border="bottom">
      <template v-slot:suffix>
        <image class="w-20 h-8 rounded-1" :src="captchaSrc" @click="refreshCaptcha" alt="captcha" />
      </template>
    </uv-input>
  </view>
</template>

<script setup>
import { getCaptcha } from '@/service/home/index'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'update:timestamp'])

const localValue = ref(props.modelValue)
const captchaSrc = ref('')
const timestamp = ref(null)

const refreshCaptcha = async () => {
  timestamp.value = Date.now() // 生成当前时间戳
  const { success, result } = await getCaptcha(timestamp.value)
  if (success) {
    captchaSrc.value = result
  } else {
    // 处理获取验证码失败的情况
    captchaSrc.value = '../../static/login/checkcode.png'
  }
  // 触发事件，将时间戳传给父组件
  emit('update:timestamp', timestamp.value)
}

const validateCaptcha = () => {
  return !!localValue.value
}

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

onMounted(() => {
  refreshCaptcha()
})

defineExpose({
  validateCaptcha,
  refreshCaptcha,
})
</script>

<style scoped>
.captcha {
  display: flex;
  align-items: center;
}
img {
  cursor: pointer;
}
</style>
