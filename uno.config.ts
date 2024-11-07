// uno.config.ts
import { defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { presetShades } from '@viarotel-org/unocss-preset-shades'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import path from 'node:path'
import { loadEnv } from 'vite'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))
const { VITE_PRIMARY_COLOR } = env

const presetMain = presetUni({ attributify: false })

const presets = [presetMain, presetShades(VITE_PRIMARY_COLOR)]

export default defineConfig({
  theme: {},
  presets,
  transformers: [transformerDirectives()],
  // 简写
  shortcuts: {
    'inset-center': 'absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2',
    'inset-x-center': 'absolute left-1/2 transform -translate-x-1/2',
    'inset-y-center': 'absolute top-1/2 transform -translate-y-1/2',
    'h-safe-bottom': 'h-[constant(safe-area-inset-bottom)] h-[env(safe-area-inset-bottom)]',
    'h-safe-top': 'h-[var(--status-bar-height)]',
  },
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
