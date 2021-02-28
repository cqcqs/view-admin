module.exports = {
  publicPath: '/',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  // 设为false打包时不生成.map文件
  productionSourceMap: false
  // 这里写你调用接口的基础路径，来解决跨域
  /* devServer: {
    proxy: {
      // 开启代理后，需设置开发环境的base api，如 '/api'
      '/api': {
        // 请求的API地址
        target: 'http://127.0.0.1/',
        changeOrigin: true
      }
    }
  } */
}
