"use strict";

var express = require('express');

var _require = require('./utils/getIp'),
    getIPAddress = _require.getIPAddress;

var router = require('./router');

var fs = require('fs');

var https = require('https'); // 创建 express 应用


var app = express(); // 监听 / 路径的 get 请求

app.use('/', router);
var privateKey = fs.readFileSync('./https/4402924_yunyoushe.xyz.key', 'utf8');
var pem = fs.readFileSync('./https/4402924_yunyoushe.xyz.pem', 'utf8');
var credentials = {
  key: privateKey,
  cert: pem
};
var httpsServer = https.createServer(credentials, app);
var SSLPORT = 18082;
httpsServer.listen(SSLPORT, function () {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
}); // 使 express 监听 5000 端口号发起的 http 请求

var server = app.listen(5000, function () {
  var _server$address = server.address(),
      address = _server$address.address,
      port = _server$address.port;

  var ip = getIPAddress();
  console.log('Http Server is running on http://%s:%s', ip, port);
});