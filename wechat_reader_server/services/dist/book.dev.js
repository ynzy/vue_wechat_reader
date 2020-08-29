"use strict";

var _require = require('../db'),
    insert = _require.insert,
    queryOne = _require.queryOne;

var Book = require('../models/Book'); // 判断是否存在此电子书


function exists(book) {
  /* const { title, author, publisher } = book
  const sql = `select * from book where title='${title}' and author='${author}' and publisher='${publisher}'`
  return queryOne(sql) */
}

function removeBook() {}

function insertContents() {}

function insertBook(book) {
  return new Promise(function _callee(reslove, reject) {
    var result;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(book instanceof Book)) {
              _context.next = 19;
              break;
            }

            _context.next = 4;
            return regeneratorRuntime.awrap(exists(book));

          case 4:
            result = _context.sent;

            if (!result) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(removeBook(book));

          case 8:
            reject(new Error('电子书已存在'));
            _context.next = 17;
            break;

          case 11:
            console.log('添加电子书');
            _context.next = 14;
            return regeneratorRuntime.awrap(insert(book.toDb(), 'book'));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(insertContents(book));

          case 16:
            reslove();

          case 17:
            _context.next = 20;
            break;

          case 19:
            reject(new Error('添加的图书对象不合法'));

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            reject(_context.t0);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 22]]);
  });
}

module.exports = {
  insertBook: insertBook
};