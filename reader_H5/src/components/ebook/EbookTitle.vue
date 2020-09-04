<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left" @click="back">
        <span class="iconfont iconback"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="iconfont iconshelf"></span>
        </div>
        <div class="iconfont icon-wrapper">
          <span class="iconfont iconcart"></span>
        </div>
        <div class="iconfont icon-wrapper" @click="gotoBookStore">
          <span class="iconfont iconmore"></span>
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
    back() {
      this.$router.go(-1)
    },
    gotoBookStore() {
      this.$router.push('/book-store')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: 48px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.15);
  font-size: 22px;
  .left {
    @include flexbox(flex-end, center);
    flex: 0 0 37px;
  }
  .right {
    @include flexbox(flex-end, center);

    .icon-wrapper {
      @include flexbox(flex-end, center);
      flex: 0 0 37px;
    }
  }
}
</style>
