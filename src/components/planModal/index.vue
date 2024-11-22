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
        ref="planForm"
        class="w-100 h-20"
      >
        <uv-form-item prop="name" @click="showProgrammeSelect">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center mr-4 w-18">
              <view class="label-icon"></view>
              <view class="label-text">方案</view>
            </view>
          </template>
          <uv-input
            v-model="formData.name"
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
      ref="planSelect"
      :actions="plans"
      title="请选择方案"
      @select="planSelectHandler"
    ></uv-action-sheet>
  </uv-modal>
</template>

<script setup>
import { useCommonStore } from '@/store'
import { getDesignPlan } from '@/service/home/index'
import { useToast } from '@/utils/modals'

const emit = defineEmits(['confirm-success'])

const commonStore = useCommonStore()

const modalTitle = '选择方案'
const planObj = commonStore.commonInfo.planObj || {}

const formData = reactive({
  name: planObj.name || '',
  id: planObj.id || '',
})

const plans = ref([
  { name: '方案一', id: '1726133066786' },
  { name: '方案二', id: '1727250800901' },
  { name: '方案三', id: '1729838576104' },
])

const rules = ref({
  name: {
    type: 'string',
    required: true,
    message: '请选择方案',
    trigger: ['blur', 'change'],
  },
})

// 引用 modal、form 和 planSelect 组件实例
const modal = ref(null)
const planForm = ref(null)
const planSelect = ref(null)

const getDesignPlans = () => {
  getDesignPlan().then((res) => {
    if (res.code === 200) {
      plans.value = res.data.map((item) => ({
        name: item.planName,
        id: item.id,
      }))
    }
  })
}

const showProgrammeSelect = () => {
  planSelect.value.open()
  uni.hideKeyboard()
}

const planSelectHandler = (e) => {
  console.error('planSelect====>', e)
  formData.name = e.name
  formData.id = e.id
}

const openModal = () => {
  getDesignPlans()
  modal.value.open()
}

const onCancel = () => {
  modal.value.close()
}

const onConfirm = () => {
  planForm.value
    .validate()
    .then(() => {
      commonStore.setPlanObj(JSON.parse(JSON.stringify(formData)))
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
  // getDesignPlans()
})
</script>
