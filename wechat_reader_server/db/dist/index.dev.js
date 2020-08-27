"use strict";

var mysql = require('mysql');

var config = require('./config');

var host = config.host,
    user = config.user,
    password = config.password,
    database = config.database;

var _require = require('../utils/constant'),
    debug = _require.debug;

function connect() {
  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    multipleStatements: true
  });
}

function querySql(sql) {
  var conn = connect();
  debug && console.log(sql);
  return new Promise(function (resolve, reject) {
    try {
      conn.query(sql, function (err, res) {
        if (err) {
          debug && console.log('查询失败，原因:' + JSON.stringify(err));
          reject(err);
        } else {
          debug && console.log('查询成功', JSON.stringify(res));
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    } finally {
      conn.end();
    }
  });
}

function queryOne(sql) {
  return new Promise(function (resolve, reject) {
    querySql(sql).then(function (results) {
      if (results && results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    })["catch"](function (err) {
      reject(err);
    });
  });
}

module.exports = {
  querySql: querySql,
  queryOne: queryOne
};