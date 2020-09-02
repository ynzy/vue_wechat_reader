"use strict";

var _ = require('lodash');

var _require = require('../db'),
    insert = _require.insert,
    queryOne = _require.queryOne;

var Book = require('../models/Book');

var db = require('../db');

var _require2 = require('lodash'),
    reject = _require2.reject;

var _require3 = require('../utils/constant'),
    debug = _require3.debug; // 判断是否存在此电子书


function exists(book) {
  var title = book.title,
      author = book.author,
      publisher = book.publisher;
  console.log(title, author, publisher);
  var sql = "select * from book where title='".concat(title, "' and author='").concat(author, "' and publisher='").concat(publisher, "'");
  return queryOne(sql);
} // 移除电子书


function removeBook(book) {
  var removeBookSql, removeContentsSql;
  return regeneratorRuntime.async(function removeBook$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!book) {
            _context.next = 9;
            break;
          }

          // 删除保存的电子书文件数据
          book.reset(); // 删除数据库中电子书数据

          if (!book.fileName) {
            _context.next = 9;
            break;
          }

          removeBookSql = "delete from book where fileName='".concat(book.fileName, "'");
          removeContentsSql = "delete from contents where fileName='".concat(book.fileName, "'");
          _context.next = 7;
          return regeneratorRuntime.awrap(db.querySql(removeBookSql));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(db.querySql(removeContentsSql));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function insertContents(book) {
  var contents, newBook, i, content, _content;

  return regeneratorRuntime.async(function insertContents$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          contents = book.getContents();

          if (contents) {
            _context2.next = 6;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(book.parse());

        case 4:
          newBook = _context2.sent;
          contents = newBook.getContents();

        case 6:
          if (!(contents && contents.length > 0)) {
            _context2.next = 16;
            break;
          }

          i = 0;

        case 8:
          if (!(i < contents.length)) {
            _context2.next = 16;
            break;
          }

          content = contents[i];
          _content = _.pick(content, ['fileName', 'id', 'href', 'order', 'level', 'text', 'label', 'pid', 'navId']);
          _context2.next = 13;
          return regeneratorRuntime.awrap(insert(_content, 'contents'));

        case 13:
          i++;
          _context2.next = 8;
          break;

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function insertBook(book) {
  return new Promise(function _callee(resolve, reject) {
    var result;
    return regeneratorRuntime.async(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!(book instanceof Book)) {
              _context3.next = 18;
              break;
            }

            _context3.next = 4;
            return regeneratorRuntime.awrap(exists(book));

          case 4:
            result = _context3.sent;

            if (!result) {
              _context3.next = 11;
              break;
            }

            _context3.next = 8;
            return regeneratorRuntime.awrap(removeBook(book));

          case 8:
            reject(new Error('电子书已存在'));
            _context3.next = 16;
            break;

          case 11:
            _context3.next = 13;
            return regeneratorRuntime.awrap(insert(book.toDb(), 'book'));

          case 13:
            _context3.next = 15;
            return regeneratorRuntime.awrap(insertContents(book));

          case 15:
            resolve();

          case 16:
            _context3.next = 19;
            break;

          case 18:
            reject(new Error('添加的图书对象不合法'));

          case 19:
            _context3.next = 24;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](0);
            reject(_context3.t0);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 21]]);
  });
}

function updateBook(book) {
  return new Promise(function _callee2(resolve, reject) {
    var result, model;
    return regeneratorRuntime.async(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (!(book instanceof Book)) {
              _context4.next = 19;
              break;
            }

            _context4.next = 4;
            return regeneratorRuntime.awrap(getBook(book.fileName));

          case 4:
            result = _context4.sent;

            if (!result) {
              _context4.next = 19;
              break;
            }

            model = book.toDb();

            if (!(+result.updateType === 0)) {
              _context4.next = 11;
              break;
            }

            reject(new Error('内置图书不能编辑'));
            _context4.next = 19;
            break;

          case 11:
            delete model.createDt; // 创建时间不能更新

            if (!(result.createUser !== book.createUser)) {
              _context4.next = 16;
              break;
            }

            reject(new Error('只有创建人才能编辑'));
            _context4.next = 19;
            break;

          case 16:
            _context4.next = 18;
            return regeneratorRuntime.awrap(db.update(model, 'book', "where fileName='".concat(book.fileName, "'")));

          case 18:
            resolve();

          case 19:
            _context4.next = 24;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](0);
            reject(_context4.t0);

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 21]]);
  });
}

function getBook(fileName) {
  return new Promise(function _callee3(resolve, reject) {
    var bookSql, contentsSql, book, contents;
    return regeneratorRuntime.async(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            bookSql = "select * from book where fileName='".concat(fileName, "'");
            contentsSql = "select * from contents where fileName='".concat(fileName, "' order by `order`");
            _context5.next = 4;
            return regeneratorRuntime.awrap(db.queryOne(bookSql));

          case 4:
            book = _context5.sent;
            _context5.next = 7;
            return regeneratorRuntime.awrap(db.querySql(contentsSql));

          case 7:
            contents = _context5.sent;

            if (book) {
              book.cover = Book.genCoverUrl(book);
              book.contentsTree = Book.genContentsTree(contents);
              resolve(book);
            } else {
              reject(new Error('电子书不存在'));
            }

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
}

function getCategory() {
  var sql, result, categoryList;
  return regeneratorRuntime.async(function getCategory$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          sql = 'select * from category order by category asc';
          _context6.next = 3;
          return regeneratorRuntime.awrap(db.querySql(sql));

        case 3:
          result = _context6.sent;
          categoryList = [];
          result.forEach(function (item) {
            categoryList.push({
              label: item.categoryText,
              value: item.category,
              num: item.num
            });
          });
          return _context6.abrupt("return", categoryList);

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function listBook(query) {
  var _query$page, page, _query$pageSize, pageSize, sort, title, category, author, offset, bookSql, where, symbol, column, order, countSql, list, count;

  return regeneratorRuntime.async(function listBook$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          debug && console.log(query);
          _query$page = query.page, page = _query$page === void 0 ? 1 : _query$page, _query$pageSize = query.pageSize, pageSize = _query$pageSize === void 0 ? 20 : _query$pageSize, sort = query.sort, title = query.title, category = query.category, author = query.author;
          offset = (page - 1) * pageSize;
          bookSql = 'select * from book';
          where = 'where'; // 查询关键字

          title && (where = db.andLike(where, 'title', title));
          author && (where = db.andLike(where, 'author', author));
          category && (where = db.and(where, 'categoryText', category));

          if (where !== 'where') {
            bookSql = "".concat(bookSql, " ").concat(where);
          } // 查询排序


          if (sort) {
            symbol = sort[0];
            column = sort.slice(1, sort.length);
            order = symbol === '+' ? 'asc' : 'desc';
            bookSql = "".concat(bookSql, " order by ").concat(column, " ").concat(order);
          } // 查询分页


          bookSql = "".concat(bookSql, " limit ").concat(pageSize, " offset ").concat(offset); // 查询总数

          countSql = "select count(*) as count from book";

          if (where !== 'where') {
            countSql = "".concat(countSql, " ").concat(where);
          }

          debug && console.log('bookSql:', bookSql);
          debug && console.log('countSql:', countSql);
          _context7.next = 17;
          return regeneratorRuntime.awrap(db.querySql(bookSql));

        case 17:
          list = _context7.sent;
          list.forEach(function (book) {
            return book.cover = Book.genCoverUrl(book);
          });
          _context7.next = 21;
          return regeneratorRuntime.awrap(db.querySql(countSql));

        case 21:
          count = _context7.sent;
          console.log(list.length);
          return _context7.abrupt("return", {
            list: list,
            count: count[0].count,
            page: page,
            pageSize: pageSize
          });

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  });
}

module.exports = {
  insertBook: insertBook,
  getBook: getBook,
  updateBook: updateBook,
  getCategory: getCategory,
  listBook: listBook
};