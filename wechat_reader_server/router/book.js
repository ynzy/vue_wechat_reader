
const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const boom = require('boom')
const { jwtDecoded } = require('../utils/jwt')
const { insertBook, getBook, updateBook } = require('../services/book')

const router = express.Router()

/**
 * 上传图书
 * multer 
 * 用于处理 multipart/form-data 类型的表单数据
 */
router.post('/upload', multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
  function (req, res, next) {
    if (!req.file || req.file.length === 0) {
      new Result('上传电子书失败').fail(res)
    } else {
      const book = new Book(req.file)
      // console.log(book);
      book.parse().then(book => {
        // console.log('book:', book);
        new Result(book, '上传电子书成功').success(res)
      }).catch(err => {
        console.log(err);
        next(boom.badImplementation(err))
      })
    }
  })

/**
 * 新增图书
 */

router.post('/create', function (req, res, next) {
  const decode = jwtDecoded(req)
  if (decode && decode.username) {
    req.body.username = decode.username
  }
  const book = new Book(null, req.body)
  insertBook(book).then(result => {
    new Result('添加电子书成功').success(res)
  }).catch(err => {
    console.log(err);
    next(boom.badImplementation(err))
  })
})

/**
 * 编辑图书
 */

router.post('/update', function (req, res, next) {
  const decode = jwtDecoded(req)
  if (decode && decode.username) {
    req.body.username = decode.username
  }
  const book = new Book(null, req.body)
  updateBook(book).then(result => {
    new Result('更新电子书成功').success(res)
  }).catch(err => {
    console.log(err);
    next(boom.badImplementation(err))
  })
})

router.get('/get', function (req, res, next) {
  const { fileName } = req.query
  if (!fileName) {
    next(boom.badRequest(new Error('参数fileName不能为空')))
  } else {
    getBook(fileName).then(book => {
      new Result(book, '获取图书信息成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})

module.exports = router