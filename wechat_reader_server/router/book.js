
const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')


const router = express.Router()

/**
 * multer 
 * 用于处理 multipart/form-data 类型的表单数据
 */
router.post('/upload', multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
  function (req, res, next) {
    if (!req.file || req.file.length === 0) {
      new Result('上传电子书失败').fail(res)
    } else {
      new Result('上传电子书成功').success(res)
    }
  })

module.exports = router