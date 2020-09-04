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
// global.epub = Epub
export default {
  mixins: [ebookMixin],
  mounted() {
    // History|2017_Book_InterdisciplinaryPerspectivesO
    const fileName = this.$route.params.fileName.split('|').join('/')
    console.log(this.setFileName(fileName))
    this.setFileName(fileName).then(() => {
      const epubPath = `${uploadUrl}${fileName}.epub` // 电子书路径
      this.initEpub(epubPath)
    })
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
      this.setMenuVisible(!this.menuVisible)
    },
    hideTileAndMenu() {
      this.setMenuVisible(false)
    },
    initEpub(url) {
      // 解析电子书
      this.book = new Epub(url)
      console.log(this.book)
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 兼容微信浏览器
      })
      console.log(this.rendition)
      this.rendition.display()
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
        console.log(offsetX, time)
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
        // event.stopPropagation() // 阻止冒泡
      })
    }
  }
}
</script>

<style></style>
