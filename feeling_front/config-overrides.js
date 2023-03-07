const {
  addWebpackAlias,
  override,
  adjustStyleLoaders,
  addBabelPlugin,
} = require('customize-cra')
const path = require('path')

module.exports = override(
  // 配置别名
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  // 配置babel
  addBabelPlugin(
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
        },
      },
    ]
  ),
  // 配置全局scss变量
  adjustStyleLoaders((rule) => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: ['./src/styles/vars/index.scss'],
        },
      })
    }
  })
)
