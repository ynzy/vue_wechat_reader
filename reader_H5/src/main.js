import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from "@/config";
console.log(config);
// 全局样式
import '@/assets/css/index.scss'
import '@/assets/css/iconfont.css'
// 移动端适配
import 'lib-flexible/flexible.js'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
