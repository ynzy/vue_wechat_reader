"use strict";

var express = require('express');

var Result = require('../models/Result');

var router = express.Router();
router.post('/login', function (req, res) {
  console.log(req.body);
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;

  if (username === 'admin' && password === 'admin') {
    new Result('登录成功').success(res);
  } else {
    new Result('登录失败').fail(res);
  }
});
router.get('/info', function (req, res, next) {
  res.json('user info...');
});
module.exports = router;