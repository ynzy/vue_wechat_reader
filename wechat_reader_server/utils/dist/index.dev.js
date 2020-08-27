"use strict";

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var _require = require('./constant'),
    PRIVATE_KEY = _require.PRIVATE_KEY; // md5加密


function md5(s) {
  // 注意参数需要为 String 类型，否则会出错
  return crypto.createHash('md5').update(String(s)).digest('hex');
}

module.exports = {
  md5: md5
};