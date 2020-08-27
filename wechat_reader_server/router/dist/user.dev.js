"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var express = require('express');

var Result = require('../models/Result');

var _require = require('../services/user'),
    login = _require.login;

var _require2 = require('../utils'),
    md5 = _require2.md5;

var _require3 = require('../utils/constant'),
    PWD_SALT = _require3.PWD_SALT;

var router = express.Router();
router.post('/login', function (req, res) {
  console.log(req.body);
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password; // 密码md5加密

  password = (_readOnlyError("password"), md5("".concat(password).concat(PWD_SALT)));
  login(username, password).then(function (user) {
    if (!user || user.length === 0) {
      new Result('登录失败').fail(res);
    } else {
      new Result('登录成功').success(res);
    }
  });
});
router.get('/info', function (req, res, next) {
  res.json('user info...');
});
module.exports = router;