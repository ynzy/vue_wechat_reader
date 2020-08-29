const mysql = require('mysql');
const config = require('./config')
const { host, user, password, database } = config
const { debug } = require('../utils/constant');
const { isObject } = require('../utils');
function connect() {
  return mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  })
}

// 查询所有数据
const querySql = function (sql) {
  const conn = connect();
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          debug && console.log('查询失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          debug && console.log('查询成功', JSON.stringify(res))
          resolve(res)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      conn.end()
    }
  })
}

// 查询一条数据
const queryOne = function (sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      if (results && results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

// 插入数据
const insert = function (model, tableName) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败 插入非对象'))
    } else {
      const keys = []
      const values = []
      Object.keys(model).forEach(key => {
        // 是否是model自身上的key，而不是原型上的
        if (model.hasOwnProperty(key)) {
          // 防止sql查询时出现错误 select `from` from book
          keys.push(`\`${key}\``)
          values.push(`'${model[key]}'`)
        }
      })
      if (keys.length > 0 && values.length > 0) {
        let sql = `INSERT INTO \`${tableName}\` (`
        const keysString = keys.join(',')
        const valuesString = values.join(',')
        sql = `${sql}${keysString} ) VALUES (${valuesString})`
        debug && console.log(sql);
        const conn = connect()
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } catch (e) {
          reject(e)
        } finally {
          conn.end()
        }
      } else {
        reject(new Error('插入数据库失败，对象中没有任何属性'))
      }
    }

  })
}

module.exports = {
  querySql,
  queryOne,
  insert
}