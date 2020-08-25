const express = require('express')
const { getIPAddress } = require('./utils/getIp')
const router = require('./router')

// 创建 express 应用
const app = express()

// 监听 / 路径的 get 请求
app.use('/', router)

// 使 express 监听 5000 端口号发起的 http 请求
const server = app.listen(5000, function () {
  const { address, port } = server.address()
  const ip = getIPAddress()
  console.log('Http Server is running on http://%s:%s', ip, port)
})