"use strict";

var express = require('express');

var multer = require('multer');

var _require = require('../utils/constant'),
    UPLOAD_PATH = _require.UPLOAD_PATH;

var Result = require('../models/Result');

var router = express.Router();
/**
 * multer 
 * 用于处理 multipart/form-data 类型的表单数据
 */

router.post('/upload', multer({
  dest: "".concat(UPLOAD_PATH, "/book")
}).single('file'), function (req, res, next) {
  if (!req.file || req.file.length === 0) {
    new Result('上传电子书失败').fail(res);
  } else {
    new Result('上传电子书成功').success(res);
  }
});
module.exports = router;