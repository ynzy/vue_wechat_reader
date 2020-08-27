const mysql = require('mysql');
const config = require('./config')
const { host, user, password, database } = config
const { debug } = require('../utils/constant')
function connect() {
  return mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  })
}

function querySql(sql) {
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

module.exports = {
  querySql
}