"use strict";

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var _require = require('./constant'),
    PRIVATE_KEY = _require.PRIVATE_KEY; // md5加密


function md5(s) {
  // 注意参数需要为 String 类型，否则会出错
  return crypto.createHash('md5').update(String(s)).digest('hex');
} // jwt解析


function decoded(req) {
  var authorization = req.get('Authorization');
  var token = '';

  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '');
  } else {
    token = authorization;
  }

  return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
  md5: md5,
  decoded: decoded
};