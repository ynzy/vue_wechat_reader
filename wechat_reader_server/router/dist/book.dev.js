"use strict";

var express = require('express');

var multer = require('multer');

var _require = require('../utils/constant'),
    UPLOAD_PATH = _require.UPLOAD_PATH;

var Result = require('../models/Result');

var Book = require('../models/Book');

var boom = require('boom');

var _require2 = require('../utils/jwt'),
    jwtDecoded = _require2.jwtDecoded;

var _require3 = require('../services/book'),
    insertBook = _require3.insertBook,
    getBook = _require3.getBook,
    updateBook = _require3.updateBook;

var router = express.Router();
/**
 * 上传图书
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
      // console.log('book:', book);
      new Result(book, '上传电子书成功').success(res);
    })["catch"](function (err) {
      console.log(err);
      next(boom.badImplementation(err));
    });
  }
});
/**
 * 新增图书
 */

router.post('/create', function (req, res, next) {
  var decode = jwtDecoded(req);

  if (decode && decode.username) {
    req.body.username = decode.username;
  }

  var book = new Book(null, req.body);
  insertBook(book).then(function (result) {
    new Result('添加电子书成功').success(res);
  })["catch"](function (err) {
    console.log(err);
    next(boom.badImplementation(err));
  });
});
/**
 * 编辑图书
 */

router.post('/update', function (req, res, next) {
  var decode = jwtDecoded(req);

  if (decode && decode.username) {
    req.body.username = decode.username;
  }

  var book = new Book(null, req.body);
  updateBook(book).then(function (result) {
    new Result('更新电子书成功').success(res);
  })["catch"](function (err) {
    console.log(err);
    next(boom.badImplementation(err));
  });
});
router.get('/get', function (req, res, next) {
  var fileName = req.query.fileName;

  if (!fileName) {
    next(boom.badRequest(new Error('参数fileName不能为空')));
  } else {
    getBook(fileName).then(function (book) {
      new Result(book, '获取图书信息成功').success(res);
    })["catch"](function (err) {
      next(boom.badImplementation(err));
    });
  }
});
module.exports = router;