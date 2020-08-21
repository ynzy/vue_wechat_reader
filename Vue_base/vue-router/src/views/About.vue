<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>


export default {
  beforeRouteEnter (to, from, next) {
      // 不能获取组件实例 `this`
      console.log('beforeRouteEnter', to, from)
      next()
    },
    beforeRouteUpdate (to, from, next) {
      console.log('beforeRouteUpdate', to, from)
      next()
    },
    beforeRouteLeave (to, from, next) {
      console.log('beforeRouteLeave', to, from)
      next()
    }
}
</script>