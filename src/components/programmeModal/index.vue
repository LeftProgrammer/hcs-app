<template>
  <uv-modal
    class="modal"
    ref="modal"
    :width="600"
    :showCancelButton="true"
    :asyncClose="true"
    @confirm="onConfirm"
    @cancel="onCancel"
    v-bind="$attrs"
    cancelColor="#ffffff"
  >
    <view class="modal-content">
      <view class="modal-title">{{ modalTitle }}</view>
      <uv-form
        labelWidth="106"
        labelPosition="left"
        :model="formData"
        :rules="rules"
        ref="programmeForm"
        class="w-100 h-20"
      >
        <uv-form-item prop="programme" @click="showProgrammeSelect">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center mr-4">
              <view class="label-icon"></view>
              <view class="label-text">方案</view>
            </view>
          </template>
          <uv-input
            v-model="formData.programme"
            disabled
            disabledColor="#082665"
            placeholder="请选择方案"
            border="none"
          ></uv-input>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
      </uv-form>
    </view>

    <uv-action-sheet
      class="action-sheet"
      ref="programmeSelect"
      :actions="programmes"
      title="请选择方案"
      @select="programmeSelectHandler"
    ></uv-action-sheet>
  </uv-modal>
</template>

<script setup>
import { getDesignPlan } from '@/service/home/index'
import { useToast } from '@/utils/modals'

const emit = defineEmits(['confirm-success'])

const modalTitle = '选择方案'
const programmeObj = JSON.parse(uni.getStorageSync('programmeObj') || '{}')

const formData = reactive({
  programme: programmeObj.programme || '',
  fileName: programmeObj.fileName || '',
})

const programmes = ref([
  { name: '方案一', fileName: '1726133066786' },
  { name: '方案二', fileName: '1727250800901' },
  { name: '方案三', fileName: '1729838576104' },
])

const rules = ref({
  programme: {
    type: 'string',
    required: true,
    message: '请选择方案',
    trigger: ['blur', 'change'],
  },
})

// 引用 modal、form 和 programmeSelect 组件实例
const modal = ref(null)
const programmeForm = ref(null)
const programmeSelect = ref(null)

const getDesignPlans = () => {
  getDesignPlan().then((res) => {
    if (res.code === 200) {
      programmes.value = res.data.map((item) => ({
        name: item.planName,
        fileName: item.id,
      }))
    }
  })
}

const showProgrammeSelect = () => {
  programmeSelect.value.open()
  uni.hideKeyboard()
}

const programmeSelectHandler = (e) => {
  console.error('programmeSelect====>', e)
  formData.programme = e.name
  formData.fileName = e.fileName
}

const openModal = () => {
  modal.value.open()
}

const onCancel = () => {
  modal.value.close()
}

const onConfirm = () => {
  programmeForm.value
    .validate()
    .then(() => {
      uni.setStorageSync('programmeObj', JSON.stringify(formData))
      useToast('设置成功')
      modal.value.close()
      emit('confirm-success', formData)
    })
    .catch((errors) => {
      console.error('errors====>', errors)
      modal.value.closeLoading()
    })
}
defineExpose({
  openModal,
})
// 在挂载时获取方案
onMounted(() => {
  getDesignPlans()
})
</script>
