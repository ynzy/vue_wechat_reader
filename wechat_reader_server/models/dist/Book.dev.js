"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * file 电子书文件（上传）
 * data 电子书数据（编辑）
 */
var fs = require('fs');

var path = require('path');

var Epub = require('../utils/epub');

var _require = require('../utils/constant'),
    MIME_TYPE_EPUB = _require.MIME_TYPE_EPUB,
    UPLOAD_URL = _require.UPLOAD_URL,
    UPLOAD_PATH = _require.UPLOAD_PATH,
    UPDATE_TYPE_FROM_WEB = _require.UPDATE_TYPE_FROM_WEB,
    OLD_UPLOAD_URL = _require.OLD_UPLOAD_URL;

var xml2js = require('xml2js').parseString;

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
  } // 新增电子书


  _createClass(Book, [{
    key: "createBookFromFile",
    value: function createBookFromFile(file) {
      // console.log(file);
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

      this.originalName = originalname; // 电子书文件的原名
    }
  }, {
    key: "createBookFromData",
    value: function createBookFromData(data) {
      // console.log(data);
      this.fileName = data.fileName;
      this.cover = data.coverPath;
      this.title = data.title;
      this.author = data.author;
      this.publisher = data.publisher;
      this.bookId = data.fileName;
      this.language = data.language;
      this.rootFile = data.rootFile;
      this.originalName = data.originalName;
      this.path = data.path || data.filePath;
      this.filePath = data.path || data.filePath;
      this.unzipPath = data.unzipPath;
      this.coverPath = data.coverPath;
      this.createUser = data.username;
      this.createDt = new Date().getTime();
      this.updateDt = new Date().getTime();
      this.updateType = data.updateType === 0 ? data.updateType : UPDATE_TYPE_FROM_WEB;
      this.contents = data.contents;
      this.category = data.category || 99;
      this.categoryText = data.categoryText || '自定义';
    } // 解析电子书路径

  }, {
    key: "parse",
    value: function parse() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var bookPath = "".concat(UPLOAD_PATH).concat(_this.filePath); // console.log(bookPath);

        if (!fs.existsSync(bookPath)) {
          reject(new Error('电子书不存在'));
        }

        var epub = new Epub(bookPath);
        epub.on('error', function (err) {
          reject(err);
        });
        epub.on('end', function (err) {
          if (err) {
            reject(err);
          } else {
            // console.log(epub.manifest);
            var _epub$metadata = epub.metadata,
                language = _epub$metadata.language,
                creator = _epub$metadata.creator,
                creatorFileAs = _epub$metadata.creatorFileAs,
                title = _epub$metadata.title,
                cover = _epub$metadata.cover,
                publisher = _epub$metadata.publisher;

            if (!title) {
              reject(new Error('图书标题为空'));
            } else {
              _this.title = title;
              _this.language = language || 'en';
              _this.author = creator || creatorFileAs || 'unknown';
              _this.publisher = publisher || 'unknown';
              _this.rootFile = epub.rootFile;

              var handleGetImage = function handleGetImage(err, file, mimeType) {
                if (err) {
                  reject(err);
                } else {
                  var suffix = mimeType.split('/')[1];
                  var coverPath = "".concat(UPLOAD_PATH, "/img/").concat(_this.fileName, ".").concat(suffix);
                  var coverUrl = "".concat(UPLOAD_URL, "/img/").concat(_this.fileName, ".").concat(suffix);
                  fs.writeFileSync(coverPath, file, 'binary');
                  _this.coverPath = "/img/".concat(_this.fileName, ".").concat(suffix);
                  _this.cover = coverUrl;
                  resolve(_this);
                }
              };

              try {
                _this.unzip();

                _this.parseContents(epub).then(function (_ref) {
                  var chapters = _ref.chapters,
                      chapterTree = _ref.chapterTree;
                  // console.log(chapters);
                  _this.contents = chapters;
                  _this.contentsTree = chapterTree;
                  epub.getImage(cover, handleGetImage);
                });
              } catch (e) {
                reject(e);
              }
            }
          }
        });
        epub.parse();
      });
    } // 解压电子书

  }, {
    key: "unzip",
    value: function unzip() {
      var AdmZip = require('adm-zip');

      var zip = new AdmZip(Book.genPath(this.path));
      zip.extractAllTo(Book.genPath(this.unzipPath), true);
    } // 解析目录

  }, {
    key: "parseContents",
    value: function parseContents(epub) {
      var _this2 = this;

      // 获取目录文件
      // D:/A_Personal/epub/admin-upload-ebook/unzip/e8cf03d70942d841ae9d0b0d93f69e20/OEBPS/toc.ncx
      function getNcxFilePath() {
        var spine = epub && epub.spine;
        var manifest = epub && epub.manifest;
        var ncx = spine.toc && spine.toc.href;
        var id = spine.toc && spine.toc.id; // console.log('spine', ncx, manifest[id].href);

        if (ncx) {
          return ncx;
        } else {
          return manifest[id].href;
        }
      } // 查找父级对象


      function findParent(array) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var pid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        return array.map(function (item) {
          item.level = level;
          item.pid = pid; // 包含子目录

          if (item.navPoint && item.navPoint.length > 0) {
            item.navPoint = findParent(item.navPoint, level + 1, item['$'].id); // 如果navPoint是个对象
          } else if (item.navPoint) {
            item.navPoint.level = level + 1;
            item.navPoint.pid = item['$'].id;
          }

          return item;
        });
      } // 展开多级数组


      function flatten(array) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(array.map(function (item) {
          if (item.navPoint && item.navPoint.length > 0) {
            var _ref3;

            return (_ref3 = []).concat.apply(_ref3, [item].concat(_toConsumableArray(flatten(item.navPoint))));
          } else if (item.navPoint) {
            return [].concat(item, item.navPoint);
          }

          return item;
        })));
      }

      var ncxFilePath = Book.genPath("".concat(this.unzipPath, "/").concat(getNcxFilePath())); // console.log(ncxFilePath);

      if (fs.existsSync(ncxFilePath)) {
        return new Promise(function (resolve, reject) {
          var xml = fs.readFileSync(ncxFilePath, 'utf-8'); // 路径有相对路径和绝对路径，替换掉绝对路径，都改成相对路径
          // dir D:/A_Personal/epub/admin-upload-ebook/unzip/528d54275940d8ff8b420b1685a2a8de/OEBPS
          // dir /epub/admin-upload-ebook/unzip/420d0ea28c955e655982ec729e4ea482/OEBPS

          var dir = path.dirname(ncxFilePath).replace(UPLOAD_PATH, ''); // console.log('dir', dir);

          var fileName = _this2.fileName;
          var unzipPath = _this2.unzipPath;
          xml2js(xml, {
            explicitArray: false,
            ignoreAttrs: false
          }, function (err, json) {
            if (err) {
              reject(err);
            } else {
              var navMap = json.ncx.navMap; // console.log(JSON.stringify(navMap));
              // console.log('xml', navMap);

              if (navMap.navPoint && navMap.navPoint.length > 0) {
                // 修改结构
                navMap.navPoint = findParent(navMap.navPoint); // 数组扁平化

                var newNavMap = flatten(navMap.navPoint);
                var chapters = []; //目录信息
                // console.log(epub.flow);

                newNavMap.forEach(function (chapter, index) {
                  var src = chapter.content['$'].src;
                  chapter.id = "".concat(src);
                  chapter.href = "".concat(dir, "/").concat(src).replace(unzipPath, '');
                  chapter.text = "".concat(UPLOAD_URL).concat(dir, "/").concat(src); // console.log(chapter.text);

                  chapter.label = chapter.navLabel.text || '';
                  chapter.navId = chapter['$'].id;
                  chapter.fileName = fileName;
                  chapter.order = index + 1; // console.log(chapter);

                  chapters.push(chapter);
                });
                var chapterTree = Book.genContentsTree(chapters); // console.log(chapters);

                /* chapters.forEach(c => {
                  c.children = []
                  // 一级目录
                  if (c.pid === '') {
                    chapterTree.push(c)
                  } else {
                    const parent = chapters.find(_ => _.navId === c.pid)
                    parent.children.push(c)
                  }
                }) */
                // console.log(chapterTree);

                resolve({
                  chapters: chapters,
                  chapterTree: chapterTree
                });
              } else {
                reject(new Error('目录解析失败，目录数为0'));
              }
            }
          });
        });
      } else {
        throw new Error('目录文件不存在');
      }
    } // 将book对象中与数据库相关的数据提取出来，供使用

  }, {
    key: "toDb",
    value: function toDb() {
      return {
        fileName: this.fileName,
        cover: this.coverPath,
        title: this.title,
        author: this.author,
        publisher: this.publisher,
        bookId: this.fileName,
        language: this.language,
        rootFile: this.rootFile,
        originalName: this.originalName,
        filePath: this.filePath,
        unzipPath: this.unzipPath,
        coverPath: this.coverPath,
        createUser: this.username,
        createDt: this.createDt,
        updateDt: this.updateDt,
        updateType: this.updateType
      };
    } // 获取电子书目录

  }, {
    key: "getContents",
    value: function getContents() {
      return this.contents;
    } // 删除电子书文件

  }, {
    key: "reset",
    value: function reset() {
      if (Book.pathExists(this.filePath)) {
        fs.unlinkSync(Book.genPath(this.filePath));
      }

      if (Book.pathExists(this.coverPath)) {
        fs.unlinkSync(Book.genPath(this.coverPath));
      }

      if (Book.pathExists(this.unzipPath)) {
        //! 低版本 node 中 recursive不支持
        fs.rmdirSync(Book.genPath(this.unzipPath), {
          recursive: true
        });
      }
    } // 生成路径

  }], [{
    key: "genPath",
    value: function genPath(path) {
      // 如果没有/ 添加/
      if (!path.startsWith('/')) {
        path = "/".concat(path);
      }

      return "".concat(UPLOAD_PATH).concat(path);
    } // 判断路径是否存在

  }, {
    key: "pathExists",
    value: function pathExists(path) {
      if (path.startsWith(UPLOAD_PATH)) {
        return fs.existsSync(path);
      } else {
        return fs.existsSync(Book.genPath(path));
      }
    } // 获取图书路径

  }, {
    key: "genCoverUrl",
    value: function genCoverUrl(book) {
      var cover = book.cover; // 新的电子书

      if (+book.updateType === 0) {
        if (!cover) return null;

        if (cover.startsWith('/')) {
          return "".concat(OLD_UPLOAD_URL).concat(cover);
        } else {
          return "".concat(OLD_UPLOAD_URL, "/").concat(cover);
        } // 老电子书

      } else {
        if (!cover) return null;

        if (cover.startsWith('/')) {
          return "".concat(UPLOAD_URL).concat(cover);
        } else {
          return "".concat(UPLOAD_URL, "/").concat(cover);
        }
      }
    } // 生成目录树

  }, {
    key: "genContentsTree",
    value: function genContentsTree(contents) {
      if (!contents) return null;
      var contentsTree = [];
      contents.forEach(function (c) {
        c.children = []; // 一级目录

        if (c.pid === '') {
          contentsTree.push(c);
        } else {
          var parent = contents.find(function (_) {
            return _.navId === c.pid;
          });
          parent.children.push(c);
        }
      });
      return contentsTree;
    }
  }]);

  return Book;
}();

module.exports = Book;