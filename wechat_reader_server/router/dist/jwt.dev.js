"use strict";

/**
 * 认证jwt
 */
var expressJwt = require('express-jwt');

var _require = require('../utils/constant'),
    PRIVATE_KEY = _require.PRIVATE_KEY; // jwt认证


var jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问

}).unless({
  path: ['/', '/user/login'] // 设置 jwt 认证白名单

});
module.exports = jwtAuth;