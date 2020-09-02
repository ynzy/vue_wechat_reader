"use strict";

var _require = require('../db'),
    querySql = _require.querySql,
    queryOne = _require.queryOne;

function login(username, password) {
  var sql = "select * from admin_user where username='".concat(username, "' and password='").concat(password, "'");
  return querySql(sql);
}

function findUser(username) {
  var sql = "select id, username, role, nickname, avatar from admin_user where username='".concat(username, "'");
  return queryOne(sql);
}

module.exports = {
  login: login,
  findUser: findUser
};