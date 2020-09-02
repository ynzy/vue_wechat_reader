/**
 * jwt逻辑处理
 */
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('./constant');

/**
 * jwt签名(生成token)
 */

const jwtToken = function (username) {
  return jwt.sign(
    { username },
    PRIVATE_KEY,
    { expiresIn: JWT_EXPIRED }
  )
}

/**
 * jwt认证(验证token)
 */
const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问
}).unless({
  path: [
    '/',
    '/user/login'
  ], // 设置 jwt 认证白名单
});

/**
 * jwt解析(解析token)
 */
const jwtDecoded = function (req) {
  const authorization = req.get('Authorization')
  let token = ''
  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '')
  } else {
    token = authorization
  }
  return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {
  jwtToken,
  jwtAuth,
  jwtDecoded
}