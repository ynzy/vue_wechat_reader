import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: 'About'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.mixin({
  beforeCreate() {
    console.log('beforeCreate', this.$router, this.$route);
    if (this.$route.meta?.title) {
      document.title = this.$route.meta.title
    } else {
      document.title = 'router'
    }
  }
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  next()
})

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve', to, from)
  next()
})

router.afterEach((to, from) => {
  console.log('afterEach', to, from)
})

export default router
