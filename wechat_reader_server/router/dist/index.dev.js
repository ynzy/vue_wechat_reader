"use strict";

var express = require('express');

var boom = require('boom');

var userRouter = require('./user');

var _require = require('../utils/constant'),
    CODE_ERROR = _require.CODE_ERROR;

var _require2 = require('../utils/jwt'),
    jwtAuth = _require2.jwtAuth;

var Result = require('../models/Result'); // 注册路由


var router = express.Router();
router.use(jwtAuth);
router.get('/', function (req, res) {
  res.send('欢迎学习小慕读书管理后台');
}); // 通过 userRouter 来处理 /user 路由，对路由处理进行解耦

router.use('/user', userRouter);
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */

router.use(function (req, res, next) {
  next(boom.notFound('接口不存在'));
});
/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */

router.use(function (err, req, res, next) {
  if (err.name && err.name === 'UnauthorizedError') {
    var _err$status = err.status,
        status = _err$status === void 0 ? 401 : _err$status,
        message = err.message;
    new Result(null, 'Token验证失败', {
      error: status,
      errMsg: message
    }).jwtError(res.status(status));
  } else {
    var msg = err && err.message || '系统错误';
    var statusCode = err.output && err.output.statusCode || 500;
    var errorMsg = err.output && err.output.payload && err.output.payload.error || err.message;
    new Result(null, msg, {
      error: statusCode,
      errorMsg: errorMsg
    }).fail(res.status(statusCode));
  }
});
module.exports = router;