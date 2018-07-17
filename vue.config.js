module.exports = {
  baseUrl: "/SignalControl/dist",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.1.14/SignalControl/web/public/index.php",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
}