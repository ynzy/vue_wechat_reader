import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute, showBookDetail, addCss, removeAllCss } from './book'
import * as Storage from './localStorage'
import { uploadUrl } from '@/config/env.development'



export const ebookMixin = {
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST,
      fontFamily: FONT_FAMILY
    }
  },
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      if (this.section) {
        const section = this.currentBook.section(this.section)
        if (section && section.href && this.currentBook && this.currentBook.navigation) {
          return this.currentBook.navigation.get(section.href)?.label
          // return this.navigation[this.section].label
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        Storage.saveFontSize(this.fileName, fontSize)
        this.currentBook.rendition.themes.fontSize(this.defaultFontSize + 'px')
      })
    },
    showFontFamilySetting() {
      this.setFontFamilyVisible(true)
    },
    hideFontFamilySetting() {
      this.setFontFamilyVisible(false)
    },
    setFontFamily(font) {
      this.setDefaultFontFamily(font).then(() => {
        Storage.saveFontFamily(this.fileName, font)
        if (font === 'Default') {
          this.currentBook.rendition.themes.font('Times New Roman')
        } else {
          this.currentBook.rendition.themes.font(font)
        }
      })
    },
    setTheme(theme) {
      this.setDefaultTheme(theme).then(() => {
        // this.switchTheme()
        this.initGlobalStyle()
        this.currentBook.rendition.themes.select(this.defaultTheme)
        Storage.saveTheme(this.fileName, theme)
      })
    },
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${uploadUrl}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${uploadUrl}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${uploadUrl}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${uploadUrl}/theme/theme_night.css`)
          break
        default:
          this.setDefaultTheme('Default')
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    getReadTime() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    },
    // 进度条章节显示
    displayProgress() {
      // 通过百分比获取定位
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // 渲染获取到的章节
      this.display(cfi)
    },
    //  上一章下一章，章节显示
    displaySection(cb) {
      const section = this.currentBook.section(this.section)
      if (section && section.href) {
        this.display(section.href, () => {
          if (cb) cb()
        })
      }
    },
    // 刷新章节定位
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
      this.setProgress(Math.floor(progress * 100))
      const cfistart = currentLocation.start.cfi
      Storage.saveLocation(this.fileName, cfistart)
      this.setSection(currentLocation.start.index)
      return
      if (currentLocation.start && currentLocation.start.index) {
        this.setSection(currentLocation.start.index)
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100))
        if (this.pagelist) {
          if (currentLocation.start.location <= 0) {
            this.setPaginate('')
          } else {
            this.setPaginate(currentLocation.start.location + ' / ' + this.pagelist.length)
          }
        } else {
          this.setPaginate('')
        }
        const cfistart = currentLocation.start.cfi
        const bookmark = Storage.getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === cfistart)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        Storage.saveLocation(this.fileName, cfistart)
      }
    },
    /**
     * 自定义rendition.display方法
     * target 控制显示的页面
     */
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          cb && cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          cb && cb()

        })
      }
    }
  }
}