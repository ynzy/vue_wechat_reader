/**
 * file 电子书文件（上传）
 * data 电子书数据（编辑）
 */
const fs = require('fs')

const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')

class Book {
  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file)
    } else {
      this.createBookFromData(data)
    }
  }
  createBookFromFile(file) {
    console.log(file);
    const {
      destination, filename, mimetype = MIME_TYPE_EPUB, path, originalname
    } = file
    let reg = /^application\/epub\+zip|application\/epub$/
    //* 电子书的文件后缀名
    const suffix = reg.test(mimetype) ? '.epub' : ''
    //* 电子书的原有路径
    const oldBookPath = path
    //* 电子书的新路径
    const bookPath = `${destination}/${filename}${suffix}`
    //* 电子书的下载url
    const url = `${UPLOAD_URL}/book/${filename}${suffix}`
    //* 电子书解压后的文件夹路径
    const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
    //* 电子书解压后的文件夹URL
    const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
    //* 如果没有电子书的解压路径
    if (!fs.existsSync(unzipPath)) {
      // 创建目录
      fs.mkdirSync(unzipPath, { recursive: true })
    }
    //* 如果有解压路径 并且 不存在新的路径，重命名 
    if (fs.existsSync(unzipPath) && !fs.existsSync(bookPath)) {
      fs.renameSync(oldBookPath, bookPath)
    }
    this.fileName = filename
    this.path = `/book/${filename}${suffix}` // epub文件相对路径
    this.filePath = this.path
    this.unzipPath = `/unzip/${filename}` // epub解压后相对路径
    this.url = url // epub文件下载链接
    this.title = '' // 书名
    this.author = '' // 作者
    this.publisher = '' // 出版社
    this.contents = [] // 目录
    this.cover = '' // 封面图片URL
    this.coverPath = '' // 封面图片路径
    this.category = -1 // 分类ID
    this.categoryText = '' // 分类名称
    this.language = '' // 语种
    this.unzipUrl = unzipUrl // 解压后文件夹链接(阅读电子书需要)
    this.originalname = originalname // 电子书文件的原名
  }

  createBookFromData(data) {
    console.log(data);

  }
}

module.exports = Book