"use strict";

/**
 * jwt逻辑处理
 */
var expressJwt = require('express-jwt');

var jwt = require('jsonwebtoken');

var _require = require('./constant'),
    PRIVATE_KEY = _require.PRIVATE_KEY,
    JWT_EXPIRED = _require.JWT_EXPIRED;
/**
 * jwt签名(生成token)
 */


var jwtToken = function jwtToken(username) {
  return jwt.sign({
    username: username
  }, PRIVATE_KEY, {
    expiresIn: JWT_EXPIRED
  });
};
/**
 * jwt认证(验证token)
 */


var jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问

}).unless({
  path: ['/', '/user/login'] // 设置 jwt 认证白名单

});
/**
 * jwt解析(解析token)
 */

var jwtDecoded = function jwtDecoded(req) {
  var authorization = req.get('Authorization');
  var token = '';

  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '');
  } else {
    token = authorization;
  }

  return jwt.verify(token, PRIVATE_KEY);
};

module.exports = {
  jwtToken: jwtToken,
  jwtAuth: jwtAuth,
  jwtDecoded: jwtDecoded
};