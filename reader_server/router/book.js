
const express = require('express')
const multer = require('multer')
const { check, body, validationResult } = require('express-validator');
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const boom = require('boom')
const { jwtDecoded } = require('../utils/jwt')
const bookServices = require('../services/book')

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
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // 定义返回错误的样式，存入array数组
  return `${param}: ${msg}`;
};
router.post('/create', [
  body('title').isLength({ min: 1 }).withMessage('title不能为空'),
  body('author').isLength({ min: 1 }).withMessage('author不能为空'),
  body('publisher').isLength({ min: 1 }).withMessage('publisher不能为空'),
], function (req, res, next) {
  // 错误校验
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    next(boom.badImplementation(errors.array()[0]))
    return
  }
  // 添加图书
  const decode = jwtDecoded(req)
  if (decode && decode.username) {
    req.body.username = decode.username
  }
  const book = new Book(null, req.body)
  bookServices.insertBook(book).then(result => {
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
  bookServices.updateBook(book).then(result => {
    new Result('更新电子书成功').success(res)
  }).catch(err => {
    console.log(err);
    next(boom.badImplementation(err))
  })
})
// 获取图书
router.get('/get', function (req, res, next) {
  const { fileName } = req.query
  if (!fileName) {
    next(boom.badRequest(new Error('参数fileName不能为空')))
  } else {
    bookServices.getBook(fileName).then(book => {
      new Result(book, '获取图书信息成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})
// 获取分类
router.get('/category', function (req, res, next) {
  bookServices.getCategory().then(category => {
    // console.log(category);
    new Result(category, '获取分类成功').success(res)
  }).catch(err => {
    boom.badImplementation(err)
  })
})

// 图书列表
router.get('/list', function (req, res, next) {
  bookServices.listBook(req.query).then(({ list, count, page, pageSize }) => {
    // console.log(category);
    new Result(list,
      '获取图书列表成功',
      {
        page: +page,
        pageSize: +pageSize,
        total: count || 0
      }).success(res)
  }).catch(err => {
    boom.badImplementation(err)
  })
})

// 图书列表
router.get('/delete', function (req, res, next) {
  bookServices.deleteBook(req.query).then(() => {
    // console.log(res);
    new Result('删除电子书成功',).success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})


module.exports = router