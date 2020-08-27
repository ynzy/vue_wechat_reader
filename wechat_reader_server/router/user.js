const express = require('express')
const Result = require('../models/Result')
const { login } = require('../services/user')
const { md5 } = require('../utils')
const { PWD_SALT } = require('../utils/constant')
const router = express.Router()

router.post('/login', function (req, res) {
  console.log(req.body);
  const { username, password } = req.body
  // 密码md5加密
  password = md5(`${password}${PWD_SALT}`)
  login(username, password).then(user => {
    if (!user || user.length === 0) {
      new Result('登录失败').fail(res)
    } else {
      new Result('登录成功').success(res)
    }
  })

})
router.get('/info', function (req, res, next) {
  res.json('user info...')
})
module.exports = router