import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    name: 'Ebook',
    component: () => import(/* webpackChunkName: "Ebook" */ '../views/ebook/index.vue'),
    meta: { title: '首页', keepAlive: false, },
    children: [
      {
        path: ':fileName',
        meta: { title: '电子书', keepAlive: false, },
        component: () => import(/* webpackChunkName: "Ebook" */ '../components/ebook/EbookReader.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
