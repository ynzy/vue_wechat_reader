"use strict";

var express = require('express');

var multer = require('multer');

var _require = require('../utils/constant'),
    UPLOAD_PATH = _require.UPLOAD_PATH;

var Result = require('../models/Result');

var Book = require('../models/Book');

var boom = require('boom');

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
    var book = new Book(req.file); // console.log(book);

    book.parse().then(function (book) {
      console.log('book:', book);
      new Result(book, '上传电子书成功').success(res);
    })["catch"](function (err) {
      console.log(err);
      next(boom.badImplementation(err));
    });
  }
});
module.exports = router;