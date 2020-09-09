<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="iconfont iconsearch"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage()"
          v-model="searchText"
          @keyup.enter="search()"
          ref="searchInput"
        />
      </div>
      <div class="slide-contents-search-cancel" v-if="searchVisible" @click="hideSearchPage()">
        {{ $t('book.cancel') }}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <!-- <img v-lazy="cover" class="slide-contents-book-img" /> -->
        <img :src="cover" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{ metadata.title }}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{ metadata.creator }}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{ $t('book.haveRead2') }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTime() }}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
        @click="displayNavigation(item.href)"
      >
        <span
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{ selected: section === index }"
          >{{ item.label.trim() }}</span
        >
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" ref="scroll" v-show="searchVisible">
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayNavigation(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { px2rem } from '@/utils/utils'
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../Scroll'

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchText: '',
      searchVisible: false,
      searchList: null
    }
  },
  methods: {
    displayNavigation(target, highlight = false) {
      this.display(target, () => {
        this.hideTileAndMenu()
        console.log(this.currentBook.rendition)
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target, {}, e => {})
        }
      })
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    showSearchPage() {
      this.searchVisible = true
    },
    hideSearchPage() {
      this.searchVisible = false
    },
    search() {
      // console.log(this.searchText)
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(result => {
          this.searchList = result.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            )
            return item
          })
          this.$refs.searchInput.blur()
        })
      }
    },
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
        // [].concat.apply([], results) 二维数组降为一维数组
      ).then(results => Promise.resolve([].concat.apply([], results)))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: 36px;
    margin: 20px 0 10px 0;
    padding: 0 15px;
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      border-radius: 3px;
      @include flexbox();
      .slide-contents-search-icon {
        // @include flexbox();
        flex: 0 0 28px;
        text-align: center;
        .iconsearch {
          font-size: 12px;
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: 32px;
        font-size: 14px;
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      font-size: 14px;
      @include flexbox(flex-end, center);
      flex: 0 0 50px;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: 90px;
    padding: 10px 15px 20px 15px;
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 45px;
      box-sizing: border-box;
      .slide-contents-book-img {
        width: 45px;
        height: 60px;
      }
    }
    .slide-contents-book-info-wrapper {
      @include flexbox(center, flex-start, column);
      .slide-contents-book-title {
        @include flexbox(flex-start);
        font-size: 14px;
        line-height: 16px;
        padding: 0 10px;
        box-sizing: border-box;
        .slide-contents-book-title-text {
          @include textoverflow(1);
        }
      }
      .slide-contents-book-author {
        @include flexbox(flex-start);
        font-size: 12px;
        line-height: 14px;
        padding: 0 10px;
        box-sizing: border-box;
        margin-top: 5px;
        .slide-contents-book-author-text {
          @include textoverflow(2);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      @include flexbox(center, flex-start, column);
      flex: 0 0 70px;
      .slide-contents-book-progress {
        .progress {
          font-size: 14px;
          line-height: 16px;
        }
        .progress-text {
          font-size: 12px;
          line-height: 14px;
          margin-left: 2px;
        }
      }
      .slide-contents-book-time {
        font-size: 12px;
        line-height: 14px;
        margin-top: 5px;
      }
    }
  }
  .slide-contents-list {
    padding: 0 15px;
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: 20px 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: 14px;
        line-height: 16px;
        @include textoverflow;
      }
      .slide-contents-item-page {
        font-size: 10px;
        @include flexbox(flex-end, center);
        flex: 0 0 30px;
      }
    }
  }
  .slide-search-list {
    padding: 0 15px;
    box-sizing: border-box;
    .slide-search-item {
      font-size: 14px;
      line-height: 16px;
      padding: 20px 0;
      box-sizing: border-box;
    }
  }
}
</style>
