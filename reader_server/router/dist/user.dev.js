"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var boom = require('boom');

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var Result = require('../models/Result');

var _require2 = require('../services/user'),
    login = _require2.login,
    findUser = _require2.findUser;

var _require3 = require('../utils'),
    md5 = _require3.md5;

var _require4 = require('../utils/constant'),
    PWD_SALT = _require4.PWD_SALT;

var _require5 = require('../utils/jwt'),
    jwtToken = _require5.jwtToken,
    jwtDecoded = _require5.jwtDecoded;

var router = express.Router();
router.post('/login', [body('username').isString().withMessage('username类型不正确'), body('password').isString().withMessage('password类型不正确')], function (req, res, next) {
  var err = validationResult(req);

  if (!err.isEmpty()) {
    var _err$errors = _slicedToArray(err.errors, 1),
        msg = _err$errors[0].msg;

    next(boom.badRequest(msg));
  } else {
    console.log(req.body);
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password; // 密码md5加密

    password = md5("".concat(password).concat(PWD_SALT));
    login(username, password).then(function (user) {
      // console.log(user);
      if (!user || user.length === 0) {
        new Result('登录失败').fail(res);
      } else {
        var token = jwtToken(username);
        console.log(token);
        new Result({
          token: token
        }, '登录成功').success(res);
      }
    })["catch"](function (e) {
      console.log(e);
    });
  }
});
router.get('/info', function (req, res, next) {
  var decode = jwtDecoded(req);
  console.log(decode);

  if (decode && decode.username) {
    findUser(decode.username).then(function (user) {
      console.log(user);

      if (user) {
        user.roles = [user.role];
        new Result(user, '用户信息查询成功').success(res);
      } else {
        new Result(user, '用户信息查询失败').fail(res);
      }
    });
  } else {
    new Result(user, '用户信息查询失败').fail(res);
  }
});
module.exports = router;