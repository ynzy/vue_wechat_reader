"use strict";

var _require = require('../db'),
    querySql = _require.querySql;

function login(username, password) {
  return querySql("select * from admin_user where username='".concat(username, "' and password='").concat(password, "'"));
}

module.exports = {
  login: login
};