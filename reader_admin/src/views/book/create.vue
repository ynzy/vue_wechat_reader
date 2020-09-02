<!-- 上传图书 -->
<template>
  <div>
    <detail :is-edit="false" />
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  components: { Detail },
  data() {
    return {}
  },
  methods: {},
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
