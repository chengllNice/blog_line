import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/page/home'
import Manage from '@/page/manage'
import Category from '@/page/category'
import AddCategory from '@/page/addCategory'
import AddSubCategory from '@/page/addSubCategory'
import ArticleList from '@/page/articleList'
import AddArticle from '@/page/addArticle'
import EditArticle from '@/page/editArticle'
import Login from '@/page/Login'
import ArticleCommit from '@/page/articleCommit'
import UserList from '@/page/userList'
import ImageList from '@/page/imageList'
import AddModule from '@/page/addModule'
import ModuleList from '@/page/ModuleList'
import EditModule from '@/page/editModule'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/manage',
          name: 'manage',
          component: Manage,
        },
        {
          path: '/category',
          name: 'category',
          component: Category,
        },
        {
          path: '/addCategory',
          name: 'addCategory',
          component: AddCategory,
        },
        {
          path: '/addSubCategory',
          name: 'addSubCategory',
          component: AddSubCategory,
        },
        {
          path: '/articleList',
          name: 'articleList',
          component: ArticleList,
        },
        {
          path: '/addArticle',
          name: 'addArticle',
          component: AddArticle,
        },
        {
          path: '/editArticle',
          name: 'editArticle',
          component: EditArticle,
        },
        {
          path: '/articleCommit',
          name: 'articleCommit',
          component: ArticleCommit,
        },
        {
          path: '/userList',
          name: 'userList',
          component: UserList,
        },
        {
          path: '/imageList',
          name: 'imageList',
          component: ImageList,
        },
        {
          path: '/moduleList',
          name: 'moduleList',
          component: ModuleList,
        },
        {
          path: '/addModule',
          name: 'addModule',
          component: AddModule,
        },
        {
          path: '/editModule',
          name: 'editModule',
          component: EditModule,
        }
      ]
    }
  ]
})
