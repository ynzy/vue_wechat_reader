import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./getters";
import book from "./module/book";
Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    book
  }
})
