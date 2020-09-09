<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{ getReadTime() }}</span>
          <span class="iconfont iconforward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="iconfont iconback" @click="prevSection()"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @input="onProgressInput($event.target.value)"
            @change="onProgressChange($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="iconfont iconforward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{ getSectionName }}</span>
          <span class="progress-text">({{ bookAvailable ? progress + '%' : $t('book.loading') }})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ebookMixin } from '../../utils/mixin'
import { saveProgress } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
      isProgressLoading: false
    }
  },
  methods: {
    prevSection() {
      if (this.section > 0 && !this.isProgressLoading ) {
        this.isProgressLoading = true
        this.setSection(this.section - 1).then(() => {
          this.displaySection(() => {
            this.updateProgressBg()
            this.isProgressLoading = false
          })
        })
      }
    },
    nextSection() {

      if (this.currentBook.spine.length - 1 > this.section && !this.isProgressLoading && this.bookAvailable) {
        this.isProgressLoading = true
        this.setSection(this.section + 1).then(() => {
          this.displaySection(() => {
            this.updateProgressBg()
            this.isProgressLoading = false
          })
        })
      }
    },
    onProgressInput(progress) {
      console.log(progress);
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
      })
    },
    onProgressChange(progress) {
      console.log(progress);
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
        this.displayProgress()
      })
      saveProgress(this.fileName, progress)
    },
    updateProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  },
  updated() {
    this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.setting-wrapper {
  position: absolute;
  bottom: 48px;
  left: 0;
  z-index: 190;
  width: 100%;
  height: 90px;
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.15);
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      @include flexbox(center, center);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 40px;
      font-size: 12px;
    }
    .progress-wrapper {
      @include flexbox(center, center);
      width: 100%;
      height: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      .progress {
        flex: 1;
        width: 100%;
        -webkit-appearance: none;
        height: 2px;
        background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
        background-size: 0 100%;
        margin: 0 10px;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ceced0;
          box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.15);
          border: none;
        }
      }
      .progress-icon-wrapper {
        @include flexbox(center, center);
        flex: 0 0 22px;
        font-size: 22px;
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: 5px;
      @include flexbox(center, center);
      width: 100%;
      font-size: 12px;
      text-align: center;
      padding: 0 15px;
      box-sizing: border-box;
      .progress-section-text {
        line-height: 15px;
        @include textoverflow;
      }
      .progress-text {
      }
    }
  }
}
</style>
