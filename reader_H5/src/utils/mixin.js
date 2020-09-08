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
  }
}