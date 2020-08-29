/**
 * file 电子书文件（上传）
 * data 电子书数据（编辑）
 */
const fs = require('fs')
const Epub = require('../utils/epub')
const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const xml2js = require('xml2js').parseString
class Book {
  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file)
    } else {
      this.createBookFromData(data)
    }
  }
  // 新增电子书
  createBookFromFile(file) {
    // console.log(file);
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
  // 解析电子书路径
  parse() {
    return new Promise((resolve, reject) => {
      const bookPath = `${UPLOAD_PATH}${this.filePath}`
      // console.log(bookPath);
      if (!fs.existsSync(bookPath)) {
        reject(new Error('电子书不存在'))
      }
      const epub = new Epub(bookPath)
      epub.on('error', err => {
        reject(err)
      })
      epub.on('end', err => {
        if (err) {
          reject(err)
        } else {
          // console.log(epub.manifest);
          const { language, creator, creatorFileAs, title, cover, publisher } = epub.metadata
          if (!title) {
            reject(new Error('图书标题为空'))
          } else {
            this.title = title
            this.language = language || 'en'
            this.author = creator || creatorFileAs || 'unknown'
            this.publisher = publisher || 'unknown'
            this.rootFile = epub.rootFile
            const handleGetImage = (err, file, mimeType) => {
              if (err) {
                reject(err)
              } else {
                const suffix = mimeType.split('/')[1]
                const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                fs.writeFileSync(coverPath, file, 'binary')
                this.coverPath = `/img/${this.fileName}.${suffix}`
                this.cover = coverUrl
                resolve(this)
              }
            }
            try {
              this.unzip()
              this.parseContents(epub).then(({ chapters }) => {
                // console.log(chapters);
                this.contents = chapters
                epub.getImage(cover, handleGetImage)
              })
            } catch (e) {
              reject(e)
            }
          }
        }
      })
      epub.parse()
    })
  }
  // 解压电子书
  unzip() {
    const AdmZip = require('adm-zip')
    const zip = new AdmZip(Book.genPath(this.path))
    zip.extractAllTo(Book.genPath(this.unzipPath), true)
  }
  // 解析目录
  parseContents(epub) {
    // 获取目录文件
    // D:/A_Personal/epub/admin-upload-ebook/unzip/e8cf03d70942d841ae9d0b0d93f69e20/OEBPS/toc.ncx
    function getNcxFilePath() {
      const spine = epub && epub.spine
      const manifest = epub && epub.manifest
      const ncx = spine.toc && spine.toc.href
      const id = spine.toc && spine.toc.id
      // console.log('spine', ncx, manifest[id].href);
      if (ncx) {
        return ncx
      } else {
        return manifest[id].href
      }
    }

    function findParent(array, level = 0, pid = '') {
      return array.map(item => {
        item.level = level
        item.pid = pid
        // 包含子目录
        if (item.navPoint && item.navPoint.length > 0) {
          item.navPoint = findParent(item.navPoint, level + 1, item['$'].id)
          // 如果navPoint是个对象
        } else if (item.navPoint) {
          item.navPoint.level = level + 1
          item.navPoint.pid = item['$'].id
        }
        return item
      })
    }

    function flatten(array) {
      return [].concat(...array.map(item => {
        if (item.navPoint && item.navPoint.length > 0) {
          return [].concat(item, ...flatten(item.navPoint))
        } else if (item.navPoint) {
          return [].concat(item, item.navPoint)
        }
        return item
      }))
    }
    const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`)
    // console.log(ncxFilePath);
    if (fs.existsSync(ncxFilePath)) {
      return new Promise((resolve, reject) => {
        const xml = fs.readFileSync(ncxFilePath, 'utf-8')
        const fileName = this.fileName
        xml2js(xml, {
          explicitArray: false,
          ignoreAttrs: false
        },
          function (err, json) {
            if (err) {
              reject(err)
            } else {
              const navMap = json.ncx.navMap
              // console.log(JSON.stringify(navMap));
              // console.log('xml', navMap);
              if (navMap.navPoint && navMap.navPoint.length > 0) {
                // 修改结构
                navMap.navPoint = findParent(navMap.navPoint)
                // 数组扁平化
                const newNavMap = flatten(navMap.navPoint)
                const chapters = [] //目录信息
                // console.log(epub.flow);
                epub.flow.forEach((chapter, index) => {
                  if (index + 1 > newNavMap.length) {
                    return
                  }
                  const nav = newNavMap[index]
                  chapter.text = `${UPLOAD_URL}/unzip/${fileName}/${chapter.href}`
                  // console.log(chapter.text);
                  if (nav && nav.navLabel) {
                    chapter.label = nav.navLabel.text || ''
                  } else {
                    chapter.label = ''
                  }
                  chapter.level = nav.level
                  chapter.pid = nav.pid
                  chapter.navId = nav['$'].id
                  chapter.fileName = fileName
                  chapter.order = index + 1
                  // console.log(chapter);
                  chapters.push(chapter)
                })
                // console.log(chapters);
                resolve({ chapters })
              } else {
                reject(new Error('目录解析失败，目录数为0'))
              }
            }
          })

      })
    } else {
      throw new Error('目录文件不存在')
    }

  }
  // 生成路径
  static genPath(path) {
    // 如果没有/ 添加/
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    return `${UPLOAD_PATH}${path}`
  }
}

module.exports = Book