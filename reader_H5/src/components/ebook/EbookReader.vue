<template>
  <div class="ebook-reader">
    <div
      class="ebook-reader-mask"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseup.left="onMouseEnd"
      @click="onMaskClick"
    ></div>
    <div id="read"></div>
  </div>
</template>

<script>
import { ebookMixin } from '@/utils/mixin'
import Epub from 'epubjs'
import { uploadUrl } from '@/config'
import { mapActions } from 'vuex'
import * as Storage from '@/utils/localStorage'
import { addCss } from '@/utils/book'

// global.epub = Epub
export default {
  mixins: [ebookMixin],
  mounted() {
    // Biomedicine|2015_Book_InnovativeMedicine
    // http://192.168.1.122:8080/#/ebook/Biomedicine|2015_Book_InnovativeMedicine
    /* const fileName = this.$route.params.fileName.split('|').join('/')
    this.setFileName(fileName).then(() => {
      const epubPath = `${uploadUrl}/epub/${fileName}.epub` // 电子书路径
      this.initEpub(epubPath)
    }) */
    let epubPath = 'http://192.168.1.122:8080/2015.epub' //!静态电子书，测试
    this.setFileName(2015)
    this.initEpub(epubPath)
  },
  methods: {
    /**
     * mouseState
     * 1-鼠标进入
     * 2-鼠标进入后的移动
     * 3-鼠标从移动状态松手
     * 4-鼠标还原(鼠标进入，点击之后什么都没做，就是点击了mask)
     */
    onMouseEnter(e) {
      this.mouseState = 1 // 鼠标的状态
      this.mouseStartTime = e.timeStamp // 通过点击时间辅助进行判断，点击事件还是点击移动事件
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e) {
      if (this.mouseState === 1) {
        // 点下鼠标进入的时候
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        // 鼠标进入后移动 防止鼠标进入页面，没有点击也会进行计算
        console.log(e)
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0) // 归位操作
        this.firstOffsetY = 0
        this.mouseState = 3 // 点击鼠标，移动，松开的状态
      } else {
        this.mouseState == 4
      }
      this.mouseEndTime = e.timeStamp
      const time = this.mouseEndTime - this.mouseStartTime // 点击时间差
      if (time < 200) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    move(e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        // 获取滑动距离 = 最后的偏移量 - 最初的偏移量
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        // 获取最初的偏移量(鼠标第一次按下的那个点)
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd(e) {
      // 鼠标移开之后还原偏移量
      this.setOffsetY(0)
      this.firstOffsetY = 0
    },
    onMaskClick(e) {
      if (this.mouseState == 2 || this.mouseState == 3) {
        return
      }
      const offsetX = e.offsetX
      const width = window.innerWidth
      // 上一页
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
        // 下一页
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
        // 显示菜单
      } else {
        this.toggleTitleAndMenu()
      }
    },
    prevPage() {
      this.rendition?.prev()
      this.refreshLocation()
      this.hideTileAndMenu()
    },
    nextPage() {
      this.rendition?.next()
      this.refreshLocation()
      this.hideTileAndMenu()
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontSize() {
      let fontSize = Storage.getFontSize(this.fileName)
      if (!fontSize) {
        Storage.saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily() {
      let font = Storage.getFontFamily(this.fileName)
      if (!font) {
        Storage.saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initTheme() {
      let defaultTheme = Storage.getTheme(this.fileName)
      // console.log(defaultTheme)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        Storage.saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      // return defaultTheme
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(defaultTheme)
    },

    // 初始化渲染
    initRendition() {
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 兼容微信浏览器
        // flow: 'scrolled'
      })
      // console.log(this.rendition)
      /* this.rendition.display().then(() => {
        this.initTheme()
        this.initFontSize()
        this.initFontFamily()
        this.initGlobalStyle()
        this.refreshLocation()
      }) */
      // 获取定位章节进行页面显示
      const location = Storage.getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontSize()
        this.initFontFamily()
        this.initGlobalStyle()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${uploadUrl}/fonts/daysOne.css`),
          contents.addStylesheet(`${uploadUrl}/fonts/cabin.css`),
          contents.addStylesheet(`${uploadUrl}/fonts/montserrat.css`),
          contents.addStylesheet(`${uploadUrl}/fonts/tangerine.css`)
        ]).then(() => {
          // console.log('字体加载完')
        })
      })
    },
    // 初始化手势
    initGesture() {
      // 监听滑动效果
      this.rendition.on('touchstart', event => {
        // 当前一个手指点击屏幕X轴的位置
        this.touchStartX = event.changedTouches[0].clientX
        // 点击的时间
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        // X轴偏移量
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        // 手势移入移出的时间差
        const time = event.timeStamp - this.touchStartTime
        // console.log(offsetX, time)
        // 假定滑动事件小于500毫秒
        if (time < 500 && offsetX > 40) {
          // 向右滑动,上一页
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          // 向左滑动，下一页
          this.nextPage()
        } else {
          // 显示屏幕中间的内容(显示菜单)
          this.toggleTitleAndMenu()
        }
        // event.preventDefault() // 阻止默认行为
        event.stopPropagation() // 阻止冒泡
      })
    },
    // 解析电子书基本信息
    parseBook() {
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
        Storage.saveMetadata(this.fileName, metadata)
      })
      // 获取背景图
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.navigation.then(nav => {
        // console.log(nav)
        const navItem = (function flatten(arr) {
          return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
        })(nav.toc)

        // function find(item, v = 0) {
        //   const parent = navItem.filter(it => it.id === item.parent)[0]
        //   return !item.parent ? v : (parent ? find(parent, ++v) : v)
        // }
        function find(item, level = 0) {
          if (!item.parent) {
            return level
          } else {
            return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
        }

        navItem.forEach(item => {
          item.level = find(item)
          item.total = 0
          item.pagelist = []
          if (item.href.match(/^(.*)\.html$/)) {
            item.idhref = item.href.match(/^(.*)\.html$/)[1]
          } else if (item.href.match(/^(.*)\.xhtml$/)) {
            item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
          }
        })
        this.setNavigation(navItem)
      })
    },
    initEpub(url) {
      // 解析电子书
      this.book = new Epub(url)
      // console.log(this.book)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture()
      this.parseBook()
      this.book.ready
        .then(() => {
          // 简易的分页算法
          return this.book.locations.generate(
            750 * (window.innerWidth / 750) * (Storage.getFontSize(this.fileName) / 16)
          )
        })
        .then(locations => {
          this.navigation.forEach(item => (item.pagelist = []))
          // console.log(locations)
          locations.forEach(location => {
            // epubcfi(/6/4[A323691_1_En_BookFrontmatter_OnlinePDF]!/4/2,/2/2/2/1:0,/4/22/1:177.00000000000023)
            // href: "A323691_1_En_BookFrontmatter_OnlinePDF.html"
            // locations信息中的一部分，对应href信息，可以判定是哪个章节
            // console.log(locations, this.navigation)
            const loc = location.match(/\[(.*)]!/)[1]
            // console.log(loc)
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.html$/)[1]
                if (href == loc) {
                  nav.pagelist.push(location)
                }
              }
            })
            let currentPage = 1
            this.navigation.forEach((nav, index) => {
              if (index == 0) {
                //封面
                nav.page = 1
              } else {
                nav.page = currentPage
              }
              currentPage += nav.pagelist.length + 1
            })
          })
          this.setPagelist(locations)
          this.setBookAvailable(true)
          this.refreshLocation()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    z-index: 150;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
