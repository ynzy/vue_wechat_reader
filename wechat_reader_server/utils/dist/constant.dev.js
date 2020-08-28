"use strict";

var _require = require('./env'),
    env = _require.env;

var UPLOAD_PATH = env === 'dev' ? 'D:/A_Personal/epub/admin-upload-ebook' : '/root/upload/admin-upload/ebook';
var UPLOAD_URL = env === 'dev' ? 'https://yunyoushe.xyz/admin-upload-ebook' : 'https://www.yunyoushe.xyz/admin-upload-ebook';
module.exports = {
  CODE_ERROR: -1,
  CODE_TOKEN_EXPIRED: -2,
  CODE_SUCCESS: 0,
  debug: true,
  PWD_SALT: 'admin_imooc_node',
  PRIVATE_KEY: 'admin_imooc_node_test_youbaobao_xyz',
  JWT_EXPIRED: 60 * 60,
  // token失效时间
  UPLOAD_PATH: UPLOAD_PATH,
  // MIME_TYPE_EPUB: 'application/epub+zip'
  MIME_TYPE_EPUB: 'application/epub',
  // 上传电子书类型
  UPLOAD_URL: UPLOAD_URL
}; // let reg = /^application\/epub\+zip|application\/epub$/
// let t = 'application/epub'
// let t = 'application/epub'
// console.log(reg.test(t));