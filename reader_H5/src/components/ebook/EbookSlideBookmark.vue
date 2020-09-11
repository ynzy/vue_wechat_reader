<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{ $t('book.bookmark') }} · {{ bookmark ? bookmark.length : 0 }}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div
        class="slide-bookmark-item"
        v-for="(item, index) in bookmark"
        :key="index"
        @click="displayNavigation(item.cfi)"
      >
        <div class="slide-bookmark-item-icon">
          <div class="iconfont iconbookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{ item.text }}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '../Scroll'
import { getBookmark } from '@/utils/localStorage'
import { ebookMixin } from '@/utils/mixin'

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      bookmark: null
    }
  },
  methods:{
    displayNavigation(target) {
      this.display(target, () => {
        this.hideTileAndMenu()
      })
    },
  },
  mounted() {
    this.bookmark = getBookmark(this.fileName)
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ebook-slide-bookmark {
  width: 100%;
  .slide-bookmark-title {
    width: 100%;
    height: 48px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 15px;
    box-sizing: border-box;
    @include flexbox(flex-start);
  }
  .slide-bookmark-list {
    padding: 0 15px;
    box-sizing: border-box;
    .slide-bookmark-item {
      display: flex;
      padding: 15px 0;
      box-sizing: border-box;
      .slide-bookmark-item-icon {
        @include flexbox(flex-start);
        flex: 0 0 29px;

        .icon-bookmark {
          width: 20px;
          height: 20px;
          font-size: 12px;
          border-radius: 50%;
          background: #bbb;
          @include flexbox(center, center);
        }
      }
      .slide-bookmark-item-text {
        font-size: 14px;
        line-height: 15px;
        max-height: 45px;
        @include textoverflow(2);
      }
    }
  }
}
</style>
