const { insert, queryOne } = require('../db')
const Book = require('../models/Book')

// 判断是否存在此电子书
function exists(book) {
  /* const { title, author, publisher } = book
  const sql = `select * from book where title='${title}' and author='${author}' and publisher='${publisher}'`
  return queryOne(sql) */
}

function removeBook() {

}
function insertContents() {

}

function insertBook(book) {
  return new Promise(async (reslove, reject) => {
    try {
      if (book instanceof Book) {
        const result = await exists(book)
        // 如果有此电子书把它移除掉
        if (result) {
          await removeBook(book)
          reject(new Error('电子书已存在'))
        } else {
          console.log('添加电子书');
          await insert(book.toDb(), 'book')
          await insertContents(book)
          reslove()
        }
      } else {
        reject(new Error('添加的图书对象不合法'))
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  insertBook
}