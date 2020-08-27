const express = require('express')
const boom = require('boom')
const { body, validationResult } = require('express-validator')

const Result = require('../models/Result')
const { login, findUser } = require('../services/user')
const { md5 } = require('../utils')
const { PWD_SALT } = require('../utils/constant')
const { jwtToken, jwtDecoded } = require('../utils/jwt')

const router = express.Router()

router.post('/login',
  [
    body('username').isString().withMessage('username类型不正确'),
    body('password').isString().withMessage('password类型不正确')
  ],
  function (req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      next(boom.badRequest(msg))
    } else {
      console.log(req.body);
      let { username, password } = req.body
      // 密码md5加密
      password = md5(`${password}${PWD_SALT}`)
      login(username, password).then(user => {
        // console.log(user);
        if (!user || user.length === 0) {
          new Result('登录失败').fail(res)
        } else {
          const token = jwtToken(username)
          console.log(token);
          new Result({ token }, '登录成功').success(res)
        }
      }).catch(e => {
        console.log(e);
      })
    }
  })
router.get('/info', function (req, res, next) {
  const decode = jwtDecoded(req)
  console.log(decode);
  if (decode && decode.username) {
    findUser(decode.username).then(user => {
      console.log(user);
      if (user) {
        user.roles = [user.role]
        new Result(user, '用户信息查询成功').success(res)
      } else {
        new Result(user, '用户信息查询失败').fail(res)
      }
    })
  } else {
    new Result(user, '用户信息查询失败').fail(res)
  }

})
module.exports = router