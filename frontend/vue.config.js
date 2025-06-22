const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env["PORT"],
    proxy: {
      'api': {
        target: 'http://127.0.0.1:8085',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    },
    client: {
      overlay: false
    }
  }
})