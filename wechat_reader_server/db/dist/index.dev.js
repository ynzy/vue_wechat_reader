"use strict";

var mysql = require('mysql');

var config = require('./config');

var host = config.host,
    user = config.user,
    password = config.password,
    database = config.database;

var _require = require('../utils/constant'),
    debug = _require.debug;

var _require2 = require('../utils'),
    isObject = _require2.isObject;

function orLike(where, k, v) {
  if (where === 'where') {
    return where + " ".concat(k, " like '%").concat(v, "%'");
  } else {
    return where + " or ".concat(k, " like '%").concat(v, "%'");
  }
}

function andLike(where, k, v) {
  if (where === 'where') {
    return where + " ".concat(k, " like '%").concat(v, "%'");
  } else {
    return where + " and ".concat(k, " like '%").concat(v, "%'");
  }
}

function or(where, k, v) {
  if (where === 'where') {
    return where + " ".concat(k, "='").concat(v, "'");
  } else {
    return where + " or ".concat(k, "='").concat(v, "'");
  }
}

function and(where, k, v) {
  if (where === 'where') {
    return where + " ".concat(k, "='").concat(v, "'");
  } else {
    return where + " and ".concat(k, "='").concat(v, "'");
  }
}

function connect() {
  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    multipleStatements: true
  });
} // 查询所有数据


var querySql = function querySql(sql) {
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
}; // 查询一条数据


var queryOne = function queryOne(sql) {
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
}; // 插入数据


var insert = function insert(model, tableName) {
  return new Promise(function (resolve, reject) {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败 插入非对象'));
    } else {
      var keys = [];
      var values = [];
      Object.keys(model).forEach(function (key) {
        // 是否是model自身上的key，而不是原型上的
        if (model.hasOwnProperty(key)) {
          // 防止sql查询时出现错误 select `from` from book
          keys.push("`".concat(key, "`"));
          values.push("'".concat(model[key], "'"));
        }
      });

      if (keys.length > 0 && values.length > 0) {
        var sql = "INSERT INTO `".concat(tableName, "` (");
        var keysString = keys.join(',');
        var valuesString = values.join(',');
        sql = "".concat(sql).concat(keysString, " ) VALUES (").concat(valuesString, ")");
        debug && console.log(sql);
        var conn = connect();

        try {
          conn.query(sql, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } catch (e) {
          reject(e);
        } finally {
          conn.end();
        }
      } else {
        reject(new Error('插入数据库失败，对象中没有任何属性'));
      }
    }
  });
}; // 更新数据


function update(model, tableName, where) {
  return new Promise(function (resolve, reject) {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败，插入数据非对象'));
    } else {
      var entry = [];
      Object.keys(model).forEach(function (key) {
        if (model.hasOwnProperty(key)) {
          entry.push("`".concat(key, "`='").concat(model[key], "'"));
        }
      });

      if (entry.length > 0) {
        var sql = "UPDATE `".concat(tableName, "` SET");
        sql = "".concat(sql, " ").concat(entry.join(','), " ").concat(where);
        debug && console.log(sql);
        var conn = connect();

        try {
          conn.query(sql, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } catch (e) {
          reject(e);
        } finally {
          conn.end();
        }
      } else {
        reject(new Error('SQL解析失败'));
      }
    }
  });
}

module.exports = {
  querySql: querySql,
  queryOne: queryOne,
  insert: insert,
  update: update,
  orLike: orLike,
  or: or,
  andLike: andLike,
  and: and
};