import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/import',
    name: 'import',
    component: () => import(/* webpackChunkName: "about" */ '../views/HomePage/homePage'),
    children: [
      {
        path: '/',
        name: '',
        component: () => import('@/views/Import/import')
      },

    ]
  },
  {
    path: '/', redirect: '/import',
  }

]

const router = new VueRouter({
  routes
})

export default router
