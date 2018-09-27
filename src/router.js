import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: `/article`,
      name: 'article',
      component: () => import('./views/Article.vue'),
      children: [
        {
          path: ':id',
          name: 'article-detail',
          props: true,
          component: () => import('./components/Detail.vue')
        },
        {
          path: 'all',
          name: 'allarticle',
          props: true,
          component: () => import('./components/AllArticle.vue')
        }
      ]
    }
  ]
})
