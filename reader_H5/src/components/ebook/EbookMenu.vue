<template>
  <div class="ebook-menu">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="menuVisible"
        :class="{ 'hide-box-shadow': settingVisible >= 0 || !menuVisible }"
      >
        <div class="icon-wrapper" :class="{ selected: settingVisible === 3 }">
          <span class="iconfont iconmenu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" :class="{ selected: settingVisible === 2 }">
          <span class="iconfont iconprogress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper" :class="{ selected: settingVisible === 1 }">
          <span class="iconfont iconbright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper" :class="{ selected: settingVisible === 0 }">
          <span class="iconfont iconA" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <!-- <ebook-setting-theme></ebook-setting-theme> -->
    <!-- <ebook-setting-progress></ebook-setting-progress> -->
    <!-- <ebook-slide></ebook-slide> -->
    <!-- <ebook-speaking-icon></ebook-speaking-icon> -->
  </div>
</template>

<script type="text/ecmascript-6">
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
// import EbookSettingTheme from './EbookSettingTheme'
// import EbookSettingProgress from './EbookSettingProgress'
// import EbookSpeakingIcon from './EbookSpeakingIcon'

// import EbookSlide from './EbookSlide'
import { ebookMixin } from '@/utils/mixin'

export default {
  methods: {
    showSetting(val){
      this.setSettingVisible(val)
    }
  },
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    // EbookSlide,
    // EbookSettingProgress,
    // EbookSettingTheme,
    // EbookSpeakingIcon
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: 48px;
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.15);
  font-size: 22px;
  background: #fff;
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include flexbox(center, center);
    .icon-progress {
      font-size: 24px;
    }
    .iconA {
      font-size: 20px;
    }
  }
}
</style>
