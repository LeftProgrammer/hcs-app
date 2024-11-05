/**
 * @desc uni 弹窗
 * @param {string} content - 弹窗内容
 * @param {object} options - 弹窗配置选项
 * @param {string} [options.title='提示'] - 弹窗标题
 * @param {boolean} [options.showCancelButton=false] - 是否显示取消按钮
 * @param {string} [options.confirmButtonText='确认'] - 确认按钮文本
 * @param {string} [options.cancelButtonText='取消'] - 取消按钮文本
 * @returns {Promise<object>} - 点击按钮后的返回结果
 */
export function useDialog(
  content: string,
  {
    title = '提示',
    showCancelButton = false,
    confirmButtonText = '确认',
    cancelButtonText = '取消',
    ...moreOptions
  }: {
    title?: string
    showCancelButton?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
    [key: string]: any
  } = {},
): Promise<{ type: string }> {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title,
      content,
      confirmText: confirmButtonText,
      cancelText: cancelButtonText,
      showCancel: showCancelButton,
      ...moreOptions,
      success({ cancel }: { cancel: boolean }) {
        if (cancel) {
          reject(new Error('cancel'))
        } else {
          resolve({ type: 'confirm' })
        }
      },
    })
  })
}

/**
 * @desc uni 轻提示
 * @param {string} content - 提示内容
 * @param {object} options - 提示配置选项
 * @param {string} [options.position='center'] - 提示位置
 * @param {number} [options.duration=1000] - 提示持续时间
 * @param {boolean} [options.overlay=true] - 是否显示遮罩层
 * @param {string} [options.icon='none'] - 图标类型
 * @returns {Promise<UniApp.ShowToastRes>} - 显示 Toast 后的返回结果
 */
export function useToast(
  content: string,
  {
    position = 'center',
    duration = 1000,
    overlay = true,
    icon = 'none',
    ...moreOptions
  }: {
    position?: 'top' | 'center' | 'bottom'
    duration?: number
    overlay?: boolean
    icon?: 'success' | 'loading' | 'none'
    [key: string]: any
  } = {},
): Promise<any> {
  if (!content) {
    uni.hideToast()
    return Promise.resolve({} as any) // 返回一个空的 Promise
  }

  uni.showToast({
    title: content,
    position,
    duration,
    mask: overlay,
    icon,
    ...moreOptions,
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({} as any) // 返回一个空的 Promise
    }, duration)
  })
}

/**
 * @desc 显示或隐藏 loading
 * @param {string | boolean} content - loading 提示内容，如果传入 true 则显示默认 loading
 * @param {object} options - loading 配置选项
 * @param {boolean} [options.overlay=true] - 是否显示遮罩层
 */
export function useLoading(
  content: string | boolean = '努力加载中...',
  { overlay = true, ...moreOptions }: { overlay?: boolean; [key: string]: any } = {},
): void {
  if (typeof content === 'boolean') {
    content = '努力加载中...'
  }

  if (!content) {
    uni.hideLoading()
    return
  }

  uni.showLoading({
    title: content,
    mask: overlay,
    ...moreOptions,
  })
}
