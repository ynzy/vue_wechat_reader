
let UPLOAD_PATH,
  OLD_UPLOAD_URL,
  UPLOAD_URL,
  dbHost,
  dbUser,
  dbPwd
if (process.env.NODE_ENV == "prod") {
  //线上接口地址
  UPLOAD_PATH = '/root/upload/admin-upload/ebook'
  OLD_UPLOAD_URL = 'http://yunyoushe.xyz/book/res/img'
  UPLOAD_URL = 'http://yunyoushe.xyz/admin-upload-ebook'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = ''
} else {
  //测试环境接口地址
  UPLOAD_PATH = 'D:/A_Personal/epub/admin-upload-ebook'
  OLD_UPLOAD_URL = 'https://yunyoushe.xyz/book/res/img'
  UPLOAD_URL = 'https://yunyoushe.xyz/admin-upload-ebook'
  dbHost = '101.37.171.186'
  dbUser = 'root'
  dbPwd = '123456'
}
module.exports = {
  CODE_ERROR: -1,
  CODE_TOKEN_EXPIRED: -2,
  CODE_SUCCESS: 0,
  debug: true,
  PWD_SALT: 'admin_imooc_node',
  PRIVATE_KEY: 'admin_imooc_node_test_youbaobao_xyz',
  JWT_EXPIRED: 60 * 60, // token失效时间
  UPLOAD_PATH,
  // MIME_TYPE_EPUB: 'application/epub+zip'
  MIME_TYPE_EPUB: 'application/epub',  // 上传电子书类型
  OLD_UPLOAD_URL,
  UPLOAD_URL,
  UPDATE_TYPE_FROM_WEB: 1,
  dbHost,
  dbPwd,
  dbUser,
}

// let reg = /^application\/epub\+zip|application\/epub$/
// let t = 'application/epub'
// let t = 'application/epub'
// console.log(reg.test(t));