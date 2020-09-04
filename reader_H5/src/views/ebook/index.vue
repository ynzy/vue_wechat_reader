<template>
  <div>
    <EbookTitle />
    <EbookReader />
    <EbookMenu />
  </div>
</template>

<script>
import EbookReader from '@/components/ebook/EbookReader.vue'
import EbookTitle from '@/components/ebook/EbookTitle.vue'
import EbookMenu from '@/components/ebook/EbookMenu.vue'
export default {
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  }
}
</script>

<style></style>
