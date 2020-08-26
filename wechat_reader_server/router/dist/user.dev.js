"use strict";

var express = require('express');

var router = express.Router();
router.post('/login', function (req, res) {
  console.log(req.query);
  console.log(req.body);
  res.json({
    code: 0,
    msg: '登录成功'
  });
});
router.get('/info', function (req, res, next) {
  res.json('user info...');
});
module.exports = router;