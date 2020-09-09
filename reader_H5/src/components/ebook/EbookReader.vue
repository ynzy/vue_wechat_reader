<template>
  <div class="ebook-reader">
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
    this.initEpub(epubPath)
  },
  methods: {
    prevPage() {
      this.hideTileAndMenu()
      this.rendition?.prev()
    },
    nextPage() {
      this.hideTileAndMenu()
      this.rendition?.next()
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
        console.log(nav)
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
      console.log(this.book)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.parseBook()
      this.book.ready
        .then(() => {
          // 简易的分页算法
          return this.book.locations.generate(
            750 * (window.innerWidth / 750) * (Storage.getFontSize(this.fileName) / 16)
          )
        })
        .then(locations => {
          // console.log(locations)
          this.setBookAvailable(true)
          this.refreshLocation()
        })
    }
  }
}
</script>

<style></style>
