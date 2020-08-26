const express = require('express')
const { getIPAddress } = require('./utils/getIp')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
// 创建 express 应用
const app = express()

// 解析query
app.use(bodyParser.urlencoded({ extended: true }))
// 解析json
app.use(bodyParser.json())

// 监听 / 路径的 get 请求
app.use('/', router)

const privateKey = fs.readFileSync('./https/4402924_yunyoushe.xyz.key', 'utf8')
const pem = fs.readFileSync('./https/4402924_yunyoushe.xyz.pem', 'utf8')
const credentials = { key: privateKey, cert: pem }
const httpsServer = https.createServer(credentials, app)
const SSLPORT = 18082

httpsServer.listen(SSLPORT, function () {
  console.group('https')
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)
  console.log('HTTPS Server is running on: https://yunyoushe.xyz:%s', SSLPORT)
  console.groupEnd()
})

// 使 express 监听 5000 端口号发起的 http 请求
const server = app.listen(5000, function () {
  const { address, port } = server.address()
  const ip = getIPAddress()
  console.log('Http Server is running on http://%s:%s', ip, port)
})