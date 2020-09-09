<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="settingVisible === 3 || settingVisible === 4">
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3 || settingVisible === 4">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <keep-alive>
                <component :is="tab === 1 ? content : bookmark"></component>
              </keep-alive>
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item" :class="{ selected: tab === 1 }" @click="selectTab(1)">
                {{ $t('book.navigation') }}
              </div>
              <div class="content-page-tab-item" :class="{ selected: tab === 2 }" @click="selectTab(2)">
                {{ $t('book.bookmark') }}
              </div>
            </div>
          </div>
          <div class="content-empty" v-else><EbookLoading /></div>
        </div>
      </transition>
      <div class="content-bg" @click="hideTileAndMenu()"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import EbookLoading from './EbookLoading'
 import EbookContent from './EbookSlideContent'
  import EbookBookmark from './EbookSlideBookmark'
import { ebookMixin } from '@/utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
      EbookLoading
    },
  data(){
    return{
       tab: 1,
        content: EbookContent,
        bookmark: EbookBookmark
    }
  },
  methods: {
    selectTab(tab) {
        this.tab = tab
      }
  }
}
</script>

<style lang="scss" scoped>
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 350;
  display: flex;
  width: 100%;
  height: 100%;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-tab {
        display: flex;
        flex: 0 0 48px;
        .content-page-tab-item {
          flex: 1;
          font-size: 12px;
          @include flexbox(center, center);
        }
      }
    }
    .content-empty {
      width: 100%;
      height: 100%;
      @include flexbox(center, center);
      font-size: 16px;
      color: #333;
    }
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>
