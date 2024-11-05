<template>
  <view>
    <view
      class="jh-select--mask"
      :class="{ 'jh-select--mask-show': show }"
      :style="getStyles"
      @tap.stop="maskClose"
    ></view>
    <view
      class="jh-select--wrap"
      :class="{ 'jh-select--wrap-show': show }"
      :style="{
        borderTopLeftRadius: radius + 'rpx',
        borderTopRightRadius: radius + 'rpx',
        background: background,
        zIndex: zIndex,
      }"
    >
      <view
        class="jh-select--header"
        :style="{
          background: background,
          borderTopLeftRadius: radius + 'rpx',
          borderTopRightRadius: radius + 'rpx',
        }"
      >
        <text
          class="jh-select--header-text"
          :style="{ fontSize: titleSize + 'rpx', color: titleColor, fontWeight: fontWeight }"
        >
          {{ title }}
        </text>
        <view class="jh-select--header-close" @tap.stop="handleClose">
          <icon type="clear" color="#ccc" :size="16"></icon>
        </view>
        <view class="jh-select--header-line" :style="{ background: dividerColor }"></view>
      </view>
      <scroll-view
        scroll-y
        class="jh-select--scroll"
        :show-scrollbar="false"
        :style="{ height: height + 'rpx' }"
      >
        <view class="jh-select--list">
          <view
            class="jh-select--item"
            :style="{ padding: padding }"
            @tap="itemClick(index)"
            v-for="(model, index) in itemList"
            :key="index"
            :class="{
              'jh-select--reverse': reverse,
              'jh-select--item-active': highlight && !model.disabled,
              'jh-select--disabled': model.disabled,
            }"
          >
            <view
              class="jh-select--checkbox"
              :class="{ 'jh-select--is-checkmark ': isCheckMark }"
              :style="{
                background: model[checkedField] && !isCheckMark ? getCheckboxColor : 'transparent',
                borderColor: model[checkedField] && !isCheckMark ? getCheckboxColor : borderColor,
              }"
            >
              <view
                class="jh-select--checkmark"
                :style="{ borderBottomColor: checkmarkColor, borderRightColor: checkmarkColor }"
                v-if="model[checkedField]"
              ></view>
            </view>
            <view class="jh-select--flex">
              <view
                class="jh-select--icon-box"
                :class="{ 'jh-select--icon-ml': !reverse, 'jh-select--icon-mr': reverse }"
                :style="{
                  width: iconWidth + 'rpx',
                  height: iconWidth + 'rpx',
                  background: iconBgColor,
                }"
                v-if="model[srcField]"
              >
                <image
                  :src="model[srcField]"
                  :style="{ width: iconWidth + 'rpx', height: iconWidth + 'rpx' }"
                  mode="scaleToFill"
                ></image>
              </view>
              <text
                class="jh-select--item-text"
                :class="{ 'jh-select--text-pl': !reverse, 'jh-select--text-pr': reverse }"
                :style="{ fontSize: size + 'rpx', color: color }"
              >
                {{ model[textField] }}
              </text>
            </view>
            <view
              v-if="dividerLine"
              class="jh-select--item-line"
              :style="{
                background: dividerColor,
                left: reverse ? 0 : bottomLeft + 'rpx',
                right: reverse ? bottomLeft + 'rpx' : 0,
              }"
            ></view>
          </view>
        </view>
      </scroll-view>
      <view class="jh-select--btn-wrap">
        <view class="jh-select--btn" :style="{ background: getBtnBackground }">
          <text
            class="jh-select--btn"
            :class="['jh-select--btn-text']"
            :style="{ color: btnColor }"
            @tap.stop="handleClick"
          >
            {{ btnText }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'jh-select',
  emits: ['confirm', 'close'],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    textField: {
      type: String,
      default: 'text',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    srcField: {
      type: String,
      default: 'src',
    },
    checkedField: {
      type: String,
      default: 'checked',
    },
    height: {
      type: [Number, String],
      default: 600,
    },
    radius: {
      type: [Number, String],
      default: 24,
    },
    title: {
      type: String,
      default: '请选择',
    },
    titleSize: {
      type: [Number, String],
      default: 32,
    },
    titleColor: {
      type: String,
      default: '#333',
    },
    fontWeight: {
      type: [Number, String],
      default: 400,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: '#fff',
    },
    padding: {
      type: String,
      default: '30rpx',
    },
    // 选择框选中后颜色
    checkboxColor: {
      type: String,
      default: '',
    },
    borderColor: {
      type: String,
      default: '#ccc',
    },
    isCheckMark: {
      type: Boolean,
      default: false,
    },
    checkmarkColor: {
      type: String,
      default: '#fff',
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    dividerLine: {
      type: Boolean,
      default: true,
    },
    dividerColor: {
      type: String,
      default: '#EEEEEE',
    },
    bottomLeft: {
      type: [Number, String],
      default: 30,
    },
    highlight: {
      type: Boolean,
      default: true,
    },
    iconWidth: {
      type: [Number, String],
      default: 48,
    },
    // v2.9.0+
    iconBgColor: {
      type: String,
      default: '#F8F8F8',
    },
    size: {
      type: [Number, String],
      default: 30,
    },
    color: {
      type: String,
      default: '#333',
    },
    btnText: {
      type: String,
      default: '确定',
    },
    btnBackground: {
      type: String,
      default: '',
    },
    btnColor: {
      type: String,
      default: '#fff',
    },
    maskBackground: {
      type: String,
      default: 'rgba(0,0,0,.6)',
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: [Number, String],
      default: 1000,
    },
  },
  computed: {
    getStyles() {
      return `background:${this.maskBackground};z-index:${Number(this.zIndex) - 1};`
    },
    getCheckboxColor() {
      return this.checkboxColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc'
    },
    getBtnBackground() {
      return this.btnBackground || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc'
    },
  },
  watch: {
    list(newVal) {
      this.initData(newVal)
    },
  },
  data() {
    return {
      itemList: [],
      index: -1,
    }
  },
  created() {
    this.initData(this.list)
  },
  methods: {
    initData(vals) {
      vals = JSON.parse(JSON.stringify(vals))
      if (vals && vals.length > 0) {
        if (typeof vals[0] !== 'object') {
          vals = vals.map((item) => {
            return {
              [this.textField]: item,
              [this.checkedField]: false,
              disabled: false,
            }
          })
        } else {
          // vals.map((item, index) => {
          //   item[this.checkedField] = item[this.checkedField] || false
          //   if (!this.multiple && item[this.checkedField]) {
          //     this.index = index
          //   }
          // })
          const newVals = vals.map((item, index) => {
            const newItem = { ...item, [this.checkedField]: item[this.checkedField] || false }

            if (!this.multiple && newItem[this.checkedField]) {
              return index
            }

            return newItem
          })

          if (!this.multiple) {
            this.index = newVals.find((index) => typeof index === 'number')
          } else {
            this.vals = newVals
          }
        }
        this.itemList = vals
      }
    },
    itemClick(index) {
      const vals = [...this.itemList]
      const item = vals[index]
      if (item && item.disabled) return
      if (this.multiple) {
        item[this.checkedField] = !item[this.checkedField]
      } else {
        vals.forEach((item, idx) => {
          if (index === idx) {
            item[this.checkedField] = true
          } else {
            item[this.checkedField] = false
          }
        })
        this.index = index
      }
      this.itemList = vals
    },
    handleClick() {
      if (this.multiple) {
        const items = []
        this.itemList.forEach((item, idx) => {
          if (item[this.checkedField]) {
            items.push(item)
          }
        })
        this.$emit('confirm', {
          options: items,
        })
      } else {
        const index = this.index
        this.$emit('confirm', {
          index,
          options: index === -1 ? '' : this.list[index],
        })
      }
    },
    maskClose() {
      if (!this.maskClosable) return
      this.handleClose()
    },
    handleClose() {
      this.$emit('close', {})
    },
  },
}
</script>

<style scoped>
.jh-select--mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transition: all ease-in-out 0.3s;
  visibility: hidden;
  opacity: 0;
}

.jh-select--mask-show {
  opacity: 1;
  visibility: visible;
}

.jh-select--wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s ease-in-out;
  min-height: 20rpx;
  opacity: 0;
  visibility: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.jh-select--wrap-show {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  visibility: visible;
}

.jh-select--scroll {
  width: 100%;
  flex: 1;
}

.jh-select--list {
  width: 100%;
}

.jh-select--item {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  flex: 1;
  flex-direction: row;
  align-items: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  position: relative;
}

.jh-select--disabled {
  opacity: 0.5;
  /* #ifdef H5 */
  cursor: not-allowed;
  /* #endif */
}

.jh-select--item-line {
  position: absolute;
  bottom: 0;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  z-index: 1;
}

.jh-select--item-active:active {
  background: rgba(0, 0, 0, 0.2);
}

.jh-select--flex {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  flex: 1;
  flex-direction: row;
  align-items: center;
}

.jh-select--reverse {
  justify-content: space-between;
  flex-direction: row-reverse;
}

.jh-select--checkbox {
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  width: 40rpx;
  height: 40rpx;
  border-width: 1px;
  border-style: solid;
  display: inline-flex;
  box-sizing: border-box;
  border-radius: 50%;
  vertical-align: top;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.jh-select--is-checkmark {
  border-width: 0 !important;
  background: transparent !important;
}

.jh-select--checkmark {
  width: 20rpx;
  height: 40rpx;
  border-bottom-style: solid;
  border-bottom-width: 3px;
  border-bottom-color: #ffffff;
  border-right-style: solid;
  border-right-width: 3px;
  border-right-color: #ffffff;
  box-sizing: border-box;
  transform: rotate(45deg) scale(0.5) translateZ(0);
  transform-origin: 54% 48%;
}

.jh-select--item-text {
  word-break: break-all;
  font-weight: normal;
}

.jh-select--text-pl {
  padding-left: 20rpx;
}

.jh-select--text-pr {
  padding-right: 20rpx;
}

.jh-select--icon-box {
  overflow: hidden;
  background-color: #f8f8f8;
  flex-shrink: 0;
}

.jh-select--icon-ml {
  margin-left: 20rpx;
}

.jh-select--icon-mr {
  margin-right: 20rpx;
}

.jh-select--header {
  width: 100%;
  display: flex;
  flex: 1;
  height: 98rpx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}

.jh-select--header-line {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  z-index: 1;
}

.jh-select--header-text {
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  flex: 1;
  padding: 0 88rpx;
}

.jh-select--header-close {
  width: 50rpx;
  height: 50rpx;
  position: absolute;
  right: 32rpx;
  top: 24rpx;
  text-align: right;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.jh-select--btn-wrap {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.jh-select--btn {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 84rpx;
  border-radius: 44rpx;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  font-size: 30rpx;
  font-weight: normal;
  text-align: center;
}

.jh-select--btn-text:active {
  background: rgba(0, 0, 0, 0.2);
}
</style>
