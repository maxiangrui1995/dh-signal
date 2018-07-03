module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.0.152/SignalControl/web/public/index.php",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
}