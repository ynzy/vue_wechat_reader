<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <i class="iconfont iconA"></i>
    <span style="font-size:20px">1234</span>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
