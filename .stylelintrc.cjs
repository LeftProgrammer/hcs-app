// .stylelintrc.cjs

module.exports = {
  root: true,
  extends: [
    // stylelint-config-standard 替换成了更宽松的 stylelint-config-recommended
    'stylelint-config-recommended',
    // stylelint-config-standard-scss 替换成了更宽松的 stylelint-config-recommended-scss
    // 'stylelint-config-recommended-scss', // 会格式化.scss文件引入后缀名
    // 'stylelint-config-recommended-vue/scss',
    'stylelint-config-html/vue',
    // 'stylelint-config-recess-order', // 按照 Recess 的 CSS 属性顺序规则来格式化
  ],
  plugins: ['stylelint-prettier'],
  overrides: [
    // 扫描 .vue/html 文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss',
    },
  ],
  // 自定义规则
  rules: {
    'prettier/prettier': true,
    // 允许 global 、export 、v-deep等伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'v-deep', 'deep'],
      },
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
    // 处理小程序page标签不认识的问题
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page'],
      },
    ],
    'comment-empty-line-before': 'never', // never|always|always-multi-line|never-multi-line
    'custom-property-empty-line-before': 'never',
    'no-empty-source': null,
    'no-duplicate-selectors': null,
    // 'comment-no-empty': null,
    // 'scss/comment-no-empty': null,
    'selector-class-pattern': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
}
