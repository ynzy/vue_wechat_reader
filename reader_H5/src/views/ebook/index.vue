<template>
  <div class="ebook" ref="ebookView">
    <EbookTitle />
    <EbookReader />
    <EbookMenu />
    <EbookBookmark />
  </div>
</template>

<script>
import EbookReader from '@/components/ebook/EbookReader.vue'
import EbookTitle from '@/components/ebook/EbookTitle.vue'
import EbookMenu from '@/components/ebook/EbookMenu.vue'
import EbookBookmark from '@/components/ebook/EbookBookmark.vue'
import { getReadTime, saveReadTime } from '@/utils/localStorage'
import { ebookMixin } from '@/utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark
  },
  watch: {
    offsetY(v) {
      // 分页没有完成不可以下拉， 菜单显示不可以下拉
      if (this.bookAvailable && !this.menuVisible) {
        if (v > 0) {
          this.move(v)
        } else {
          this.restore()
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebookView.style.top = 0
      this.$refs.ebookView.style.transition = 'all .2s linear'
      // 清除动画
      setTimeout(() => {
        this.$refs.ebookView.style.transition = ''
      }, 200)
    },
    move(offsetY) {
      this.$refs.ebookView.style.top = offsetY + 'px'
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName) || 0
      this.task = setInterval(() => {
        readTime++
        // 没半分钟记录一次时间
        if (readTime % 30 == 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" scoped>
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
