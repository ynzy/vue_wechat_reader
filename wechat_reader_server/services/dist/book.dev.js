"use strict";

var _ = require('lodash');

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

function insertContents(book) {
  var contents, newBook, i, content, _content;

  return regeneratorRuntime.async(function insertContents$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          contents = book.getContents();

          if (contents) {
            _context.next = 6;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(book.parse());

        case 4:
          newBook = _context.sent;
          contents = newBook.getContents();

        case 6:
          if (!(contents && contents.length > 0)) {
            _context.next = 16;
            break;
          }

          i = 0;

        case 8:
          if (!(i < contents.length)) {
            _context.next = 16;
            break;
          }

          content = contents[i];
          _content = _.pick(content, ['fileName', 'id', 'href', 'order', 'level', 'text', 'label', 'pid', 'navId']);
          _context.next = 13;
          return regeneratorRuntime.awrap(insert(_content, 'contents'));

        case 13:
          i++;
          _context.next = 8;
          break;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}

function insertBook(book) {
  return new Promise(function _callee(reslove, reject) {
    var result;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(book instanceof Book)) {
              _context2.next = 18;
              break;
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(exists(book));

          case 4:
            result = _context2.sent;

            if (!result) {
              _context2.next = 11;
              break;
            }

            _context2.next = 8;
            return regeneratorRuntime.awrap(removeBook(book));

          case 8:
            reject(new Error('电子书已存在'));
            _context2.next = 16;
            break;

          case 11:
            _context2.next = 13;
            return regeneratorRuntime.awrap(insert(book.toDb(), 'book'));

          case 13:
            _context2.next = 15;
            return regeneratorRuntime.awrap(insertContents(book));

          case 15:
            reslove();

          case 16:
            _context2.next = 19;
            break;

          case 18:
            reject(new Error('添加的图书对象不合法'));

          case 19:
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](0);
            reject(_context2.t0);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 21]]);
  });
}

module.exports = {
  insertBook: insertBook
};