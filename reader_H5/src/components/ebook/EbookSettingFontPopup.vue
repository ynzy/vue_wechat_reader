<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-if="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hideFontFamilySetting">
          <span class="iconfont icondown2"></span>
        </div>
        <!-- <span class="ebook-popup-title-text">{{ $t('book.selectFont') }}</span> -->
      </div>
      <div class="ebook-popup-list-wrapper">
        <div
          class="ebook-popup-item"
          v-for="(item, index) in fontFamily"
          :key="index"
          @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text" :class="{ selected: isSelected(item) }">{{ item.font }}</div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="iconfont iconcheck"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ebookMixin } from '@/utils/mixin'

export default {
  mixins: [ebookMixin],
  methods: {
    isSelected(item) {
      return this.defaultFontFamily === item.font
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 350;
  width: 100%;
  font-size: 0;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    text-align: center;
    padding: 15px;
    border-bottom: 1px solid #b8b9bb;
    box-sizing: border-box;
    @include flexbox(center, center);
    .ebook-popup-title-text {
      font-size: 14px;
      font-weight: bold;
    }
    .ebook-popup-title-icon {
      position: absolute;
      left: 15px;
      top: 0;
      height: 100%;
      @include flexbox(center, center);
      .icon-down2 {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-item {
      display: flex;
      padding: 15px;
      .ebook-popup-item-text {
        flex: 1;
        font-size: 14px;
        text-align: left;
        &.selected {
          color: #346cb9;
          font-weight: bold;
        }
      }
      .ebook-popup-item-check {
        flex: 1;
        text-align: right;
        .iconcheck {
          font-size: 14px;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
}
</style>
