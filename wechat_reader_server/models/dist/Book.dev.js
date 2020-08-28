"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * file 电子书文件（上传）
 * data 电子书数据（编辑）
 */
var fs = require('fs');

var _require = require('../utils/constant'),
    MIME_TYPE_EPUB = _require.MIME_TYPE_EPUB,
    UPLOAD_URL = _require.UPLOAD_URL,
    UPLOAD_PATH = _require.UPLOAD_PATH;

var Book =
/*#__PURE__*/
function () {
  function Book(file, data) {
    _classCallCheck(this, Book);

    if (file) {
      this.createBookFromFile(file);
    } else {
      this.createBookFromData(data);
    }
  }

  _createClass(Book, [{
    key: "createBookFromFile",
    value: function createBookFromFile(file) {
      console.log(file);
      var destination = file.destination,
          filename = file.filename,
          _file$mimetype = file.mimetype,
          mimetype = _file$mimetype === void 0 ? MIME_TYPE_EPUB : _file$mimetype,
          path = file.path,
          originalname = file.originalname;
      var reg = /^application\/epub\+zip|application\/epub$/; //* 电子书的文件后缀名

      var suffix = reg.test(mimetype) ? '.epub' : ''; //* 电子书的原有路径

      var oldBookPath = path; //* 电子书的新路径

      var bookPath = "".concat(destination, "/").concat(filename).concat(suffix); //* 电子书的下载url

      var url = "".concat(UPLOAD_URL, "/book/").concat(filename).concat(suffix); //* 电子书解压后的文件夹路径

      var unzipPath = "".concat(UPLOAD_PATH, "/unzip/").concat(filename); //* 电子书解压后的文件夹URL

      var unzipUrl = "".concat(UPLOAD_URL, "/unzip/").concat(filename); //* 如果没有电子书的解压路径

      if (!fs.existsSync(unzipPath)) {
        // 创建目录
        fs.mkdirSync(unzipPath, {
          recursive: true
        });
      } //* 如果有解压路径 并且 不存在新的路径，重命名 


      if (fs.existsSync(unzipPath) && !fs.existsSync(bookPath)) {
        fs.renameSync(oldBookPath, bookPath);
      }

      this.fileName = filename;
      this.path = "/book/".concat(filename).concat(suffix); // epub文件相对路径

      this.filePath = this.path;
      this.unzipPath = "/unzip/".concat(filename); // epub解压后相对路径

      this.url = url; // epub文件下载链接

      this.title = ''; // 书名

      this.author = ''; // 作者

      this.publisher = ''; // 出版社

      this.contents = []; // 目录

      this.cover = ''; // 封面图片URL

      this.coverPath = ''; // 封面图片路径

      this.category = -1; // 分类ID

      this.categoryText = ''; // 分类名称

      this.language = ''; // 语种

      this.unzipUrl = unzipUrl; // 解压后文件夹链接(阅读电子书需要)

      this.originalname = originalname; // 电子书文件的原名
    }
  }, {
    key: "createBookFromData",
    value: function createBookFromData(data) {
      console.log(data);
    }
  }]);

  return Book;
}();

module.exports = Book;