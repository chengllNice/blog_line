import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
/*import Home from '@/page/home'
import Index from '@/page/index'
import ArticleDetail from '@/page/articleDetail'
import ArticleListSearch from '@/page/articleListSearch'*/

const Home = r => require.ensure([], () => {
  r(require('@/page/home'))
}, 'home');
const Index = r => require.ensure([], () => {
  r(require('@/page/index'))
}, 'index');
const ArticleDetail = r => require.ensure([], () => {
  r(require('@/page/articleDetail'))
}, 'articleDetail');
const ArticleListSearch = r => require.ensure([], () => {
  r(require('@/page/articleListSearch'))
}, 'articleListSearch');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: Index,
        },
        {
          path: '/articleListSearch',
          name: 'articleListSearch',
          component: ArticleListSearch,
        },
        {
          path: '/articleDetail',
          name: 'articleDetail',
          component: ArticleDetail,
        }
      ]
    }
  ]
})
