<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="iconfont icondown"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <!-- 保持书签添加状态 -->
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed && !menuVisible ? fixedStyle : {}">
      <book-mark :width="15" :height="35" :color="color" ref="bookmark"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BookMark from '@/components/ebook/Bookmark'
import { realPx } from '@/utils/utils'
import { ebookMixin } from '../../utils/mixin'
import { saveBookmark, getBookmark } from '../../utils/localStorage'

const BLUE = '#346cbc'
const WHITE = '#fff'
// pulldownAddMark: '下拉添加书签',
// releaseAddMark: '松手添加书签',
// pulldownDeleteMark: '下拉删除书签',
// releaseDeleteMark: '松手删除书签',

export default {
  mixins: [ebookMixin],
  components: {
    BookMark
  },
  data() {
    return {
      color: WHITE,
      text: '',
      setBookmark: false,
      isFixed: false
    }
  },
  computed: {
    // 书签高度，多高算是达到临界点
    height() {
      return realPx(35)
    },
    // 临界值
    threshold() {
      return realPx(55)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        right: `${(window.innerWidth - this.$refs.bookmark?.clientWidth) / 2}px`,
        top: 0
      }
    }
  },
  watch: {
    /**
     * 通过监听下拉距离
     * 判断下拉书签动作算法
     * 添加书签
     * 1. 自然下拉阶段(x < 35): 向下拖动屏幕，书签组件跟随屏幕移动而移动
     * 2. 吸顶阶段(35<= x < 临界值): 书签组件高度为35px，当滑动距离刚好等于书签组件高度(35)，但没有达到添加书签临界值时候，出现吸顶的效果
     * 3. 达到临界值阶段(x >= 临界值): 滑动距离大于临界值，此时添加书签，书签变色，添加书签成功
     *
     *
     */
    offsetY(v) {
      // 如果分页没有加载完 菜单显示 菜单操作显示 不进行任何操作
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      // 状态2
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
        // 状态3
      } else if (v >= this.threshold) {
        this.afterThreshold(v)
        // 状态1
      } else if (v > 0 && v < this.height) {
        this.beforeHeight()
        // 归位操作
      } else if (v == 0) {
        this.restore()
      }
    },
    // 页面更改时refreshLocation执行时，更改了isBookmark，监听isBookmark
    isBookmark(v) {
      // console.log('监听是否有标签',v);
      this.isFixed = v
      if (v) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  methods: {
    addBookmark() {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      // 获取当前的章节定位
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation);
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
      // 章节开头->结尾 定位 拼接
      const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
      const cfi = currentLocation.start.cfi
      console.group('添加书签');
      console.log(cfiRange);
      console.log(cfi);
      console.groupEnd();
      // 获取章节内容
      this.currentBook.getRange(cfiRange).then(range => {
        /* let text = range.toString()
          text = text.replace(/\s\s/g, '')
          text = text.replace(/\r/g, '')
          text = text.replace(/\n/g, '')
          text = text.replace(/\t/g, '')
          text = text.replace(/\f/g, '') */
        let text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: cfi,
          text: text
        })
        this.setIsBookmark(true)
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
      }
      this.setIsBookmark(false)
    },
    // 状态4:归位
    restore() {
      // 由于滑动的时候定义了200毫秒的动画，所以延时200毫秒进行归位
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()
      }
    },
    // 状态1： 未超过书签的高度
    beforeHeight() {
      // 如果当前页不是书签页，显示下拉添加
      if (!this.isBookmark) {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
        // 显示下拉删除
      } else {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      }
    },
    // 状态2：未达到零界状态
    beforeThreshold(v) {
      // 吸顶
      this.$refs.bookmark.style.top = `${-v}px`
      // 下拉图标动画
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
      this.beforeHeight()
    },
    // 状态3：超越零界状态
    afterThreshold(v) {
      // 吸顶
      this.$refs.bookmark.style.top = `${-v}px`
      // 下拉图标动画
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
      // this.beforeHeight()
      if (!this.isBookmark) {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ebook-bookmark {
  position: absolute;
  top: -35px;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 35px;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: 45px;
    bottom: 0;
    display: flex;
    align-items: center;
    .ebook-bookmark-down-wrapper {
      font-size: 14px;
      color: white;
      transition: all 0.2s linear;
      // @include flexbox(center, center);
    }
    .ebook-bookmark-text {
      font-size: 14px;
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: 10px;
  }
}
</style>
